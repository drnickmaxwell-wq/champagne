import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const currentDir = dirname(fileURLToPath(import.meta.url));
const modalSource = readFileSync(join(currentDir, "HandoffModal.tsx"), "utf8");
const routerSource = readFileSync(join(currentDir, "postbackRouter.ts"), "utf8");

describe("HandoffModal fallback copy", () => {
  it("keeps visible booking/contact handoff safety copy", () => {
    expect(modalSource).toContain(
      "Captain can guide you to contact or booking options, but Captain does not confirm appointments.",
    );
    expect(modalSource).toContain(
      "This form sends a request/handoff to the practice team only, unless a separate governed confirmed-booking flow tells you otherwise.",
    );
    expect(modalSource).toContain("Please do not include personal health information or sensitive details.");
    expect(modalSource).toContain("For urgent dental issues, contact the practice directly.");
    expect(modalSource).toContain("It is not a confirmed appointment.");
  });

  it("points fallback navigation to the existing contact surface only", () => {
    expect(routerSource).toContain('export const SAFE_HANDOFF_FALLBACK_HREF = "/contact";');
    expect(modalSource).toContain("Contact the practice directly");
    expect(modalSource).not.toContain("dentally");
    expect(modalSource).not.toContain("pms");
  });
});
