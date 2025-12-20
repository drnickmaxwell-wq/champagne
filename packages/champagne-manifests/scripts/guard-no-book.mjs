#!/usr/bin/env node
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '../..');
const scanTargets = [
  'packages/champagne-manifests/data',
  'packages/champagne-manifests/src',
];
const retiredBookingTarget = '/book';
const ignoredSegments = [/\/_imports\//, /\/reports\//, /\/docs\//, /\/node_modules\//];

function runRipgrep() {
  const command = `cd ${repoRoot} && rg --no-heading --line-number "${retiredBookingTarget}" ${scanTargets.join(' ')}`;
  try {
    const output = execSync(command, { stdio: 'pipe' }).toString().trim();
    return output ? output.split('\n') : [];
  } catch (error) {
    const output = error.stdout?.toString().trim();
    return output ? output.split('\n') : [];
  }
}

function shouldIgnore(filePath) {
  return ignoredSegments.some((pattern) => pattern.test(filePath));
}

function main() {
  const lines = runRipgrep();
  const violations = [];

  for (const line of lines) {
    const [filePath, lineNumber, ...rest] = line.split(':');
    const content = rest.join(':');

    if (!filePath || shouldIgnore(filePath)) continue;

    const trimmed = content.trim();
    const manifestScoped = filePath.startsWith('packages/champagne-manifests/data/');

    if (manifestScoped || trimmed.includes('href') || trimmed.includes('to=')) {
      violations.push(`${filePath}:${lineNumber} → ${trimmed}`);
    }
  }

  if (violations.length > 0) {
    console.error('❌ /book references detected in manifest runtime scope:');
    violations.forEach((entry) => console.error(`- ${entry}`));
    process.exit(1);
  }

  console.log('✅ No /book references found in manifest data or runtime helpers.');
}

main();
