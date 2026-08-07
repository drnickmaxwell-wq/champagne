import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import ts from "typescript";

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
    ".turbo",
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

const embeddedStyleExpressionPlaceholder = "var(--champagne-embedded-style-expression)";

export function unwrapStaticTypeScriptExpression(expression) {
  let current = expression;
  while (
    current &&
    (ts.isParenthesizedExpression(current) ||
      ts.isAsExpression(current) ||
      ts.isSatisfiesExpression(current) ||
      ts.isTypeAssertionExpression(current) ||
      ts.isNonNullExpression(current))
  ) {
    current = current.expression;
  }
  return current;
}

function embeddedStyleExpressionText(expression) {
  const normalized = unwrapStaticTypeScriptExpression(expression);
  if (!normalized) return "";
  if (ts.isStringLiteral(normalized) || ts.isNoSubstitutionTemplateLiteral(normalized)) {
    return normalized.text;
  }
  if (ts.isTemplateExpression(normalized)) {
    return normalized.templateSpans.reduce(
      (source, span) => source + embeddedStyleExpressionPlaceholder + span.literal.text,
      normalized.head.text,
    );
  }
  return embeddedStyleExpressionPlaceholder;
}

function jsxTagNameIsStyle(tagName) {
  return ts.isIdentifier(tagName) && tagName.text === "style";
}

function staticPropertyNameText(name) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name)) return name.text;
  if (!ts.isComputedPropertyName(name)) return undefined;
  const expression = unwrapStaticTypeScriptExpression(name.expression);
  return expression &&
    (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression))
    ? expression.text
    : undefined;
}

function dangerousStyleText(attributes) {
  const attribute = attributes.properties.find(
    (candidate) =>
      ts.isJsxAttribute(candidate) &&
      ts.isIdentifier(candidate.name) &&
      candidate.name.text === "dangerouslySetInnerHTML",
  );
  const expression = unwrapStaticTypeScriptExpression(
    attribute && attribute.initializer && ts.isJsxExpression(attribute.initializer)
      ? attribute.initializer.expression
      : undefined,
  );
  if (!expression || !ts.isObjectLiteralExpression(expression)) return undefined;
  const html = expression.properties.find(
    (candidate) =>
      ts.isPropertyAssignment(candidate) && staticPropertyNameText(candidate.name) === "__html",
  );
  return html && ts.isPropertyAssignment(html)
    ? embeddedStyleExpressionText(html.initializer)
    : undefined;
}

const jsxTextCookFactory = "__champagneCookJsxText";

function cookedJsxText(text, sourcePath, sourceFile, node) {
  const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  const provenance = `${sourcePath}:${position.line + 1}:${position.character + 1}`;
  let output;
  try {
    const result = ts.transpileModule(
      `const __champagneStyle = <style>${text}</style>;`,
      {
        compilerOptions: {
          jsx: ts.JsxEmit.React,
          jsxFactory: jsxTextCookFactory,
          target: ts.ScriptTarget.ESNext,
        },
        fileName: `${sourcePath}.champagne-jsx-text.tsx`,
        reportDiagnostics: true,
      },
    );
    const diagnostic = result.diagnostics?.[0];
    if (diagnostic) {
      throw new Error(ts.flattenDiagnosticMessageText(diagnostic.messageText, " "));
    }
    output = result.outputText;
  } catch (error) {
    throw new Error(
      `[EMBEDDED_STYLE_ENTITY_DECODE] ${provenance}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  const emitted = ts.createSourceFile(
    `${sourcePath}.champagne-jsx-text.js`,
    output,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS,
  );
  const statement = emitted.statements[0];
  const declaration =
    statement && ts.isVariableStatement(statement)
      ? statement.declarationList.declarations[0]
      : undefined;
  const call = declaration?.initializer;
  if (
    !call ||
    !ts.isCallExpression(call) ||
    !ts.isIdentifier(call.expression) ||
    call.expression.text !== jsxTextCookFactory ||
    call.arguments.length < 2 ||
    call.arguments.length > 3 ||
    !ts.isStringLiteral(call.arguments[0]) ||
    call.arguments[0].text !== "style"
  ) {
    throw new Error(
      `[EMBEDDED_STYLE_ENTITY_DECODE] ${provenance}: TypeScript emitted an unexpected JSX text shape`,
    );
  }
  if (call.arguments.length === 2) return "";
  const cooked = call.arguments[2];
  if (!ts.isStringLiteral(cooked)) {
    throw new Error(
      `[EMBEDDED_STYLE_ENTITY_DECODE] ${provenance}: TypeScript did not emit a static JSX text value`,
    );
  }
  return cooked.text;
}

function ordinaryStyleText(children, sourcePath, sourceFile) {
  return children
    .map((child) => {
      if (ts.isJsxText(child)) return cookedJsxText(child.text, sourcePath, sourceFile, child);
      if (ts.isJsxExpression(child)) return embeddedStyleExpressionText(child.expression);
      return embeddedStyleExpressionPlaceholder;
    })
    .join("");
}

export function extractEmbeddedStyleSources(source, sourcePath) {
  const scriptKind = sourcePath.endsWith(".jsx") ? ts.ScriptKind.JSX : ts.ScriptKind.TSX;
  const sourceFile = ts.createSourceFile(
    sourcePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    scriptKind,
  );
  const diagnostic = sourceFile.parseDiagnostics?.[0];
  if (diagnostic) {
    const position = sourceFile.getLineAndCharacterOfPosition(diagnostic.start ?? 0);
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, " ");
    throw new Error(
      `[EMBEDDED_STYLE_SOURCE_PARSE] ${sourcePath}:${position.line + 1}:${position.character + 1}: ${message}`,
    );
  }

  const styles = new Map();
  const record = (node, attributes, children) => {
    const dangerous = dangerousStyleText(attributes);
    const css =
      dangerous ?? (children ? ordinaryStyleText(children, sourcePath, sourceFile) : undefined);
    if (css === undefined) return;
    const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
    const provenance = `${sourcePath}:${position.line + 1}:${position.character + 1} <style>`;
    styles.set(provenance, css);
  };
  const visit = (node) => {
    if (ts.isJsxElement(node) && jsxTagNameIsStyle(node.openingElement.tagName)) {
      record(node, node.openingElement.attributes, node.children);
    } else if (ts.isJsxSelfClosingElement(node) && jsxTagNameIsStyle(node.tagName)) {
      record(node, node.attributes);
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return styles;
}

export function collectEmbeddedStyleSources(root, reportRoot = root) {
  let files;
  try {
    files = collectFiles(root, reportRoot, [".tsx", ".jsx"]).sort((left, right) =>
      left.localeCompare(right),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      message.replace("[SOURCE_SYMLINK_UNAPPROVED]", "[EMBEDDED_STYLE_SYMLINK_UNAPPROVED]"),
    );
  }
  const styles = new Map();
  for (const file of files) {
    const sourcePath = path.relative(reportRoot, file);
    for (const [provenance, css] of extractEmbeddedStyleSources(
      readFileSync(file, "utf8"),
      sourcePath,
    )) {
      styles.set(provenance, css);
    }
  }
  return styles;
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
