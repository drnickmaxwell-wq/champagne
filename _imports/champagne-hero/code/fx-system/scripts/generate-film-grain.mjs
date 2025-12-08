#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const DEFAULTS = {
  seed: 'champagne-v1',
  width: 2560,
  height: 1440,
  intensity: 0.015,
};

function parseArgs(argv) {
  const options = { ...DEFAULTS };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) {
      continue;
    }
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      options[key] = next;
      i += 1;
    } else {
      options[key] = true;
    }
  }
  const widthValue = Number.parseInt(options.width ?? DEFAULTS.width, 10);
  const heightValue = Number.parseInt(options.height ?? DEFAULTS.height, 10);
  const intensityValue = Number.parseFloat(options.intensity ?? DEFAULTS.intensity);
  return {
    seed: String(options.seed ?? DEFAULTS.seed),
    width: Number.isFinite(widthValue) && widthValue > 0 ? widthValue : DEFAULTS.width,
    height: Number.isFinite(heightValue) && heightValue > 0 ? heightValue : DEFAULTS.height,
    intensity: Number.isFinite(intensityValue) && intensityValue >= 0 ? intensityValue : DEFAULTS.intensity,
  };
}

function seedToUint32(seedValue) {
  if (Number.isInteger(seedValue)) {
    return seedValue >>> 0;
  }
  const text = String(seedValue);
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return hash >>> 0;
}

function mulberry32(seedValue) {
  let a = seedValue >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussianPair(rng) {
  let u1 = 0;
  let u2 = 0;
  while (u1 === 0) u1 = rng();
  while (u2 === 0) u2 = rng();
  const mag = Math.sqrt(-2.0 * Math.log(u1));
  const theta = 2.0 * Math.PI * u2;
  return [mag * Math.cos(theta), mag * Math.sin(theta)];
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const { seed, width, height, intensity } = options;

  if (width <= 0 || height <= 0) {
    console.error('Width and height must be positive integers.');
    process.exit(1);
  }

  const rng = mulberry32(seedToUint32(seed));
  const totalPixels = width * height;
  const baseLevel = 128;
  const stdDev = Math.max(intensity, 0) * 255;

  const pixels = new Uint8ClampedArray(totalPixels);
  let index = 0;
  while (index < totalPixels) {
    const [z0, z1] = gaussianPair(rng);
    pixels[index++] = clamp(Math.round(baseLevel + z0 * stdDev), 0, 255);
    if (index < totalPixels) {
      pixels[index++] = clamp(Math.round(baseLevel + z1 * stdDev), 0, 255);
    }
  }

  await fs.mkdir(path.join(repoRoot, 'public/brand/textures'), { recursive: true });
  const outputPath = path.join(repoRoot, 'public/brand/textures/film-grain-2560x1440.webp');

  const { data: processed } = await sharp(pixels, {
    raw: {
      width,
      height,
      channels: 1,
    },
  })
    .blur(0.6)
    .linear(1.08, -10)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const rgb = Buffer.alloc(processed.length * 3);
  for (let i = 0; i < processed.length; i += 1) {
    const value = processed[i];
    const offset = i * 3;
    rgb[offset] = value;
    rgb[offset + 1] = value;
    rgb[offset + 2] = value;
  }

  const pixelSha = crypto.createHash('sha256').update(rgb).digest('hex');

  await sharp(rgb, {
    raw: {
      width,
      height,
      channels: 3,
    },
  })
    .webp({
      lossless: true,
    })
    .toFile(outputPath);

  console.log(`Generated film grain texture at ${path.relative(repoRoot, outputPath)}`);
  console.log(`FILMGRAIN_SHA=${pixelSha}`);
}

await main();
