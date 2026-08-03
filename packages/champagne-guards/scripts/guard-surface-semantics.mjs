#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { checkGenerated } from "../../champagne-tokens/scripts/generate-critical-paint.v1.mjs";

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), "../../..");
const relative = (...parts) => path.join(repoRoot, ...parts);

const paths = {
  rootPackage: "package.json",
  primitives: "packages/champagne-tokens/styles/tokens/smh-champagne-tokens.css",
  tokens: "packages/champagne-tokens/styles/champagne/tokens.css",
  generatedCss: "packages/champagne-tokens/styles/champagne/canvas-material.generated.css",
  generatedTs: "packages/champagne-tokens/src/critical-paint.generated.ts",
  materialSource: "packages/champagne-tokens/src/canvas-material.v1.json",
  generator: "packages/champagne-tokens/scripts/generate-critical-paint.v1.mjs",
  tokensPackage: "packages/champagne-tokens/package.json",
  tsconfig: "tsconfig.base.json",
  theme: "packages/champagne-tokens/styles/champagne/theme.css",
  timeOfDay: "packages/champagne-tokens/styles/champagne/time-of-day.css",
  exports: "packages/champagne-tokens/src/index.ts",
  layout: "apps/web/app/layout.tsx",
  footer: "apps/web/app/components/layout/Footer.tsx",
  guardPackage: "packages/champagne-guards/package.json",
  surfaceTest: "tests/champagne-surface-semantics.spec.ts",
  criticalFirstPaintTest: "tests/champagne-critical-first-paint.spec.ts",
  generatorTest: "tests/champagne-critical-first-paint-generator.test.mjs",
  workflow: ".github/workflows/verify.yml",
};

const errors = [];

function read(relativePath) {
  const absolutePath = relative(relativePath);
  if (!existsSync(absolutePath)) {
    errors.push(`missing required path: ${relativePath}`);
    return "";
  }
  return readFileSync(absolutePath, "utf8");
}

function parseJson(source, sourcePath) {
  try {
    return JSON.parse(source);
  } catch (error) {
    errors.push(`unable to parse ${sourcePath}: ${error.message}`);
    return null;
  }
}

function countOccurrences(source, needle) {
  return source.split(needle).length - 1;
}

function definitionValues(source, token) {
  return [...source.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)]
    .filter((match) => match[1] === token)
    .map((match) => match[2].trim());
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

function collectSourceFiles(rootPath, supportedExtensions = /\.(?:css|[cm]?[jt]sx?)$/) {
  const ignoredDirectories = new Set([
    "node_modules",
    ".next",
    "dist",
    "build",
    "coverage",
    ".git",
  ]);
  const results = [];
  for (const entry of readdirSync(rootPath, { withFileTypes: true })) {
    if (ignoredDirectories.has(entry.name)) continue;
    const absolutePath = path.join(rootPath, entry.name);
    if (entry.isDirectory()) results.push(...collectSourceFiles(absolutePath, supportedExtensions));
    else if (entry.isFile() && supportedExtensions.test(entry.name)) results.push(absolutePath);
  }
  return results;
}

function relativePath(absolutePath) {
  return path.relative(repoRoot, absolutePath).split(path.sep).join("/");
}

const rootPackageSource = read(paths.rootPackage);
const primitives = read(paths.primitives);
const tokens = read(paths.tokens);
const generatedCss = read(paths.generatedCss);
const generatedTs = read(paths.generatedTs);
const theme = read(paths.theme);
const timeOfDay = read(paths.timeOfDay);
const exportsSource = read(paths.exports);
const layoutSource = read(paths.layout);
const footerSource = read(paths.footer);
const guardPackageSource = read(paths.guardPackage);
const tokenPackageSource = read(paths.tokensPackage);
const tsconfigSource = read(paths.tsconfig);
const surfaceTestSource = read(paths.surfaceTest);
const criticalFirstPaintTestSource = read(paths.criticalFirstPaintTest);
const generatorTestSource = read(paths.generatorTest);
const workflow = read(paths.workflow);

const rootPackage = parseJson(rootPackageSource, paths.rootPackage);
const tokenPackage = parseJson(tokenPackageSource, paths.tokensPackage);
const tsconfig = parseJson(tsconfigSource, paths.tsconfig);
const guardPackage = parseJson(guardPackageSource, paths.guardPackage);

let renderedMaterial;
try {
  renderedMaterial = await checkGenerated(repoRoot);
} catch (error) {
  errors.push(error instanceof Error ? error.message : String(error));
}

const expectedImports =
  "@import '../tokens/smh-champagne-tokens.css';\n@import './canvas-material.generated.css';\n";
if (!tokens.startsWith(expectedImports)) {
  errors.push(`${paths.tokens} must import primitives then generated canvas material first`);
}

const generatedOwners = new Map([
  ["--smh-ink-navy", renderedMaterial?.loadedCanvas],
  ["--brand-ink", "var(--smh-ink-navy)"],
  ["--surface-canvas", "var(--brand-ink)"],
  ["--bg-ink", "var(--surface-canvas)"],
  ["--text-ink-high", renderedMaterial?.loadedForeground],
]);

for (const [token, expectedValue] of generatedOwners) {
  const values = definitionValues(generatedCss, token);
  if (!expectedValue || values.length !== 1 || values[0] !== expectedValue) {
    errors.push(
      `${paths.generatedCss} must define ${token} exactly once from the material generator`,
    );
  }
  if (definitionValues(tokens, token).length !== 0) {
    errors.push(`${paths.tokens} must not duplicate generated owner ${token}`);
  }
}

const requiredTokenRoles = new Map([
  ["--surface-ink", "var(--brand-ink)"],
  ["--surface-ink-soft", "var(--bg-ink-soft)"],
  ["--surface-footer-emotion", "var(--smh-ink)"],
]);
for (const [token, expectedValue] of requiredTokenRoles) {
  const values = definitionValues(tokens, token);
  if (values.length !== 1 || values[0] !== expectedValue) {
    errors.push(`${token} must preserve current truth as ${expectedValue}`);
  }
}

for (const token of ["--surface-canvas", ...requiredTokenRoles.keys()]) {
  if (exportedTokenCount(exportsSource, token) !== 1) {
    errors.push(`${token} must be exported exactly once in ${paths.exports}`);
  }
}

const protectedOwners = new Set(generatedOwners.keys());
const cssFiles = [
  ...collectSourceFiles(relative("packages/champagne-tokens/styles"), /\.css$/),
  relative("apps/web/app/globals.css"),
];
for (const token of protectedOwners) {
  const owners = [];
  for (const file of cssFiles) {
    const values = definitionValues(readFileSync(file, "utf8"), token);
    for (const value of values) owners.push({ path: relativePath(file), value });
  }
  const invalid = owners.filter(
    (owner) =>
      owner.path !== paths.generatedCss &&
      !(token === "--surface-canvas" && owner.path === paths.timeOfDay),
  );
  if (invalid.length > 0) {
    errors.push(
      `[CANVAS_OWNER_UNAPPROVED] ${token} has owner(s) outside the closed set: ${invalid
        .map((owner) => owner.path)
        .join(", ")}`,
    );
  }
}

for (const [themeName, expectedValue] of [
  ["dawn", "color-mix(in srgb, var(--brand-teal) 15%, white)"],
  ["dusk", "var(--ink-100)"],
  ["night", "var(--ink-100)"],
]) {
  const selector = `:root[data-theme='${themeName}']`;
  const block = blockFor(timeOfDay, selector);
  const canvasValues = definitionValues(block, "--surface-canvas");
  const legacyValues = definitionValues(block, "--bg-ink");
  if (canvasValues.length !== 1 || canvasValues[0] !== expectedValue) {
    errors.push(`${themeName} must define --surface-canvas exactly once as ${expectedValue}`);
  }
  if (legacyValues.length !== 0) errors.push(`${themeName} must not override --bg-ink`);
}

for (const [token, expectedValue] of [
  ["--brand-magenta", "#C2185B"],
  ["--brand-teal", "#40C4B4"],
  ["--brand-gold", "#D4AF37"],
  ["--brand-gold-keyline", "#F9E8C3"],
]) {
  const values = definitionValues(primitives, token);
  if (values.length !== 1 || values[0].toUpperCase() !== expectedValue) {
    errors.push(`${token} immutable chroma drift`);
  }
}

const footerBackgroundBindings = [
  ...footerSource.matchAll(/"--smh-footer-bg"\s*:\s*"([^"]+)"\s*,/g),
].map((match) => match[1]);
if (
  footerBackgroundBindings.length !== 1 ||
  footerBackgroundBindings[0] !== "var(--surface-footer-emotion)"
) {
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
    errors.push(`${label} context must reapply the actual color property`);
  }
}

if (!/:root\s*{[\s\S]*?background\s*:\s*var\(--surface-canvas\)\s*;/.test(theme)) {
  errors.push(":root must paint var(--surface-canvas)");
}
if (!/body,\s*\n?\.champagne-page\s*{[\s\S]*?background\s*:\s*var\(--surface-canvas\)\s*;/.test(theme)) {
  errors.push("body and .champagne-page must paint var(--surface-canvas)");
}

const criticalImport =
  'import { champagneCriticalPaintCss } from "@champagne/tokens/critical-paint";';
const requiredRootSequence = `  return (\n    <html lang="en">\n      <head>\n        <style\n          data-champagne-critical-paint="v1"\n          dangerouslySetInnerHTML={{ __html: champagneCriticalPaintCss }}\n        />\n      </head>\n      <body`;
if (
  !layoutSource.includes(requiredRootSequence) ||
  countOccurrences(layoutSource, 'data-champagne-critical-paint="v1"') !== 1
) {
  errors.push(
    `[CRITICAL_STYLE_PLACEMENT] ${paths.layout} must emit exactly one unconditional critical style as the first direct child of root <html>`,
  );
}
if (countOccurrences(layoutSource, criticalImport) !== 1) {
  errors.push(`${paths.layout} must import critical paint exactly once from the pure subpath`);
}

if (/^\s*import\s/m.test(generatedTs) || /\brequire\s*\(|node:|readFile|writeFile/.test(generatedTs)) {
  errors.push(`${paths.generatedTs} must remain a leaf-pure generated module`);
}
if (
  tokenPackage?.exports?.["./critical-paint"]?.default !==
    "./src/critical-paint.generated.ts" ||
  tokenPackage?.exports?.["./critical-paint"]?.types !==
    "./src/critical-paint.generated.ts"
) {
  errors.push(`${paths.tokensPackage} must expose the pure ./critical-paint subpath`);
}
if (tokenPackage?.exports?.["."]?.default !== "./src/index.ts") {
  errors.push(`${paths.tokensPackage} must preserve the existing package root entry`);
}
if (tokenPackage?.exports?.["./styles/*"] !== "./styles/*") {
  errors.push(`${paths.tokensPackage} must preserve direct style subpath compatibility`);
}
if (
  tsconfig?.compilerOptions?.paths?.["@champagne/tokens/critical-paint"]?.[0] !==
    "packages/champagne-tokens/src/critical-paint.generated.ts"
) {
  errors.push(`${paths.tsconfig} must map the pure critical-paint subpath`);
}

for (const [scriptName, expected] of [
  ["generate:critical-paint", "node packages/champagne-tokens/scripts/generate-critical-paint.v1.mjs --write"],
  ["check:critical-paint-generated", "node packages/champagne-tokens/scripts/generate-critical-paint.v1.mjs --check"],
  ["test:critical-paint-generator", "node --test tests/champagne-critical-first-paint-generator.test.mjs"],
]) {
  if (rootPackage?.scripts?.[scriptName] !== expected) {
    errors.push(`${paths.rootPackage} must wire ${scriptName} exactly`);
  }
}

for (const marker of [
  'test.use({ serviceWorkers: "block" })',
  'waitUntil: "commit"',
  'early.readyState).toBe("loading")',
  "stylesheetGate.heldUrls",
  "loaded.srgb.canvas).toEqual(early.srgb.canvas)",
  "directHeadChildren).toEqual([true])",
  'path: "/contact"',
  'path: "/champagne/sections-debug"',
]) {
  if (!criticalFirstPaintTestSource.includes(marker)) {
    errors.push(`${paths.criticalFirstPaintTest} is missing required proof marker: ${marker}`);
  }
}
if (surfaceTestSource.includes("canvas is painted through first, 120ms and 1500ms frames")) {
  errors.push(`${paths.surfaceTest} must not retain the superseded timing-based first-paint test`);
}
for (const marker of ["GENERATED_DRIFT", "REF_MISSING", "REF_CYCLE", "PRIMITIVE_DRIFT"]) {
  if (!generatorTestSource.includes(marker)) {
    errors.push(`${paths.generatorTest} is missing adversarial marker ${marker}`);
  }
}

for (const testPath of [
  paths.criticalFirstPaintTest,
  paths.surfaceTest,
  "tests/hero-v2-navigation-continuity.spec.ts",
]) {
  if (!workflow.includes(testPath)) errors.push(`${paths.workflow} does not execute ${testPath}`);
}
if (!workflow.includes("critical-paint-generated")) {
  errors.push(`${paths.workflow} must expose the generated-material check as a named CI job`);
}
if (!workflow.includes(paths.generatorTest)) {
  errors.push(`${paths.workflow} must execute ${paths.generatorTest}`);
}
if (!workflow.includes("git diff --exit-code")) {
  errors.push(`${paths.workflow} must prove write-mode generation leaves a clean diff`);
}

if (guardPackage?.scripts?.["guard:surface-semantics"] !== "node scripts/guard-surface-semantics.mjs") {
  errors.push("guard:surface-semantics script is not wired exactly");
}
if (!guardPackage?.scripts?.["guard:all"]?.includes("guard:surface-semantics")) {
  errors.push("guard:surface-semantics is absent from guard:all");
}

const searchableFiles = [relative("apps"), relative("packages")].flatMap((root) =>
  collectSourceFiles(root),
);
for (const token of ["--surface-canvas", ...requiredTokenRoles.keys()]) {
  const consumers = searchableFiles.filter((file) => readFileSync(file, "utf8").includes(`var(${token}`));
  const definitions =
    definitionValues(tokens, token).length + definitionValues(generatedCss, token).length;
  if (consumers.length > 0 && definitions !== 1) {
    errors.push(`${token} is consumed but lacks one default canonical definition`);
  }
}

for (const candidateValue of ["001126", "00142C", "071D3A", "031A39"]) {
  const candidate = `#${candidateValue}`;
  for (const sourcePath of [
    paths.materialSource,
    paths.generatedCss,
    paths.generatedTs,
    paths.generator,
    paths.layout,
    paths.criticalFirstPaintTest,
  ]) {
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

console.log(
  "✅ Surface semantics guard passed: generated first paint, closed canvas ownership, semantic contexts and CI proof remain deterministic.",
);
