#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), "../../..");
const relative = (...parts) => path.join(repoRoot, ...parts);

const paths = {
  primitives: "packages/champagne-tokens/styles/tokens/smh-champagne-tokens.css",
  tokens: "packages/champagne-tokens/styles/champagne/tokens.css",
  theme: "packages/champagne-tokens/styles/champagne/theme.css",
  timeOfDay: "packages/champagne-tokens/styles/champagne/time-of-day.css",
  criticalPaint: "packages/champagne-tokens/src/critical-paint.v1.json",
  exports: "packages/champagne-tokens/src/index.ts",
  footer: "apps/web/app/components/layout/Footer.tsx",
  guardPackage: "packages/champagne-guards/package.json",
  surfaceTest: "tests/champagne-surface-semantics.spec.ts",
  workflow: ".github/workflows/verify.yml",
};

const requiredRoles = new Map([
  ["--surface-canvas", "var(--brand-ink)"],
  ["--surface-ink", "var(--brand-ink)"],
  ["--surface-ink-soft", "var(--bg-ink-soft)"],
  ["--surface-footer-emotion", "var(--smh-ink)"],
]);

const immutableChroma = new Map(
  [
    ["--brand-magenta", "C2185B"],
    ["--brand-teal", "40C4B4"],
    ["--brand-gold", "D4AF37"],
    ["--brand-gold-keyline", "F9E8C3"],
  ].map(([token, value]) => [token, `#${value}`]),
);

const prohibitedCandidates = ["001126", "00142C", "071D3A", "031A39"].map(
  (value) => `#${value}`,
);
const c1Paths = [
  paths.tokens,
  paths.theme,
  paths.timeOfDay,
  paths.criticalPaint,
  paths.exports,
  paths.footer,
  "packages/champagne-guards/scripts/guard-surface-semantics.mjs",
  paths.guardPackage,
  paths.surfaceTest,
  paths.workflow,
];

const errors = [];

function read(relativePath) {
  const absolutePath = relative(relativePath);
  if (!existsSync(absolutePath)) {
    errors.push(`missing required path: ${relativePath}`);
    return "";
  }
  return readFileSync(absolutePath, "utf8");
}

function validateStylesheetSyntax(source, sourcePath) {
  try {
    postcss.parse(source, { from: relative(sourcePath) });
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    errors.push(`${sourcePath} must be valid CSS: ${reason}`);
  }
}

function definitionValues(source, token) {
  return [...source.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)]
    .filter((match) => match[1] === token)
    .map((match) => match[2].trim());
}

function exactlyOneDefinition(source, token, sourcePath) {
  const values = definitionValues(source, token);
  if (values.length !== 1) {
    errors.push(`${token} must be defined exactly once in ${sourcePath}; found ${values.length}`);
    return "";
  }
  return values[0];
}

function normalizeCssExpression(value) {
  return value
    .replace(/\s+/g, " ")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .replace(/\s*,\s*/g, ", ")
    .trim();
}

function splitTopLevelComma(value) {
  let depth = 0;
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (character === "(") depth += 1;
    else if (character === ")") depth -= 1;
    else if (character === "," && depth === 0) {
      return [value.slice(0, index).trim(), value.slice(index + 1).trim()];
    }
    if (depth < 0) return null;
  }
  return depth === 0 ? [value.trim(), null] : null;
}

function replaceBalancedVarFunctions(value, replacer) {
  let output = "";
  let cursor = 0;

  while (cursor < value.length) {
    const match = /var\s*\(/gi.exec(value.slice(cursor));
    if (!match) return output + value.slice(cursor);
    const start = cursor + match.index;
    const open = start + match[0].length;

    output += value.slice(cursor, start);
    let depth = 1;
    let end = open;
    for (; end < value.length && depth > 0; end += 1) {
      if (value[end] === "(") depth += 1;
      else if (value[end] === ")") depth -= 1;
    }

    if (depth !== 0) {
      errors.push(`unbalanced var() expression: ${value}`);
      return output + value.slice(start);
    }

    const body = value.slice(open, end - 1);
    output += replacer(body);
    cursor = end;
  }

  return output;
}

function resolveTokenExpression(token, sources, stack = []) {
  if (!/^--[a-z0-9-]+$/i.test(token)) {
    errors.push(`invalid CSS custom property reference: ${token}`);
    return "";
  }
  if (stack.includes(token)) {
    errors.push(`critical paint token cycle: ${[...stack, token].join(" -> ")}`);
    return "";
  }

  const matches = sources.flatMap(({ source, sourcePath }) =>
    definitionValues(source, token).map((value) => ({ value, sourcePath })),
  );
  if (matches.length !== 1) {
    errors.push(`${token} must resolve from exactly one canonical source; found ${matches.length}`);
    return "";
  }

  return resolveCssExpression(matches[0].value, sources, [...stack, token]);
}

function resolveCssExpression(value, sources, stack = []) {
  return replaceBalancedVarFunctions(value, (body) => {
    const parts = splitTopLevelComma(body);
    if (!parts) {
      errors.push(`invalid var() expression: var(${body})`);
      return "";
    }

    const [token, fallback] = parts;
    if (!/^--[a-z0-9-]+$/i.test(token)) {
      errors.push(`invalid CSS custom property reference: ${token || "missing"}`);
      return "";
    }
    if (fallback !== null) {
      errors.push(
        `${token} uses a fallback-bearing var(), which is prohibited in the deterministic critical canvas chain`,
      );
      return "";
    }

    return resolveTokenExpression(token, sources, stack);
  });
}

function exportedTokenCount(source, token) {
  const doubleQuoted = `"${token}",`;
  const singleQuoted = `'${token}',`;
  return source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line === doubleQuoted || line === singleQuoted).length;
}

function blockFor(source, selectorFragment) {
  const selectorIndex = source.indexOf(selectorFragment);
  if (selectorIndex < 0) return "";
  const openIndex = source.indexOf("{", selectorIndex);
  const closeIndex = source.indexOf("}", openIndex + 1);
  if (openIndex < 0 || closeIndex < 0) return "";
  return source.slice(openIndex + 1, closeIndex);
}

function collectSourceFiles(rootPath) {
  const ignoredDirectories = new Set(["node_modules", ".next", "dist", "build", "coverage", ".git"]);
  const supportedExtensions = /\.(?:css|[cm]?[jt]sx?)$/;
  const results = [];

  for (const entry of readdirSync(rootPath, { withFileTypes: true })) {
    if (ignoredDirectories.has(entry.name)) continue;
    const absolutePath = path.join(rootPath, entry.name);
    if (entry.isDirectory()) results.push(...collectSourceFiles(absolutePath));
    else if (entry.isFile() && supportedExtensions.test(entry.name)) results.push(absolutePath);
  }

  return results;
}

const primitives = read(paths.primitives);
const tokens = read(paths.tokens);
const theme = read(paths.theme);
const timeOfDay = read(paths.timeOfDay);
const criticalPaintSource = read(paths.criticalPaint);
const exportsSource = read(paths.exports);
const footerSource = read(paths.footer);
const packageSource = read(paths.guardPackage);
const surfaceTestSource = read(paths.surfaceTest);
const workflow = read(paths.workflow);

for (const [sourcePath, source] of [
  [paths.primitives, primitives],
  [paths.tokens, tokens],
  [paths.theme, theme],
  [paths.timeOfDay, timeOfDay],
]) {
  validateStylesheetSyntax(source, sourcePath);
}

for (const [token, expectedValue] of requiredRoles) {
  const values = definitionValues(tokens, token);
  if (values.length !== 1) {
    errors.push(`${token} must be defined exactly once in ${paths.tokens}; found ${values.length}`);
  } else if (values[0] !== expectedValue) {
    errors.push(`${token} must preserve current truth as ${expectedValue}; found ${values[0]}`);
  }

  const exportCount = exportedTokenCount(exportsSource, token);
  if (exportCount !== 1) {
    errors.push(`${token} must be exported exactly once in ${paths.exports}; found ${exportCount}`);
  }
}

const bgInkValues = definitionValues(tokens, "--bg-ink");
if (bgInkValues.length !== 1 || bgInkValues[0] !== "var(--surface-canvas)") {
  errors.push("--bg-ink must remain one compatibility alias to var(--surface-canvas)");
}

let criticalPaint;
try {
  criticalPaint = JSON.parse(criticalPaintSource);
} catch (error) {
  errors.push(`unable to parse ${paths.criticalPaint}: ${error.message}`);
}

if (criticalPaint) {
  const canonical = criticalPaint.canonicalSource;
  if (
    canonical?.rootPath !== paths.tokens ||
    canonical?.rootToken !== "--surface-canvas" ||
    canonical?.primitivePath !== paths.primitives
  ) {
    errors.push(
      `${paths.criticalPaint} must identify ${paths.tokens} --surface-canvas and ${paths.primitives} as canonical sources`,
    );
  }

  const rootDefinition = exactlyOneDefinition(
    tokens,
    canonical?.rootToken ?? "--surface-canvas",
    paths.tokens,
  );
  const resolvedCanvasExpression = resolveTokenExpression(
    canonical?.rootToken ?? "--surface-canvas",
    [
      { source: tokens, sourcePath: paths.tokens },
      { source: primitives, sourcePath: paths.primitives },
    ],
  );

  if (!rootDefinition) errors.push(`${paths.criticalPaint} canvas root definition is missing`);
  if (
    resolvedCanvasExpression &&
    normalizeCssExpression(criticalPaint.canvasExpression ?? "") !==
      normalizeCssExpression(resolvedCanvasExpression)
  ) {
    errors.push(
      `${paths.criticalPaint} canvasExpression must equal recursively resolved ${canonical?.rootToken}; expected ${normalizeCssExpression(resolvedCanvasExpression)}, found ${normalizeCssExpression(criticalPaint.canvasExpression ?? "missing")}`,
    );
  }
  if (/var\s*\(/i.test(criticalPaint.canvasExpression ?? "")) {
    errors.push(`${paths.criticalPaint} canvasExpression must be fully resolved and contain no var()`);
  }

  if (criticalPaint.finalPersianMidnightSelection !== false) {
    errors.push(`${paths.criticalPaint} must not claim a final Persian Midnight selection`);
  }
  if (criticalPaint.bindings?.["--surface-canvas"] !== "canvasExpression") {
    errors.push(`${paths.criticalPaint} must bind --surface-canvas to canvasExpression`);
  }
  if (criticalPaint.bindings?.["--bg-ink"] !== "var(--surface-canvas)") {
    errors.push(`${paths.criticalPaint} must bind --bg-ink to var(--surface-canvas)`);
  }
}

const footerBackgroundBindings = [
  ...footerSource.matchAll(/"--smh-footer-bg"\s*:\s*"([^"]+)"\s*,/g),
].map((match) => match[1]);
if (
  footerBackgroundBindings.length !== 1 ||
  footerBackgroundBindings[0] !== "var(--surface-footer-emotion)"
) {
  errors.push(
    "--smh-footer-bg must be assigned exactly once to var(--surface-footer-emotion) in apps/web/app/components/layout/Footer.tsx",
  );
}
if (footerBackgroundBindings.includes("var(--smh-ink)")) {
  errors.push("--smh-footer-bg must not bind directly to var(--smh-ink)");
}

for (const [themeName, expectedValue] of [
  ["dawn", "color-mix(in srgb, var(--brand-teal) 15%, white)"],
  ["dusk", "var(--ink-100)"],
  ["night", "var(--ink-100)"],
]) {
  const block = blockFor(timeOfDay, `:root[data-theme='${themeName}']`);
  const canvasValues = definitionValues(block, "--surface-canvas");
  const legacyValues = definitionValues(block, "--bg-ink");
  if (canvasValues.length !== 1 || canvasValues[0] !== expectedValue) {
    errors.push(
      `${themeName} must define --surface-canvas exactly once as ${expectedValue}; found ${canvasValues.join(", ") || "missing"}`,
    );
  }
  if (legacyValues.length !== 0) {
    errors.push(`${themeName} must not override the --bg-ink compatibility alias`);
  }
}

for (const [token, expectedValue] of immutableChroma) {
  const values = definitionValues(primitives, token);
  if (values.length !== 1 || values[0].toUpperCase() !== expectedValue.toUpperCase()) {
    errors.push(`${token} immutable chroma drift: expected ${expectedValue}, found ${values.join(", ") || "missing"}`);
  }
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
    errors.push(`${label} context must reapply the actual color property`);
  }
}

if (!/:root\s*{[\s\S]*?background\s*:\s*var\(--surface-canvas\)\s*;/.test(theme)) {
  errors.push(":root must paint var(--surface-canvas)");
}
if (!/body,\s*\n?\.champagne-page\s*{[\s\S]*?background\s*:\s*var\(--surface-canvas\)\s*;/.test(theme)) {
  errors.push("body and .champagne-page must paint var(--surface-canvas)");
}

const searchableFiles = [relative("apps"), relative("packages")].flatMap(collectSourceFiles);
for (const token of requiredRoles.keys()) {
  const consumers = searchableFiles.filter((file) => readFileSync(file, "utf8").includes(`var(${token}`));
  if (consumers.length > 0 && definitionValues(tokens, token).length !== 1) {
    errors.push(`${token} is consumed but lacks one canonical definition`);
  }
}

for (const candidate of prohibitedCandidates) {
  for (const c1Path of c1Paths) {
    const source = read(c1Path);
    if (source.toUpperCase().includes(candidate)) {
      errors.push(`prohibited Persian candidate ${candidate} found in ${c1Path}`);
    }
  }
}

let packageJson;
try {
  packageJson = JSON.parse(packageSource);
} catch (error) {
  errors.push(`unable to parse ${paths.guardPackage}: ${error.message}`);
}
if (packageJson?.scripts?.["guard:surface-semantics"] !== "node scripts/guard-surface-semantics.mjs") {
  errors.push("guard:surface-semantics script is not wired exactly");
}
if (!packageJson?.scripts?.["guard:all"]?.includes("guard:surface-semantics")) {
  errors.push("guard:surface-semantics is absent from guard:all");
}

for (const testPath of [paths.surfaceTest, "tests/hero-v2-navigation-continuity.spec.ts"]) {
  if (!workflow.includes(testPath)) errors.push(`${paths.workflow} does not execute ${testPath}`);
}

const mobileFilmstripMarker =
  'test("canvas is painted through first, 120ms and 1500ms frames on mobile reduced motion"';
const mobileFilmstripIndex = surfaceTestSource.indexOf(mobileFilmstripMarker);
const mobileFilmstripSource = mobileFilmstripIndex >= 0 ? surfaceTestSource.slice(mobileFilmstripIndex) : "";
const commitNavigationIndex = mobileFilmstripSource.indexOf('waitUntil: "commit"');
const bodyAttachmentIndex = mobileFilmstripSource.indexOf("document.body !== null");
const commitCaptureIndex = mobileFilmstripSource.indexOf(
  "const navigationCommit = await readNavigationCommitCanvasEvidence(page);",
);
const commitAssertionIndex = mobileFilmstripSource.indexOf("expectNavigationCommitCanvas(navigationCommit);");
const domContentLoadedIndex = mobileFilmstripSource.indexOf('waitForLoadState("domcontentloaded")');
const beforeCommitCapture = commitCaptureIndex >= 0 ? mobileFilmstripSource.slice(0, commitCaptureIndex) : "";

if (mobileFilmstripIndex < 0) {
  errors.push(`${paths.surfaceTest} is missing the mobile reduced-motion filmstrip test`);
} else if (
  commitNavigationIndex < 0 ||
  bodyAttachmentIndex <= commitNavigationIndex ||
  commitCaptureIndex <= bodyAttachmentIndex ||
  commitAssertionIndex <= commitCaptureIndex ||
  domContentLoadedIndex <= commitAssertionIndex
) {
  errors.push(
    `${paths.surfaceTest} must capture and assert the canvas after navigation commit and body attachment, before DOMContentLoaded`,
  );
}
if (mobileFilmstripSource.includes('waitUntil: "domcontentloaded"')) {
  errors.push(`${paths.surfaceTest} must not defer the initial canvas capture to DOMContentLoaded`);
}
for (const forbiddenBeforeCapture of [
  'waitForLoadState("domcontentloaded")',
  'waitForLoadState("load")',
  'waitForLoadState("networkidle")',
  "readSurfaceEvidence(page)",
]) {
  if (beforeCommitCapture.includes(forbiddenBeforeCapture)) {
    errors.push(`${paths.surfaceTest} must not use ${forbiddenBeforeCapture} before navigation-commit canvas capture`);
  }
}
if (!mobileFilmstripSource.includes("{ polling: 1 }")) {
  errors.push(`${paths.surfaceTest} must use a non-animation-frame body-attachment polling gate`);
}

if (errors.length > 0) {
  console.error("❌ Surface semantics guard failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("✅ Surface semantics guard passed: canvas-root-derived critical paint, fallback-free canonical resolution, ink, footer and nested text contexts are deterministic.");
