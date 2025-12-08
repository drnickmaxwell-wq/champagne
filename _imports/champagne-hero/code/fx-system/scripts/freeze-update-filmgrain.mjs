#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const generatorScript = path.join(__dirname, 'generate-film-grain.mjs');
const hashScript = path.join(__dirname, 'hash-media.mjs');
const baselinePath = path.join(__dirname, 'hero-freeze.hashes.json');
const targetRelative = 'public/brand/textures/film-grain-2560x1440.webp';
const generatorArgs = [
  '--seed',
  'champagne-v1',
  '--width',
  '2560',
  '--height',
  '1440',
  '--intensity',
  '0.015',
];

function runScript(script, args, label) {
  const result = spawnSync(process.execPath, [script, ...args], {
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

function ensureBaseline() {
  if (!fs.existsSync(baselinePath)) {
    throw new Error('Baseline file is missing.');
  }
  const parsed = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
  if (!parsed.files || typeof parsed.files !== 'object') {
    throw new Error('Baseline file is malformed.');
  }
  return parsed;
}

try {
  runScript(generatorScript, generatorArgs, 'Film grain generator');
  const hashOutput = runScript(hashScript, [targetRelative], 'Pixel hash');
  const match = /PIXEL_SHA=([a-f0-9]+)/i.exec(hashOutput);
  if (!match) {
    throw new Error('Unable to parse pixel hash output.');
  }
  const pixelSha = match[1].toLowerCase();

  const baseline = ensureBaseline();
  const entry = baseline.files[targetRelative];
  if (!entry || typeof entry !== 'object' || entry.derived !== true) {
    throw new Error('Baseline entry for film grain is missing or not marked derived.');
  }

  entry.expectedPixelSha = pixelSha;
  baseline.generatedAt = new Date().toISOString();

  fs.writeFileSync(baselinePath, `${JSON.stringify(baseline, null, 2)}\n`, 'utf8');
  console.log(`Updated expected pixel SHA for ${targetRelative} -> ${pixelSha}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
