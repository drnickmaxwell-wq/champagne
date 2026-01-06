#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '../../..');

const targetRoots = ['apps', 'packages'];
const skipRootPrefixes = [
  'packages/champagne-tokens/'
];
const skipDirectories = new Set([
  'node_modules',
  '.next',
  'dist',
  'build',
  '.turbo',
  'coverage',
  '_imports'
]);
const skipExtensions = new Set(['.md']);

const tokenImportAllowlist = [
  /^@champagne\/tokens(\/.*)?$/,
  /\bpackages\/champagne-tokens\//
];

function isAllowedImport(specifier) {
  const normalized = specifier.replace(/\\/g, '/');
  return tokenImportAllowlist.some((pattern) => pattern.test(normalized));
}

function isTokenSpecifier(specifier) {
  const lower = specifier.toLowerCase();
  return lower.includes('token') || lower.endsWith('theme.css') || lower.includes('champagne-tokens');
}

function isSkippedPath(filePath) {
  const relative = path.relative(repoRoot, filePath).replace(/\\/g, '/');
  return skipRootPrefixes.some((prefix) => relative.startsWith(prefix));
}

function collectFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (skipDirectories.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(fullPath));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (!skipExtensions.has(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

function extractSpecifiers(line) {
  const specifiers = [];

  const importRegex = /import\s+(?:[^'"`]+?from\s+)?["'`]([^"'`]+)["'`]/g;
  const requireRegex = /require\(\s*["'`]([^"'`]+)["'`]\s*\)/g;
  const dynamicImportRegex = /import\(\s*["'`]([^"'`]+)["'`]\s*\)/g;
  const cssImportRegex = /@import\s+(?:url\()?['"]?([^"')\s]+)['"]?\)?/gi;

  let match;
  while ((match = importRegex.exec(line))) {
    specifiers.push(match[1]);
  }
  while ((match = requireRegex.exec(line))) {
    specifiers.push(match[1]);
  }
  while ((match = dynamicImportRegex.exec(line))) {
    specifiers.push(match[1]);
  }
  while ((match = cssImportRegex.exec(line))) {
    specifiers.push(match[1]);
  }

  return specifiers;
}

function findViolations(filePath) {
  const violations = [];
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);

  lines.forEach((line, index) => {
    const specifiers = extractSpecifiers(line);
    for (const specifier of specifiers) {
      if (isTokenSpecifier(specifier) && !isAllowedImport(specifier)) {
        violations.push({
          file: path.relative(repoRoot, filePath).replace(/\\/g, '/'),
          line: index + 1,
          specifier
        });
      }
    }
  });

  return violations;
}

function run() {
  const errors = [];

  for (const root of targetRoots) {
    const rootPath = path.join(repoRoot, root);
    if (!statSync(rootPath, { throwIfNoEntry: false })?.isDirectory()) {
      continue;
    }

    const files = collectFiles(rootPath).filter((filePath) => !isSkippedPath(filePath));
    for (const file of files) {
      const violations = findViolations(file);
      errors.push(...violations);
    }
  }

  if (errors.length) {
    console.error('❌ Token binding guard failed: detected non-canonical token imports.');
    errors.forEach(({ file, line, specifier }) => {
      console.error(`- ${file}:${line} → ${specifier}`);
    });
    process.exit(1);
  }

  console.log('✅ Token binding guard passed: no non-canonical token imports detected.');
}

run();
