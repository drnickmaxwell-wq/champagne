import "../styles/champagne/theme.css";

export const champagneTokensVersion = "v1";

/**
 * Public CSS entry point for consumers who prefer direct stylesheet imports.
 */
export const champagneThemeStylesheet = "@champagne/tokens/styles/champagne/theme.css";

export const champagneTokenNames = [
  "--brand-magenta",
  "--brand-teal",
  "--brand-gold",
  "--brand-gold-keyline",
  "--brand-soft-gold",
  "--brand-ink",
  "--brand-white",
  "--ink",
  "--bg",
  "--text",
  "--ink-100",
  "--ink-80",
  "--ink-60",
  "--radius-lg",
  "--radius-md",
  "--radius-sm",
  "--shadow-soft",
  "--shadow-strong",
  "--particles-opacity",
  "--grain-opacity",
  "--glass-opacity",
  "--bg-ink",
  "--bg-ink-soft",
  "--surface-glass",
  "--surface-glass-deep",
  "--text-high",
  "--text-medium",
  "--text-low",
  "--smh-gradient",
  "--smh-gradient-legacy",
  "--iridescent-gradient",
  "--smh-ink",
  "--smh-text",
  "--smh-primary-ink",
  "--smh-white",
  "--smh-gray-200",
  "--smh-primary-magenta",
  "--smh-primary-teal",
  "--smh-accent-gold",
  "--smh-accent-gold-soft",
  "--smh-gold",
  "--champagne-keyline-gold",
  "--smh-surface-bg-size",
  "--smh-surface-bg-position",
  "--champagne-glass-bg",
  "--smh-grain-alpha",
  "--smh-vignette-alpha",
  "--smh-particles-alpha",
  "--champagne-grain-alpha",
  "--champagne-vignette-alpha",
  "--champagne-sheen-alpha",
  "--champagne-particles-opacity-d",
  "--champagne-particles-opacity-m",
  "--smh-warm-lift",
  "--smh-warm-lift-magenta-alpha",
  "--smh-warm-lift-gold-alpha",
  "--smh-warm-magenta",
  "--smh-warm-rose",
  "--smh-warm-gold",
  "--smh-grad-angle",
  "--smh-grad-stop1",
  "--smh-grad-stop2",
  "--smh-grad-stop3",
  "--smh-gold-shoulder",
  "--smh-bg-size",
  "--smh-bg-pos",
  "--parallax-max"
] as const;

export type ChampagneTokenName = (typeof champagneTokenNames)[number];
export type ChampagneTokenMap = Record<ChampagneTokenName, string>;

export const champagneTokenMap: ChampagneTokenMap = Object.fromEntries(
  champagneTokenNames.map((name) => [name, `var(${name})`] as const)
) as ChampagneTokenMap;

/**
 * Typed representation of the canonical Champagne CSS variable names. Useful for
 * TS/JS consumers that want to reference tokens without importing CSS files.
 */
export const champagneTokens = {
  names: champagneTokenNames,
  map: champagneTokenMap
};
