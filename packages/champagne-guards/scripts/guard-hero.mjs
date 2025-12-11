#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');

const heroRendererRel = 'apps/web/app/_components/HeroRenderer/HeroRenderer.tsx';
const manifestPaths = {
  base: 'packages/champagne-manifests/data/hero/sacred_hero_base.json',
  surfaces: 'packages/champagne-manifests/data/hero/sacred_hero_surfaces.json',
  variants: 'packages/champagne-manifests/data/hero/sacred_hero_variants.json',
  weather: 'packages/champagne-manifests/data/hero/sacred_hero_weather.json',
};

const errors = [];

function addError(message) {
  errors.push(message);
}

function loadFile(relPath) {
  const absPath = path.join(repoRoot, relPath);
  if (!fs.existsSync(absPath)) {
    return null;
  }
  return fs.readFileSync(absPath, 'utf8');
}

function ensureHeroRenderer() {
  const content = loadFile(heroRendererRel);

  if (!content) {
    addError(
      'Hero Guard: marketing HeroRenderer component is missing at apps/web/app/_components/HeroRenderer/HeroRenderer.tsx',
    );
    return;
  }

  const importBaseSurface = /import[^;]*BaseChampagneSurface[^;]*from\s+["']@champagne\/hero["']/;
  const importGetRuntime = /import[^;]*getHeroRuntime[^;]*from\s+["']@champagne\/hero["']/;
  const exportRenderer = /export\s+(function|const|let|var)\s+HeroRenderer\b/;
  const forbiddenTokens = ['fetch(', 'axios.', 'document.', 'window.', 'localStorage', 'sessionStorage'];

  if (!importBaseSurface.test(content)) {
    addError('Hero Guard: HeroRenderer must import BaseChampagneSurface from @champagne/hero.');
  }

  if (!importGetRuntime.test(content)) {
    addError('Hero Guard: HeroRenderer must import getHeroRuntime from @champagne/hero.');
  }

  if (!exportRenderer.test(content)) {
    addError('Hero Guard: HeroRenderer must export a function named HeroRenderer.');
  }

  for (const token of forbiddenTokens) {
    if (content.includes(token)) {
      addError(
        `Hero Guard: HeroRenderer must not call browser or network APIs directly. Found forbidden token '${token.replace(/[()]/g, '')}' in HeroRenderer.tsx.`,
      );
    }
  }
}

function loadManifest(relPath, label) {
  const content = loadFile(relPath);
  if (!content) {
    addError(`Hero Guard: ${label} is missing at ${relPath}`);
    return null;
  }

  try {
    return JSON.parse(content);
  } catch (error) {
    addError(`Hero Guard: ${path.basename(relPath)} is not valid JSON: ${error.message}`);
    return null;
  }
}

function ensureBaseManifest() {
  const data = loadManifest(manifestPaths.base, 'sacred_hero_base.json');
  if (!data || typeof data !== 'object') {
    addError('Hero Guard: sacred_hero_base.json must contain an object with hero defaults.');
    return;
  }

  if (!data.id || typeof data.id !== 'string') {
    addError('Hero Guard: sacred_hero_base.json missing required key "id".');
  }

  if (!data.content || typeof data.content !== 'object') {
    addError('Hero Guard: sacred_hero_base.json missing required key "content".');
  } else if (!data.content.headline) {
    addError('Hero Guard: sacred_hero_base.json missing required key "content.headline".');
  }

  if (!data.defaults || typeof data.defaults !== 'object') {
    addError('Hero Guard: sacred_hero_base.json missing required key "defaults".');
  }
}

function ensureSurfacesManifest() {
  const data = loadManifest(manifestPaths.surfaces, 'sacred_hero_surfaces.json');
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    addError('Hero Guard: sacred_hero_surfaces.json must define a surfaces object.');
    return;
  }

  if (!Array.isArray(data.surfaceStack) || data.surfaceStack.length === 0) {
    addError('Hero Guard: sacred_hero_surfaces.json missing required key "surfaceStack" with at least one layer.');
  }

  if (!data.gradients || typeof data.gradients !== 'object' || !('gradient.base' in data.gradients)) {
    addError('Hero Guard: sacred_hero_surfaces.json missing required key "gradients.gradient.base".');
  }

  if (!data.waveBackgrounds || typeof data.waveBackgrounds !== 'object') {
    addError('Hero Guard: sacred_hero_surfaces.json missing required key "waveBackgrounds".');
  }

  if (!data.waveMasks || typeof data.waveMasks !== 'object') {
    addError('Hero Guard: sacred_hero_surfaces.json missing required key "waveMasks".');
  }
}

function ensureVariantsManifest() {
  const data = loadManifest(manifestPaths.variants, 'sacred_hero_variants.json');
  if (!data || typeof data !== 'object') {
    addError('Hero Guard: sacred_hero_variants.json must contain a variants list.');
    return;
  }

  if (!Array.isArray(data.variants) || data.variants.length === 0) {
    addError('Hero Guard: sacred_hero_variants.json must define at least one variant.');
    return;
  }

  const missingId = data.variants.find((variant) => !variant || typeof variant.id !== 'string' || variant.id.length === 0);
  if (missingId) {
    addError('Hero Guard: sacred_hero_variants.json variants must include an "id" field.');
  }
}

function ensureWeatherManifest() {
  const data = loadManifest(manifestPaths.weather, 'sacred_hero_weather.json');
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    addError('Hero Guard: sacred_hero_weather.json must contain a weather object.');
    return;
  }

  const keys = Object.keys(data);
  if (keys.length === 0) {
    addError('Hero Guard: sacred_hero_weather.json must define at least one weather profile.');
    return;
  }

  const hasProfile = keys.some((key) => {
    const entry = data[key];
    return entry && typeof entry === 'object' && !Array.isArray(entry);
  });

  if (!hasProfile) {
    addError('Hero Guard: sacred_hero_weather.json must define at least one weather profile.');
  }
}

function run() {
  ensureHeroRenderer();
  ensureBaseManifest();
  ensureSurfacesManifest();
  ensureVariantsManifest();
  ensureWeatherManifest();

  if (errors.length) {
    console.error('❌ Hero Guard failed:');
    for (const message of errors) {
      console.error(`- ${message}`);
    }
    process.exit(1);
  }

  console.log('✅ Hero Guard: marketing hero renderer and manifests look good.');
}

run();
