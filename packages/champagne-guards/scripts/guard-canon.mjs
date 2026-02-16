#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '../../..');
process.chdir(repoRoot);

const errors = [];
const warnings = [];

const heroSurfacesPath = 'packages/champagne-manifests/data/hero/sacred_hero_surfaces.json';
const tokenFilePath = 'packages/champagne-tokens/styles/tokens/smh-champagne-tokens.css';
const canonicalGradient = 'linear-gradient(135deg, var(--brand-magenta) 0%, var(--brand-teal) 60%, var(--brand-gold) 100%)';
const canonicalTokens = {
  '--brand-magenta': '#C2185B',
  '--brand-teal': '#40C4B4',
  '--brand-gold': '#D4AF37',
  '--brand-gold-keyline': '#F9E8C3',
  '--smh-gradient-legacy': '#D94BC6 0%,#00C2C7 100%',
  '--ink': '#0B0D0F',
  '--smh-ink-persian-900': '#021733',
  '--text': '#1A1A1A',
  '--smh-warm-rose': '#E24DAA',
  '--smh-white': '#FFFFFF',
  '--smh-gray-200': '#E5E7EB'
};

const allowedHexes = new Set(
  ['#c2185b', '#40c4b4', '#d4af37', '#f9e8c3', '#d94bc6', '#00c2c7', '#0b0d0f', '#1a1a1a', '#ffffff', '#e5e7eb', '#e24daa', '#021733']
);

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

function recordError(message) {
  errors.push(message);
}

function recordWarning(message) {
  warnings.push(message);
}

function ensureHeroGradientUsesToken() {
  if (!existsSync(heroSurfacesPath)) {
    recordError(`Canon Guard: missing ${heroSurfacesPath}.`);
    return;
  }

  try {
    const manifest = JSON.parse(readFileSync(heroSurfacesPath, 'utf8'));
    const gradientValue = manifest?.gradients?.['gradient.base'];
    if (typeof gradientValue !== 'string') {
      recordError(
        'Canon Guard: sacred hero surfaces must define gradients.gradient.base as a string.'
      );
      return;
    }

    if (!gradientValue.includes('var(--smh-gradient)')) {
      recordError(
        `Canon Guard: marketing hero gradient must use var(--smh-gradient). Found: ${gradientValue}`
      );
    }
  } catch (error) {
    recordError(`Canon Guard: unable to parse ${heroSurfacesPath}: ${error.message}`);
  }
}

function parseTokenValue(body, token) {
  const escapedToken = token.replace(/[.*+?^${}()|[\]\-]/g, '\\$&');
  const tokenRegex = new RegExp(`${escapedToken}\s*:\\s*([^;]+);`, 'i');
  const match = body.match(tokenRegex);
  return match ? match[1].trim() : null;
}

function ensureTokenDefinitions() {
  if (!existsSync(tokenFilePath)) {
    recordError(`Canon Guard: missing canonical token file at ${tokenFilePath}.`);
    return;
  }

  const content = readFileSync(tokenFilePath, 'utf8');
  const gradientMatch = content.match(/--smh-gradient:\s*([^;]+);/i);

  if (!gradientMatch) {
    recordError('Canon Guard: --smh-gradient is not defined in the canonical tokens.');
  } else {
    const gradientValue = gradientMatch[1].trim().replace(/\s+/g, ' ');
    if (gradientValue !== canonicalGradient) {
      recordError(
        `Canon Guard: --smh-gradient must equal "${canonicalGradient}". Found "${gradientValue}".`
      );
    }
  }

  for (const [token, expected] of Object.entries(canonicalTokens)) {
    const value = parseTokenValue(content, token);
    if (!value) {
      recordError(`Canon Guard: token ${token} is missing.`);
      continue;
    }

    if (!value.toLowerCase().includes(expected.toLowerCase())) {
      recordError(
        `Canon Guard: token ${token} must remain ${expected}; found ${value}.`
      );
    }
  }

  const hexRegex = /#[0-9a-fA-F]{3,8}\b/g;
  const lines = content.split(/\r?\n/);
  lines.forEach((line, index) => {
    const matches = [...line.matchAll(hexRegex)];
    for (const match of matches) {
      const hex = match[0].toLowerCase();
      if (!allowedHexes.has(hex)) {
        recordError(
          `Canon Guard: unauthorized hex ${match[0]} found in ${tokenFilePath}:${
            index + 1
          }`
        );
      }
    }
  });
}

function ensureTokensNotModified() {
  const base = getBaseRevision();
  const diffOutput = execSync(`git diff --name-only ${base} HEAD -- ${tokenFilePath}`)
    .toString()
    .trim();

  if (!diffOutput) {
    return;
  }

  const diffStat = execSync(`git diff --stat ${base} HEAD -- ${tokenFilePath}`)
    .toString()
    .trim();
  recordWarning(`Canon Guard: token file changed on this branch.\n${diffStat}`);

  const patch = execSync(`git diff --unified=0 ${base} HEAD -- ${tokenFilePath}`)
    .toString();
  const changedLines = patch
    .split(/\r?\n/)
    .filter((line) => line.startsWith('+') || line.startsWith('-'))
    .filter((line) => !line.startsWith('+++') && !line.startsWith('---'));

  const isPersianInkChangeOnly = changedLines.every((line) =>
    /--smh-ink-persian-900:\s*#(?:031a39|021733);/i.test(line)
  );

  if (!isPersianInkChangeOnly) {
    recordError('Canon Guard: canonical token file must not change on this branch.');
  }
}


function runSubGuard(label, scriptPath) {
  try {
    console.log(`Running ${label} guard...`);
    execSync(`node ${scriptPath}`, { stdio: 'inherit' });
  } catch (error) {
    const output =
      error.stdout?.toString().trim() || error.stderr?.toString().trim() || error.message;
    recordError(`Canon Guard: ${label} failed.${output ? `\n${output}` : ''}`);
  }
}

function run() {
  ensureHeroGradientUsesToken();
  ensureTokenDefinitions();
  ensureTokensNotModified();
  runSubGuard('retired booking routes', 'packages/champagne-guards/scripts/guard-no-book.mjs');
  runSubGuard('patient portal SSR smoke test', 'packages/champagne-guards/scripts/guard-patient-portal-ssr.mjs');

  if (warnings.length) {
    console.warn('⚠️ Canon Guard warnings:');
    for (const warning of warnings) {
      console.warn(`- ${warning}`);
    }
  }

  if (errors.length) {
    console.error('❌ Canon Guard failed:');
    for (const message of errors) {
      console.error(`- ${message}`);
    }
    process.exit(1);
  }

  console.log('✅ Canon Guard passed: gradient token and canon files are intact.');
}

run();
