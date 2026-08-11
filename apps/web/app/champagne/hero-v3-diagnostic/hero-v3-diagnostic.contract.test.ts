import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(join(__dirname, "HeroV3DiagnosticLab.tsx"), "utf8");
const surface = readFileSync(join(__dirname, "HeroV3StaticCompositionSurface.tsx"), "utf8");
const styles = readFileSync(join(__dirname, "heroV3Diagnostic.module.css"), "utf8");

describe("Hero V3 H3.1 diagnostic contract", () => {
  it("uses the real V2 renderer without importing sacred runtime internals", () => {
    expect(source).toContain("HeroRendererV2");
    expect(source).not.toContain("HeroAssetRegistry");
    expect(source).not.toContain("HeroManifestAdapter");
  });

  it("includes static, motion, reduced-motion and loop evidence", () => {
    expect(source).toContain("Complete V2 static");
    expect(source).toContain("Complete V2 motion");
    expect(source).toContain("Reduced-motion V2");
    expect(source).toContain("time-regression");
    expect(source).toContain("node-replaced");
  });

  it("keeps exported evidence explicitly diagnostic", () => {
    expect(source).toContain("HERO_V3_H3_1_LIVE_EVIDENCE_V1");
    expect(source).toContain("productionBinding=false");
  });

  it("exposes the bounded H3.2 static candidate family without motion repair", () => {
    expect(source).toContain("V2 static reference baseline");
    expect(source).toContain("A — V2 Precision");
    expect(source).toContain("B — Spectral Wave");
    expect(source).toContain("C — Velvet Porcelain Depth");
    expect(source).toContain("D — Luminous Counterflow");
    expect(source).not.toContain("crossfade");
  });

  it("mounts no more than three versioned V3-only static candidates", () => {
    expect(source).toContain("v3-editorial-current");
    expect(source).toContain("v3-velvet-ribbon");
    expect(source).toContain("v3-luminous-tide");
    expect(surface).toContain("HERO_V3_STATIC_COMPOSITION_SURFACE_V1");
    expect(surface.match(/\| "v3-/g)).toHaveLength(3);
  });

  it("keeps the V3 substrate deterministic, static and token-bound", () => {
    expect(surface).toContain("<svg");
    expect(surface).not.toContain("video");
    expect(surface).not.toContain("requestAnimationFrame");
    expect(surface).not.toMatch(/#[0-9a-f]{3,8}/i);
    expect(styles).toContain("var(--brand-magenta)");
    expect(styles).toContain("var(--brand-teal)");
    expect(styles).toContain("var(--brand-gold)");
  });

  it("removes the inherited V2 surface stack without hiding the sibling content", () => {
    expect(styles).toContain(":global(.hero-surface-stack)");
    expect(styles).toMatch(/data-h3-study\^=\"v3-\"[\s\S]*?display:\s*none\s*!important/);
    expect(styles).not.toMatch(/data-h3-study\^=\"v3-\"[^}]*?hero-content[^}]*?display:\s*none/);
  });
});
