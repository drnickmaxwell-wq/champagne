"use client";

import { useEffect, useState } from "react";
import type { HeroRegistryEntry } from "./HeroRegistry";
import { BaseChampagneSurface } from "./BaseChampagneSurface";
import { HeroPreviewDebug } from "./HeroPreviewDebug";
import { resolveHeroVariant } from "./HeroRegistry";

export interface ChampagneHeroFrameProps {
  heroId: string;
  headline?: string;
  subheadline?: string;
  cta?: { label: string; href: string };
}

export function ChampagneHeroFrame({ heroId, headline, subheadline, cta }: ChampagneHeroFrameProps) {
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

  return (
    <BaseChampagneSurface
      variant="inkGlass"
      style={{
        padding: "2.5rem",
        border: "1px solid var(--champagne-keyline-gold, rgba(255, 215, 137, 0.45))",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <span style={{
            fontSize: "0.9rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--text-medium, rgba(255,255,255,0.7))",
          }}>
            Champagne Hero Surface
          </span>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1.2 }}>
            {headline ?? "Placeholder hero headline"}
          </h1>
          {subheadline && (
            <p style={{ fontSize: "1.1rem", color: "var(--text-medium, rgba(255,255,255,0.78))" }}>
              {subheadline}
            </p>
          )}
        </div>

        {cta && (
          <a
            href={cta.href}
            style={{
              alignSelf: "flex-start",
              padding: "0.75rem 1.5rem",
              borderRadius: "var(--radius-md)",
              background: "var(--champagne-keyline-gold, rgba(255, 215, 137, 0.18))",
              color: "var(--text-high)",
              textDecoration: "none",
              border: "1px solid var(--champagne-keyline-gold, rgba(255, 215, 137, 0.45))",
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
