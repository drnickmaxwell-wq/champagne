#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), "../../..");
const relative = (...parts) => path.join(repoRoot, ...parts);

const paths = {
  primitives: "packages/champagne-tokens/styles/tokens/smh-champagne-tokens.css",
  tokens: "packages/champagne-tokens/styles/champagne/tokens.css",
  theme: "packages/champagne-tokens/styles/champagne/theme.css",
  exports: "packages/champagne-tokens/src/index.ts",
  guardPackage: "packages/champagne-guards/package.json",
  workflow: ".github/workflows/verify.yml",
};

const requiredRoles = new Map([
  ["--surface-canvas", "var(--brand-ink)"],
  ["--surface-ink", "var(--brand-ink)"],
  ["--surface-ink-soft", "var(--bg-ink-soft)"],
  ["--surface-footer-emotion", "var(--smh-ink)"],
]);

const immutableChroma = new Map([
  ["--brand-magenta", "#C2185B"],
  ["--brand-teal", "#40C4B4"],
  ["--brand-gold", "#D4AF37"],
  ["--brand-gold-keyline", "#F9E8C3"],
]);

const prohibitedCandidates = ["001126", "00142C", "071D3A", "031A39"].map(
  (value) => `#${value}`,
);
const c1Paths = [
  paths.tokens,
  paths.theme,
  paths.exports,
  "packages/champagne-guards/scripts/guard-surface-semantics.mjs",
  paths.guardPackage,
  "tests/champagne-surface-semantics.spec.ts",
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

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function definitionValues(source, token) {
  const expression = new RegExp(`${escapeRegex(token)}\\s*:\\s*([^;]+);`, "gi");
  return [...source.matchAll(expression)].map((match) => match[1].trim());
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
const exportsSource = read(paths.exports);
const packageSource = read(paths.guardPackage);
const workflow = read(paths.workflow);

for (const [token, expectedValue] of requiredRoles) {
  const values = definitionValues(tokens, token);
  if (values.length !== 1) {
    errors.push(`${token} must be defined exactly once in ${paths.tokens}; found ${values.length}`);
  } else if (values[0] !== expectedValue) {
    errors.push(`${token} must preserve current truth as ${expectedValue}; found ${values[0]}`);
  }

  const exportMatches = exportsSource.match(new RegExp(`^[ \\t]*["']${escapeRegex(token)}["']`, "gm")) ?? [];
  if (exportMatches.length !== 1) {
    errors.push(`${token} must be exported exactly once in ${paths.exports}; found ${exportMatches.length}`);
  }
}

const bgInkValues = definitionValues(tokens, "--bg-ink");
if (bgInkValues.length !== 1 || bgInkValues[0] !== "var(--surface-canvas)") {
  errors.push("--bg-ink must remain one compatibility alias to var(--surface-canvas)");
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

for (const testPath of [
  "tests/champagne-surface-semantics.spec.ts",
  "tests/hero-v2-navigation-continuity.spec.ts",
]) {
  if (!workflow.includes(testPath)) errors.push(`${paths.workflow} does not execute ${testPath}`);
}

if (errors.length > 0) {
  console.error("❌ Surface semantics guard failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("✅ Surface semantics guard passed: canvas, ink, footer and nested text contexts are deterministic.");
