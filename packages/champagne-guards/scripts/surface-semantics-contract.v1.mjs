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
  own("--brand-gold", canonical.primitives, ["#D4AF37"]);
  own("--brand-gold-keyline", canonical.primitives, ["#F9E8C3"]);

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
