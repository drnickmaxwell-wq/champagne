#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

const files = {
  hero: path.join(repoRoot, 'components/hero/4k-hero-video.tsx'),
  journey: path.join(repoRoot, 'components/sections/SmileJourney.tsx'),
};

const errors = [];

function read(fileKey) {
  const filePath = files[fileKey];
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    errors.push(`Unable to read ${filePath}: ${error.message}`);
    return '';
  }
}

const heroContent = read('hero');
const journeyContent = read('journey');

function ensureChampagneSurface(name, content) {
  if (!(content.includes('champagne-surface') || content.includes('champagne-surface-lux'))) {
    errors.push(`${name} must include the 'champagne-surface' class.`);
  }
}

function ensureNoSectionGlass(name, content) {
  const sectionWithGlass = /<section[^>]*className[^>]*champagne-glass/;
  if (sectionWithGlass.test(content)) {
    errors.push(`${name} section wrappers must not use 'champagne-glass'.`);
  }
}

ensureChampagneSurface('Hero component', heroContent);
ensureNoSectionGlass('Hero component', heroContent);

ensureChampagneSurface('Smile Journey component', journeyContent);
ensureNoSectionGlass('Smile Journey component', journeyContent);

if (!journeyContent.includes('md:grid-cols-2')) {
  errors.push("Smile Journey grid must include 'md:grid-cols-2'.");
}

if (!journeyContent.includes('lg:grid-cols-3')) {
  errors.push("Smile Journey grid must include 'lg:grid-cols-3'.");
}

if (errors.length > 0) {
  console.error('Brand Structure Guard failed:');
  for (const message of errors) {
    console.error(` - ${message}`);
  }
  process.exit(1);
}

console.log('Brand Structure Guard passed.');
