import type { CSSProperties } from "react";
import { BaseChampagneSurface, ChampagneHeroFrame } from "@champagne/hero";
import {
  champagneMachineManifest,
  getHeroManifest,
  getPageManifestBySlug,
} from "@champagne/manifests";
import { ChampagneSectionRenderer } from "@champagne/sections";

export interface ChampagnePageBuilderProps {
  slug: string;
}

function resolveManifest(slug: string) {
  return (
    getPageManifestBySlug(slug) ||
    champagneMachineManifest.pages?.[slug] ||
    champagneMachineManifest.treatments?.[slug]
  );
}

const surfaceStyle: CSSProperties = {
  padding: "clamp(1.25rem, 3vw, 2.5rem)",
  border: "1px solid var(--champagne-keyline-gold, rgba(255, 215, 137, 0.28))",
  background:
    "radial-gradient(circle at 14% 18%, color-mix(in srgb, var(--smh-white, #ffffff) 12%, transparent), transparent 40%), linear-gradient(145deg, color-mix(in srgb, var(--bg-ink, #06070c) 90%, transparent), color-mix(in srgb, var(--bg-ink-soft, #0c0f16) 82%, transparent))",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gap: "clamp(1.25rem, 3vw, 2.5rem)",
};

export function ChampagnePageBuilder({ slug }: ChampagnePageBuilderProps) {
  const manifest = resolveManifest(slug);
  const pagePath = manifest?.path ?? (slug.startsWith("/") ? slug : `/${slug}`);
  const heroManifest = getHeroManifest(pagePath) ?? getHeroManifest(slug);
  const heroId = heroManifest?.id ?? (typeof manifest?.hero === "string" ? manifest.hero : manifest?.id ?? pagePath);
  const heroPreset = heroManifest?.preset ?? manifest?.hero;

  return (
    <BaseChampagneSurface variant="inkGlass" style={surfaceStyle}>
      <div style={gridStyle}>
        <ChampagneHeroFrame
          heroId={heroId ?? pagePath}
          preset={heroPreset}
          headline={manifest?.label as string | undefined}
        />
        <ChampagneSectionRenderer pageSlug={pagePath} />
      </div>
    </BaseChampagneSurface>
  );
}

export default ChampagnePageBuilder;
