#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import url from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const baselinePath = path.join(__dirname, 'hero-freeze.hashes.json');
const hashScript = path.join(__dirname, 'hash-media.mjs');

function readBaseline(fp) {
  try {
    const raw = fs.readFileSync(fp, 'utf8');
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object' || typeof data.files !== 'object') {
      throw new Error('Invalid baseline format');
    }
    return { files: data.files };
  } catch (error) {
    return { error };
  }
}

function sha256File(absPath) {
  const hash = crypto.createHash('sha256');
  hash.update(fs.readFileSync(absPath));
  return `sha256:${hash.digest('hex')}`;
}

function runNodeScript(scriptPath, args, label) {
  const result = spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['inherit', 'pipe', 'pipe'],
  });

  if (result.stdout) {
    process.stdout.write(result.stdout);
  }
  if (result.stderr) {
    process.stderr.write(result.stderr);
  }

  if (result.status !== 0) {
    throw new Error(`${label} failed`);
  }

  return result.stdout;
}

function isDerivedEntry(entry) {
  return Boolean(entry && typeof entry === 'object' && entry.derived);
}

const { error, files } = readBaseline(baselinePath);
if (error) {
  console.error('❌ Hero freeze failed:');
  if (error.code === 'ENOENT') {
    console.error(`  - MISSING_BASELINE ${path.relative(repoRoot, baselinePath)}`);
  } else {
    console.error(`  - INVALID_BASELINE ${path.relative(repoRoot, baselinePath)}`);
  }
  process.exit(1);
}

const entries = Object.entries(files).sort(([a], [b]) => a.localeCompare(b));

const missing = [];
const mismatched = [];
const derivedFailures = [];
const derivedValidated = [];

for (const [relativePath, descriptor] of entries) {
  const absolutePath = path.join(repoRoot, relativePath);

  if (isDerivedEntry(descriptor)) {
    const { generator, args = [], expectedPixelSha } = descriptor;
    if (!generator || typeof generator !== 'string') {
      derivedFailures.push(`${relativePath} (invalid generator)`);
      continue;
    }
    const generatorPath = path.isAbsolute(generator)
      ? generator
      : path.join(repoRoot, generator);

    try {
      runNodeScript(generatorPath, args, `Generator for ${relativePath}`);
    } catch (runError) {
      derivedFailures.push(`${relativePath} (${runError.message})`);
      continue;
    }

    if (!fs.existsSync(absolutePath)) {
      derivedFailures.push(`${relativePath} (missing after generation)`);
      continue;
    }

    let actualPixelSha;
    try {
      const hashOutput = runNodeScript(hashScript, [relativePath], `Hash for ${relativePath}`);
      const match = /PIXEL_SHA=([a-f0-9]+)/i.exec(hashOutput);
      if (!match) {
        derivedFailures.push(`${relativePath} (unable to read pixel hash)`);
        continue;
      }
      actualPixelSha = match[1].toLowerCase();
    } catch (runError) {
      derivedFailures.push(`${relativePath} (${runError.message})`);
      continue;
    }

    if (typeof expectedPixelSha !== 'string' || expectedPixelSha.length === 0) {
      derivedFailures.push(`${relativePath} (missing expected pixel hash)`);
      continue;
    }

    if (actualPixelSha !== expectedPixelSha.toLowerCase()) {
      derivedFailures.push(`${relativePath} (pixel hash mismatch)`);
      continue;
    }

    derivedValidated.push(`${relativePath}`);
    continue;
  }

  const expected = descriptor;
  if (!fs.existsSync(absolutePath)) {
    missing.push(relativePath);
    continue;
  }
  const actual = sha256File(absolutePath);
  if (actual !== expected) {
    mismatched.push(relativePath);
  }
}

if (missing.length || mismatched.length || derivedFailures.length) {
  console.error('❌ Hero freeze failed:');
  for (const rel of mismatched) {
    console.error(`  - MISMATCH ${rel}`);
  }
  for (const rel of missing) {
    console.error(`  - MISSING  ${rel}`);
  }
  for (const rel of derivedFailures) {
    console.error(`  - DERIVED_FAIL ${rel}`);
  }
  process.exit(1);
}

console.log(`✅ Hero freeze OK (${entries.length} files checked)`);
for (const rel of derivedValidated) {
  console.log(`   • Derived asset validated by pixel hash: ${rel}`);
}
