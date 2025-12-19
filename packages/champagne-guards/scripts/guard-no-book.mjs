#!/usr/bin/env node
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import micromatch from 'micromatch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../..');

const scanRoots = ['apps', 'packages', 'public'];
const retiredBookingSegment = 'book';
const retiredBookingTarget = `/${retiredBookingSegment}`;
const allowList = [
];

const routingPatterns = [
  new RegExp(`href\\s*[:=]\\s*["']${retiredBookingTarget}\\b`),
  new RegExp(`to\\s*[:=]\\s*["']${retiredBookingTarget}\\b`),
  new RegExp(`router\\.push\\(\\s*["']${retiredBookingTarget}\\b`),
  new RegExp(`navigate\\(\\s*["']${retiredBookingTarget}\\b`),
  new RegExp(`path\\s*[:=]\\s*["']${retiredBookingTarget}\\b`),
  new RegExp(`<Link[^>]*href=["']${retiredBookingTarget}\\b`),
  new RegExp(`"cta"[^\\n]*"href"\\s*:\\s*"${retiredBookingTarget}"`),
];

function isAllowed(filePath) {
  return micromatch.isMatch(filePath, allowList);
}

function collectCandidates() {
  const command = `cd ${repoRoot} && rg --no-heading --line-number "${retiredBookingTarget}" ${scanRoots.join(' ')}`;

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
    console.error('❌ Retired booking routing targets detected:');
    violations.forEach((entry) => console.error(`- ${entry}`));
    process.exit(1);
  }

  console.log('✅ No retired booking routing targets detected.');
}

run();
