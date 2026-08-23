import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const atelier = readFileSync(new URL("../../app/champagne/design-lab/_components/Atelier.tsx", import.meta.url), "utf8");
const preview = readFileSync(new URL("../../app/champagne/design-lab/_components/AtelierPreviewDocument.tsx", import.meta.url), "utf8");
const previewPage = readFileSync(new URL("../../app/champagne/design-lab/preview/page.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../../app/champagne/design-lab/atelier-r4.6.css", import.meta.url), "utf8");
const qa = readFileSync(new URL("./r4-6-responsive-qa.mjs", import.meta.url), "utf8");

test("R4.6 uses a same-origin inner browsing context with outer-only scaling", () => {
  assert.match(atelier, /<iframe/);
  assert.match(atelier, /src="\/champagne\/design-lab\/preview"/);
  assert.match(atelier, /CHAMPAGNE_ATELIER_PREVIEW_STATE/);
  assert.match(preview, /window\.innerWidth|window\.location\.origin/);
  assert.match(previewPage, /HeroV2LabAdapter/);
  assert.match(atelier, /transform: `scale\(\$\{displayScale \/ 100\}\)`/);
  assert.doesNotMatch(atelier, /<div className="dl45-preview-scroll">\{canvas/);
});

test("mobile rhythm and Clean Preview media fallback are explicit", () => {
  assert.match(css, /@media\(max-width:50rem\)/);
  assert.match(css, /grid-template-columns:minmax\(0,1fr\)/);
  assert.match(css, /data-brand-rhythm=editorial/);
  assert.match(css, /data-preview-mode=clean.*dl44-media-intent/);
});

test("runtime QA proves exact widths, overflow, clipping, order and complete scrolling", () => {
  for (const proof of ["innerWidth", "scrollWidth", "clippedHeadings", "pathwaysColumns", "stepsColumns", "scrollProof", "home.proof", "beforeAfterSectionHeights"]) assert.match(qa, new RegExp(proof.replace(".", "\\.")));
  for (const width of [1440, 768, 1024, 390]) assert.match(qa, new RegExp(`width: ${width}`));
});
