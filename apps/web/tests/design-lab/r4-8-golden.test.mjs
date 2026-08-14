import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const preview = await readFile(new URL("../../app/champagne/design-lab/_components/AtelierPreviewDocument.tsx", import.meta.url), "utf8");
const atelier = await readFile(new URL("../../app/champagne/design-lab/_components/Atelier.tsx", import.meta.url), "utf8");
const css = await readFile(new URL("../../app/champagne/design-lab/atelier-r4.8.css", import.meta.url), "utf8");

test("R4.8 remains synthetic, permission-neutral and production-unbound", () => {
  assert.match(preview, /PUBLIC_NON_PHI · Zone A/);
  assert.match(preview, /No diagnosis · no suitability · no personalised recommendation/);
  assert.match(preview, /NAVIGATION_ONLY · no live booking state/);
  assert.match(preview, /Digital guide · synthetic simulation · not a person/);
  assert.doesNotMatch(preview, /fetch\(|WebSocket|EventSource/);
  assert.match(atelier, /productionBinding: false/);
});

test("Golden journey uses trusted canonical destinations and frozen synthetic semantics", () => {
  assert.match(preview, /href="\/treatments\/implants"/);
  assert.match(preview, /href="\/contact"/);
  assert.match(preview, /Synthetic 3D education handoff/);
  assert.match(preview, /OPEN_MODEL · HIGHLIGHT_COMPONENT · SHOW_LABELS · HIDE_LABELS · OPEN_TEXT_ALTERNATIVE/);
  assert.doesNotMatch(preview, /\/dental-implants|\/composite-bonding/);
});

test("Concierge supports keyboard closure, focus containment and restoration", () => {
  assert.match(preview, /event\.key === "Escape"/);
  assert.match(preview, /event\.key !== "Tab"/);
  assert.match(preview, /openerRef\.current\?\.focus\(\)/);
  assert.match(preview, /role="dialog" aria-modal="true"/);
  assert.match(css, /prefers-reduced-motion:reduce/);
});

test("R4.7 Founder art-direction decisions and Hero conflict remain governed", () => {
  for (const id of ["home.founder-authority", "home.team-continuity", "home.technology-purpose", "home.heritage-story"]) assert.match(atelier, new RegExp(id.replaceAll(".", "\\.")));
  assert.match(atelier, /heroAuthorityConflict: "UNRESOLVED_PRESERVED"/);
  assert.match(atelier, /contentAuthority: "UNCHANGED"/);
});

test("mobile Concierge is independently composed and bounded", () => {
  assert.match(css, /height:min\(82dvh,44rem\)/);
  assert.match(css, /\.dl48-answer,.dl48-three-d\{grid-template-columns:1fr\}/);
  assert.match(css, /width:calc\(100vw - 1\.5rem\)/);
});
