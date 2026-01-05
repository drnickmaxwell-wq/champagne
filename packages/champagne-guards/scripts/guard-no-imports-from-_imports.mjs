#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../..');
process.chdir(repoRoot);

const scanRoots = ['apps', 'packages'];
const skipDirNames = new Set(['node_modules', 'dist', '.next', '.turbo', '.git', 'coverage', '_imports']);
const targetExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);

const detectionRegex =
  /(from\s+["'][^"']*\/_imports\/[^"']*["'])|(export\s+.*from\s+["'][^"']*\/_imports\/[^"']*["'])|(import\(\s*["'][^"']*\/_imports\/[^"']*["']\s*\))|(require\(\s*["'][^"']*\/_imports\/[^"']*["']\s*\))/g;

const violations = [];

function walk(directory) {
  let entries;
  try {
    entries = readdirSync(directory, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (skipDirNames.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!targetExtensions.has(path.extname(entry.name))) {
      continue;
    }

    const relativePath = path.relative(repoRoot, fullPath);
    if (relativePath.split(path.sep).includes('_imports')) {
      continue;
    }

    scanFile(fullPath, relativePath);
  }
}

function scanFile(fullPath, relativePath) {
  let content;
  try {
    content = readFileSync(fullPath, 'utf8');
  } catch {
    return;
  }

  const lines = content.split(/\r?\n/);
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    let match;
    while ((match = detectionRegex.exec(line)) !== null) {
      const column = match.index + 1;
      const snippet = line.trim();
      violations.push({
        file: relativePath,
        line: lineIndex + 1,
        column,
        snippet
      });
      if (!detectionRegex.global) {
        break;
      }
    }
    detectionRegex.lastIndex = 0;
  }
}

function run() {
  for (const root of scanRoots) {
    const rootPath = path.join(repoRoot, root);
    try {
      const stats = statSync(rootPath);
      if (!stats.isDirectory()) {
        continue;
      }
    } catch {
      continue;
    }
    walk(rootPath);
  }

  if (violations.length) {
    console.error('❌ _imports runtime import guard failed:');
    for (const violation of violations) {
      console.error(`- ${violation.file}:${violation.line}:${violation.column} ${violation.snippet}`);
    }
    process.exit(1);
  }

  console.log('✅ _imports runtime import guard passed.');
}

run();
