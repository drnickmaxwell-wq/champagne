import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  collectCssFiles,
  parseCssDefinitions,
  timeOfDayCanvasOwnerErrors,
} from "../packages/champagne-guards/scripts/guard-surface-semantics.mjs";
import {
  GENERATED_CSS_RELATIVE_PATH,
  GENERATED_TS_RELATIVE_PATH,
  PRIMITIVES_RELATIVE_PATH,
  SOURCE_RELATIVE_PATH,
  checkGenerated,
  renderMaterial,
  stableStringify,
  writeGenerated,
} from "../packages/champagne-tokens/scripts/generate-critical-paint.v1.mjs";

const fixtureRoot = path.resolve(import.meta.dirname, "..");
const source = JSON.parse(
  await readFile(path.join(fixtureRoot, SOURCE_RELATIVE_PATH), "utf8"),
);
const primitiveCss = await readFile(path.join(fixtureRoot, PRIMITIVES_RELATIVE_PATH), "utf8");
const timeOfDayCss = await readFile(
  path.join(fixtureRoot, "packages/champagne-tokens/styles/champagne/time-of-day.css"),
  "utf8",
);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

async function createTempRepository(sourceValue = source, primitiveValue = primitiveCss) {
  const root = await mkdtemp(path.join(tmpdir(), "champagne-critical-paint-"));
  for (const relativePath of [
    SOURCE_RELATIVE_PATH,
    PRIMITIVES_RELATIVE_PATH,
    GENERATED_CSS_RELATIVE_PATH,
    GENERATED_TS_RELATIVE_PATH,
  ]) {
    await mkdir(path.dirname(path.join(root, relativePath)), { recursive: true });
  }
  await writeFile(path.join(root, SOURCE_RELATIVE_PATH), `${JSON.stringify(sourceValue, null, 2)}\n`);
  await writeFile(path.join(root, PRIMITIVES_RELATIVE_PATH), primitiveValue);
  return root;
}

test("current material renders byte-stable loaded and critical outputs", () => {
  const first = renderMaterial(source, primitiveCss);
  const second = renderMaterial(clone(source), primitiveCss);
  assert.equal(first.css, second.css);
  assert.equal(first.ts, second.ts);
  assert.match(first.css, /--surface-canvas: var\(--brand-ink\)/);
  assert.match(first.ts, /export const champagneCriticalPaintCss/);
  assert.doesNotMatch(first.ts, /\bimport\s|\brequire\s*\(/);
  assert.deepEqual(first.documentStyle, {
    background: "var(--surface-canvas)",
    color: "var(--text-ink-high)",
  });
  assert.equal(Object.keys(first.documentStyle).some((property) => property.startsWith("--")), false);
});

test("semantic source changes alter both generated outputs", () => {
  const changed = clone(source);
  const canvas = changed.nodes.find((node) => node.id === "canvas");
  canvas.left.weight = 91;
  canvas.right.weight = 9;
  const before = renderMaterial(source, primitiveCss);
  const after = renderMaterial(changed, primitiveCss);
  assert.notEqual(after.css, before.css);
  assert.notEqual(after.ts, before.ts);
});

test("unknown keys fail closed", () => {
  const changed = clone(source);
  changed.unexpected = true;
  assert.throws(() => renderMaterial(changed, primitiveCss), /unknown key/);
});

test("material status and final-selection truth fail closed together", () => {
  const contradictoryStatus = clone(source);
  contradictoryStatus.status = "FINAL_PERSIAN_MIDNIGHT_SELECTED";
  assert.throws(() => renderMaterial(contradictoryStatus, primitiveCss), /MATERIAL_STATUS/);

  const selectedWithoutAuthority = clone(source);
  selectedWithoutAuthority.finalPersianMidnightSelection = true;
  assert.throws(
    () => renderMaterial(selectedWithoutAuthority, primitiveCss),
    /PERSIAN_MIDNIGHT_AUTHORITY/,
  );
});

test("CSS_DECLARATION_PARSER_BYPASS: encoded generated-token owners fail closed", () => {
  const encodedOwners = [
    ":root{--surface-canvas/**/: var(--surface-1);}",
    ".card{--surface/**/-canvas: var(--surface-1);}",
    String.raw`@media (min-width: 1px){:root{--surface-\63 anvas: var(--surface-1);}}`,
    String.raw`.card{--\73 urface-canvas: var(--surface-1);}`,
    String.raw`.card{--surface\2d canvas: var(--surface-1);}`,
  ];
  for (const css of encodedOwners) {
    assert.deepEqual(parseCssDefinitions(css, "--surface-canvas"), ["var(--surface-1)"]);
  }
  assert.deepEqual(
    parseCssDefinitions(':root{content:"--surface-canvas/**/: var(--surface-1);";}', "--surface-canvas"),
    [],
  );
});

test("TIME_OF_DAY_OWNER_EXEMPTION: only the three exact theme owners are accepted", () => {
  assert.deepEqual(timeOfDayCanvasOwnerErrors(timeOfDayCss), []);

  const surplusOwner = `${timeOfDayCss}\n:root { --surface-canvas: var(--surface-1); }\n`;
  assert.match(timeOfDayCanvasOwnerErrors(surplusOwner).join("\n"), /TIME_OF_DAY_CANVAS_OWNERS/);

  const duplicateTheme = `${timeOfDayCss}\n:root[data-theme='night'] { --surface-canvas: var(--ink-100); }\n`;
  assert.match(timeOfDayCanvasOwnerErrors(duplicateTheme).join("\n"), /TIME_OF_DAY_CANVAS_OWNERS/);
});

test("CSS_SYMLINK_UNAPPROVED: protected CSS trees fail closed on symlinks", async (context) => {
  const root = await mkdtemp(path.join(tmpdir(), "champagne-css-symlink-"));
  context.after(() => rm(root, { recursive: true, force: true }));

  const nested = path.join(root, "nested");
  await mkdir(nested, { recursive: true });
  await writeFile(path.join(root, "owner.css"), ":root { --surface-canvas: var(--surface-1); }\n");
  await symlink("../owner.css", path.join(nested, "linked.module.css"), "file");

  assert.throws(
    () => collectCssFiles(root, root),
    /\[CSS_SYMLINK_UNAPPROVED\] nested[\\/]linked\.module\.css/,
  );
});

test("missing references and cycles fail deterministically", () => {
  const missing = clone(source);
  missing.outputs.canvas = "missingNode";
  assert.throws(() => renderMaterial(missing, primitiveCss), /REF_MISSING/);

  const cyclic = clone(source);
  const canvas = cyclic.nodes.find((node) => node.id === "canvas");
  canvas.left.ref = "canvas";
  assert.throws(() => renderMaterial(cyclic, primitiveCss), /REF_CYCLE/);
});

test("transparent canvas and primitive drift fail closed", () => {
  const transparentCanvas = clone(source);
  const transparent = transparentCanvas.nodes.find((node) => node.id === "transparent");
  transparent.id = "clear";
  transparentCanvas.outputs.canvas = "clear";
  assert.throws(() => renderMaterial(transparentCanvas, primitiveCss), /CANVAS_OPACITY/);

  const driftedPrimitive = primitiveCss.replace("#40C4B4", "#40C4B5");
  assert.throws(() => renderMaterial(source, driftedPrimitive), /PRIMITIVE_DRIFT/);
});

test("write mode is deterministic and check mode detects manual drift", async (context) => {
  const root = await createTempRepository();
  context.after(() => rm(root, { recursive: true, force: true }));

  const first = await writeGenerated(root);
  await checkGenerated(root);
  const firstCss = await readFile(path.join(root, GENERATED_CSS_RELATIVE_PATH), "utf8");
  const firstTs = await readFile(path.join(root, GENERATED_TS_RELATIVE_PATH), "utf8");

  const second = await writeGenerated(root);
  assert.equal(second.css, first.css);
  assert.equal(second.ts, first.ts);
  assert.equal(await readFile(path.join(root, GENERATED_CSS_RELATIVE_PATH), "utf8"), firstCss);
  assert.equal(await readFile(path.join(root, GENERATED_TS_RELATIVE_PATH), "utf8"), firstTs);

  await writeFile(path.join(root, GENERATED_CSS_RELATIVE_PATH), `${firstCss}/* manual drift */\n`);
  await assert.rejects(() => checkGenerated(root), /GENERATED_DRIFT/);
});

test("stable source serialization is independent of object key order", () => {
  assert.equal(stableStringify({ b: 2, a: 1 }), stableStringify({ a: 1, b: 2 }));
});
