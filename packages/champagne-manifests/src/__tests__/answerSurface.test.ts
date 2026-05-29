import { describe, expect, it } from "vitest";
import {
  TREATMENT_ANSWER_SURFACE_REQUIRED_SECTION_IDS,
  validateTreatmentAnswerSurface,
  type TreatmentAnswerSurface,
} from "../answerSurface";

const completeSurface = (): TreatmentAnswerSurface => ({
  version: "TREATMENT_ANSWER_SURFACE_V1",
  status: "example_seed",
  exampleSeed: true,
  primaryGeography: "Shoreham-by-Sea",
  sections: TREATMENT_ANSWER_SURFACE_REQUIRED_SECTION_IDS.map((id) => ({
    id,
    heading: id,
    body: `Answer content for ${id}.`,
  })),
});

describe("treatment answer-surface model", () => {
  it("validates all required sections when present", () => {
    const result = validateTreatmentAnswerSurface(completeSurface());

    expect(result.valid).toBe(true);
    expect(result.frameworkPresent).toBe(true);
    expect(result.missingSectionIds).toEqual([]);
    expect(result.presentSectionIds).toHaveLength(TREATMENT_ANSWER_SURFACE_REQUIRED_SECTION_IDS.length);
  });

  it("detects missing sections", () => {
    const surface = completeSurface();
    surface.sections = surface.sections.filter((section) => section.id !== "aftercare");

    const result = validateTreatmentAnswerSurface(surface);

    expect(result.valid).toBe(false);
    expect(result.missingSectionIds).toContain("aftercare");
    expect(result.errors.join(" ")).toContain("aftercare");
  });

  it("reports secondary geography stuffing without making Shoreham secondary", () => {
    const surface = completeSurface();
    surface.sections[0] = {
      id: "direct_answer",
      heading: "Direct answer",
      body: "Brighton Brighton Brighton Worthing Lancing Southwick should be reported as stuffing while Shoreham-by-Sea remains primary.",
    };

    const result = validateTreatmentAnswerSurface(surface);

    expect(result.secondaryGeographyStuffing).toBe(true);
    expect(result.secondaryGeographyMentions.Brighton).toBe(3);
    expect(result.warnings.join(" ")).toContain("Secondary geography");
  });
});
