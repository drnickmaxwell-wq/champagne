/**
 * Map semantic sacred hero asset IDs to concrete URLs under /assets/champagne/**
 */
const assetMap: Record<string, string> = {
  "sacred.wave.background.desktop": "/assets/champagne/waves/waves-bg-1920.webp",
  "sacred.wave.background.mobile": "/assets/champagne/waves/waves-bg-768.webp",
  "sacred.wave.overlay.field": "/assets/champagne/waves/wave-field.svg",
  "sacred.wave.overlay.dots": "/assets/champagne/waves/wave-dots.svg",
  "sacred.wave.mask.desktop": "/assets/champagne/waves/wave-mask-desktop.webp",
  "sacred.wave.mask.mobile": "/assets/champagne/waves/wave-mask-mobile.webp",
  "sacred.grain.desktop": "/assets/champagne/film-grain/film-grain-desktop.webp",
  "sacred.grain.mobile": "/assets/champagne/film-grain/film-grain-mobile.webp",
  "sacred.particles.home": "/assets/champagne/particles/home-hero-particles.webp",
  "sacred.particles.gold": "/assets/champagne/particles/particles-gold.webp",
  "sacred.particles.magenta": "/assets/champagne/particles/particles-magenta.webp",
  "sacred.particles.teal": "/assets/champagne/particles/particles-teal.webp",
  "sacred.motion.waveCaustics": "/assets/champagne/motion/wave-caustics.webm",
  "sacred.motion.glassShimmer": "/assets/champagne/motion/glass-shimmer.webm",
  "sacred.motion.goldDust": "/assets/champagne/motion/gold-dust-drift.webm",
  "sacred.motion.particleDrift": "/assets/champagne/motion/particles-drift.webm",
  "sacred.motion.heroVideo": "/assets/champagne/motion/dental-hero-4k.mp4",
};

export function resolveHeroAsset(id?: string | null): string | undefined {
  if (!id) return undefined;
  if (id.startsWith("/")) return id;
  return assetMap[id] ?? `/assets/champagne/${id}`;
}
