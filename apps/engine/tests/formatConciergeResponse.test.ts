import { describe, expect, it } from "vitest";
import { formatConciergeResponse } from "../src/concierge/formatConciergeResponse";

describe("formatConciergeResponse", () => {
  it("formats cost-related content into the required structure", () => {
    const formatted = formatConciergeResponse(
      "Cost depends on treatment scope. We usually provide a range first and finalize after exam.",
      { prompt: "How much does this cost?" },
    );

    const sections = formatted.split("\n\n");
    expect(sections.length).toBeGreaterThanOrEqual(4);
    expect(sections[0]).toMatch(/^Cost depends on treatment scope\./);
    expect(formatted).toContain("A key variable is your clinical history");
    expect(sections.at(-1)).toBe(
      "Next step: share your primary goal and timing, and I will map the most appropriate path.",
    );
  });

  it("formats process-related answers into 2-4 explanation paragraphs", () => {
    const formatted = formatConciergeResponse(
      "The process starts with assessment. Then we confirm candidacy. Treatment follows with checkpoints. Follow-up validates healing.",
      { prompt: "Can you explain the treatment process?" },
    );

    const sections = formatted.split("\n\n");
    const explanationSections = sections.slice(1, -1);

    expect(explanationSections.length).toBeGreaterThanOrEqual(2);
    expect(explanationSections.length).toBeLessThanOrEqual(4);
    expect(sections.at(-1)).toMatch(/^Next step:/);
  });

  it("rewrites prohibited language in fear/anxiety answers", () => {
    const formatted = formatConciergeResponse(
      "Great question! Don’t worry 😊 Absolutely! Anxiety is common and we can pace treatment.",
      { prompt: "I am nervous about pain" },
    );

    expect(formatted).not.toMatch(/Great question|Don[’']t worry|Absolutely|😊|!/);
    expect(formatted).toContain("Anxiety is common and we can pace treatment.");
    expect(formatted).toContain("Next step:");
  });
});
