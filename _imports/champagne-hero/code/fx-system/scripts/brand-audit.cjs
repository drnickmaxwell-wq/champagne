#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();

const paths = {
  hero: path.join(repoRoot, 'components/hero/4k-hero-video.tsx'),
  journey: path.join(repoRoot, 'components/sections/SmileJourney.tsx'),
  preview: path.join(repoRoot, 'app/preview/brand-live/page.tsx'),
  surface: path.join(repoRoot, 'styles/champagne/surface.css'),
  tokens: path.join(repoRoot, 'styles/tokens/smh-champagne-tokens.css'),
  footer: path.join(repoRoot, 'components/layout/FooterLuxe.tsx'),
};

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function relative(filePath) {
  return path.relative(repoRoot, filePath);
}

function extractDeclaration(source, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = source.match(new RegExp(`${escaped}\s*:\s*([^;]+);`, 'i'));
  return match ? match[1].trim() : null;
}

function extractFallback(source, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = source.match(new RegExp(`${escaped}:var\\([^,]+,([^\n)]+)\)`, 'i'));
  return match ? match[1].trim() : null;
}

const heroContent = read(paths.hero);
const journeyContent = read(paths.journey);
const previewContent = read(paths.preview);
const surfaceContent = read(paths.surface);
const tokensContent = read(paths.tokens);
const footerContent = read(paths.footer);

const violations = [];

function flagBgUtility(content, label) {
  const matches = content.match(/bg-(?:ink|black)[^"'\s){}]*/gi);
  if (matches && matches.length > 0) {
    const unique = Array.from(new Set(matches));
    violations.push(`${label} contains disallowed background utility: ${unique.join(', ')}`);
  }
}

flagBgUtility(heroContent, 'Hero surface');
flagBgUtility(journeyContent, 'Journey surface');

const driftPatterns = [
  { label: 'text-[#…]', regex: /text-\[#/gi },
  { label: 'bg-[#…]', regex: /bg-\[#/gi },
  { label: 'background: linear-gradient', regex: /background:\s*linear-gradient/gi },
];

const driftTargets = [
  { file: paths.hero, content: heroContent },
  { file: paths.journey, content: journeyContent },
  { file: paths.preview, content: previewContent },
  { file: paths.surface, content: surfaceContent },
  { file: paths.footer, content: footerContent },
];

const driftOffenders = [];
for (const { file, content } of driftTargets) {
  for (const pattern of driftPatterns) {
    const tester = new RegExp(pattern.regex.source, pattern.regex.flags);
    if (tester.test(content)) {
      const collector = new RegExp(pattern.regex.source, pattern.regex.flags);
      const matches = content.match(collector) || [];
      driftOffenders.push({
        file: relative(file),
        pattern: pattern.label,
        samples: Array.from(new Set(matches)),
      });
    }
  }
}

if (driftOffenders.length === 0) {
  console.log('No drift');
} else {
  console.log('Drift offenders:');
  for (const offender of driftOffenders) {
    console.log(`- ${offender.file} → ${offender.pattern} ${offender.samples.join(', ')}`);
  }
  violations.push('Design drift detected');
}

const gradientDeclaration = extractDeclaration(tokensContent, '--smh-gradient') || '';
const gradientString = gradientDeclaration.replace(/\s+/g, '');
const heroRadiusMatch = surfaceContent.match(/\.champagne-surface(?:-lux)?\s*{[^}]*border-radius:([^;]+);/s);
const heroRadiusRaw = heroRadiusMatch ? heroRadiusMatch[1].trim() : 'unknown';
const heroRadius = heroRadiusRaw === '0' ? '0px' : heroRadiusRaw;
const textToken = extractDeclaration(tokensContent, '--smh-text')
  || extractDeclaration(tokensContent, '--smh-primary-ink')
  || 'unknown';
const grainToken = extractDeclaration(tokensContent, '--smh-grain-alpha')
  || extractFallback(surfaceContent, '--smh-grain-alpha')
  || '0';
const vignetteToken = extractDeclaration(tokensContent, '--smh-vignette-alpha')
  || extractFallback(surfaceContent, '--smh-vignette-alpha')
  || '0';
const particlesToken = extractDeclaration(tokensContent, '--smh-particles-alpha')
  || extractFallback(surfaceContent, '--smh-particles-alpha')
  || '0';
const glassZRaw = extractDeclaration(surfaceContent, '--z-glass');
const headerZRaw = extractDeclaration(surfaceContent, '--z-header');
const glassZ = glassZRaw ? Number.parseFloat(glassZRaw) : NaN;
const headerZ = headerZRaw ? Number.parseFloat(headerZRaw) : NaN;

if (!Number.isFinite(glassZ)) {
  violations.push('Glass z-index is missing');
}
if (!Number.isFinite(headerZ)) {
  violations.push('Header z-index is missing');
}
if (Number.isFinite(glassZ) && Number.isFinite(headerZ)) {
  if (!(headerZ > glassZ)) {
    violations.push(`Header z-index (${headerZRaw}) must be greater than glass (${glassZRaw})`);
  }
  if (headerZ < 40) {
    violations.push(`Header z-index (${headerZRaw}) must be at least 40`);
  }
}

console.log(`[audit] gradient_string:${gradientString}`);
console.log(`[audit] hero_border_radius:${heroRadius}`);
console.log(`[audit] cta_text_color:${textToken}`);
console.log(`[audit] grain_alpha:${grainToken}`);
console.log(`[audit] vignette_alpha:${vignetteToken}`);
console.log(`[audit] particles_alpha:${particlesToken}`);
console.log(`[audit] z_index_glass:${glassZRaw ?? 'unknown'}`);
console.log(`[audit] z_index_header:${headerZRaw ?? 'unknown'}`);

if (violations.length > 0) {
  console.error('Brand audit violations detected:');
  for (const item of violations) {
    console.error(`- ${item}`);
  }
  process.exit(1);
}

process.exit(0);
