#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkGenerated } from "../../../packages/champagne-tokens/scripts/generate-critical-paint.v1.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const absolute = (relativePath) => path.join(repoRoot, relativePath);
const paths = {
  rootPackage: "package.json",
  primitives: "packages/champagne-tokens/styles/tokens/smh-champagne-tokens.css",
  tokens: "packages/champagne-tokens/styles/champagne/tokens.css",
  generatedCss: "packages/champagne-tokens/styles/champagne/canvas-material.generated.css",
  generatedTs: "packages/champagne-tokens/src/critical-paint.generated.ts",
  material: "packages/champagne-tokens/src/canvas-material.v1.json",
  tokenPackage: "packages/champagne-tokens/package.json",
  theme: "packages/champagne-tokens/styles/champagne/theme.css",
  timeOfDay: "packages/champagne-tokens/styles/champagne/time-of-day.css",
  exports: "packages/champagne-tokens/src/index.ts",
  layout: "apps/web/app/layout.tsx",
  footer: "apps/web/app/components/layout/Footer.tsx",
  guardPackage: "packages/champagne-guards/package.json",
  surfaceTest: "tests/champagne-surface-semantics.spec.ts",
  firstPaintTest: "tests/champagne-critical-first-paint.spec.ts",
  generatorTest: "tests/champagne-critical-first-paint-generator.test.mjs",
  receipt: "docs/audits/CHAMPAGNE_CRITICAL_FIRST_PAINT_CLEAN_REPLACEMENT_V1.md",
  workflow: ".github/workflows/verify.yml",
};

const errors = [];
function read(relativePath) {
  const file = absolute(relativePath);
  if (!existsSync(file)) {
    errors.push(`missing required path: ${relativePath}`);
    return "";
  }
  return readFileSync(file, "utf8");
}
function json(relativePath) {
  try {
    return JSON.parse(read(relativePath));
  } catch (error) {
    errors.push(`unable to parse ${relativePath}: ${error.message}`);
    return null;
  }
}
function decodeCssIdentifier(value) {
  let result = "";
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (character !== "\\") {
      result += character;
      continue;
    }
    const next = value[index + 1];
    if (next === undefined) {
      result += "\uFFFD";
      continue;
    }
    if (next === "\n" || next === "\f") {
      index += 1;
      continue;
    }
    if (next === "\r") {
      index += value[index + 2] === "\n" ? 2 : 1;
      continue;
    }
    if (/[0-9A-Fa-f]/.test(next)) {
      let digits = "";
      let cursor = index + 1;
      while (
        cursor < value.length &&
        digits.length < 6 &&
        /[0-9A-Fa-f]/.test(value[cursor])
      ) {
        digits += value[cursor];
        cursor += 1;
      }
      let codePoint = Number.parseInt(digits, 16);
      if (
        codePoint === 0 ||
        codePoint > 0x10ffff ||
        (codePoint >= 0xd800 && codePoint <= 0xdfff)
      ) {
        codePoint = 0xfffd;
      }
      result += String.fromCodePoint(codePoint);
      if (/[\t\n\f\r ]/.test(value[cursor] ?? "")) {
        if (value[cursor] === "\r" && value[cursor + 1] === "\n") cursor += 1;
        cursor += 1;
      }
      index = cursor - 1;
      continue;
    }
    result += next;
    index += 1;
  }
  return result.trim();
}
function parseCssDeclarations(source) {
  const input = source.includes("{") ? source : `:root{${source}}`;
  const declarations = [];
  let blockDepth = 0;
  let mode = "name";
  let name = "";
  let value = "";
  let quote = null;
  let escaped = false;
  let parenthesisDepth = 0;
  let bracketDepth = 0;
  let valueBraceDepth = 0;

  const resetDeclaration = () => {
    mode = "name";
    name = "";
    value = "";
    parenthesisDepth = 0;
    bracketDepth = 0;
    valueBraceDepth = 0;
  };
  const commitDeclaration = () => {
    const property = decodeCssIdentifier(name);
    if (property.startsWith("--")) declarations.push({ property, value: value.trim() });
    resetDeclaration();
  };

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    const next = input[index + 1];
    const target = mode === "name" ? "name" : "value";

    if (quote) {
      if (target === "name") name += character;
      else value += character;
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = null;
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      if (target === "name") name += character;
      else value += character;
      continue;
    }
    if (character === "/" && next === "*") {
      const close = input.indexOf("*/", index + 2);
      if (close < 0) throw new Error("unterminated CSS comment");
      index = close + 1;
      continue;
    }

    if (blockDepth === 0) {
      if (character === "{") {
        blockDepth = 1;
        resetDeclaration();
      }
      continue;
    }

    if (mode === "name") {
      if (character === "(") parenthesisDepth += 1;
      else if (character === ")" && parenthesisDepth > 0) parenthesisDepth -= 1;
      else if (character === "[") bracketDepth += 1;
      else if (character === "]" && bracketDepth > 0) bracketDepth -= 1;

      if (character === "{" && parenthesisDepth === 0 && bracketDepth === 0) {
        blockDepth += 1;
        resetDeclaration();
      } else if (character === "}" && parenthesisDepth === 0 && bracketDepth === 0) {
        blockDepth -= 1;
        resetDeclaration();
      } else if (character === ";" && parenthesisDepth === 0 && bracketDepth === 0) {
        resetDeclaration();
      } else if (character === ":" && parenthesisDepth === 0 && bracketDepth === 0) {
        mode = "value";
        parenthesisDepth = 0;
        bracketDepth = 0;
      } else {
        name += character;
      }
      continue;
    }

    if (character === "(") parenthesisDepth += 1;
    else if (character === ")" && parenthesisDepth > 0) parenthesisDepth -= 1;
    else if (character === "[") bracketDepth += 1;
    else if (character === "]" && bracketDepth > 0) bracketDepth -= 1;
    else if (character === "{") {
      const property = decodeCssIdentifier(name);
      if (!property.startsWith("--") && parenthesisDepth === 0 && bracketDepth === 0) {
        blockDepth += 1;
        resetDeclaration();
        continue;
      }
      valueBraceDepth += 1;
    } else if (character === "}" && valueBraceDepth > 0) valueBraceDepth -= 1;

    if (
      character === ";" &&
      parenthesisDepth === 0 &&
      bracketDepth === 0 &&
      valueBraceDepth === 0
    ) {
      commitDeclaration();
    } else if (
      character === "}" &&
      parenthesisDepth === 0 &&
      bracketDepth === 0 &&
      valueBraceDepth === 0
    ) {
      commitDeclaration();
      blockDepth -= 1;
    } else {
      value += character;
    }
  }
  if (quote) throw new Error("unterminated CSS string");
  if (blockDepth !== 0) throw new Error("unbalanced CSS block");
  return declarations;
}
export function parseCssDefinitions(source, token) {
  return parseCssDeclarations(source)
    .filter((declaration) => declaration.property === token)
    .map((declaration) => declaration.value);
}
function definitions(source, token, label = "CSS input") {
  try {
    return parseCssDefinitions(source, token);
  } catch (error) {
    errors.push(
      `[CSS_DECLARATION_PARSE] ${label}: ${error instanceof Error ? error.message : String(error)}`,
    );
    return [];
  }
}
function blockFor(source, selector) {
  const start = source.indexOf(selector);
  if (start < 0) return "";
  const open = source.indexOf("{", start);
  const close = source.indexOf("}", open + 1);
  return open >= 0 && close >= 0 ? source.slice(open + 1, close) : "";
}
function count(source, needle) {
  return source.split(needle).length - 1;
}
const approvedTimeOfDayCanvasOwners = [
  ["dawn", "color-mix(in srgb, var(--brand-teal) 15%, white)"],
  ["dusk", "var(--ink-100)"],
  ["night", "var(--ink-100)"],
];
export function timeOfDayCanvasOwnerErrors(source) {
  const issues = [];
  try {
    const expectedValues = approvedTimeOfDayCanvasOwners.map(([, value]) => value);
    const allValues = parseCssDefinitions(source, "--surface-canvas");
    if (
      allValues.length !== expectedValues.length ||
      allValues.some((value, index) => value !== expectedValues[index])
    ) {
      issues.push(
        `[TIME_OF_DAY_CANVAS_OWNERS] expected exactly ${expectedValues.join(", ")}; found ${allValues.join(", ") || "none"}`,
      );
    }
    for (const [name, expected] of approvedTimeOfDayCanvasOwners) {
      const block = blockFor(source, `:root[data-theme='${name}']`);
      const values = parseCssDefinitions(block, "--surface-canvas");
      if (values.length !== 1 || values[0] !== expected) {
        issues.push(`[TIME_OF_DAY_CANVAS_OWNERS] ${name} must preserve its one approved canvas owner`);
      }
      if (parseCssDefinitions(block, "--bg-ink").length !== 0) {
        issues.push(`[TIME_OF_DAY_CANVAS_OWNERS] ${name} must not override --bg-ink`);
      }
    }
  } catch (error) {
    issues.push(
      `[TIME_OF_DAY_CANVAS_OWNERS] unable to parse: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  return issues;
}
export function collectCssFiles(root, reportRoot = repoRoot) {
  const ignored = new Set(["node_modules", ".next", "dist", "build", "coverage", ".git"]);
  const files = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const file = path.join(root, entry.name);
    if (entry.isSymbolicLink()) {
      throw new Error(`[CSS_SYMLINK_UNAPPROVED] ${path.relative(reportRoot, file)}`);
    }
    if (ignored.has(entry.name)) continue;
    if (entry.isDirectory()) files.push(...collectCssFiles(file, reportRoot));
    else if (entry.isFile() && entry.name.endsWith(".css")) files.push(file);
  }
  return files;
}
function collectCss(root) {
  try {
    return collectCssFiles(root, repoRoot);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
    return [];
  }
}

const rootPackage = json(paths.rootPackage);
const guardPackage = json(paths.guardPackage);
const tokenPackage = json(paths.tokenPackage);
const material = json(paths.material);
const primitives = read(paths.primitives);
const tokens = read(paths.tokens);
const generatedCss = read(paths.generatedCss);
const generatedTs = read(paths.generatedTs);
const theme = read(paths.theme);
const timeOfDay = read(paths.timeOfDay);
const exportsSource = read(paths.exports);
const layout = read(paths.layout);
const footer = read(paths.footer);
const surfaceTest = read(paths.surfaceTest);
const firstPaintTest = read(paths.firstPaintTest);
const generatorTest = read(paths.generatorTest);
const receipt = read(paths.receipt);
const workflow = read(paths.workflow);

let rendered;
try {
  rendered = await checkGenerated(repoRoot);
} catch (error) {
  errors.push(error instanceof Error ? error.message : String(error));
}

const cssImportKeyword = ["@", "import"].join("");
const importPrefix =
  `${cssImportKeyword} '../tokens/smh-champagne-tokens.css';\n` +
  `${cssImportKeyword} './canvas-material.generated.css';\n`;
if (!tokens.startsWith(importPrefix)) {
  errors.push(`${paths.tokens} must import primitives then generated material first`);
}

const generatedOwners = new Map([
  ["--smh-ink-navy", rendered?.loadedCanvas],
  ["--brand-ink", "var(--smh-ink-navy)"],
  ["--surface-canvas", "var(--brand-ink)"],
  ["--bg-ink", "var(--surface-canvas)"],
  ["--text-ink-high", rendered?.loadedForeground],
]);
for (const [token, expected] of generatedOwners) {
  const values = definitions(generatedCss, token, paths.generatedCss);
  if (!expected || values.length !== 1 || values[0] !== expected) {
    errors.push(`${paths.generatedCss} must define ${token} exactly once from the generator`);
  }
  if (definitions(tokens, token, paths.tokens).length !== 0) {
    errors.push(`${paths.tokens} must not duplicate generated owner ${token}`);
  }
}
for (const issue of timeOfDayCanvasOwnerErrors(timeOfDay)) errors.push(issue);

const cssFiles = [
  ...collectCss(absolute("packages/champagne-tokens/styles")),
  ...collectCss(absolute("apps/web/app")),
];
for (const token of generatedOwners.keys()) {
  const invalidOwners = [];
  for (const file of cssFiles) {
    if (file === absolute(paths.generatedCss)) continue;
    if (token === "--surface-canvas" && file === absolute(paths.timeOfDay)) continue;
    const relativePath = path.relative(repoRoot, file);
    if (definitions(readFileSync(file, "utf8"), token, relativePath).length > 0) {
      invalidOwners.push(relativePath);
    }
  }
  if (invalidOwners.length > 0) {
    errors.push(`[CANVAS_OWNER_UNAPPROVED] ${token}: ${invalidOwners.join(", ")}`);
  }
}

const requiredRoles = new Map([
  ["--surface-ink", "var(--brand-ink)"],
  ["--surface-ink-soft", "var(--bg-ink-soft)"],
  ["--surface-footer-emotion", "var(--smh-ink)"],
]);
for (const [token, expected] of requiredRoles) {
  const values = definitions(tokens, token, paths.tokens);
  if (values.length !== 1 || values[0] !== expected) {
    errors.push(`${token} must preserve current truth as ${expected}`);
  }
}
for (const token of ["--surface-canvas", ...requiredRoles.keys()]) {
  if (count(exportsSource, `"${token}",`) !== 1) {
    errors.push(`${token} must be exported exactly once`);
  }
}

const materialLiterals = new Map(
  (material?.nodes ?? [])
    .filter((node) => node?.type === "literal")
    .map((node) => [node.token, node.value]),
);
const immutableChroma = new Map([
  ["--brand-magenta", materialLiterals.get("--brand-magenta")],
  ["--brand-teal", materialLiterals.get("--brand-teal")],
  ["--brand-gold", `#${["D4", "AF", "37"].join("")}`],
  ["--brand-gold-keyline", `#${["F9", "E8", "C3"].join("")}`],
]);
for (const [token, expected] of immutableChroma) {
  const values = definitions(primitives, token, paths.primitives);
  if (!expected || values.length !== 1 || values[0].toUpperCase() !== expected.toUpperCase()) {
    errors.push(
      `${token} immutable chroma drift: expected ${expected ?? "a canonical material value"}, found ${values.join(", ") || "missing"}`,
    );
  }
}
if (material?.finalPersianMidnightSelection !== false) {
  errors.push(`${paths.material} must not claim a final Persian Midnight selection`);
}

const footerBindings = [
  ...footer.matchAll(/"--smh-footer-bg"\s*:\s*"([^"]+)"\s*,/g),
].map((match) => match[1]);
if (footerBindings.length !== 1 || footerBindings[0] !== "var(--surface-footer-emotion)") {
  errors.push("footer background must remain bound to --surface-footer-emotion");
}
for (const [label, selector] of [
  ["porcelain", "[data-surface-tone='porcelain']"],
  ["ink", "[data-surface-tone='ink']"],
]) {
  const block = blockFor(theme, selector);
  for (const suffix of ["high", "medium", "low"]) {
    const expected = `--text-${label === "porcelain" ? "porcelain" : "ink"}-${suffix}`;
    if (!block.includes(`--text-${suffix}: var(${expected})`)) {
      errors.push(`${label} context must bind --text-${suffix} to ${expected}`);
    }
  }
  if (!/color\s*:\s*var\(--text-high\)\s*;/.test(block)) {
    errors.push(`${label} context must reapply color through --text-high`);
  }
}
if (!/:root\s*{[\s\S]*?background\s*:\s*var\(--surface-canvas\)\s*;/.test(theme)) {
  errors.push(":root must paint --surface-canvas");
}
if (!/body,\s*\n?\.champagne-page\s*{[\s\S]*?background\s*:\s*var\(--surface-canvas\)\s*;/.test(theme)) {
  errors.push("body and .champagne-page must paint --surface-canvas");
}

const criticalImport = `import {
  champagneCriticalPaintCss,
  champagneCriticalPaintDocumentStyle,
} from "../../../packages/champagne-tokens/src/critical-paint.generated";`;
const headSequence = `<head>
        <style
          data-champagne-critical-paint="v1"
          dangerouslySetInnerHTML={{ __html: champagneCriticalPaintCss }}
        />
      </head>`;
if (count(layout, criticalImport) !== 1) {
  errors.push(`${paths.layout} must import both generated paint outputs exactly once`);
}
if (
  !layout.includes(headSequence) ||
  count(layout, 'data-champagne-critical-paint="v1"') !== 1
) {
  errors.push(
    `[CRITICAL_STYLE_PLACEMENT] ${paths.layout} must emit one unconditional marked critical style directly inside head`,
  );
}
if (
  count(layout, 'style={champagneCriticalPaintDocumentStyle}') !== 2 ||
  !layout.includes('<html lang="en" style={champagneCriticalPaintDocumentStyle}>')
) {
  errors.push(
    `[CRITICAL_DOCUMENT_FALLBACK] ${paths.layout} must apply the generated document style to html and body`,
  );
}
for (const marker of [
  "const CRITICAL_PAINT_FALLBACK_STYLE = {",
  "...champagneCriticalPaintDocumentStyle",
  "<Suspense",
  'data-champagne-critical-fallback="v1"',
  "style={CRITICAL_PAINT_FALLBACK_STYLE}",
]) {
  if (!layout.includes(marker)) {
    errors.push(`[CRITICAL_STREAMING_FALLBACK] ${paths.layout} missing marker ${marker}`);
  }
}
const expectedDocumentStyle = {
  background: "var(--surface-canvas)",
  color: "var(--text-ink-high)",
};
if (JSON.stringify(rendered?.documentStyle) !== JSON.stringify(expectedDocumentStyle)) {
  errors.push(
    `${paths.generatedTs} document style must paint through cascade-resolved variables without declaring inline token values`,
  );
}
if (Object.keys(rendered?.documentStyle ?? {}).some((property) => property.startsWith("--"))) {
  errors.push(`${paths.generatedTs} document style must not override themeable custom properties inline`);
}
if (!generatedTs.includes("export const champagneCriticalPaintDocumentStyle = {")) {
  errors.push(`${paths.generatedTs} must expose the generated streaming fallback`);
}
if (/^\s*import\s/m.test(generatedTs) || /\brequire\s*\(|node:|readFile|writeFile/.test(generatedTs)) {
  errors.push(`${paths.generatedTs} must remain leaf-pure`);
}
if (tokenPackage?.exports?.["./critical-paint"]?.default !== "./src/critical-paint.generated.ts") {
  errors.push(`${paths.tokenPackage} must expose the pure critical-paint subpath`);
}
if (tokenPackage?.exports?.["."]?.default !== "./src/index.ts") {
  errors.push(`${paths.tokenPackage} must preserve its root entry`);
}
if (tokenPackage?.exports?.["./styles/*"] !== "./styles/*") {
  errors.push(`${paths.tokenPackage} must preserve style subpath compatibility`);
}

for (const [script, expected] of [
  ["generate:critical-paint", "node packages/champagne-tokens/scripts/generate-critical-paint.v1.mjs --write"],
  ["check:critical-paint-generated", "node packages/champagne-tokens/scripts/generate-critical-paint.v1.mjs --check"],
  ["test:critical-paint-generator", "node --test tests/champagne-critical-first-paint-generator.test.mjs"],
]) {
  if (rootPackage?.scripts?.[script] !== expected) {
    errors.push(`${paths.rootPackage} must wire ${script} exactly`);
  }
}
for (const marker of [
  'test.use({ serviceWorkers: "block" })',
  'waitUntil: "commit"',
  'early.readyState).toBe("loading")',
  "stylesheetGate.heldUrls",
  "loaded.srgb.canvas).toEqual(earlyCanvas)",
  "directHeadChildren).toEqual([true])",
  'style[data-champagne-critical-paint="v1"]',
  "fallback.coversViewport",
  'earlyContract: "streaming-fallback"',
  'expect(evidence.fallback.count).toBe(1)',
  '"public-head"',
  '"streaming-fallback"',
  '"loaded-streaming"',
  "expectDocumentPaint(evidence)",
  'expect(evidence.inline.rootCanvas).toBe("")',
  'expect(evidence.inline.bodyCanvas).toBe("")',
  "expect(loaded.fallback.count).toBe(0)",
  'path: "/contact"',
  'path: "/champagne/sections-debug"',
]) {
  if (!firstPaintTest.includes(marker)) errors.push(`${paths.firstPaintTest} missing marker ${marker}`);
}
if (surfaceTest.includes("canvas is painted through first, 120ms and 1500ms frames")) {
  errors.push(`${paths.surfaceTest} must not retain the superseded timing test`);
}
for (const marker of ["expectedThemeCanvas", "not.toBe(baseline.resolved.canvas)"]) {
  if (!surfaceTest.includes(marker)) errors.push(`${paths.surfaceTest} missing theme-override proof ${marker}`);
}
for (const marker of [
  "GENERATED_DRIFT",
  "MATERIAL_STATUS",
  "PERSIAN_MIDNIGHT_AUTHORITY",
  "CSS_DECLARATION_PARSER_BYPASS",
  "TIME_OF_DAY_OWNER_EXEMPTION",
  "CSS_SYMLINK_UNAPPROVED",
  "REF_MISSING",
  "REF_CYCLE",
  "PRIMITIVE_DRIFT",
]) {
  if (!generatorTest.includes(marker)) errors.push(`${paths.generatorTest} missing marker ${marker}`);
}
for (const marker of [
  paths.firstPaintTest,
  paths.surfaceTest,
  "tests/hero-v2-navigation-continuity.spec.ts",
  "critical-paint-generated",
  paths.generatorTest,
  "git diff --exit-code",
]) {
  if (!workflow.includes(marker)) errors.push(`${paths.workflow} missing marker ${marker}`);
}
if (guardPackage?.scripts?.["guard:surface-semantics"] !== "node scripts/guard-surface-semantics.mjs") {
  errors.push("guard:surface-semantics script is not wired exactly");
}
if (!guardPackage?.scripts?.["guard:all"]?.includes("guard:surface-semantics")) {
  errors.push("guard:surface-semantics is absent from guard:all");
}
if (receipt.includes("BROWSER_PROVEN")) {
  errors.push(`${paths.receipt} must not use the non-canonical BROWSER_PROVEN evidence level`);
}
if (!receipt.includes("LIVE_READ_PROVEN")) {
  errors.push(`${paths.receipt} must classify exact-head browser evidence canonically`);
}

for (const value of ["001126", "00142C", "071D3A", "031A39"]) {
  const candidate = `#${value}`;
  for (const sourcePath of [paths.material, paths.generatedCss, paths.generatedTs, paths.layout, paths.firstPaintTest]) {
    if (read(sourcePath).toUpperCase().includes(candidate)) {
      errors.push(`prohibited Persian candidate ${candidate} found in ${sourcePath}`);
    }
  }
}

if (errors.length > 0) {
  console.error("❌ Surface semantics guard failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("✅ Surface semantics guard passed: generated first paint and semantic ownership remain deterministic.");
