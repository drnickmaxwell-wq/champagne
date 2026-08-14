import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(join(__dirname, "HeroV3DiagnosticLab.tsx"), "utf8");
const retired = readFileSync(join(__dirname, "HeroV3StaticCompositionSurface.tsx"), "utf8");
const styles = readFileSync(join(__dirname, "heroV3Diagnostic.module.css"), "utf8");

describe("Hero V3 H3.2R founder-correction contract", () => {
  it("makes accepted Sacred V2 the only active visual baseline", () => {
    expect(source).toContain("Accepted Sacred V2");
    expect(source).toContain('data-h3-study="v2-reference"');
    expect(source).toContain("<HeroRendererV2");
    expect(source).toContain("prm");
    expect(source).not.toContain("HeroV3StaticCompositionSurface");
    expect(source).not.toContain("Champagne V3 candidate");
  });

  it("records V3 as engine improvement rather than Champagne hero redesign", () => {
    expect(source).toContain("Hero V3 improves this engine; it does not redesign this hero");
    expect(source).toContain("Rendering fidelity, luminous depth, seamless motion");
    expect(source).toContain("preserving Champagne’s accepted composition and identity");
  });

  it("retains desktop and mobile baseline review with protected zones", () => {
    expect(source).toContain('{ id: "desktop", label: "Desktop · 1440" }');
    expect(source).toContain('{ id: "mobile", label: "Mobile · 390" }');
    expect(source).toContain("Protected copy");
    expect(source).toContain("Protected CTA");
    expect(styles).toContain('.stage[data-h3-viewport="mobile"]');
  });

  it("keeps the retired artwork as inactive historical evidence only", () => {
    expect(retired).toContain('disposition: "OPTIONAL_VISUAL_STUDY_NOT_HERO_V3"');
    expect(retired).toContain("active: false");
    expect(retired).toContain("productionBinding: false");
    expect(retired).toContain("optional-visual-studies/champagne-sculpted-current-concept.webp");
    expect(retired).not.toContain("<svg");
  });

  it("does not introduce motion, production binding or runtime internals", () => {
    expect(source).toContain('data-production-binding="false"');
    expect(source).not.toContain("requestAnimationFrame");
    expect(source).not.toContain("HeroAssetRegistry");
    expect(source).not.toContain("HeroManifestAdapter");
    expect(styles).not.toContain("v3-champagne-sculpted-current");
  });
});
