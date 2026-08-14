import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(join(__dirname, "HeroV3DiagnosticLab.tsx"), "utf8");
const controller = readFileSync(join(__dirname, "HeroV3MotionScoreController.tsx"), "utf8");
const styles = readFileSync(join(__dirname, "heroV3Diagnostic.module.css"), "utf8");
const engine = readFileSync(join(__dirname, "../../../../../packages/champagne-hero/src/hero-engine/HeroMotionScore.ts"), "utf8");

describe("Hero V3 H3.3 engine enhancement", () => {
  it("compares the same Sacred V2 design under two engines", () => {
    expect(source).toContain("Accepted Sacred V2");
    expect(source).toContain("V3 engine enhancement");
    expect(source.match(/<HeroRendererV2/g)).toHaveLength(1);
    expect(source).not.toContain("HeroV3StaticCompositionSurface");
  });
  it("scores all four canonical motion layers without collective restart", () => {
    for (const id of ["waveCaustics", "glassShimmer", "particleDrift", "goldDust"]) expect(engine).toContain(`sacred.motion.${id}`);
    expect(engine).toContain("collectiveRestartAllowed: false");
    expect(engine).toContain("durationSeconds: 42");
  });
  it("fails safely for autoplay and reduced motion", () => {
    expect(controller).toContain('setState("baseline")');
    expect(controller).toContain('removeProperty("mix-blend-mode")');
    expect(controller).toContain("MutationObserver");
    expect(controller).toContain("videos.length !== CHAMPAGNE_SACRED_V2_MOTION_SCORE.layers.length");
    expect(controller).toContain('"static-fallback"');
    expect(controller).toContain("prefers-reduced-motion: reduce");
    expect(controller).toContain("Promise.all");
    expect(styles).toContain('data-h3-motion-health="static-fallback"');
  });
  it("separates engine, brand, grammar and instance for variants and tenants", () => {
    expect(engine).toContain("HeroBrandProfile");
    expect(engine).toContain("HeroGrammar");
    expect(engine).toContain("HeroInstance");
    expect(engine).toContain("logoAssetId");
    expect(engine).toContain("desiredCharacter");
    expect(engine).not.toMatch(/#[0-9a-f]{3,8}/i);
    expect(engine).toContain('blend: "soft-light"');
  });
  it("remains isolated and production-unbound", () => {
    expect(source).toContain('data-production-binding="false"');
    expect(source).toContain("Future Champagne variants and tenant heroes");
    expect(styles).toContain("@container (max-width: 640px)");
    expect(styles).toContain('[class*="concierge_root"]');
  });
});
