#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkGenerated } from "../../../packages/champagne-tokens/scripts/generate-critical-paint.v1.mjs";
import {
  collectCssFiles,
  materialOwnershipErrors,
  parseCssDeclarations,
  parseCssDefinitions,
  timeOfDayCanvasOwnerErrors,
  themeAndLayoutContractErrors,
} from "./surface-semantics-contract.v1.mjs";
export {
  collectCssFiles,
  materialOwnershipErrors,
  parseCssDeclarations,
  parseCssDefinitions,
  timeOfDayCanvasOwnerErrors,
  themeAndLayoutContractErrors,
} from "./surface-semantics-contract.v1.mjs";
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const absolute = (file) => path.join(repoRoot, file);
const paths = {
 rootPkg: "package.json",
 primitives: "packages/champagne-tokens/styles/tokens/smh-champagne-tokens.css",
 tokens: "packages/champagne-tokens/styles/champagne/tokens.css",
 genCss: "packages/champagne-tokens/styles/champagne/canvas-material.generated.css",
 genTs: "packages/champagne-tokens/src/critical-paint.generated.ts",
 material: "packages/champagne-tokens/src/canvas-material.v1.json",
 tokenPkg: "packages/champagne-tokens/package.json",
 theme: "packages/champagne-tokens/styles/champagne/theme.css",
 timeOfDay: "packages/champagne-tokens/styles/champagne/time-of-day.css",
 exports: "packages/champagne-tokens/src/index.ts",
 layout: "apps/web/app/layout.tsx",
 footer: "apps/web/app/components/layout/Footer.tsx",
 guardPkg: "packages/champagne-guards/package.json",
 receipt: "docs/audits/CHAMPAGNE_CRITICAL_FIRST_PAINT_CLEAN_REPLACEMENT_V1.md",
 workflow: ".github/workflows/verify.yml",
};
const errors = [];
function read(file) {
 const target = absolute(file);
 if (!existsSync(target)) { errors.push(`missing required path: ${file}`); return ""; }
 return readFileSync(target, "utf8");
}
function json(file) {
 try { return JSON.parse(read(file)); }
 catch (error) { errors.push(`unable to parse ${file}: ${error.message}`); return null; }
}
function declarations(source, label = "CSS input", issues = errors) {
 try { return parseCssDeclarations(source); }
 catch (error) {
  issues.push(`[CSS_DECLARATION_PARSE] ${label}: ${error instanceof Error ? error.message : String(error)}`);
  return [];
 }
}
function definitions(source, token, label = "CSS input") {
 return declarations(source, label).filter((item) => item.property === token).map((item) => item.value);
}
function count(source, needle) { return source.split(needle).length - 1; }
function collectCss(root) {
  try {
    return collectCssFiles(root, repoRoot);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
    return [];
  }
}
async function main() {
 const rootPkg = json(paths.rootPkg);
 const guardPkg = json(paths.guardPkg);
 const tokenPkg = json(paths.tokenPkg);
 const material = json(paths.material);
 const tokens = read(paths.tokens);
 const genTs = read(paths.genTs);
 const theme = read(paths.theme);
 const timeOfDay = read(paths.timeOfDay);
 const exportsText = read(paths.exports);
 const layout = read(paths.layout);
 const footer = read(paths.footer);
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
 const cssFiles = [
  ...collectCss(absolute("packages/champagne-tokens/styles")),
  ...collectCss(absolute("apps/web/app")),
 ];
 const cssSources = new Map(
  cssFiles.map((file) => [path.relative(repoRoot, file), readFileSync(file, "utf8")]),
 );
 for (const issue of materialOwnershipErrors({
  cssSources,
  materialSource: material,
  renderedMaterial: rendered,
 })) {
  errors.push(issue);
 }
 for (const issue of timeOfDayCanvasOwnerErrors(timeOfDay)) errors.push(issue);
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
  if (count(exportsText, `"${token}",`) !== 1) {
   errors.push(`${token} must be exported exactly once`);
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
 for (const issue of themeAndLayoutContractErrors({ theme, layout, genTs, rendered, tokenPkg, paths })) {
  errors.push(issue);
 }
 for (const [script, expected] of [
  ["generate:critical-paint", "node packages/champagne-tokens/scripts/generate-critical-paint.v1.mjs --write"],
  ["check:critical-paint-generated", "node packages/champagne-tokens/scripts/generate-critical-paint.v1.mjs --check"],
  ["test:critical-paint-generator", "node --test tests/champagne-critical-first-paint-generator.test.mjs"],
 ]) {
  if (rootPkg?.scripts?.[script] !== expected) {
   errors.push(`${paths.rootPkg} must wire ${script} exactly`);
  }
 }
 for (const marker of [
  "tests/champagne-critical-first-paint.spec.ts",
  "tests/champagne-surface-semantics.spec.ts",
  "tests/hero-v2-navigation-continuity.spec.ts",
  "critical-paint-generated",
  "tests/champagne-critical-first-paint-generator.test.mjs",
  "git diff --exit-code",
 ]) {
  if (!workflow.includes(marker)) errors.push(`${paths.workflow} missing verification ${marker}`);
 }
 const job = workflow.match(
  /\n  critical-paint-generated:\n([\s\S]*?)(?=\n  [a-zA-Z0-9_-]+:\n|$)/,
 )?.[1] ?? "";
 for (const action of [
  "actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2",
  "actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4.4.0",
 ]) {
  if (!job.includes(action)) {
   errors.push(`${paths.workflow} critical-paint-generated must pin ${action}`);
  }
 }
 if (/actions\/(?:checkout|setup-node)@v\d/.test(job)) {
  errors.push(`${paths.workflow} critical-paint-generated must not use mutable major-version tags`);
 }
 if (guardPkg?.scripts?.["guard:surface-semantics"] !== "node scripts/guard-surface-semantics.mjs") {
  errors.push("guard:surface-semantics script is not wired exactly");
 }
 if (!guardPkg?.scripts?.["guard:all"]?.includes("guard:surface-semantics")) {
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
  for (const sourceFile of [paths.material, paths.genCss, paths.genTs, paths.layout]) {
   if (read(sourceFile).toUpperCase().includes(candidate)) {
    errors.push(`prohibited Persian candidate ${candidate} found in ${sourceFile}`);
   }
  }
 }
 if (errors.length > 0) {
  console.error("❌ Surface semantics guard failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
  return;
 }
 console.log(
  "✅ Surface semantics guard passed: shared CSS parsing and complete material ownership remain deterministic.",
 );
}
const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) {
 main().catch((error) => {
  console.error(`❌ ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
 });
}
