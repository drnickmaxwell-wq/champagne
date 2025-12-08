import type { HeroSchema } from "@/lib/champagne/hero-schema";

type HeroShimmerProps = {
  shimmer: HeroSchema["shimmer"];
  tone: HeroSchema["tone"];
  className?: string;
};

const shimmerMap: Record<HeroSchema["tone"], string> = {
  dusk: "/particles/particles-gold.webp",
  "teal-lux": "/particles/particles-teal.webp",
  noir: "/particles/particles-gold.webp",
  dawn: "/particles/particles-magenta.webp",
  whitening: "/particles/particles-gold.webp",
  custom: "/particles/particles-gold.webp",
};

export function HeroShimmer({ shimmer, tone, className }: HeroShimmerProps) {
  if (!shimmer.enabled) return null;

  const texture = shimmerMap[tone] ?? shimmerMap.dusk;
  const densityClass = shimmer.density === "high"
    ? "hero-shimmer-density-high"
    : shimmer.density === "low"
      ? "hero-shimmer-density-low"
      : "hero-shimmer-density-med";

  return (
    <div
      aria-hidden
      className={`hero-shimmer-layer ${densityClass} ${className ?? ""}`.trim()}
      style={{ backgroundImage: `url(${texture})` }}
    />
  );
}
