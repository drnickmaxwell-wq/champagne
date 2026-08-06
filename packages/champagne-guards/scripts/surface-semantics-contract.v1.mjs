import { readdirSync } from "node:fs";
import path from "node:path";

import {
  cssOwnerContractErrors,
  cssRegistrationContractErrors,
  decodeCssIdentifier,
  parseCssDeclarations,
  parseCssDefinitions,
  parseCssPropertyRegistrations,
} from "../../../packages/champagne-tokens/scripts/css-declarations.v1.mjs";

export {
  decodeCssIdentifier,
  parseCssDeclarations,
  parseCssDefinitions,
  parseCssPropertyRegistrations,
};

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

function collectFiles(root, reportRoot, extensions) {
  const ignored = new Set([
    "node_modules",
    ".next",
    "dist",
    "build",
    "coverage",
    ".git",
    "__tests__",
  ]);
  const files = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const file = path.join(root, entry.name);
    if (entry.isSymbolicLink()) {
      throw new Error(`[SOURCE_SYMLINK_UNAPPROVED] ${path.relative(reportRoot, file)}`);
    }
    if (ignored.has(entry.name)) continue;
    if (entry.isDirectory()) files.push(...collectFiles(file, reportRoot, extensions));
    else if (
      entry.isFile() &&
      extensions.some((extension) => entry.name.endsWith(extension)) &&
      !/\.(?:test|spec)\.[cm]?[jt]sx?$/.test(entry.name)
    ) {
      files.push(file);
    }
  }
  return files;
}

export function collectCssFiles(root, reportRoot = root) {
  try {
    return collectFiles(root, reportRoot, [".css"]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message.replace("[SOURCE_SYMLINK_UNAPPROVED]", "[CSS_SYMLINK_UNAPPROVED]"));
  }
}

export function collectRuntimeSourceFiles(root, reportRoot = root) {
  return collectFiles(root, reportRoot, [".js", ".jsx", ".mjs", ".cjs", ".ts", ".tsx"]);
}

function sameOwnerValue(actual, expected) {
  if (/^#[0-9A-Fa-f]{6}$/.test(expected)) return actual.toUpperCase() === expected.toUpperCase();
  return actual === expected;
}

export function materialOwnerContract(materialSource, renderedMaterial) {
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
  return contract;
}

export function protectedMaterialTokens(materialSource, renderedMaterial) {
  return new Set(materialOwnerContract(materialSource, renderedMaterial).keys());
}

export function protectedRegistrationErrors(cssSources, protectedTokens) {
  return cssRegistrationContractErrors(cssSources, protectedTokens);
}

export function materialOwnershipErrors({ cssSources, materialSource, renderedMaterial }) {
  const contract = materialOwnerContract(materialSource, renderedMaterial);
  return [
    ...cssOwnerContractErrors(cssSources, contract, sameOwnerValue),
    ...cssRegistrationContractErrors(cssSources, new Set(contract.keys())),
  ];
}

function isJsWhitespace(character) {
  return /\s/.test(character ?? "");
}

function decodeJavascriptEscape(source, index) {
  const character = source[index];
  const simple = new Map([
    ["n", "\n"],
    ["r", "\r"],
    ["t", "\t"],
    ["b", "\b"],
    ["f", "\f"],
    ["v", "\v"],
    ["0", "\0"],
  ]);
  if (simple.has(character)) return { value: simple.get(character), end: index + 1 };
  if (character === "\n") return { value: "", end: index + 1 };
  if (character === "\r") {
    return { value: "", end: source[index + 1] === "\n" ? index + 2 : index + 1 };
  }
  if (character === "x") {
    const digits = source.slice(index + 1, index + 3);
    if (!/^[0-9A-Fa-f]{2}$/.test(digits)) throw new Error("invalid JavaScript hexadecimal escape");
    return { value: String.fromCodePoint(Number.parseInt(digits, 16)), end: index + 3 };
  }
  if (character === "u") {
    if (source[index + 1] === "{") {
      const close = source.indexOf("}", index + 2);
      if (close < 0) throw new Error("invalid JavaScript Unicode escape");
      const digits = source.slice(index + 2, close);
      if (!/^[0-9A-Fa-f]{1,6}$/.test(digits)) throw new Error("invalid JavaScript Unicode escape");
      return { value: String.fromCodePoint(Number.parseInt(digits, 16)), end: close + 1 };
    }
    const digits = source.slice(index + 1, index + 5);
    if (!/^[0-9A-Fa-f]{4}$/.test(digits)) throw new Error("invalid JavaScript Unicode escape");
    return { value: String.fromCodePoint(Number.parseInt(digits, 16)), end: index + 5 };
  }
  return { value: character, end: index + 1 };
}

function readJavascriptLiteral(source, start) {
  const quote = source[start];
  if (quote !== '"' && quote !== "'" && quote !== "`") return null;
  let value = "";
  let index = start + 1;
  while (index < source.length) {
    const character = source[index];
    if (character === quote) return { value, start, end: index + 1 };
    if (quote === "`" && character === "$" && source[index + 1] === "{") {
      return { value, start, end: index, dynamic: true };
    }
    if (character === "\\") {
      if (index + 1 >= source.length) throw new Error("unterminated JavaScript escape");
      const decoded = decodeJavascriptEscape(source, index + 1);
      value += decoded.value;
      index = decoded.end;
      continue;
    }
    if ((quote === '"' || quote === "'") && (character === "\n" || character === "\r")) {
      throw new Error("unterminated JavaScript string");
    }
    value += character;
    index += 1;
  }
  throw new Error("unterminated JavaScript string");
}

function skipJavascriptTrivia(source, start) {
  let index = start;
  while (index < source.length) {
    if (isJsWhitespace(source[index])) {
      index += 1;
      continue;
    }
    if (source[index] === "/" && source[index + 1] === "/") {
      const newline = source.indexOf("\n", index + 2);
      return newline < 0 ? source.length : skipJavascriptTrivia(source, newline + 1);
    }
    if (source[index] === "/" && source[index + 1] === "*") {
      const close = source.indexOf("*/", index + 2);
      if (close < 0) throw new Error("unterminated JavaScript comment");
      index = close + 2;
      continue;
    }
    break;
  }
  return index;
}

export function extractStaticJavascriptStrings(source) {
  if (typeof source !== "string") throw new TypeError("runtime source must be a string");
  const strings = [];
  for (let index = 0; index < source.length; index += 1) {
    if (source[index] === "/" && source[index + 1] === "/") {
      const newline = source.indexOf("\n", index + 2);
      if (newline < 0) break;
      index = newline;
      continue;
    }
    if (source[index] === "/" && source[index + 1] === "*") {
      const close = source.indexOf("*/", index + 2);
      if (close < 0) throw new Error("unterminated JavaScript comment");
      index = close + 1;
      continue;
    }
    const literal = readJavascriptLiteral(source, index);
    if (!literal) continue;
    if (!literal.dynamic) {
      let value = literal.value;
      let end = literal.end;
      let cursor = skipJavascriptTrivia(source, end);
      while (source[cursor] === "+") {
        cursor = skipJavascriptTrivia(source, cursor + 1);
        const next = readJavascriptLiteral(source, cursor);
        if (!next || next.dynamic) break;
        value += next.value;
        end = next.end;
        cursor = skipJavascriptTrivia(source, end);
      }
      strings.push({ value, start: literal.start, end });
      index = end - 1;
    } else {
      index = literal.end;
    }
  }
  return strings;
}

function staticMemberAccess(property) {
  return `(?:\\.\\s*${property}\\b|\\[\\s*(?:"${property}"|'${property}'|\`${property}\`)\\s*\\])`;
}

const assignmentOperator = "(?:\\?\\?=|\\|\\|=|&&=|\\*\\*=|>>>=|<<=|>>=|[+\\-*/%&|^]=|=(?!=|>))";
const staticStyleArgument = '(?:"style"|\'style\'|`style`)';

function runtimeChannelFor(source, item) {
  const before = source.slice(Math.max(0, item.start - 320), item.start);
  const after = source.slice(item.end, Math.min(source.length, item.end + 80));
  const hasBefore = (pattern) => new RegExp(`${pattern}\\s*$`).test(before);
  const setProperty = staticMemberAccess("setProperty");
  const replace = staticMemberAccess("replace");
  const replaceSync = staticMemberAccess("replaceSync");
  const insertRule = staticMemberAccess("insertRule");
  const textContent = staticMemberAccess("textContent");
  const innerText = staticMemberAccess("innerText");
  const innerHTML = staticMemberAccess("innerHTML");
  const cssText = staticMemberAccess("cssText");
  const setAttribute = staticMemberAccess("setAttribute");

  if (hasBefore(`${setProperty}\\s*\\(`)) return "CSSStyleDeclaration.setProperty";
  if (hasBefore(`(?:${replace}|${replaceSync}|${insertRule})\\s*\\(`)) {
    return "CSSStyleSheet mutation";
  }
  if (hasBefore(`(?:${textContent}|${innerText}|${innerHTML})\\s*${assignmentOperator}`)) {
    return "generated style text";
  }
  if (hasBefore(`${cssText}\\s*${assignmentOperator}`)) {
    return "style attribute/CSS payload mutation";
  }
  if (hasBefore(`${setAttribute}\\s*\\(\\s*${staticStyleArgument}\\s*,`)) {
    return "style attribute mutation";
  }
  if (/style\s*(?:=|:)\s*\{\{?[^{}]{0,160}$/.test(before) && /^\s*:/.test(after)) {
    return "React style object";
  }
  if (/(?:const|let|var)\s+\w*style\w*\s*=\s*\{[^{}]{0,160}$/i.test(before) && /^\s*:/.test(after)) {
    return "style object";
  }
  return null;
}

function protectedNamesInCssText(value, protectedTokens) {
  const found = new Set();
  let declarations = [];
  let registrations = [];
  try {
    declarations = parseCssDeclarations(value);
  } catch {
    // A malformed static CSS payload is still examined lexically below.
  }
  try {
    registrations = parseCssPropertyRegistrations(value);
  } catch {
    // A malformed static registration is still examined lexically below.
  }
  for (const declaration of declarations) {
    if (protectedTokens.has(declaration.property)) found.add(declaration.property);
  }
  for (const registration of registrations) {
    for (const name of [registration.property, registration.compactProperty]) {
      if (protectedTokens.has(name)) found.add(name);
    }
  }
  for (const token of protectedTokens) {
    if (value.includes(token)) found.add(token);
  }
  return found;
}

export function staticRuntimeMutationErrors(runtimeSources, protectedTokens) {
  const issues = [];
  const entries = runtimeSources instanceof Map ? [...runtimeSources.entries()] : runtimeSources;
  for (const [file, source] of entries) {
    let strings;
    try {
      strings = extractStaticJavascriptStrings(source);
    } catch (error) {
      issues.push(
        `[RUNTIME_SOURCE_PARSE] ${file}: ${error instanceof Error ? error.message : String(error)}`,
      );
      continue;
    }
    for (const item of strings) {
      const channel = runtimeChannelFor(source, item);
      const exactName = decodeCssIdentifier(item.value.trim());
      if (channel && protectedTokens.has(exactName)) {
        issues.push(`[RUNTIME_TOKEN_MUTATION_UNAPPROVED] ${exactName}: ${channel} in ${file}`);
        continue;
      }
      const cssNames = protectedNamesInCssText(item.value, protectedTokens);
      if (cssNames.size === 0) continue;
      const looksLikeCss = /@property|[{}:]|--[^\s]+\s*:/.test(item.value);
      if (channel || looksLikeCss) {
        for (const token of cssNames) {
          issues.push(
            `[RUNTIME_TOKEN_MUTATION_UNAPPROVED] ${token}: ${channel ?? "static CSS source"} in ${file}`,
          );
        }
      }
    }
  }
  return issues;
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
  if (count(layout, criticalImportText) !== 1) {
    issues.push(`${paths.layout} must import both generated paint outputs exactly once`);
  }
  if (!layout.includes('const CRITICAL_PAINT_RESOURCE = "champagne-critical-paint-v1";')) {
    issues.push(`[CRITICAL_STYLE_PLACEMENT] ${paths.layout} must name the unique React stylesheet resource`);
  }
  if (
    !/<style\s+href=\{CRITICAL_PAINT_RESOURCE\}\s+precedence="critical">\s*\{champagneCriticalPaintCss\}\s*<\/style>/.test(layout)
  ) {
    issues.push(
      `[CRITICAL_STYLE_PLACEMENT] ${paths.layout} must emit the generated React 19 stylesheet resource with critical precedence`,
    );
  }
  if (count(layout, "<Suspense") !== 0 || layout.includes("data-champagne-critical-fallback")) {
    issues.push(`[SSR_CONTENT_VISIBILITY] ${paths.layout} must not hide the whole page behind a streamed fallback`);
  }
  for (const marker of ["<Header />", '<main className="flex-1 px-6 py-10">', "{children}", "<Footer />"]) {
    if (!layout.includes(marker)) issues.push(`[SSR_CONTENT_VISIBILITY] ${paths.layout} missing direct SSR marker ${marker}`);
  }
  if (count(layout, 'style={champagneCriticalPaintDocumentStyle}') !== 2 || !layout.includes('<html lang="en" style={champagneCriticalPaintDocumentStyle}>')) {
    issues.push(`[CRITICAL_DOCUMENT_FALLBACK] ${paths.layout} must apply the generated document style to html and body`);
  }
  const documentStyle = { background: "var(--surface-canvas)", color: "var(--text-ink-high)" };
  if (JSON.stringify(rendered?.documentStyle) !== JSON.stringify(documentStyle)) {
    issues.push(`${paths.genTs} document style must paint through cascade-resolved variables without declaring inline token values`);
  }
  if (Object.keys(rendered?.documentStyle ?? {}).some((property) => property.startsWith("--"))) {
    issues.push(`${paths.genTs} document style must not override themeable custom properties inline`);
  }
  if (!genTs.includes("export const champagneCriticalPaintDocumentStyle = {")) issues.push(`${paths.genTs} must expose the generated document style`);
  if (/^\s*import\s/m.test(genTs) || /\brequire\s*\(|node:|readFile|writeFile/.test(genTs)) issues.push(`${paths.genTs} must remain leaf-pure`);
  if (tokenPkg?.exports?.["./critical-paint"]?.default !== "./src/critical-paint.generated.ts") issues.push(`${paths.tokenPkg} must expose the pure critical-paint subpath`);
  if (tokenPkg?.exports?.["."]?.default !== "./src/index.ts") issues.push(`${paths.tokenPkg} must preserve its root entry`);
  if (tokenPkg?.exports?.["./styles/*"] !== "./styles/*") issues.push(`${paths.tokenPkg} must preserve style subpath compatibility`);
  return issues;
}

export function workflowIntegrityErrors(workflow, workflowPath = ".github/workflows/verify.yml") {
  const issues = [];
  const actionLines = [...workflow.matchAll(/^\s*-?\s*uses:\s*([^\s#]+)(?:\s+#.*)?$/gm)].map((match) => match[1]);
  for (const reference of actionLines) {
    if (reference.startsWith("./")) continue;
    const at = reference.lastIndexOf("@");
    const ref = at >= 0 ? reference.slice(at + 1) : "";
    if (!/^[0-9a-f]{40}$/i.test(ref)) {
      issues.push(`[WORKFLOW_ACTION_NOT_PINNED] ${workflowPath}: ${reference}`);
    }
  }
  const job = workflow.match(
    /\n  critical-paint-generated:\n([\s\S]*?)(?=\n  [a-zA-Z0-9_-]+:\n|$)/,
  )?.[1] ?? "";
  if (!job) issues.push(`[WORKFLOW_PROTECTED_JOB] ${workflowPath}: critical-paint-generated is missing`);
  const protectedUses = [...job.matchAll(/^\s*-?\s*uses:\s*([^\s#]+)(?:\s+#.*)?$/gm)].map((match) => match[1]);
  const expectedUses = [
    "actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683",
    "actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020",
  ];
  if (JSON.stringify(protectedUses) !== JSON.stringify(expectedUses)) {
    issues.push(`[WORKFLOW_PROTECTED_JOB] ${workflowPath}: protected job action sequence must be exact and exclusive`);
  }
  if (/^\s*if\s*:/m.test(job)) {
    issues.push(`[WORKFLOW_PROTECTED_JOB] ${workflowPath}: protected job steps must not be conditional decoys`);
  }
  if (/uses:\s*\.\//.test(job)) {
    issues.push(`[WORKFLOW_PROTECTED_JOB] ${workflowPath}: protected job must not invoke local composite actions`);
  }
  if (/\b(?:git\s+(?:clone|checkout|fetch|reset)|curl|wget|Invoke-WebRequest|gh\s+api)\b/i.test(job)) {
    issues.push(`[WORKFLOW_PROTECTED_JOB] ${workflowPath}: protected job must not acquire or replace candidate source`);
  }
  const verifyJob = workflow.match(/\n  verify:\n([\s\S]*?)$/)?.[1] ?? "";
  if (!/needs:[\s\S]*?-\s+critical-paint-generated/.test(verifyJob)) {
    issues.push(`[WORKFLOW_VERDICT_GRAPH] ${workflowPath}: verify must depend on critical-paint-generated`);
  }
  return issues;
}
