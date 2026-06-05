import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const currentDir = dirname(fileURLToPath(import.meta.url));
const shellSource = readFileSync(join(currentDir, "ConciergeShell.tsx"), "utf8");

describe("ConciergeShell boundary copy", () => {
  it("keeps visible Captain public-boundary wording near the concierge entry surface", () => {
    expect(shellSource).toContain("Before you chat with Captain");
    expect(shellSource).toContain("Captain is our public concierge, not a clinician.");
    expect(shellSource).toContain("Captain cannot diagnose, triage, or provide treatment-specific clinical advice.");
    expect(shellSource).toContain("Please do not enter personal health information or sensitive details.");
    expect(shellSource).toContain("For urgent dental problems, contact the practice directly or follow emergency guidance.");
    expect(shellSource).toContain("Captain can help with general navigation, service information, and safe signposting.");
    expect(shellSource).toContain(
      "Contact or booking handoffs send a request to the team; they do not confirm an appointment.",
    );
  });

  it("does not invite treatment-specific clinical advice in the input placeholder", () => {
    expect(shellSource).toContain("Ask general navigation or service-information questions");
    expect(shellSource).not.toContain("Ask about treatment options, appointments, or what to do next");
  });
});
