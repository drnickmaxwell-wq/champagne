import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const currentDir = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(currentDir, "../..");
const shellSource = readFileSync(join(currentDir, "ConciergeShell.tsx"), "utf8");
const layerSource = readFileSync(join(currentDir, "ConciergeLayer.tsx"), "utf8");
const modalSource = readFileSync(join(currentDir, "_handoff/HandoffModal.tsx"), "utf8");
const routerSource = readFileSync(join(currentDir, "_handoff/postbackRouter.ts"), "utf8");
const layoutSource = readFileSync(join(appDir, "layout.tsx"), "utf8");
const homePageSource = readFileSync(join(appDir, "page.tsx"), "utf8");
const contactPageSource = readFileSync(join(appDir, "contact/page.tsx"), "utf8");

const publicRuntimeSurface = [shellSource, layerSource, modalSource, routerSource, layoutSource, homePageSource, contactPageSource].join("\n");

describe("public concierge route staging runtime proof", () => {
  it("mounts Captain concierge from the public website runtime surface", () => {
    expect(layoutSource).toContain('import { ConciergeLayer } from "./components/concierge/ConciergeLayer";');
    expect(layoutSource).toContain("<ConciergeLayer />");
    expect(homePageSource).toContain('<ChampagnePageBuilder slug={PAGE_PATH} />');
    expect(contactPageSource).toContain('<ChampagnePageBuilder slug={PAGE_PATH} />');
    expect(shellSource).toContain('aria-label={isOpen ? "Close Practice Concierge" : "Open Practice Concierge"}');
    expect(shellSource).toContain('aria-label="Practice Concierge panel"');
  });

  it("keeps public boundary and booking handoff fallback copy visible", () => {
    expect(shellSource).toContain("Before you chat with Captain");
    expect(shellSource).toContain("Captain is our public concierge, not a clinician.");
    expect(shellSource).toContain("Captain cannot diagnose, triage, or provide treatment-specific clinical advice.");
    expect(shellSource).toContain("Please do not enter personal health information or sensitive details.");
    expect(shellSource).toContain(
      "Contact or booking handoffs send a request to the team; they do not confirm an appointment.",
    );
    expect(modalSource).toContain(
      "Captain can guide you to contact or booking options, but Captain does not confirm appointments.",
    );
    expect(modalSource).toContain("It is not a confirmed appointment.");
    expect(modalSource).toContain("Please do not include personal health information or sensitive details.");
  });

  it("keeps handoff navigation constrained to safe public contact and governed request surfaces", () => {
    expect(routerSource).toContain('export const SAFE_HANDOFF_FALLBACK_HREF = "/contact";');
    expect(routerSource).toContain('BOOKING: "/api/handoff/booking"');
    expect(routerSource).toContain('EMERGENCY_CALLBACK: "/api/handoff/emergency-callback"');
    expect(routerSource).toContain('NEW_PATIENT: "/api/handoff/new-patient"');
    expect(modalSource).toContain("Contact the practice directly");
  });

  it("does not expose forbidden route/runtime surfaces in the public concierge mount", () => {
    expect(publicRuntimeSurface).not.toMatch(/your\s+(booking|appointment)\s+(is|has been)\s+confirmed/i);
    expect(publicRuntimeSurface).not.toMatch(/we\s+have\s+confirmed\s+your\s+(booking|appointment)/i);
    expect(publicRuntimeSurface).not.toMatch(/enter\s+(your\s+)?(medical|health)\s+(history|details|information)/i);
    expect(publicRuntimeSurface).not.toMatch(/collect\s+(PHI|personal health information)/i);
    expect(publicRuntimeSurface).not.toMatch(/codex/i);
    expect(publicRuntimeSurface).not.toMatch(/agent\s+(execution|runtime|bridge)/i);
    expect(publicRuntimeSurface).not.toMatch(/dev\s+(execution|bridge|console)/i);
    expect(publicRuntimeSurface).not.toMatch(/dentally|pms/i);
    expect(publicRuntimeSurface).not.toMatch(/receptionist|recall|treatment coordinator/i);
  });
});
