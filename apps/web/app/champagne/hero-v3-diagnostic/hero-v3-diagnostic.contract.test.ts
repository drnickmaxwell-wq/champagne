import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(join(__dirname, "HeroV3DiagnosticLab.tsx"), "utf8");

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
});
