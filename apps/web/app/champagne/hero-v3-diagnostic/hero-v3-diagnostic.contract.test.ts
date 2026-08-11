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
    expect(source).toContain("V2 untouched motion reference");
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

  it("isolates evidence captures from the persistent site-shell Hero stack", () => {
    expect(styles).toContain(":global(body):has(.page)");
    expect(styles).toContain('.stage[data-h3-study="v2-reference"]');
  });

  it("compares complete V2 motion against a motion-plate-only enhancement", () => {
    expect(source).toContain("v2-light-depth-enhanced");
    expect(source).toContain("V2_MOTION_STUDIES");
    expect(source).toContain("ENHANCED_MOTION");
    expect(source).toContain("controlSelected = isSelected && !evidenceMode");
    expect(source).toContain("CHOREOGRAPHY_DURATION_MS = 24_000");
    expect(source).toContain("choreographyOpacity");
    expect(source).toContain("requestAnimationFrame(choreograph)");
    expect(source).toContain('"sacred.motion.waveCaustics"');
    expect(source).toContain('"sacred.motion.glassShimmer"');
    expect(source).toContain('"sacred.motion.particleDrift"');
    expect(source).toContain('"sacred.motion.goldDust"');
    expect(styles).toMatch(/v2-light-depth-enhanced[\s\S]*?sacred\.motion/);
  });

  it("suppresses opaque plate backgrounds and sequences the retained highlights", () => {
    expect(source).toContain("peak: 0.18");
    expect(source).toContain("peak: 0.36");
    expect(source).toContain("peak: 0.58");
    expect(source).toContain("peak: 0.74");
    expect(source).toContain('dataset.h3OpticalPlate = "highlights-only"');
    expect(source).toContain("brightness(0.58) contrast(2.65)");
    expect(source).toContain("brightness(0.52) contrast(2.85)");
    expect(styles).toContain("mask-image: linear-gradient(90deg");
    expect(styles).toContain("mask-image: linear-gradient(180deg");
    expect(source).not.toContain("setInterval(enforceEnhancement");
  });

  it("does not replace V2 artwork, geometry, copy or actions in the enhancement state", () => {
    expect(source).not.toContain("HeroV2EnhancedSurface");
    expect(styles).not.toMatch(/data-h3-study="v2-light-depth-enhanced"[^}]*background\s*:/);
    expect(styles).not.toMatch(/data-h3-study="v2-light-depth-enhanced"[^}]*transform\s*:/);
  });
});
