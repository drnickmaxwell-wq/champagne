import type { CSSProperties } from "react";
import { BaseChampagneSurface, ChampagneHeroFrame } from "@champagne/hero";
import {
  champagneMachineManifest,
  getCTASlotsForPage,
  getHeroManifest,
  getPageManifestBySlug,
} from "@champagne/manifests";
import { ChampagneCTAGroup, resolveCTAList } from "@champagne/cta";
import { ChampagneSectionRenderer, getSectionStack } from "@champagne/sections";

export interface ChampagnePageBuilderProps {
  slug: string;
  previewMode?: boolean;
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

function DebugPanel({
  path,
  manifestLabel,
  heroId,
  heroPreset,
  sectionIds,
  ctaSummary,
}: {
  path?: string;
  manifestLabel?: string;
  heroId?: string;
  heroPreset?: string | Record<string, unknown>;
  sectionIds: string[];
  ctaSummary: Record<string, number>;
}) {
  return (
    <div
      style={{
        border: "1px dashed color-mix(in srgb, var(--champagne-keyline-gold, #f9e8c3) 45%, transparent)",
        borderRadius: "var(--radius-md)",
        padding: "0.9rem 1rem",
        background: "color-mix(in srgb, var(--bg-ink-soft, #0c0f16) 35%, transparent)",
        color: "var(--text-medium, rgba(245,245,245,0.8))",
        display: "grid",
        gap: "0.4rem",
      }}
    >
      <div style={{ fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", fontSize: "0.9rem" }}>
        Preview debug
      </div>
      <div style={{ fontSize: "0.95rem" }}>
        <strong>Path</strong>: {path ?? "(fallback from slug)"}
      </div>
      {manifestLabel && <div style={{ fontSize: "0.95rem" }}><strong>Label</strong>: {manifestLabel}</div>}
      <div style={{ fontSize: "0.95rem" }}>
        <strong>Hero</strong>: {heroId ?? "(resolved)"} {heroPreset ? "• preset active" : ""}
      </div>
      <div style={{ fontSize: "0.95rem" }}>
        <strong>Sections</strong>: {sectionIds.length > 0 ? sectionIds.join(", ") : "none"}
      </div>
      <div style={{ fontSize: "0.95rem" }}>
        <strong>CTA slots</strong>: hero ({ctaSummary.heroCTAs ?? 0}), mid ({ctaSummary.midPageCTAs ?? 0}), footer ({ctaSummary.footerCTAs ?? 0})
      </div>
    </div>
  );
}

export function ChampagnePageBuilder({ slug, previewMode = false }: ChampagnePageBuilderProps) {
  const manifest = resolveManifest(slug);
  const pagePath = manifest?.path ?? (slug.startsWith("/") ? slug : `/${slug}`);
  const heroManifest = getHeroManifest(pagePath) ?? getHeroManifest(slug);
  const heroId = heroManifest?.id ?? (typeof manifest?.hero === "string" ? manifest.hero : manifest?.id ?? pagePath);
  const heroPreset = heroManifest?.preset ?? manifest?.hero;
  const ctaSlots = getCTASlotsForPage(pagePath);
  const heroCTAs = resolveCTAList(ctaSlots.heroCTAs, "primary");
  const midPageCTAs = resolveCTAList(ctaSlots.midPageCTAs, "secondary");
  const footerCTAs = resolveCTAList(ctaSlots.footerCTAs, "ghost");
  const sections = getSectionStack(pagePath);

  return (
    <BaseChampagneSurface variant="inkGlass" style={surfaceStyle}>
      <div style={gridStyle}>
        <div style={{ display: "grid", gap: "0.8rem" }}>
          <ChampagneHeroFrame
            heroId={heroId ?? pagePath}
            preset={heroPreset}
            headline={manifest?.label as string | undefined}
            cta={heroCTAs[0] ? { label: heroCTAs[0].label, href: heroCTAs[0].href } : undefined}
          />
          {heroCTAs.length > 0 && (
            <ChampagneCTAGroup
              ctas={heroCTAs}
              label="Hero CTAs"
              defaultPreset="primary"
              showDebug={previewMode}
            />
          )}
        </div>
        <ChampagneSectionRenderer pageSlug={pagePath} midPageCTAs={midPageCTAs} previewMode={previewMode} />
        {footerCTAs.length > 0 && (
          <ChampagneCTAGroup
            ctas={footerCTAs}
            label="Footer CTAs"
            direction="row"
            defaultPreset="ghost"
            showDebug={previewMode}
          />
        )}
        {previewMode && (
          <DebugPanel
            path={pagePath}
            manifestLabel={manifest?.label as string | undefined}
            heroId={heroId}
            heroPreset={heroPreset}
            sectionIds={sections.map((section) => section.id)}
            ctaSummary={{
              heroCTAs: heroCTAs.length,
              midPageCTAs: midPageCTAs.length,
              footerCTAs: footerCTAs.length,
            }}
          />
        )}
      </div>
    </BaseChampagneSurface>
  );
}

export default ChampagnePageBuilder;
