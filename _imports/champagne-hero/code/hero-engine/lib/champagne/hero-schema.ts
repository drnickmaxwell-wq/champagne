export type HeroTone =
  | "dusk"
  | "teal-lux"
  | "noir"
  | "dawn"
  | "whitening"
  | "custom"
  | "whitening_dawn"
  | "bonding_dusk"
  | "implants_dusk"
  | "veneers_dusk"
  | "ortho_dusk"
  | string;

export type HeroTimeOfDay = "dawn" | "day" | "dusk" | "night";
export type HeroMood =
  | "whitening_calm"
  | "bonding_sculpted"
  | "implants_confident"
  | "veneers_polished"
  | "ortho_precise";

export interface HeroToneProfile {
  timeOfDay: HeroTimeOfDay;
  mood: HeroMood;
  depth?: "soft" | "standard" | "deep";
  contrast?: "low" | "standard" | "high";
}

export type HeroIntensity = "soft" | "standard" | "lux" | "medium" | "bold";
export type HeroWaveMask = "wave-01" | "wave-02" | "wave-03";
export type HeroWaveBlend = "soft-light" | "overlay";
export type HeroShimmerDensity = "low" | "med" | "high";
export type HeroWaveStrength = "soft" | "medium" | "strong";
export type HeroShimmerStyle = "dust" | "bands" | "none" | string;

export interface HeroSchema {
  id?: string;
  treatmentSlug?: string;
  tone: HeroTone;
  toneProfile: HeroToneProfile;
  intensity: HeroIntensity;
  headline: string;
  subheadline?: string;
  subcopy?: string;
  eyebrow?: string;
  supportingCopy?: string;
  badgeLabel?: string;
  waveSet?: HeroWaveMask;
  waveStrength?: HeroWaveStrength;
  waves: {
    mask: HeroWaveMask;
    opacity: number;
    blendMode?: HeroWaveBlend;
  };
  shimmer: {
    enabled: boolean;
    density: HeroShimmerDensity;
    style?: HeroShimmerStyle;
  };
  shimmerEnabled?: boolean;
  shimmerStyle?: HeroShimmerStyle;
  cta: {
    primary: string;
    secondary: string;
    primaryLabel?: string;
    secondaryLabel?: string;
    primaryHref?: string;
    secondaryHref?: string;
  };
  primaryCta?: {
    label: string;
    href: string;
    className?: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
    className?: string;
  };
  layout: "left" | "center";
  layoutVariant?: "left" | "center" | "right";
  notes?: string;
}

const defaultSchema: HeroSchema = {
  id: "hero-default",
  treatmentSlug: "default",
  tone: "dusk",
  toneProfile: {
    timeOfDay: "day",
    mood: "whitening_calm",
    depth: "standard",
    contrast: "standard",
  },
  intensity: "standard",
  waves: {
    mask: "wave-01",
    opacity: 0.28,
    blendMode: "soft-light",
  },
  shimmer: {
    enabled: true,
    density: "med",
    style: "dust",
  },
  cta: {
    primary: "cta-primary-ink-light",
    secondary: "cta-secondary-glass-gold",
    primaryLabel: "Primary CTA",
    secondaryLabel: "Secondary CTA",
    primaryHref: "/contact",
    secondaryHref: "/treatments",
  },
  layout: "left",
  eyebrow: "Champagne preview",
  headline: "Preview hero",
  subheadline: "Preview hero subheadline",
  subcopy: "Token-driven hero surface ready for Manus-aligned content.",
};

const toneFallback: HeroTone = "dusk";
const toneSet: Set<HeroTone> = new Set([
  "dusk",
  "teal-lux",
  "noir",
  "dawn",
  "whitening",
  "custom",
  "whitening_dawn",
  "bonding_dusk",
  "implants_dusk",
  "veneers_dusk",
  "ortho_dusk",
]);
const intensitySet: Set<HeroIntensity> = new Set(["soft", "standard", "lux", "medium", "bold"]);
const waveMaskSet: Set<HeroWaveMask> = new Set(["wave-01", "wave-02", "wave-03"]);
const shimmerDensitySet: Set<HeroShimmerDensity> = new Set(["low", "med", "high"]);
const waveStrengthSet: Set<HeroWaveStrength> = new Set(["soft", "medium", "strong"]);
const timeOfDaySet: Set<HeroTimeOfDay> = new Set(["dawn", "day", "dusk", "night"]);
const moodSet: Set<HeroMood> = new Set([
  "whitening_calm",
  "bonding_sculpted",
  "implants_confident",
  "veneers_polished",
  "ortho_precise",
]);

function clampOpacity(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) return defaultSchema.waves.opacity;
  if (value < 0.1) return 0.1;
  if (value > 0.45) return 0.45;
  return value;
}

export function validateHeroSchema(schema: Partial<HeroSchema>): HeroSchema {
  const id = schema.id || defaultSchema.id;
  const treatmentSlug = schema.treatmentSlug || defaultSchema.treatmentSlug;
  const tone = toneSet.has(schema.tone as HeroTone) ? (schema.tone as HeroTone) : toneFallback;
  const intensity = intensitySet.has(schema.intensity as HeroIntensity)
    ? (schema.intensity as HeroIntensity)
    : defaultSchema.intensity;
  const toneProfileInput = schema.toneProfile ?? defaultSchema.toneProfile;
  const toneProfile: HeroToneProfile = {
    timeOfDay: timeOfDaySet.has(toneProfileInput.timeOfDay as HeroTimeOfDay)
      ? (toneProfileInput.timeOfDay as HeroTimeOfDay)
      : defaultSchema.toneProfile.timeOfDay,
    mood: moodSet.has(toneProfileInput.mood as HeroMood)
      ? (toneProfileInput.mood as HeroMood)
      : defaultSchema.toneProfile.mood,
    depth: toneProfileInput.depth ?? defaultSchema.toneProfile.depth,
    contrast: toneProfileInput.contrast ?? defaultSchema.toneProfile.contrast,
  };
  const resolvedWaveMask = (schema.waveSet ?? schema.waves?.mask) as HeroWaveMask;
  const waveMask = waveMaskSet.has(resolvedWaveMask) ? resolvedWaveMask : defaultSchema.waves.mask;
  const blendMode = schema.waves?.blendMode === "overlay" ? "overlay" : defaultSchema.waves.blendMode;
  const waveOpacity = clampOpacity(schema.waves?.opacity);
  const waveStrength = waveStrengthSet.has(schema.waveStrength as HeroWaveStrength)
    ? (schema.waveStrength as HeroWaveStrength)
    : "medium";

  const shimmerEnabled = schema.shimmerEnabled ?? schema.shimmer?.enabled ?? defaultSchema.shimmer.enabled;
  const shimmerDensity = shimmerDensitySet.has(schema.shimmer?.density as HeroShimmerDensity)
    ? (schema.shimmer?.density as HeroShimmerDensity)
    : defaultSchema.shimmer.density;
  const shimmerStyle: HeroShimmerStyle = schema.shimmerStyle
    || (schema.shimmer?.style as HeroShimmerStyle)
    || defaultSchema.shimmer.style
    || "dust";

  const layoutVariant = schema.layoutVariant ?? schema.layout ?? defaultSchema.layout;
  const layout = layoutVariant === "center" ? "center" : "left";

  const eyebrow = schema.eyebrow?.trim() || defaultSchema.eyebrow;
  const headline = schema.headline?.trim() || defaultSchema.headline;
  const subheadline = schema.subheadline?.trim() || schema.subcopy?.trim() || defaultSchema.subheadline;
  const subcopy = schema.subcopy?.trim() || schema.subheadline?.trim() || defaultSchema.subcopy;

  const primaryLabel = schema.primaryCta?.label || schema.cta?.primaryLabel || defaultSchema.cta.primaryLabel;
  const secondaryLabel = schema.secondaryCta?.label || schema.cta?.secondaryLabel || defaultSchema.cta.secondaryLabel;
  const primaryHref = schema.primaryCta?.href || schema.cta?.primaryHref || defaultSchema.cta.primaryHref;
  const secondaryHref = schema.secondaryCta?.href || schema.cta?.secondaryHref || defaultSchema.cta.secondaryHref;

  return {
    id,
    treatmentSlug,
    tone,
    toneProfile,
    intensity,
    layout,
    layoutVariant,
    eyebrow,
    headline,
    subheadline,
    subcopy,
    supportingCopy: schema.supportingCopy,
    badgeLabel: schema.badgeLabel,
    waveSet: waveMask,
    waveStrength,
    waves: {
      mask: waveMask,
      opacity: waveOpacity,
      blendMode,
    },
    shimmer: {
      enabled: shimmerEnabled,
      density: shimmerDensity,
      style: shimmerStyle,
    },
    shimmerEnabled,
    shimmerStyle,
    cta: {
      primary: schema.primaryCta?.className || schema.cta?.primary || defaultSchema.cta.primary,
      secondary: schema.secondaryCta?.className || schema.cta?.secondary || defaultSchema.cta.secondary,
      primaryLabel,
      secondaryLabel,
      primaryHref,
      secondaryHref,
    },
    primaryCta: schema.primaryCta || (primaryLabel && primaryHref ? { label: primaryLabel, href: primaryHref } : undefined),
    secondaryCta: schema.secondaryCta
      || (secondaryLabel && secondaryHref ? { label: secondaryLabel, href: secondaryHref } : undefined),
    notes: schema.notes,
  };
}
