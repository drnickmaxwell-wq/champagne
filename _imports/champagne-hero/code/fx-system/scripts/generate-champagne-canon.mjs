import { promises as fs } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const CHAMPAGNE_DIR = join(ROOT, "public", "assets", "champagne");
const OUTPUT_FILE = join(ROOT, "public", "brand", "champagne_machine_manifest_full.json");

const NORMALISED_EXPECTATIONS = {
  wavesMask: [
    "waves/wave-mask.svg",
    "waves/wave-mask-desktop.webp",
    "waves/wave-mask-mobile.webp",
  ],
  wavesBackground: [
    "waves/wave-bg.webp",
    "waves/waves-bg.webp",
    "waves/waves-bg-2560.webp",
    "waves/waves-bg-1920.webp",
    "waves/waves-bg-1600.webp",
    "waves/waves-bg-1280.webp",
    "waves/waves-bg-1024.webp",
    "waves/waves-bg-768.webp",
    "waves/waves-bg-480.webp",
    "waves/waves-bg-320.webp",
  ],
  waveCaustics: ["motion/wave-caustics.webm"],
  glassShimmer: ["motion/glass-shimmer.webm"],
  goldDust: ["motion/gold-dust-drift.webm"],
  particlesDrift: ["motion/particles-drift.webm"],
  filmGrain: ["textures/home-hero-film-grain.webp"],
  particlesStatic: ["particles/home-hero-particles.webp"],
};

const HINTS = {
  gradientId: "champagne-core-135",
  blend: {
    caustics: "screen",
    glass: "soft-light",
    particles: "overlay",
    gold: "color-dodge",
    grain: "multiply",
  },
  opacity: {
    caustics: 0.35,
    glass: 0.28,
    particles: 0.2,
    gold: 0.26,
    grain: 0.16,
  },
};

async function main() {
  try {
    const assets = await collectAssets();
    const manifest = buildManifest(assets);
    await writeManifest(manifest);
    console.log(`Generated ${relative(ROOT, OUTPUT_FILE)}`);
  } catch (error) {
    console.error("Failed to generate Champagne canon manifest.");
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exitCode = 1;
  }
}

async function collectAssets() {
  const resolved = {};

  for (const [key, candidates] of Object.entries(NORMALISED_EXPECTATIONS)) {
    resolved[key] = await resolveAsset(candidates);
  }

  return resolved;
}

async function resolveAsset(candidates) {
  for (const candidate of candidates) {
    const absolute = join(CHAMPAGNE_DIR, candidate);
    try {
      const stats = await fs.stat(absolute);
      if (stats.isFile()) {
        return { rel: candidate, abs: absolute };
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (candidates.length === 1) {
        throw new Error(`Missing required asset at ${absolute} — ${message}`);
      }
    }
  }

  const printable = candidates.map((candidate) => `/assets/champagne/${toPosix(candidate)}`);
  throw new Error(`Missing required asset. Tried: ${printable.join(", ")}`);
}

function buildManifest(assets) {
  const assetPaths = {
    waves: {
      mask: toAssetPath(assets.wavesMask.rel),
      background: toAssetPath(assets.wavesBackground.rel),
    },
    motion: {
      waveCaustics: toAssetPath(assets.waveCaustics.rel),
      glassShimmer: toAssetPath(assets.glassShimmer.rel),
      goldDust: toAssetPath(assets.goldDust.rel),
      particles: toAssetPath(assets.particlesDrift.rel),
      filmGrain: toAssetPath(assets.filmGrain.rel),
    },
    particlesStatic: toAssetPath(assets.particlesStatic.rel),
  };

  const manifest = {
    package: "champagne-canon",
    version: "1.0.0",
    components: [
      {
        id: "hero",
        type: "hero",
        assets: assetPaths,
        hints: HINTS,
      },
    ],
    guards: {
      freeze: [
        toFreezePath(assets.wavesMask.rel),
        toFreezePath(assets.wavesBackground.rel),
        toFreezePath(assets.waveCaustics.rel),
        toFreezePath(assets.glassShimmer.rel),
        toFreezePath(assets.goldDust.rel),
        toFreezePath(assets.particlesDrift.rel),
        toFreezePath(assets.particlesStatic.rel),
        toFreezePath(assets.filmGrain.rel),
      ],
      brand_lock_assertions: [
        "no-rogue-hex",
        "gradient-135-magenta-to-teal",
        "mask-applied",
        "motion-respects-prm",
      ],
    },
  };

  return manifest;
}

async function writeManifest(manifest) {
  const json = `${JSON.stringify(manifest, null, 2)}\n`;
  await fs.writeFile(OUTPUT_FILE, json, "utf8");
}

function toAssetPath(relPath) {
  return `/${join("assets", "champagne", toPosix(relPath))}`.replace(/\\+/g, "/");
}

function toFreezePath(relPath) {
  return `/public${toAssetPath(relPath)}`;
}

function toPosix(pathLike) {
  return pathLike.split("\\").join("/");
}

main();
