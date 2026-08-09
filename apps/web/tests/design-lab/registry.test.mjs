import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";

const path = new URL("../../app/champagne/design-lab/data/v27-registry.json", import.meta.url);
const bytes = readFileSync(path);
const registry = JSON.parse(bytes);

test("V27 registry is the canonical 331-item authority", () => {
  assert.equal(registry.totals.items, 331);
  assert.deepEqual(registry.totals.byFamily, {
    ctas: 106, cardsAndDecisionPanels: 53, sections: 92, bands: 19,
    headers: 11, footers: 8, heritageArchitecture: 8, mediaLayouts: 3,
    captainStudies: 2, wholePageCompositions: 7, pageSequences: 6, surfacesMaterials: 16,
  });
  assert.equal(new Set(registry.items.map(({ id }) => id)).size, 331);
  assert.equal(registry.items.find(({ id }) => id === "CVA-HEADER-B035-E01").preview.width, 721);
  assert.equal(registry.items.find(({ id }) => id === "CVA-HEADER-B035-E01").preview.height, 75);
  assert.equal(createHash("sha256").update(bytes).digest("hex"), "2db810212a349c727763eb22140036db4ee105c8d2133d1f6a603b5e8109bcf3");
});
