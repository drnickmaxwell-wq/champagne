export type HeroAssetType = "image" | "video";

export interface HeroAssetEntry {
  id: string;
  type: HeroAssetType;
  path: string;
  description?: string;
}

const HERO_ASSET_BASE = "/assets/champagne" as const;
const HERO_ASSET_FILES = {
  waveMaskDesktop: "waves/wave-mask-desktop.webp",
  waveMaskMobile: "waves/wave-mask-mobile.webp",
  waveMaskHeader: "waves/header-wave-mask.svg",
  waveMaskSmh: "waves/smh-wave-mask.svg",
  waveBackgroundDesktop: "waves/waves-bg-1920.webp",
  waveBackgroundMobile: "waves/waves-bg-768.webp",
  waveOverlayDots: "waves/wave-dots.svg",
  waveOverlayField: "waves/wave-field.svg",
  particlesHome: "particles/home-hero-particles.webp",
  particlesGold: "particles/particles-gold.webp",
  particlesMagenta: "particles/particles-magenta.webp",
  particlesTeal: "particles/particles-teal.webp",
  grainDesktop: "film-grain/film-grain-desktop.webp",
  grainMobile: "film-grain/film-grain-mobile.webp",
  textureCaustics: "textures/wave-light-overlay.webp",
  textureGoldDust: "textures/wave-gold-dust.png",
  motionWaveCaustics: "motion/wave-caustics.webm",
  motionGlassShimmer: "motion/glass-shimmer.webm",
  motionGoldDust: "motion/gold-dust-drift.webm",
  motionParticlesDrift: "motion/particles-drift.webm",
  motionHeroVideo: "motion/dental-hero-4k.mp4",
} as const;

const assetPath = (relativePath: string) => `${HERO_ASSET_BASE}/${relativePath}`;

export const HERO_ASSET_REGISTRY: Record<string, HeroAssetEntry> = {
  // Wave masks & backgrounds
  "sacred.wave.mask.desktop": {
    id: "sacred.wave.mask.desktop",
    type: "image",
    path: assetPath(HERO_ASSET_FILES.waveMaskDesktop),
    description: "Primary Sacred hero wave mask for desktop",
  },
  "sacred.wave.mask.mobile": {
    id: "sacred.wave.mask.mobile",
    type: "image",
    path: assetPath(HERO_ASSET_FILES.waveMaskMobile),
    description: "Primary Sacred hero wave mask for mobile",
  },
  "sacred.wave.mask.header": {
    id: "sacred.wave.mask.header",
    type: "image",
    path: assetPath(HERO_ASSET_FILES.waveMaskHeader),
  },
  "sacred.wave.mask.smh": {
    id: "sacred.wave.mask.smh",
    type: "image",
    path: assetPath(HERO_ASSET_FILES.waveMaskSmh),
  },
  "sacred.wave.background.desktop": {
    id: "sacred.wave.background.desktop",
    type: "image",
    path: assetPath(HERO_ASSET_FILES.waveBackgroundDesktop),
  },
  "sacred.wave.background.mobile": {
    id: "sacred.wave.background.mobile",
    type: "image",
    path: assetPath(HERO_ASSET_FILES.waveBackgroundMobile),
  },
  "sacred.wave.overlay.dots": {
    id: "sacred.wave.overlay.dots",
    type: "image",
    path: assetPath(HERO_ASSET_FILES.waveOverlayDots),
  },
  "sacred.wave.overlay.field": {
    id: "sacred.wave.overlay.field",
    type: "image",
    path: assetPath(HERO_ASSET_FILES.waveOverlayField),
  },

  // Particles (static)
  "sacred.particles.home": {
    id: "sacred.particles.home",
    type: "image",
    path: assetPath(HERO_ASSET_FILES.particlesHome),
    description: "Primary Sacred home hero particle texture",
  },
  "sacred.particles.gold": {
    id: "sacred.particles.gold",
    type: "image",
    path: assetPath(HERO_ASSET_FILES.particlesGold),
  },
  "sacred.particles.magenta": {
    id: "sacred.particles.magenta",
    type: "image",
    path: assetPath(HERO_ASSET_FILES.particlesMagenta),
  },
  "sacred.particles.teal": {
    id: "sacred.particles.teal",
    type: "image",
    path: assetPath(HERO_ASSET_FILES.particlesTeal),
  },

  // Grain
  "sacred.grain.desktop": {
    id: "sacred.grain.desktop",
    type: "image",
    path: assetPath(HERO_ASSET_FILES.grainDesktop),
  },
  "sacred.grain.mobile": {
    id: "sacred.grain.mobile",
    type: "image",
    path: assetPath(HERO_ASSET_FILES.grainMobile),
  },

  // Textures
  "sacred.texture.causticsOverlay": {
    id: "sacred.texture.causticsOverlay",
    type: "image",
    path: assetPath(HERO_ASSET_FILES.textureCaustics),
  },
  "sacred.texture.goldDust": {
    id: "sacred.texture.goldDust",
    type: "image",
    path: assetPath(HERO_ASSET_FILES.textureGoldDust),
  },

  // Motion
  "sacred.motion.waveCaustics": {
    id: "sacred.motion.waveCaustics",
    type: "video",
    path: assetPath(HERO_ASSET_FILES.motionWaveCaustics),
  },
  "sacred.motion.glassShimmer": {
    id: "sacred.motion.glassShimmer",
    type: "video",
    path: assetPath(HERO_ASSET_FILES.motionGlassShimmer),
  },
  "sacred.motion.goldDust": {
    id: "sacred.motion.goldDust",
    type: "video",
    path: assetPath(HERO_ASSET_FILES.motionGoldDust),
  },
  "sacred.motion.particleDrift": {
    id: "sacred.motion.particleDrift",
    type: "video",
    path: assetPath(HERO_ASSET_FILES.motionParticlesDrift),
  },
  "sacred.motion.heroVideo": {
    id: "sacred.motion.heroVideo",
    type: "video",
    path: assetPath(HERO_ASSET_FILES.motionHeroVideo),
  },
} as const;

export function resolveHeroAsset(id?: string): HeroAssetEntry | undefined {
  if (!id) return undefined;
  return HERO_ASSET_REGISTRY[id];
}

export function ensureHeroAssetPath(id?: string): string | undefined {
  return resolveHeroAsset(id)?.path;
}
