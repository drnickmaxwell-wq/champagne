#!/usr/bin/env node
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import micromatch from 'micromatch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../..');

const scanRoots = ['apps', 'packages', 'public'];
const allowList = [
  'packages/champagne-manifests/data/hero/sacred_hero_base.json',
  'packages/champagne-manifests/reports/CTA_PATHWAY_MAP.md',
];

const routingPatterns = [
  /href\s*[:=]\s*["']\/book\b/,
  /to\s*[:=]\s*["']\/book\b/,
  /router\.push\(\s*["']\/book\b/,
  /navigate\(\s*["']\/book\b/,
  /path\s*[:=]\s*["']\/book\b/,
  /<Link[^>]*href=["']\/book\b/,
  /"cta"[^\n]*"href"\s*:\s*"\/book"/,
];

function isAllowed(filePath) {
  return micromatch.isMatch(filePath, allowList);
}

function collectCandidates() {
  const command = `cd ${repoRoot} && rg --no-heading --line-number "/book" ${scanRoots.join(' ')}`;

  try {
    const output = execSync(command, { stdio: 'pipe' }).toString().trim();
    return output ? output.split('\n') : [];
  } catch (error) {
    const output = error.stdout?.toString().trim();
    if (!output) return [];
    return output.split('\n');
  }
}

function run() {
  const candidates = collectCandidates();
  const violations = [];

  for (const line of candidates) {
    const [file, lineNo, ...rest] = line.split(':');
    const content = rest.join(':');

    if (!file || isAllowed(file)) continue;

    const matchesRouting = routingPatterns.some((pattern) => pattern.test(content));
    if (matchesRouting) {
      violations.push(`${file}:${lineNo} → ${content.trim()}`);
    }
  }

  if (violations.length > 0) {
    console.error('❌ /book routing targets detected:');
    violations.forEach((entry) => console.error(`- ${entry}`));
    process.exit(1);
  }

  console.log('✅ No /book routing targets detected.');
}

run();
