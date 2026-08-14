import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(join(__dirname, "HeroV3DiagnosticLab.tsx"), "utf8");
const surface = readFileSync(join(__dirname, "HeroV3StaticCompositionSurface.tsx"), "utf8");
const styles = readFileSync(join(__dirname, "heroV3Diagnostic.module.css"), "utf8");

describe("Hero V3 H3.2R single static convergence contract", () => {
  it("shows only the accepted Sacred V2 baseline and one new V3 candidate", () => {
    expect(source).toContain("Accepted Sacred V2");
    expect(source).toContain("Champagne V3 candidate");
    expect(source).toContain("v2-reference");
    expect(surface).toContain('HERO_V3_STATIC_CANDIDATE_ID = "v3-champagne-sculpted-current"');
    expect(source.match(/label: /g)).toHaveLength(4);
  });

  it("retires rejected choreography and unselected static studies from active review", () => {
    for (const retired of ["v2-light-depth-enhanced", "v3-editorial-current", "v3-velvet-ribbon", "v3-luminous-tide", "ENHANCED_MOTION", "CHOREOGRAPHY_DURATION_MS"]) expect(source).not.toContain(retired);
    expect(source).not.toContain("requestAnimationFrame");
    expect(source).not.toContain("video.play");
  });

  it("keeps the Sacred V2 renderer as the canonical copy and CTA source", () => {
    expect(source).toContain("HeroRendererV2");
    expect(source).toContain("<HeroRendererV2");
    expect(source).toContain("prm");
    expect(source).toContain('pageSlugOrPath="/"');
    expect(source).not.toContain("HeroAssetRegistry");
    expect(source).not.toContain("HeroManifestAdapter");
  });

  it("is deterministic, static, versioned and production-unbound", () => {
    expect(surface).toContain("HERO_V3_STATIC_COMPOSITION_SURFACE_V1");
    expect(surface).toContain("<svg");
    expect(surface).not.toContain("<video");
    expect(surface).not.toContain("requestAnimationFrame");
    expect(surface).not.toMatch(/#[0-9a-f]{3,8}/i);
    expect(source).toContain('data-production-binding="false"');
    expect(source).toContain("productionBinding=false");
  });

  it("uses founder brand tokens with layered wave sculpture", () => {
    expect(styles).toContain("var(--brand-magenta)");
    expect(styles).toContain("var(--brand-teal)");
    expect(styles).toContain("var(--brand-gold)");
    for (const layer of ["waveTealBack", "wavePorcelain", "waveTealFront", "waveMagenta", "goldEdge"]) expect(surface).toContain(layer);
  });

  it("provides independent desktop and mobile art direction", () => {
    expect(source).toContain('{ id: "desktop", label: "Desktop · 1440" }');
    expect(source).toContain('{ id: "mobile", label: "Mobile · 390" }');
    expect(surface).toContain("desktopComposition");
    expect(surface).toContain("mobileComposition");
    expect(styles).toContain('.stage[data-h3-viewport="mobile"] .desktopComposition');
    expect(styles).toContain('.stage[data-h3-viewport="mobile"] .mobileComposition');
  });

  it("protects copy and CTA safe zones", () => {
    expect(source).toContain("Copy / CTA safe zones");
    expect(source).toContain("Protected copy");
    expect(source).toContain("Protected CTA");
    expect(styles).toContain(".copyZone");
    expect(styles).toContain(".ctaZone");
  });

  it("replaces only the V3 surface while retaining sibling hero content", () => {
    expect(styles).toMatch(/v3-champagne-sculpted-current[^}]+hero-surface-stack[^}]+display:\s*none\s*!important/);
    expect(styles).not.toMatch(/v3-champagne-sculpted-current[^}]+hero-content[^}]+display:\s*none/);
    expect(styles).toContain(":global(body):has(.page)");
    expect(styles).toContain(".stage :global(.hero-renderer-v2)");
  });
});
