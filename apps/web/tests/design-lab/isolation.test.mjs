import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const adapter = readFileSync(new URL("../../app/champagne/design-lab/_components/HeroV2LabAdapter.tsx", import.meta.url), "utf8");
const layout = readFileSync(new URL("../../app/champagne/design-lab/layout.tsx", import.meta.url), "utf8");
const composer = readFileSync(new URL("../../app/champagne/design-lab/_components/Room11Composer.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../../app/champagne/design-lab/styles.css", import.meta.url), "utf8");

test("Hero is adapter-only and noindex is explicit", () => {
  assert.match(adapter, /import \{ HeroMount \}/);
  assert.match(adapter, /<HeroMount/);
  assert.doesNotMatch(adapter, /HeroRendererV2/);
  assert.match(layout, /index: false, follow: false/);
});

test("Room 11 supports deterministic flow, ordering, removal, gates and export", () => {
  for (const marker of ["setFlowId", "move(id", "Remove", "Capability truth", "DL-R1-COMPOSITION-V1", "productionBinding: false"]) assert.match(composer, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("responsive, reduced-motion, focus and forced-colour contracts exist", () => {
  assert.match(css, /data-frame="mobile"/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /forced-colors: active/);
  assert.match(css, /:focus-visible/);
});
