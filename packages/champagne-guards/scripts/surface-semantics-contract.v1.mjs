import { readdirSync } from "node:fs";
import path from "node:path";

import {
  cssOwnerContractErrors,
  parseCssDeclarations,
  parseCssDefinitions,
} from "../../../packages/champagne-tokens/scripts/css-declarations.v1.mjs";

export { parseCssDeclarations, parseCssDefinitions };

const canonical = {
  primitives: "packages/champagne-tokens/styles/tokens/smh-champagne-tokens.css",
  tokens: "packages/champagne-tokens/styles/champagne/tokens.css",
  generated: "packages/champagne-tokens/styles/champagne/canvas-material.generated.css",
  timeOfDay: "packages/champagne-tokens/styles/champagne/time-of-day.css",
};
const timeOwners = [
  ["dawn", "color-mix(in srgb, var(--brand-teal) 15%, white)"],
  ["dusk", "var(--ink-100)"],
  ["night", "var(--ink-100)"],
];
const exactTimeOfDayCss = `:root[data-theme='dawn'] {
  --surface-canvas: color-mix(in srgb, var(--brand-teal) 15%, white);
}

:root[data-theme='dusk'] {
  --surface-canvas: var(--ink-100);
}

:root[data-theme='night'] {
  --surface-canvas: var(--ink-100);
}
`;

export function timeOfDayCanvasOwnerErrors(source) {
  const issues = [];
  try {
    const expected = timeOwners.map(([, value]) => value);
    const actual = parseCssDefinitions(source, "--surface-canvas");
    if (actual.length !== expected.length || actual.some((value, index) => value !== expected[index])) {
      issues.push(
        `[TIME_OF_DAY_CANVAS_OWNERS] expected exactly ${expected.join(", ")}; found ${actual.join(", ") || "none"}`,
      );
    }
    if (parseCssDefinitions(source, "--bg-ink").length !== 0) {
      issues.push("[TIME_OF_DAY_CANVAS_OWNERS] time-of-day themes must not override --bg-ink");
    }
    if (source !== exactTimeOfDayCss) {
      issues.push(
        "[TIME_OF_DAY_CANVAS_OWNERS] file bytes must preserve only the three exact approved selector owners",
      );
    }
  } catch (error) {
    issues.push(
      `[TIME_OF_DAY_CANVAS_OWNERS] unable to parse: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  return issues;
}

export function collectCssFiles(root, reportRoot = root) {
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

function sameOwnerValue(actual, expected) {
  if (/^#[0-9A-Fa-f]{6}$/.test(expected)) return actual.toUpperCase() === expected.toUpperCase();
  return actual === expected;
}

export function materialOwnershipErrors({ cssSources, materialSource, renderedMaterial }) {
  const contract = new Map();
  const own = (token, file, values) => contract.set(token, [{ file, values }]);
  for (const node of materialSource?.nodes ?? []) {
    if (node?.type === "literal") own(node.token, canonical.primitives, [node.value]);
  }
  own("--brand-gold", canonical.primitives, [["#", "D4", "AF", "37"].join("")]);
  own("--brand-gold-keyline", canonical.primitives, [["#", "F9", "E8", "C3"].join("")]);

  const generated = new Map([
    ["--smh-ink-navy", renderedMaterial?.loadedCanvas],
    ["--brand-ink", "var(--smh-ink-navy)"],
    ["--surface-canvas", "var(--brand-ink)"],
    ["--bg-ink", "var(--surface-canvas)"],
    ["--text-ink-high", renderedMaterial?.loadedForeground],
  ]);
  for (const [token, value] of generated) {
    const owners = [{ file: canonical.generated, values: [value] }];
    if (token === "--surface-canvas") {
      owners.push({ file: canonical.timeOfDay, values: timeOwners.map(([, item]) => item) });
    }
    contract.set(token, owners);
  }
  own("--ink-100", canonical.tokens, ["var(--ink)"]);
  return cssOwnerContractErrors(cssSources, contract, sameOwnerValue);
}

function blockFor(source, selector) {
  const start = source.indexOf(selector);
  if (start < 0) return "";
  const open = source.indexOf("{", start);
  const close = source.indexOf("}", open + 1);
  return open >= 0 && close >= 0 ? source.slice(open + 1, close) : "";
}
function count(source, needle) { return source.split(needle).length - 1; }

export function themeAndLayoutContractErrors({ theme, layout, genTs, rendered, tokenPkg, paths }) {
  const issues = [];
  for (const [label, selector] of [
    ["porcelain", "[data-surface-tone='porcelain']"],
    ["ink", "[data-surface-tone='ink']"],
  ]) {
    const block = blockFor(theme, selector);
    for (const suffix of ["high", "medium", "low"]) {
      const expected = `--text-${label}-${suffix}`;
      if (!block.includes(`--text-${suffix}: var(${expected})`)) {
        issues.push(`${label} context must bind --text-${suffix} to ${expected}`);
      }
    }
    if (!/color\s*:\s*var\(--text-high\)\s*;/.test(block)) {
      issues.push(`${label} context must reapply color through --text-high`);
    }
  }
  if (!/:root\s*{[\s\S]*?background\s*:\s*var\(--surface-canvas\)\s*;/.test(theme)) {
    issues.push(":root must paint --surface-canvas");
  }
  if (!/body,\s*\n?\.champagne-page\s*{[\s\S]*?background\s*:\s*var\(--surface-canvas\)\s*;/.test(theme)) {
    issues.push("body and .champagne-page must paint --surface-canvas");
  }
  const criticalImportText = `import {
  champagneCriticalPaintCss,
  champagneCriticalPaintDocumentStyle,
} from "../../../packages/champagne-tokens/src/critical-paint.generated";`;
  const headMarkup = `<head>
        <style
          data-champagne-critical-paint="v1"
          dangerouslySetInnerHTML={{ __html: champagneCriticalPaintCss }}
        />
      </head>`;
  if (count(layout, criticalImportText) !== 1) {
    issues.push(`${paths.layout} must import both generated paint outputs exactly once`);
  }
  if (!layout.includes(headMarkup) || count(layout, 'data-champagne-critical-paint="v1"') !== 1) {
    issues.push(`[CRITICAL_STYLE_PLACEMENT] ${paths.layout} must emit one unconditional marked critical style directly inside head`);
  }
  if (count(layout, 'style={champagneCriticalPaintDocumentStyle}') !== 2 || !layout.includes('<html lang="en" style={champagneCriticalPaintDocumentStyle}>')) {
    issues.push(`[CRITICAL_DOCUMENT_FALLBACK] ${paths.layout} must apply the generated document style to html and body`);
  }
  for (const marker of [
    "const CRITICAL_PAINT_FALLBACK_STYLE = {",
    "...champagneCriticalPaintDocumentStyle",
    "<Suspense",
    'data-champagne-critical-fallback="v1"',
    "style={CRITICAL_PAINT_FALLBACK_STYLE}",
  ]) {
    if (!layout.includes(marker)) issues.push(`[CRITICAL_STREAMING_FALLBACK] ${paths.layout} missing marker ${marker}`);
  }
  const documentStyle = { background: "var(--surface-canvas)", color: "var(--text-ink-high)" };
  if (JSON.stringify(rendered?.documentStyle) !== JSON.stringify(documentStyle)) {
    issues.push(`${paths.genTs} document style must paint through cascade-resolved variables without declaring inline token values`);
  }
  if (Object.keys(rendered?.documentStyle ?? {}).some((property) => property.startsWith("--"))) {
    issues.push(`${paths.genTs} document style must not override themeable custom properties inline`);
  }
  if (!genTs.includes("export const champagneCriticalPaintDocumentStyle = {")) issues.push(`${paths.genTs} must expose the generated streaming fallback`);
  if (/^\s*import\s/m.test(genTs) || /\brequire\s*\(|node:|readFile|writeFile/.test(genTs)) issues.push(`${paths.genTs} must remain leaf-pure`);
  if (tokenPkg?.exports?.["./critical-paint"]?.default !== "./src/critical-paint.generated.ts") issues.push(`${paths.tokenPkg} must expose the pure critical-paint subpath`);
  if (tokenPkg?.exports?.["."]?.default !== "./src/index.ts") issues.push(`${paths.tokenPkg} must preserve its root entry`);
  if (tokenPkg?.exports?.["./styles/*"] !== "./styles/*") issues.push(`${paths.tokenPkg} must preserve style subpath compatibility`);
  return issues;
}
