/**
 * fx.ts
 * -------
 * FX adaptor for sections.
 * A lightweight layer that allows sections to declare:
 * - parallax
 * - shimmer
 * - scroll-based fade
 * - spotlight reveals
 *
 * This is intentionally minimal – FX engines may expand later.
 */

export interface FxProps {
  parallax?: boolean | number;
  fadeIn?: boolean;
  spotlight?: boolean;
  shimmer?: boolean;
}

export function computeFxProps(entry?: any): FxProps {
  if (!entry || typeof entry !== "object") return {};

  return {
    parallax: entry.parallax ?? false,
    fadeIn: entry.fadeIn ?? false,
    spotlight: entry.spotlight ?? false,
    shimmer: entry.shimmer ?? false,
  };
}
