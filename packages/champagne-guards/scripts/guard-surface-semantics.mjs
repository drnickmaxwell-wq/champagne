#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkGenerated } from "../../champagne-tokens/scripts/generate-critical-paint.v1.mjs";

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
function definitions(source, token) {
  return [...source.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)]
    .filter((match) => match[1] === token)
    .map((match) => match[2].trim());
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
function collectCss(root) {
  const ignored = new Set(["node_modules", ".next", "dist", "build", "coverage", ".git"]);
  const files = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const file = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...collectCss(file));
    else if (entry.isFile() && entry.name.endsWith(".css")) files.push(file);
  }
  return files;
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
const workflow = read(paths.workflow);

let rendered;
try {
  rendered = await checkGenerated(repoRoot);
} catch (error) {
  errors.push(error instanceof Error ? error.message : String(error));
}

const importPrefix =
  "@import '../tokens/smh-champagne-tokens.css';\n@import './canvas-material.generated.css';\n";
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
  const values = definitions(generatedCss, token);
  if (!expected || values.length !== 1 || values[0] !== expected) {
    errors.push(`${paths.generatedCss} must define ${token} exactly once from the generator`);
  }
  if (definitions(tokens, token).length !== 0) {
    errors.push(`${paths.tokens} must not duplicate generated owner ${token}`);
  }
}

const cssFiles = [
  ...collectCss(absolute("packages/champagne-tokens/styles")),
  absolute("apps/web/app/globals.css"),
];
for (const token of generatedOwners.keys()) {
  const invalidOwners = [];
  for (const file of cssFiles) {
    if (file === absolute(paths.generatedCss)) continue;
    if (token === "--surface-canvas" && file === absolute(paths.timeOfDay)) continue;
    if (definitions(readFileSync(file, "utf8"), token).length > 0) {
      invalidOwners.push(path.relative(repoRoot, file));
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
  const values = definitions(tokens, token);
  if (values.length !== 1 || values[0] !== expected) {
    errors.push(`${token} must preserve current truth as ${expected}`);
  }
}
for (const token of ["--surface-canvas", ...requiredRoles.keys()]) {
  if (count(exportsSource, `"${token}",`) !== 1) {
    errors.push(`${token} must be exported exactly once`);
  }
}

for (const [name, expected] of [
  ["dawn", "color-mix(in srgb, var(--brand-teal) 15%, white)"],
  ["dusk", "var(--ink-100)"],
  ["night", "var(--ink-100)"],
]) {
  const block = blockFor(timeOfDay, `:root[data-theme='${name}']`);
  const values = definitions(block, "--surface-canvas");
  if (values.length !== 1 || values[0] !== expected) {
    errors.push(`${name} must preserve its one approved canvas owner`);
  }
  if (definitions(block, "--bg-ink").length !== 0) {
    errors.push(`${name} must not override --bg-ink`);
  }
}

// The structured source and generator own literal-value parity. The guard only
// requires one canonical primitive owner, avoiding a second copied colour ledger.
for (const token of ["--brand-magenta", "--brand-teal", "--brand-gold", "--brand-gold-keyline"]) {
  if (definitions(primitives, token).length !== 1) {
    errors.push(`${token} immutable chroma must have one primitive owner`);
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

const criticalImport =
  'import { champagneCriticalPaintCss } from "../../../packages/champagne-tokens/src/critical-paint.generated";';
const rootSequence = `  return (\n    <html lang="en">\n      <head>\n        <style\n          href="champagne-critical-paint-v1"\n          precedence="critical"\n          dangerouslySetInnerHTML={{ __html: champagneCriticalPaintCss }}\n        />\n      </head>\n      <body`;
if (
  !layout.includes(rootSequence) ||
  count(layout, 'href="champagne-critical-paint-v1"') !== 1 ||
  count(layout, 'precedence="critical"') !== 1
) {
  errors.push(
    `[CRITICAL_STYLE_PLACEMENT] ${paths.layout} must emit one unconditional React-hoisted critical stylesheet resource`,
  );
}
if (count(layout, criticalImport) !== 1) {
  errors.push(`${paths.layout} must import the leaf-pure generated critical paint exactly once`);
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
  "loaded.srgb.canvas).toEqual(early.srgb.canvas)",
  "directHeadChildren).toEqual([true])",
  'data-href~="champagne-critical-paint-v1"',
  'data-precedence="critical"',
  'path: "/contact"',
  'path: "/champagne/sections-debug"',
]) {
  if (!firstPaintTest.includes(marker)) errors.push(`${paths.firstPaintTest} missing marker ${marker}`);
}
if (surfaceTest.includes("canvas is painted through first, 120ms and 1500ms frames")) {
  errors.push(`${paths.surfaceTest} must not retain the superseded timing test`);
}
for (const marker of ["GENERATED_DRIFT", "REF_MISSING", "REF_CYCLE", "PRIMITIVE_DRIFT"]) {
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
