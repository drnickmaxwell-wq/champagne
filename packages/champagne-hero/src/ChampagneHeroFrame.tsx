"use client";

import { useEffect, useMemo, useState } from "react";
import type { HeroRegistryEntry } from "./HeroRegistry";
import { BaseChampagneSurface } from "./BaseChampagneSurface";
import { HeroPreviewDebug } from "./HeroPreviewDebug";
import { resolveHeroVariant } from "./HeroRegistry";

export interface ChampagneHeroFrameProps {
  heroId: string;
  preset?: string | Record<string, unknown>;
  headline?: string;
  subheadline?: string;
  eyebrow?: string;
  strapline?: string;
  cta?: { label: string; href: string };
}

type HeroPreset = string | (Record<string, unknown> & { type?: string; title?: string; subtitle?: string });

type LayerTokens = {
  background?: string;
  vignette?: string;
  wave?: string;
};

function deriveHeroType(heroId: string, preset?: HeroPreset) {
  if (preset && typeof preset === "object" && typeof preset.type === "string") return preset.type;
  if (heroId.includes("gilded")) return "gilded";
  if (heroId.includes("soft")) return "soft-focus";
  if (heroId.includes("glass")) return "gradient";
  return "gradient";
}

function extractLayerTokens(preset?: HeroPreset): LayerTokens {
  if (!preset || typeof preset !== "object") return {};
  return {
    background: typeof preset.background === "string" ? preset.background : undefined,
    vignette: typeof preset.vignette === "string" ? preset.vignette : undefined,
    wave: typeof preset.wave === "string" ? preset.wave : undefined,
  };
}

function resolveTitle(preset?: HeroPreset, fallback?: string) {
  if (preset && typeof preset === "object" && typeof preset.title === "string") return preset.title;
  return fallback;
}

function resolveSubtitle(preset?: HeroPreset, fallback?: string) {
  if (preset && typeof preset === "object" && typeof preset.subtitle === "string") return preset.subtitle;
  return fallback;
}

export function ChampagneHeroFrame({ heroId, preset, headline, subheadline, eyebrow, strapline, cta }: ChampagneHeroFrameProps) {
  const [showDebug, setShowDebug] = useState(false);
  const [resolvedHero, setResolvedHero] = useState<HeroRegistryEntry>(() => resolveHeroVariant(heroId));

  useEffect(() => {
    setResolvedHero(resolveHeroVariant(heroId));
  }, [heroId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setShowDebug(params.get("heroDebug") === "true" || params.has("heroDebug"));
  }, []);

  const mergedPreset: HeroPreset | undefined = useMemo(
    () => preset ?? (resolvedHero.preset as HeroPreset | undefined),
    [preset, resolvedHero.preset],
  );

  const heroType = deriveHeroType(heroId, mergedPreset);
  const layers = extractLayerTokens(mergedPreset);
  const resolvedHeadline = resolveTitle(mergedPreset, headline ?? resolvedHero.label ?? "Champagne hero");
  const resolvedSubheadline = resolveSubtitle(mergedPreset, strapline ?? subheadline);
  const resolvedEyebrow = eyebrow ?? (mergedPreset && typeof mergedPreset === "object" && typeof mergedPreset.palette === "string"
    ? `${mergedPreset.palette} treatment`
    : "Champagne treatment");

  const heroBackground = layers.background
    ?? (heroType === "gilded"
      ? "linear-gradient(145deg, color-mix(in srgb, var(--champagne-keyline-gold) 34%, transparent), color-mix(in srgb, var(--bg-ink) 90%, transparent))"
      : heroType === "soft-focus"
        ? "radial-gradient(circle at 22% 18%, color-mix(in srgb, var(--smh-white) 18%, transparent), transparent 36%), linear-gradient(160deg, color-mix(in srgb, var(--bg-ink) 86%, transparent), color-mix(in srgb, var(--bg-ink-soft) 78%, transparent))"
        : "linear-gradient(135deg, var(--smh-gradient-legacy), color-mix(in srgb, var(--bg-ink) 75%, transparent))");

  const vignetteLayer = layers.vignette
    ?? "radial-gradient(circle at 50% 50%, transparent 35%, color-mix(in srgb, var(--bg-ink) 55%, transparent))";

  const waveLayer = layers.wave
    ?? "linear-gradient(135deg, color-mix(in srgb, var(--smh-white) 4%, transparent), transparent), linear-gradient(15deg, color-mix(in srgb, var(--smh-white) 6%, transparent), transparent 65%)";

  return (
    <BaseChampagneSurface
      variant="inkGlass"
      style={{
        padding: "clamp(2rem, 4vw, 3rem)",
        border: "1px solid var(--champagne-keyline-gold)",
        background: heroBackground,
      }}
    >
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, background: vignetteLayer, mixBlendMode: "multiply" }} />
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, background: waveLayer, opacity: 0.8 }} />

      <div style={{ display: "grid", gap: "1.15rem", maxWidth: "960px" }}>
        <div style={{ display: "grid", gap: "0.55rem", maxWidth: "780px" }}>
          {resolvedEyebrow && (
            <span style={{
              fontSize: "0.92rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-medium)",
            }}>
              {resolvedEyebrow}
            </span>
          )}
          <h1 style={{ fontSize: "clamp(1.9rem, 3.1vw, 2.8rem)", fontWeight: 800, lineHeight: 1.15 }}>
            {resolvedHeadline ?? "Placeholder hero headline"}
          </h1>
          {resolvedSubheadline && (
            <p style={{ fontSize: "1.08rem", color: "var(--text-medium)", lineHeight: 1.65 }}>
              {resolvedSubheadline}
            </p>
          )}
        </div>

        {cta && (
          <a
            href={cta.href}
            style={{
              alignSelf: "flex-start",
              padding: "0.85rem 1.6rem",
              borderRadius: "var(--radius-md)",
              background: "var(--surface-gold-soft)",
              color: "var(--text-high)",
              textDecoration: "none",
              border: "1px solid var(--champagne-keyline-gold)",
              boxShadow: "var(--shadow-soft)",
            }}
          >
            {cta.label}
          </a>
        )}

        {showDebug && <HeroPreviewDebug hero={resolvedHero} />}
      </div>
    </BaseChampagneSurface>
  );
}
