export type HeroAssetType = "image" | "video";

export interface HeroAssetEntry {
  id: string;
  type: HeroAssetType;
  path: string;
  description?: string;
}

const HERO_ASSET_BASE = "/assets/champagne" as const;

export const HERO_ASSET_REGISTRY: Record<string, HeroAssetEntry> = {
  // Wave masks & backgrounds
  "sacred.wave.mask.desktop": {
    id: "sacred.wave.mask.desktop",
    type: "image",
    path: `${HERO_ASSET_BASE}/waves/wave-mask-desktop.webp`,
    description: "Primary Sacred hero wave mask for desktop",
  },
  "sacred.wave.mask.mobile": {
    id: "sacred.wave.mask.mobile",
    type: "image",
    path: `${HERO_ASSET_BASE}/waves/wave-mask-mobile.webp`,
    description: "Primary Sacred hero wave mask for mobile",
  },
  "sacred.wave.mask.header": {
    id: "sacred.wave.mask.header",
    type: "image",
    path: `${HERO_ASSET_BASE}/waves/header-wave-mask.svg`,
  },
  "sacred.wave.mask.smh": {
    id: "sacred.wave.mask.smh",
    type: "image",
    path: `${HERO_ASSET_BASE}/waves/smh-wave-mask.svg`,
  },
  "sacred.wave.background.desktop": {
    id: "sacred.wave.background.desktop",
    type: "image",
    path: `${HERO_ASSET_BASE}/waves/waves-bg-1920.webp`,
  },
  "sacred.wave.background.mobile": {
    id: "sacred.wave.background.mobile",
    type: "image",
    path: `${HERO_ASSET_BASE}/waves/waves-bg-768.webp`,
  },
  "sacred.wave.overlay.dots": {
    id: "sacred.wave.overlay.dots",
    type: "image",
    path: `${HERO_ASSET_BASE}/waves/wave-dots.svg`,
  },
  "sacred.wave.overlay.field": {
    id: "sacred.wave.overlay.field",
    type: "image",
    path: `${HERO_ASSET_BASE}/waves/wave-field.svg`,
  },

  // Particles
  "sacred.particles.home": {
    id: "sacred.particles.home",
    type: "image",
    path: `${HERO_ASSET_BASE}/particles/home-hero-particles.webp`,
  },
  "sacred.particles.gold": {
    id: "sacred.particles.gold",
    type: "image",
    path: `${HERO_ASSET_BASE}/particles/particles-gold%20.webp`,
  },
  "sacred.particles.magenta": {
    id: "sacred.particles.magenta",
    type: "image",
    path: `${HERO_ASSET_BASE}/particles/particles-magenta%20.webp`,
  },
  "sacred.particles.teal": {
    id: "sacred.particles.teal",
    type: "image",
    path: `${HERO_ASSET_BASE}/particles/particles-teal%20.webp`,
  },

  // Grain
  "sacred.grain.desktop": {
    id: "sacred.grain.desktop",
    type: "image",
    path: `${HERO_ASSET_BASE}/film-grain/film-grain-desktop%20.webp`,
  },
  "sacred.grain.mobile": {
    id: "sacred.grain.mobile",
    type: "image",
    path: `${HERO_ASSET_BASE}/film-grain/film-grain-mobile%20.webp`,
  },

  // Textures
  "sacred.texture.causticsOverlay": {
    id: "sacred.texture.causticsOverlay",
    type: "image",
    path: `${HERO_ASSET_BASE}/textures/wave-light-overlay.webp`,
  },

  // Motion
  "sacred.motion.waveCaustics": {
    id: "sacred.motion.waveCaustics",
    type: "video",
    path: `${HERO_ASSET_BASE}/motion/wave-caustics.webm`,
  },
  "sacred.motion.glassShimmer": {
    id: "sacred.motion.glassShimmer",
    type: "video",
    path: `${HERO_ASSET_BASE}/motion/glass-shimmer.webm`,
  },
  "sacred.motion.goldDust": {
    id: "sacred.motion.goldDust",
    type: "video",
    path: `${HERO_ASSET_BASE}/motion/gold-dust-drift.webm`,
  },
  "sacred.motion.particleDrift": {
    id: "sacred.motion.particleDrift",
    type: "video",
    path: `${HERO_ASSET_BASE}/motion/particles-drift.webm`,
  },
  "sacred.motion.heroVideo": {
    id: "sacred.motion.heroVideo",
    type: "video",
    path: `${HERO_ASSET_BASE}/motion/dental-hero-4k.mp4`,
  },
} as const;

export function resolveHeroAsset(id?: string): HeroAssetEntry | undefined {
  if (!id) return undefined;
  return HERO_ASSET_REGISTRY[id];
}

export function ensureHeroAssetPath(id?: string): string | undefined {
  return resolveHeroAsset(id)?.path;
}
