#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import micromatch from 'micromatch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../..');
process.chdir(repoRoot);

const allowConfigPath = path.resolve(__dirname, 'guard-rogue-hex.allow.json');
const allowConfig = JSON.parse(readFileSync(allowConfigPath, 'utf8'));
const allowGlobs = allowConfig.allow ?? [];
const allowExtensions = new Set(allowConfig.allowExtensions ?? []);
const warnOnlyExtensions = new Set(allowConfig.warnOnlyExtensions ?? []);

const scanRoots = ['apps', 'packages', 'public'];
const ignoreGlobs = [
  '**/node_modules/**',
  '**/.next/**',
  '**/dist/**',
  '**/build/**',
  '**/.turbo/**',
  '**/.cache/**',
  '**/.git/**'
];

const textExtensions = new Set([
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.mjs',
  '.cjs',
  '.json',
  '.css',
  '.scss',
  '.sass',
  '.less',
  '.md',
  '.mdx',
  '.yml',
  '.yaml',
  '.html',
  '.txt',
  '.svg'
]);

const patterns = [
  { label: 'hex', regex: /#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?(?:[0-9a-fA-F]{2})?\b/ },
  { label: 'rgb()', regex: /\brgb[a]?\s*\(/i },
  { label: 'hsl()', regex: /\bhsl[a]?\s*\(/i }
];

const violations = [];
const warnings = [];

function getBaseRevision() {
  const targetBase = process.env.GITHUB_BASE_REF || 'main';
  const candidates = [`origin/${targetBase}`, targetBase];
  for (const candidate of candidates) {
    try {
      return execSync(`git merge-base ${candidate} HEAD`, { stdio: 'pipe' })
        .toString()
        .trim();
    } catch (error) {
      // try next
    }
  }

  try {
    return execSync('git rev-parse HEAD^', { stdio: 'pipe' })
      .toString()
      .trim();
  } catch (error) {
    return execSync('git rev-list --max-parents=0 HEAD', { stdio: 'pipe' })
      .toString()
      .trim()
      .split('\n')
      .filter(Boolean)
      .pop();
  }
}

const baseRevision = getBaseRevision();

function listTrackedFiles() {
  const command = `git ls-files ${scanRoots.join(' ')}`;
  return execSync(command)
    .toString()
    .split('\n')
    .filter(Boolean);
}

function isIgnored(file) {
  return micromatch.isMatch(file, ignoreGlobs);
}

function isAllowlisted(file) {
  return micromatch.isMatch(file, allowGlobs);
}

function fileChangedSinceBase(file) {
  const diff = execSync(`git diff --name-only ${baseRevision} HEAD -- "${file}"`)
    .toString()
    .trim();
  return Boolean(diff);
}

function scanFile(file) {
  const extension = path.extname(file);
  if (allowExtensions.has(extension)) {
    console.log(`ALLOW extension (${extension}): ${file}`);
    return;
  }

  if (isAllowlisted(file)) {
    if (fileChangedSinceBase(file)) {
      warnings.push(`Allowlisted file changed: ${file}`);
    }
    console.log(`ALLOW path: ${file}`);
    return;
  }

  if (extension && !textExtensions.has(extension)) {
    return;
  }

  let content;
  try {
    content = readFileSync(path.join(repoRoot, file), 'utf8');
  } catch (error) {
    warnings.push(`Skipped unreadable file ${file}: ${error.message}`);
    return;
  }

  const lines = content.split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const pattern of patterns) {
      if (pattern.regex.test(line)) {
        const entry = `${file}:${index + 1} contains ${pattern.label}`;
        if (warnOnlyExtensions.has(extension)) {
          warnings.push(`WARN (${pattern.label}) ${entry}`);
        } else {
          violations.push(entry);
        }
      }
    }
  });
}

function run() {
  const files = listTrackedFiles().filter((file) => !isIgnored(file));
  files.forEach(scanFile);

  if (warnings.length) {
    console.warn('⚠️ Rogue hex guard warnings:');
    for (const warning of warnings) {
      console.warn(`- ${warning}`);
    }
  }

  if (violations.length) {
    console.error('❌ Rogue hex guard failed: disallowed colour literals found.');
    for (const violation of violations) {
      console.error(`- ${violation}`);
    }
    process.exit(1);
  }

  console.log('✅ No rogue hex, rgb(), or hsl() tokens detected.');
}

run();
