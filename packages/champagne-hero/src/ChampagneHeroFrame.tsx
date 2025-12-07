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

export function ChampagneHeroFrame({ heroId, preset, headline, subheadline, cta }: ChampagneHeroFrameProps) {
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
  const resolvedSubheadline = resolveSubtitle(mergedPreset, subheadline);

  const heroBackground = layers.background
    ?? (heroType === "gilded"
      ? "linear-gradient(145deg, color-mix(in srgb, var(--champagne-keyline-gold, #ffd789) 34%, transparent), color-mix(in srgb, var(--bg-ink, #06070c) 90%, transparent))"
      : heroType === "soft-focus"
        ? "radial-gradient(circle at 22% 18%, color-mix(in srgb, var(--smh-white, #ffffff) 18%, transparent), transparent 36%), linear-gradient(160deg, color-mix(in srgb, var(--bg-ink, #06070c) 86%, transparent), color-mix(in srgb, var(--bg-ink-soft, #0c0f16) 78%, transparent))"
        : "linear-gradient(135deg, var(--smh-gradient-legacy, rgba(255,255,255,0.08)), color-mix(in srgb, var(--bg-ink, #06070c) 75%, transparent))");

  const vignetteLayer = layers.vignette
    ?? "radial-gradient(circle at 50% 50%, transparent 35%, rgba(0,0,0,0.55))";

  const waveLayer = layers.wave
    ?? "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0)), linear-gradient(15deg, rgba(255,255,255,0.06), transparent 65%)";

  return (
    <BaseChampagneSurface
      variant="inkGlass"
      style={{
        padding: "clamp(2rem, 4vw, 3rem)",
        border: "1px solid var(--champagne-keyline-gold, rgba(255, 215, 137, 0.35))",
        background: heroBackground,
      }}
    >
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, background: vignetteLayer, mixBlendMode: "multiply" }} />
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, background: waveLayer, opacity: 0.8 }} />

      <div style={{ display: "grid", gap: "1.15rem" }}>
        <div style={{ display: "grid", gap: "0.6rem", maxWidth: "720px" }}>
          <span style={{
            fontSize: "0.92rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--text-medium, rgba(255,255,255,0.7))",
          }}>
            {heroType} hero
          </span>
          <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 800, lineHeight: 1.18 }}>
            {resolvedHeadline ?? "Placeholder hero headline"}
          </h1>
          {resolvedSubheadline && (
            <p style={{ fontSize: "1.05rem", color: "var(--text-medium, rgba(255,255,255,0.78))", lineHeight: 1.6 }}>
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
              background: "rgba(255, 215, 137, 0.14)",
              color: "var(--text-high)",
              textDecoration: "none",
              border: "1px solid var(--champagne-keyline-gold, rgba(255, 215, 137, 0.35))",
              boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
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
