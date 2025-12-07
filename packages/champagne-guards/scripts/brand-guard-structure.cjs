#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const ROOT = process.cwd();

const HERO_FILES = [
  path.join(ROOT, 'components/home/ChampagneHero.tsx'),
  path.join(ROOT, 'components/preview/HeroGilded.tsx'),
];

const REQUIRED_SELECTORS = [
  'hero-gradient-base',
  'hero-wave-mask',
  'hero-film-grain',
  'hero-particles-static',
  'hero-gold-dust-drift',
];

const Z_INDEX_TARGETS = [
  { selector: '.hero-gradient-base', expected: 1 },
  { selector: '.hero-wave-caustics', expected: 2 },
  { selector: '.hero-wave-mask', expected: 3 },
  { selector: '.hero-glass-shimmer', expected: 4 },
  { selector: '.hero-particles-static', expected: 5 },
  { selector: '.hero-particles-drift', expected: 6 },
  { selector: '.hero-gold-dust-drift', expected: 7 },
  { selector: '.hero-film-grain', expected: 8 },
  { selector: '.hero-content', expected: 9 },
];

const HERO_CSS_FILE = path.join(ROOT, 'styles/champagne/hero.css');
const HEX_PATTERN = /#[0-9a-fA-F]{3,8}\b/g;

const selectorErrors = [];
for (const file of HERO_FILES) {
  const body = fs.readFileSync(file, 'utf8');
  for (const selector of REQUIRED_SELECTORS) {
    if (!body.includes(selector)) {
      selectorErrors.push(`${file}: missing selector ${selector}`);
    }
  }
}

const cssBody = fs.readFileSync(HERO_CSS_FILE, 'utf8');
const zErrors = [];
for (const { selector, expected } of Z_INDEX_TARGETS) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = cssBody.match(new RegExp(`${escaped}[^{}]*\{[^}]*?z-index\\s*:\\s*(\\d+)`, 's'));
  if (!match) {
    zErrors.push(`${HERO_CSS_FILE}: missing z-index for ${selector}`);
    continue;
  }
  const actual = Number(match[1]);
  if (actual !== expected) {
    zErrors.push(
      `${HERO_CSS_FILE}: ${selector} expected z-index ${expected} but found ${actual}`
    );
  }
}

const hexViolations = [];
for (const file of HERO_FILES) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  if (rel.startsWith('styles/brand/') || rel.startsWith('styles/tokens/')) {
    continue;
  }
  const body = fs.readFileSync(file, 'utf8');
  const matches = body.match(HEX_PATTERN);
  if (matches) {
    for (const hex of matches) {
      hexViolations.push(`${file}: contains raw hex ${hex}`);
    }
  }
}

if (selectorErrors.length || zErrors.length || hexViolations.length) {
  console.error('❌ Brand structure guard failed.');
  for (const msg of selectorErrors) {
    console.error('-', msg);
  }
  for (const msg of zErrors) {
    console.error('-', msg);
  }
  for (const msg of hexViolations) {
    console.error('-', msg);
  }
  process.exit(1);
}

console.log('Guard summary (selectors confirmed; z-map confirmed; hex offenders: 0)');
