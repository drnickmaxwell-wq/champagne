import { describe, it, expect } from "vitest";
import { getSectionFxDefaults, getSectionPrmDefaults } from "../helpers";

describe("section defaults manifests", () => {
  it("exposes fx defaults per section type", () => {
    const fx = getSectionFxDefaults();
    expect(fx.id).toBe("section-fx.defaults");
    expect(fx.fxDefaults?.["overview-rich"]?.parallax).toBe(0.25);
    expect(fx.fxDefaults?.["closing-cta"]?.shimmer).toBe(true);
  });

  it("exposes prm defaults per section type", () => {
    const prm = getSectionPrmDefaults();
    expect(prm.id).toBe("section-prm.defaults");
    expect(prm.prmRules?.faq?.softFadeOnly).toBe(true);
    expect(prm.prmRules?.["media-block"]?.disableSpotlight).toBe(true);
  });
});
