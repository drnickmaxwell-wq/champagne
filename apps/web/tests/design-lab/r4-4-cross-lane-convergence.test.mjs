import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const atelier = readFileSync(new URL("../../app/champagne/design-lab/_components/Atelier.tsx", import.meta.url), "utf8");
const rooms = readFileSync(new URL("../../app/champagne/design-lab/_components/ExperienceRooms.tsx", import.meta.url), "utf8");
const content = readFileSync(new URL("../../app/champagne/design-lab/data/home-content-bundle.ts", import.meta.url), "utf8");
const media = readFileSync(new URL("../../app/champagne/design-lab/data/media-slot-adapter.ts", import.meta.url), "utf8");
const concierge = readFileSync(new URL("../../app/champagne/design-lab/data/concierge-contract.ts", import.meta.url), "utf8");
const threeD = readFileSync(new URL("../../app/champagne/design-lab/data/implant-3d-contract.ts", import.meta.url), "utf8");
const css = readFileSync(new URL("../../app/champagne/design-lab/atelier-r4.4.css", import.meta.url), "utf8");

test("Homepage uses the real fact-blocked bundle and omits proof completely", () => {
  for (const marker of ["smh:route:/:v1", "1.0.0-draft.1", "FACT_BLOCKED", "CONTENT_BUNDLE_V1_FACT_BLOCKED", "visibleSectionCount: 12", "home.proof"]) assert.match(content, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(atelier, /Patient evidence is fully omitted/);
  assert.match(atelier, /Real Content Bundle connected/);
  assert.doesNotMatch(content, /Exceptional care\. Enduring confidence/);
});

test("canonical routes and media generations resolve without duplicate concepts", () => {
  assert.match(media, /"\/dental-implants": "\/treatments\/implants"/);
  assert.match(media, /"\/composite-bonding": "\/treatments\/composite-bonding"/);
  assert.match(media, /MEDIA\.HOME\.FOUNDER\.PORTRAIT/);
  assert.match(media, /home\.founder-authority\.portrait/);
  assert.equal((media.match(/"home\.founder-authority": slot/g) ?? []).length, 1);
});

test("Founder can compare and intentionally mix four Concierge territories", () => {
  for (const marker of ["Architectural Light", "Editorial Host", "Luminous Digital", "Quiet Companion", "Compare two", "Intentional component mix", "shortlist", "reject", "saved"]) assert.match(`${rooms}\n${concierge}`, new RegExp(marker));
  for (const component of ["CX.LAUNCHER.ARCH.01", "CX.DRAWER.SOURCE.01", "CX.VOICE.SPECTRAL.01", "CX.MODEL.IMPLANT.01", "CX.HANDOFF.HUMAN.01", "CX.MOBILE.FULLSCREEN.01"]) assert.match(concierge, new RegExp(component));
  assert.match(rooms, /champagne\.atelier\.r4\.4\.concierge-room/);
  assert.match(rooms, /window\.localStorage/);
});

test("synthetic implant exhibit uses only the frozen action and state contracts", () => {
  for (const marker of ["CD3D-IMPLANT-EDU-V1", "FROZEN_V1_PRE_EXECUTION", "SYNTHETIC_FIXTURE", "FIXTURE_CONCEPT", "ABUTMENT_CONCEPT", "RESTORED_CONCEPT", "CAM_MOBILE_OVERVIEW", "Read instead"]) assert.match(`${threeD}\n${rooms}`, new RegExp(marker));
  for (const action of ["OPEN_MODEL", "ROTATE_TO_FEATURE", "HIGHLIGHT_COMPONENT", "ISOLATE_LAYER", "PLAY_STAGE", "SET_STAGE", "COMPARE_STATE", "SHOW_LABELS", "HIDE_LABELS", "RESET_MODEL", "OPEN_MODEL_SOURCE", "OPEN_TEXT_ALTERNATIVE"]) assert.match(concierge, new RegExp(action));
});

test("Experience Preview rehearses the canonical non-clinical journey", () => {
  for (const marker of ["Homepage", "Replace a missing tooth", "/treatments/implants", "Implant exhibit", "Human contact", "No live engine response or booking state is claimed"]) assert.match(rooms, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("R4.4 remains responsive and accessible", () => {
  assert.match(css, /max-width:50rem/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /forced-colors:active/);
  assert.match(rooms, /aria-modal="true"/);
  assert.match(rooms, /aria-current/);
});
