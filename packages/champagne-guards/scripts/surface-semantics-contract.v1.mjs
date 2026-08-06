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
export const RUNTIME_MUTATION_STATEMENT_LIMIT = 64 * 1024;
const PAYLOAD_ASSIGNMENT_OPERATORS = new Set(["=", "+=", "||=", "??=", "&&="]);
const CALL_CHANNELS = new Map([
  ["setProperty", "CSSStyleDeclaration.setProperty"],
  ["replace", "stylesheet-compatible mutation candidate"],
  ["replaceSync", "stylesheet-compatible mutation candidate"],
  ["insertRule", "stylesheet-compatible mutation candidate"],
  ["setAttribute", "style attribute mutation"],
]);
const ASSIGNMENT_CHANNELS = new Map([
  ["cssText", "style attribute/CSS payload mutation"],
  ["textContent", "generated style text"],
  ["innerText", "generated style text"],
  ["innerHTML", "generated style text"],
]);

function decodeJavascriptEscape(source, index) {
  const character = source[index];
  const simple = new Map([
    ["n", "\n"], ["r", "\r"], ["t", "\t"], ["b", "\b"],
    ["f", "\f"], ["v", "\v"], ["0", "\0"],
  ]);
  if (simple.has(character)) return { value: simple.get(character), end: index + 1 };
  if (character === "\n") return { value: "", end: index + 1 };
  if (character === "\r") return { value: "", end: source[index + 1] === "\n" ? index + 2 : index + 1 };
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
  let dynamic = false;
  let index = start + 1;
  let interpolationDepth = 0;
  while (index < source.length) {
    const character = source[index];
    const next = source[index + 1];
    if (character === "\\") {
      if (index + 1 >= source.length) throw new Error("unterminated JavaScript escape");
      const decoded = decodeJavascriptEscape(source, index + 1);
      if (!dynamic || interpolationDepth === 0) value += decoded.value;
      index = decoded.end;
      continue;
    }
    if (quote === "`" && interpolationDepth === 0 && character === "$" && next === "{") {
      dynamic = true;
      interpolationDepth = 1;
      index += 2;
      continue;
    }
    if (quote === "`" && interpolationDepth > 0) {
      if (character === '"' || character === "'" || character === "`") {
        const nested = readJavascriptLiteral(source, index);
        if (!nested) throw new Error("unable to parse nested JavaScript literal");
        index = nested.end;
        continue;
      }
      if (character === "/" && next === "/") {
        const newline = source.indexOf("\n", index + 2);
        index = newline < 0 ? source.length : newline + 1;
        continue;
      }
      if (character === "/" && next === "*") {
        const close = source.indexOf("*/", index + 2);
        if (close < 0) throw new Error("unterminated JavaScript comment");
        index = close + 2;
        continue;
      }
      if (character === "{") interpolationDepth += 1;
      else if (character === "}") interpolationDepth -= 1;
      index += 1;
      continue;
    }
    if (character === quote) return { value, start, end: index + 1, dynamic };
    if ((quote === '"' || quote === "'") && (character === "\n" || character === "\r")) {
      throw new Error("unterminated JavaScript string");
    }
    value += character;
    index += 1;
  }
  throw new Error("unterminated JavaScript string");
}

function isIdentifierStart(character) {
  return /[A-Za-z_$]/.test(character ?? "");
}
function isIdentifierPart(character) {
  return /[A-Za-z0-9_$]/.test(character ?? "");
}
function readJavascriptIdentifier(source, start) {
  let index = start;
  let value = "";
  let first = true;
  while (index < source.length) {
    const character = source[index];
    if ((first ? isIdentifierStart(character) : isIdentifierPart(character))) {
      value += character;
      index += 1;
      first = false;
      continue;
    }
    if (character === "\\" && source[index + 1] === "u") {
      const decoded = decodeJavascriptEscape(source, index + 1);
      const valid = first ? isIdentifierStart(decoded.value) : isIdentifierPart(decoded.value);
      if (!valid) break;
      value += decoded.value;
      index = decoded.end;
      first = false;
      continue;
    }
    break;
  }
  return first ? null : { value, end: index };
}
function closesControlHeader(tokens) {
  if (tokens.at(-1)?.value !== ")") return false;
  let depth = 0;
  for (let index = tokens.length - 1; index >= 0; index -= 1) {
    if (tokens[index].value === ")") depth += 1;
    else if (tokens[index].value === "(") {
      depth -= 1;
      if (depth === 0) {
        return new Set(["if", "while", "for", "with", "switch", "catch"]).has(
          tokens[index - 1]?.value,
        );
      }
    }
  }
  return false;
}
function regexCanStartAfter(tokens) {
  const previous = tokens.at(-1);
  if (!previous) return true;
  if (previous.type === "identifier") {
    return new Set([
      "return", "throw", "case", "delete", "void", "typeof", "yield", "await",
      "else", "do", "in", "of", "instanceof",
    ]).has(previous.value);
  }
  if (previous.type === "string" || previous.type === "number" || previous.type === "regex") {
    return false;
  }
  if (previous.value === ")") return closesControlHeader(tokens);
  if (["]", "++", "--"].includes(previous.value)) return false;
  return true;
}
function skipRegexLiteral(source, start) {
  let index = start + 1;
  let escaped = false;
  let inClass = false;
  while (index < source.length) {
    const character = source[index];
    if (character === "\n" || character === "\r") return null;
    if (escaped) { escaped = false; index += 1; continue; }
    if (character === "\\") { escaped = true; index += 1; continue; }
    if (character === "[") inClass = true;
    else if (character === "]") inClass = false;
    else if (character === "/" && !inClass) {
      index += 1;
      while (/[A-Za-z]/.test(source[index] ?? "")) index += 1;
      return index;
    }
    index += 1;
  }
  return null;
}

function tokenizeJavascript(source) {
  const tokens = [];
  let index = 0;
  let parenDepth = 0;
  let bracketDepth = 0;
  let braceDepth = 0;
  const push = (type, value, start, end, extra = {}) => {
    tokens.push({ type, value, start, end, parenDepth, bracketDepth, braceDepth, ...extra });
  };
  const operators = [
    ">>>=", "**=", "??=", "||=", "&&=", "===", "!==", ">>>", "<<=", ">>=",
    "?.", "=>", "==", "!=", "<=", ">=", "++", "--", "+=", "-=", "*=", "/=",
    "%=", "&=", "|=", "^=", "**", "??", "||", "&&", "<<", ">>", "...",
  ];
  while (index < source.length) {
    const character = source[index];
    const next = source[index + 1];
    if (/\s/.test(character)) { index += 1; continue; }
    if (character === "/" && next === "/") {
      const newline = source.indexOf("\n", index + 2);
      index = newline < 0 ? source.length : newline + 1;
      continue;
    }
    if (character === "/" && next === "*") {
      const close = source.indexOf("*/", index + 2);
      if (close < 0) throw new Error("unterminated JavaScript comment");
      index = close + 2;
      continue;
    }
    const literal = readJavascriptLiteral(source, index);
    if (literal) {
      push("string", literal.value, index, literal.end, { dynamic: literal.dynamic });
      index = literal.end;
      continue;
    }
    const identifier = readJavascriptIdentifier(source, index);
    if (identifier) {
      push("identifier", identifier.value, index, identifier.end);
      index = identifier.end;
      continue;
    }
    if (/[0-9]/.test(character)) {
      let end = index + 1;
      while (/[0-9A-Za-z_.]/.test(source[end] ?? "")) end += 1;
      push("number", source.slice(index, end), index, end);
      index = end;
      continue;
    }
    if (character === "/" && regexCanStartAfter(tokens)) {
      const end = skipRegexLiteral(source, index);
      if (end) {
        push("regex", source.slice(index, end), index, end);
        index = end;
        continue;
      }
    }
    const operator = operators.find((candidate) => source.startsWith(candidate, index));
    if (operator) {
      push("punctuator", operator, index, index + operator.length);
      index += operator.length;
      continue;
    }
    push("punctuator", character, index, index + 1);
    if (character === "(") parenDepth += 1;
    else if (character === ")") parenDepth = Math.max(0, parenDepth - 1);
    else if (character === "[") bracketDepth += 1;
    else if (character === "]") bracketDepth = Math.max(0, bracketDepth - 1);
    else if (character === "{") braceDepth += 1;
    else if (character === "}") braceDepth = Math.max(0, braceDepth - 1);
    index += 1;
  }
  return tokens;
}

function parseStaticStringExpression(tokens, start) {
  const first = tokens[start];
  if (!first || first.type !== "string" || first.dynamic) return null;
  let value = first.value;
  let endIndex = start;
  while (tokens[endIndex + 1]?.value === "+") {
    const next = tokens[endIndex + 2];
    if (!next || next.type !== "string" || next.dynamic) break;
    value += next.value;
    endIndex += 2;
  }
  return { value, startToken: start, endToken: endIndex };
}

function staticMemberAt(tokens, index) {
  const opener = tokens[index];
  if (!opener) return null;
  if ((opener.value === "." || opener.value === "?.") && tokens[index + 1]?.type === "identifier") {
    return { property: tokens[index + 1].value, startToken: index, endToken: index + 1 };
  }
  let bracketIndex = index;
  if (opener.value === "?." && tokens[index + 1]?.value === "[") bracketIndex = index + 1;
  if (tokens[bracketIndex]?.value !== "[") return null;
  const property = tokens[bracketIndex + 1];
  const close = tokens[bracketIndex + 2];
  if (property?.type !== "string" || property.dynamic || close?.value !== "]") return null;
  return { property: property.value, startToken: index, endToken: bracketIndex + 2 };
}

function callOpenAt(tokens, index) {
  if (tokens[index]?.value === "(") return { openToken: index };
  if (tokens[index]?.value === "?." && tokens[index + 1]?.value === "(") return { openToken: index + 1 };
  return null;
}

function matchingToken(tokens, openIndex, openValue, closeValue) {
  let depth = 0;
  for (let index = openIndex; index < tokens.length; index += 1) {
    if (tokens[index].value === openValue) depth += 1;
    else if (tokens[index].value === closeValue) {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  return -1;
}

function callArguments(tokens, openIndex, closeIndex) {
  const args = [];
  let start = openIndex + 1;
  let paren = 0;
  let bracket = 0;
  let brace = 0;
  for (let index = start; index < closeIndex; index += 1) {
    const value = tokens[index].value;
    if (value === "(") paren += 1;
    else if (value === ")") paren -= 1;
    else if (value === "[") bracket += 1;
    else if (value === "]") bracket -= 1;
    else if (value === "{") brace += 1;
    else if (value === "}") brace -= 1;
    else if (value === "," && paren === 0 && bracket === 0 && brace === 0) {
      args.push([start, index]);
      start = index + 1;
    }
  }
  args.push([start, closeIndex]);
  return args;
}

function staticStringsInRange(tokens, start, end) {
  const strings = [];
  for (let index = start; index < end; index += 1) {
    const expression = parseStaticStringExpression(tokens, index);
    if (!expression) continue;
    strings.push(expression);
    index = expression.endToken;
  }
  return strings;
}

function statementEndFor(source, tokens, startToken, relevantEndToken, maxLength) {
  const start = tokens[startToken].start;
  const base = tokens[startToken];
  for (let index = relevantEndToken + 1; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token.end - start > maxLength) {
      throw new Error(`[RUNTIME_CANDIDATE_BOUND_EXCEEDED] candidate at offset ${start} exceeds ${maxLength} bytes before a complete boundary`);
    }
    if (
      token.value === ";" &&
      token.parenDepth <= base.parenDepth &&
      token.bracketDepth <= base.bracketDepth &&
      token.braceDepth <= base.braceDepth
    ) return token.end;
    if (
      token.value === "}" &&
      token.parenDepth <= base.parenDepth &&
      token.bracketDepth <= base.bracketDepth &&
      token.braceDepth <= base.braceDepth
    ) return token.start;
  }
  if (source.length - start > maxLength) {
    throw new Error(`[RUNTIME_CANDIDATE_BOUND_EXCEEDED] candidate at offset ${start} exceeds ${maxLength} bytes before a complete boundary`);
  }
  return source.length;
}

function isStyleObjectKey(tokens, index) {
  if (tokens[index]?.type !== "string" || tokens[index]?.dynamic || tokens[index + 1]?.value !== ":") return false;
  const searchStart = Math.max(0, index - 32);
  const prefix = tokens.slice(searchStart, index).map((token) => token.value);
  for (let cursor = prefix.length - 1; cursor >= 0; cursor -= 1) {
    if (prefix[cursor] === ";") break;
    if (prefix[cursor] === "style" && prefix[cursor + 1] === "=" && prefix[cursor + 2] === "{" && prefix[cursor + 3] === "{") return true;
    if (
      prefix[cursor] === "=" && prefix[cursor + 1] === "{" &&
      prefix.slice(Math.max(0, cursor - 2), cursor).some((value) => /style/i.test(value))
    ) return true;
  }
  return false;
}

export function scanStaticRuntimeMutations(source, { maxStatementLength = RUNTIME_MUTATION_STATEMENT_LIMIT } = {}) {
  if (typeof source !== "string") throw new TypeError("runtime source must be a string");
  const tokens = tokenizeJavascript(source);
  const mutations = [];
  for (let index = 0; index < tokens.length; index += 1) {
    const member = staticMemberAt(tokens, index);
    if (member) {
      const afterMember = member.endToken + 1;
      const call = callOpenAt(tokens, afterMember);
      const callChannel = CALL_CHANNELS.get(member.property);
      if (call && callChannel) {
        const closeToken = matchingToken(tokens, call.openToken, "(", ")");
        if (closeToken < 0) throw new Error(`[RUNTIME_SOURCE_PARSE] unterminated ${member.property} call`);
        const args = callArguments(tokens, call.openToken, closeToken);
        const staticArguments = args.map(([start, end]) => staticStringsInRange(tokens, start, end));
        const statementEnd = statementEndFor(source, tokens, member.startToken, closeToken, maxStatementLength);
        mutations.push({
          kind: "call",
          property: member.property,
          channel: callChannel,
          start: tokens[member.startToken].start,
          end: statementEnd,
          staticArguments,
        });
        index = member.endToken;
        continue;
      }
      const operator = tokens[afterMember]?.value;
      const assignmentChannel = ASSIGNMENT_CHANNELS.get(member.property);
      if (assignmentChannel && PAYLOAD_ASSIGNMENT_OPERATORS.has(operator)) {
        const relevantEnd = Math.min(tokens.length - 1, afterMember + 1);
        const statementEnd = statementEndFor(source, tokens, member.startToken, relevantEnd, maxStatementLength);
        const endTokenExclusive = tokens.findIndex((token) => token.start >= statementEnd);
        const payloadEnd = endTokenExclusive < 0 ? tokens.length : endTokenExclusive;
        const staticPayloads = staticStringsInRange(tokens, afterMember + 1, payloadEnd);
        mutations.push({
          kind: "assignment",
          property: member.property,
          operator,
          channel: assignmentChannel,
          start: tokens[member.startToken].start,
          end: statementEnd,
          staticPayloads,
        });
        index = member.endToken;
        continue;
      }
    }
    if (isStyleObjectKey(tokens, index)) {
      mutations.push({
        kind: "style-object",
        property: tokens[index].value,
        channel: "style object",
        start: tokens[index].start,
        end: tokens[index].end,
        staticPayloads: [{ value: tokens[index].value, startToken: index, endToken: index }],
      });
    }
  }
  return { tokens, mutations };
}

export function runtimeMutationCandidateSources(runtimeSources, options) {
  const entries = runtimeSources instanceof Map ? [...runtimeSources.entries()] : runtimeSources;
  const candidates = new Map();
  for (const [file, source] of entries) {
    const { mutations } = scanStaticRuntimeMutations(source, options);
    mutations.forEach((mutation, index) => {
      const label = mutation.kind === "style-object" ? "style-object" : mutation.property;
      const candidate = mutation.kind === "style-object"
        ? `const materialStyle = {${JSON.stringify(mutation.property)}: "guard-probe"};`
        : source.slice(mutation.start, mutation.end);
      candidates.set(`${file}#${label}-${index}`, candidate);
    });
  }
  return candidates;
}


export function extractStaticJavascriptStrings(source) {
  if (typeof source !== "string") throw new TypeError("runtime source must be a string");
  const tokens = tokenizeJavascript(source);
  const strings = [];
  for (let index = 0; index < tokens.length; index += 1) {
    const expression = parseStaticStringExpression(tokens, index);
    if (!expression) continue;
    strings.push({
      value: expression.value,
      start: tokens[expression.startToken].start,
      end: tokens[expression.endToken].end,
    });
    index = expression.endToken;
  }
  return strings;
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

function protectedMutationNames(mutation, protectedTokens) {
  const found = new Set();
  if (mutation.kind === "style-object") {
    const name = decodeCssIdentifier(mutation.property.trim());
    if (protectedTokens.has(name)) found.add(name);
    return found;
  }
  if (mutation.kind === "call" && mutation.property === "setProperty") {
    for (const item of mutation.staticArguments[0] ?? []) {
      const name = decodeCssIdentifier(item.value.trim());
      if (protectedTokens.has(name)) found.add(name);
    }
    return found;
  }
  if (mutation.kind === "call" && mutation.property === "setAttribute") {
    const attributeNames = mutation.staticArguments[0] ?? [];
    if (!attributeNames.some((item) => item.value.trim().toLowerCase() === "style")) return found;
    for (const item of mutation.staticArguments[1] ?? []) {
      for (const name of protectedNamesInCssText(item.value, protectedTokens)) found.add(name);
    }
    return found;
  }
  const strings = mutation.kind === "call"
    ? mutation.staticArguments[0] ?? []
    : mutation.staticPayloads ?? [];
  for (const item of strings) {
    for (const name of protectedNamesInCssText(item.value, protectedTokens)) found.add(name);
  }
  return found;
}

export function staticRuntimeMutationErrors(runtimeSources, protectedTokens) {
  const issues = [];
  const entries = runtimeSources instanceof Map ? [...runtimeSources.entries()] : runtimeSources;
  for (const [file, source] of entries) {
    let scan;
    try {
      scan = scanStaticRuntimeMutations(source);
    } catch (error) {
      issues.push(
        `[RUNTIME_SOURCE_PARSE] ${file}: ${error instanceof Error ? error.message : String(error)}`,
      );
      continue;
    }
    for (const mutation of scan.mutations) {
      for (const token of protectedMutationNames(mutation, protectedTokens)) {
        issues.push(
          `[RUNTIME_TOKEN_MUTATION_UNAPPROVED] ${token}: ${mutation.channel} in ${file}`,
        );
      }
    }
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
      const cssNames = protectedNamesInCssText(item.value, protectedTokens);
      if (cssNames.size === 0) continue;
      const looksLikeCss = /@property|[{}:]|--[^\s]+\s*:/.test(item.value);
      if (!looksLikeCss) continue;
      const coveredByMutation = scan.mutations.some((mutation) =>
        mutation.start <= item.start && item.end <= mutation.end,
      );
      if (coveredByMutation) continue;
      for (const token of cssNames) {
        issues.push(`[RUNTIME_TOKEN_MUTATION_UNAPPROVED] ${token}: static CSS source in ${file}`);
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
