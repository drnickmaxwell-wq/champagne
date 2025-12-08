import { HeroSchema } from "./hero-schema";

const CTA_PRIMARY_CLASS = "cta-primary-ink-light";
const CTA_SECONDARY_CLASS = "cta-secondary-glass-gold";

export const whitening_hero: HeroSchema = {
  id: "hero-whitening",
  treatmentSlug: "whitening",
  tone: "whitening",
  toneProfile: {
    timeOfDay: "dawn",
    mood: "whitening_calm",
    depth: "soft",
    contrast: "standard",
  },
  intensity: "soft",
  layout: "left",
  layoutVariant: "left",
  eyebrow: "Cosmetic treatment",
  headline: "Luminous Whitening",
  subheadline: "Champagne-calibrated brightness for confident smiles.",
  subcopy: "Professional whitening with Champagne-level attention to detail.",
  waveSet: "wave-02",
  waveStrength: "strong",
  waves: {
    mask: "wave-02",
    opacity: 0.34,
    blendMode: "soft-light",
  },
  shimmer: {
    enabled: true,
    density: "med",
    style: "dust",
  },
  shimmerEnabled: true,
  shimmerStyle: "dust",
  cta: {
    primary: CTA_PRIMARY_CLASS,
    secondary: CTA_SECONDARY_CLASS,
    primaryLabel: "Book whitening",
    secondaryLabel: "Explore treatment options",
    primaryHref: "/contact",
    secondaryHref: "/treatments",
  },
  primaryCta: {
    label: "Book whitening",
    href: "/contact",
  },
  secondaryCta: {
    label: "Explore treatment options",
    href: "/treatments",
  },
};

export const composite_bonding_hero: HeroSchema = {
  id: "hero-composite-bonding",
  treatmentSlug: "composite-bonding",
  tone: "dusk",
  toneProfile: {
    timeOfDay: "dusk",
    mood: "bonding_sculpted",
    depth: "deep",
    contrast: "high",
  },
  intensity: "lux",
  layout: "left",
  layoutVariant: "left",
  eyebrow: "Composite bonding",
  headline: "Refine your smile with precision composite bonding.",
  subheadline: "Precise refinements for edges, chips, and symmetry.",
  subcopy:
    "Sculpted resin layers close micro-gaps, rebalance edges, and restore lustre without compromising healthy enamel. Explore how our clinicians map, model, and polish every refinement.",
  waveSet: "wave-03",
  waveStrength: "strong",
  waves: {
    mask: "wave-03",
    opacity: 0.38,
    blendMode: "overlay",
  },
  shimmer: {
    enabled: true,
    density: "med",
    style: "dust",
  },
  shimmerEnabled: true,
  shimmerStyle: "dust",
  cta: {
    primary: CTA_PRIMARY_CLASS,
    secondary: CTA_SECONDARY_CLASS,
    primaryLabel: "Book a consultation",
    secondaryLabel: "AI smile preview",
    primaryHref: "/contact",
    secondaryHref: "/ai-smile-quiz",
  },
  primaryCta: {
    label: "Book a consultation",
    href: "/contact",
  },
  secondaryCta: {
    label: "AI smile preview",
    href: "/ai-smile-quiz",
  },
};

export const implants_hero: HeroSchema = {
  id: "hero-implants",
  treatmentSlug: "implants",
  tone: "noir",
  toneProfile: {
    timeOfDay: "day",
    mood: "implants_confident",
    depth: "standard",
    contrast: "standard",
  },
  intensity: "standard",
  layout: "left",
  layoutVariant: "left",
  eyebrow: "Implant dentistry",
  headline: "Dental Implants",
  subheadline: "Surgical precision with Champagne-calibrated guidance.",
  subcopy: "Surgical clarity with noir gradients, guided flows, and steady CTA anchors.",
  waveSet: "wave-01",
  waveStrength: "medium",
  waves: {
    mask: "wave-01",
    opacity: 0.26,
    blendMode: "soft-light",
  },
  shimmer: {
    enabled: true,
    density: "low",
    style: "dust",
  },
  shimmerEnabled: true,
  shimmerStyle: "dust",
  cta: {
    primary: CTA_PRIMARY_CLASS,
    secondary: CTA_SECONDARY_CLASS,
    primaryLabel: "Book implant consult",
    secondaryLabel: "View all treatments",
    primaryHref: "/contact",
    secondaryHref: "/treatments",
  },
  primaryCta: {
    label: "Book implant consult",
    href: "/contact",
  },
  secondaryCta: {
    label: "View all treatments",
    href: "/treatments",
  },
};

export const veneers_hero: HeroSchema = {
  id: "hero-veneers",
  treatmentSlug: "veneers",
  tone: "dawn",
  toneProfile: {
    timeOfDay: "day",
    mood: "veneers_polished",
    depth: "standard",
    contrast: "standard",
  },
  intensity: "standard",
  layout: "center",
  layoutVariant: "center",
  eyebrow: "Cosmetic treatment",
  headline: "Porcelain Veneers",
  subheadline: "Even contours, natural translucency, confident smiles.",
  subcopy: "Balanced dawn palette with shimmer-ready layers for veneer case previews.",
  waveSet: "wave-02",
  waveStrength: "medium",
  waves: {
    mask: "wave-02",
    opacity: 0.28,
    blendMode: "soft-light",
  },
  shimmer: {
    enabled: true,
    density: "med",
    style: "dust",
  },
  shimmerEnabled: true,
  shimmerStyle: "dust",
  cta: {
    primary: CTA_PRIMARY_CLASS,
    secondary: CTA_SECONDARY_CLASS,
    primaryLabel: "Book veneer consult",
    secondaryLabel: "View all treatments",
    primaryHref: "/contact",
    secondaryHref: "/treatments",
  },
  primaryCta: {
    label: "Book veneer consult",
    href: "/contact",
  },
  secondaryCta: {
    label: "View all treatments",
    href: "/treatments",
  },
};

export const ortho_hero: HeroSchema = {
  id: "hero-orthodontics",
  treatmentSlug: "orthodontics",
  tone: "teal-lux",
  toneProfile: {
    timeOfDay: "day",
    mood: "ortho_precise",
    depth: "soft",
    contrast: "standard",
  },
  intensity: "soft",
  layout: "left",
  layoutVariant: "left",
  eyebrow: "Orthodontics",
  headline: "Orthodontics",
  subheadline: "Aligned journeys for braces and aligner pathways.",
  subcopy: "Soft teal gradients with glass CTA plate for aligner and braces previews.",
  waveSet: "wave-03",
  waveStrength: "soft",
  waves: {
    mask: "wave-03",
    opacity: 0.24,
    blendMode: "overlay",
  },
  shimmer: {
    enabled: true,
    density: "low",
    style: "dust",
  },
  shimmerEnabled: true,
  shimmerStyle: "dust",
  cta: {
    primary: CTA_PRIMARY_CLASS,
    secondary: CTA_SECONDARY_CLASS,
    primaryLabel: "Book ortho consult",
    secondaryLabel: "View all treatments",
    primaryHref: "/contact",
    secondaryHref: "/treatments",
  },
  primaryCta: {
    label: "Book ortho consult",
    href: "/contact",
  },
  secondaryCta: {
    label: "View all treatments",
    href: "/treatments",
  },
};

export const HERO_PRESETS: Record<string, HeroSchema> = {
  whitening: whitening_hero,
  "composite-bonding": composite_bonding_hero,
  implants: implants_hero,
  veneers: veneers_hero,
  orthodontics: ortho_hero,
};
