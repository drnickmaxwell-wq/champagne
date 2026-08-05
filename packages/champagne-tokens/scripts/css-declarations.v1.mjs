function isCssNewline(character) {
  return character === "\n" || character === "\r" || character === "\f";
}

function isCssWhitespace(character) {
  return character === " " || character === "\t" || isCssNewline(character);
}

export function decodeCssIdentifier(value) {
  let result = "";
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (character !== "\\") {
      result += character;
      continue;
    }
    const next = value[index + 1];
    if (next === undefined) {
      result += "\uFFFD";
      continue;
    }
    if (next === "\n" || next === "\f") {
      index += 1;
      continue;
    }
    if (next === "\r") {
      index += value[index + 2] === "\n" ? 2 : 1;
      continue;
    }
    if (/[0-9A-Fa-f]/.test(next)) {
      let digits = "";
      let cursor = index + 1;
      while (
        cursor < value.length &&
        digits.length < 6 &&
        /[0-9A-Fa-f]/.test(value[cursor])
      ) {
        digits += value[cursor];
        cursor += 1;
      }
      let codePoint = Number.parseInt(digits, 16);
      if (
        codePoint === 0 ||
        codePoint > 0x10ffff ||
        (codePoint >= 0xd800 && codePoint <= 0xdfff)
      ) {
        codePoint = 0xfffd;
      }
      result += String.fromCodePoint(codePoint);
      if (/[\t\n\f\r ]/.test(value[cursor] ?? "")) {
        if (value[cursor] === "\r" && value[cursor + 1] === "\n") cursor += 1;
        cursor += 1;
      }
      index = cursor - 1;
      continue;
    }
    result += next;
    index += 1;
  }
  return result.trim();
}

export function parseCssDeclarations(source) {
  if (typeof source !== "string") throw new TypeError("CSS source must be a string");

  const declarations = [];
  let blockDepth = 1;
  let mode = "name";
  let name = "";
  let value = "";
  let quote = null;
  let escaped = false;
  let parenthesisDepth = 0;
  let bracketDepth = 0;
  let valueBraceDepth = 0;

  const append = (character) => {
    if (mode === "name") name += character;
    else value += character;
  };
  const resetDeclaration = () => {
    mode = "name";
    name = "";
    value = "";
    parenthesisDepth = 0;
    bracketDepth = 0;
    valueBraceDepth = 0;
  };
  const commitDeclaration = () => {
    const property = decodeCssIdentifier(name);
    if (property.startsWith("--")) declarations.push({ property, value: value.trim() });
    resetDeclaration();
  };
  const assertBalancedComponents = () => {
    if (parenthesisDepth !== 0 || bracketDepth !== 0 || valueBraceDepth !== 0) {
      throw new Error("unbalanced CSS component value");
    }
  };

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    const next = source[index + 1];

    if (quote) {
      if (escaped) {
        append(character);
        escaped = false;
        if (character === "\r" && next === "\n") {
          append(next);
          index += 1;
        }
        continue;
      }
      if (character === "\\") {
        append(character);
        escaped = true;
        continue;
      }
      if (character === quote) {
        append(character);
        quote = null;
        continue;
      }
      if (isCssNewline(character)) {
        append(" ");
        quote = null;
        if (character === "\r" && next === "\n") index += 1;
        continue;
      }
      append(character);
      continue;
    }

    if (character === '"' || character === "'") {
      quote = character;
      append(character);
      continue;
    }
    if (character === "/" && next === "*") {
      const close = source.indexOf("*/", index + 2);
      if (close < 0) throw new Error("unterminated CSS comment");
      index = close + 1;
      continue;
    }

    if (mode === "name") {
      if (character === "(") parenthesisDepth += 1;
      else if (character === ")") {
        if (parenthesisDepth === 0) throw new Error("unexpected CSS closing parenthesis");
        parenthesisDepth -= 1;
      } else if (character === "[") bracketDepth += 1;
      else if (character === "]") {
        if (bracketDepth === 0) throw new Error("unexpected CSS closing bracket");
        bracketDepth -= 1;
      }

      if (character === "{" && parenthesisDepth === 0 && bracketDepth === 0) {
        blockDepth += 1;
        resetDeclaration();
      } else if (character === "}" && parenthesisDepth === 0 && bracketDepth === 0) {
        if (blockDepth === 1) throw new Error("unexpected CSS closing block");
        blockDepth -= 1;
        resetDeclaration();
      } else if (character === ";" && parenthesisDepth === 0 && bracketDepth === 0) {
        resetDeclaration();
      } else if (character === ":" && parenthesisDepth === 0 && bracketDepth === 0) {
        mode = "value";
        parenthesisDepth = 0;
        bracketDepth = 0;
      } else {
        name += character;
      }
      continue;
    }

    if (character === "(") parenthesisDepth += 1;
    else if (character === ")") {
      if (parenthesisDepth === 0) throw new Error("unexpected CSS closing parenthesis");
      parenthesisDepth -= 1;
    } else if (character === "[") bracketDepth += 1;
    else if (character === "]") {
      if (bracketDepth === 0) throw new Error("unexpected CSS closing bracket");
      bracketDepth -= 1;
    } else if (character === "{") {
      const property = decodeCssIdentifier(name);
      if (!property.startsWith("--") && parenthesisDepth === 0 && bracketDepth === 0) {
        blockDepth += 1;
        resetDeclaration();
        continue;
      }
      valueBraceDepth += 1;
      value += character;
      continue;
    } else if (character === "}" && valueBraceDepth > 0) {
      valueBraceDepth -= 1;
      value += character;
      continue;
    }

    if (
      character === ";" &&
      parenthesisDepth === 0 &&
      bracketDepth === 0 &&
      valueBraceDepth === 0
    ) {
      commitDeclaration();
    } else if (
      character === "}" &&
      parenthesisDepth === 0 &&
      bracketDepth === 0 &&
      valueBraceDepth === 0
    ) {
      commitDeclaration();
      if (blockDepth === 1) throw new Error("unexpected CSS closing block");
      blockDepth -= 1;
    } else {
      value += character;
    }
  }

  if (quote) throw new Error("unterminated CSS string");
  if (escaped) throw new Error("unterminated CSS escape");
  assertBalancedComponents();
  if (blockDepth !== 1) throw new Error("unbalanced CSS block");
  if (mode === "value") commitDeclaration();
  return declarations;
}

export function parseCssDefinitions(source, token) {
  return parseCssDeclarations(source)
    .filter((declaration) => declaration.property === token)
    .map((declaration) => declaration.value);
}

function consumeCssComment(source, index) {
  const close = source.indexOf("*/", index + 2);
  if (close < 0) throw new Error("unterminated CSS comment");
  return close + 2;
}

function skipCssWhitespaceAndComments(source, start) {
  let index = start;
  while (index < source.length) {
    if (isCssWhitespace(source[index])) {
      index += 1;
      continue;
    }
    if (source[index] === "/" && source[index + 1] === "*") {
      index = consumeCssComment(source, index);
      continue;
    }
    break;
  }
  return index;
}

function readCssIdentifierToken(source, start) {
  let index = start;
  let raw = "";
  let ambiguous = false;
  while (index < source.length) {
    const character = source[index];
    if (character === "/" && source[index + 1] === "*") {
      ambiguous = true;
      index = consumeCssComment(source, index);
      continue;
    }
    if (isCssWhitespace(character) || character === "{" || character === ";") break;
    if (character === "\\") {
      raw += character;
      index += 1;
      if (index >= source.length) throw new Error("unterminated CSS escape");
      if (/[0-9A-Fa-f]/.test(source[index])) {
        let count = 0;
        while (index < source.length && count < 6 && /[0-9A-Fa-f]/.test(source[index])) {
          raw += source[index];
          index += 1;
          count += 1;
        }
        if (isCssWhitespace(source[index] ?? "")) {
          raw += source[index];
          if (source[index] === "\r" && source[index + 1] === "\n") {
            raw += source[index + 1];
            index += 1;
          }
          index += 1;
        }
        continue;
      }
      raw += source[index];
      index += 1;
      continue;
    }
    raw += character;
    index += 1;
  }
  return { raw, end: index, ambiguous };
}

function findMatchingCssBlock(source, openIndex) {
  let depth = 1;
  let quote = null;
  let escaped = false;
  for (let index = openIndex + 1; index < source.length; index += 1) {
    const character = source[index];
    const next = source[index + 1];
    if (quote) {
      if (escaped) {
        escaped = false;
        if (character === "\r" && next === "\n") index += 1;
        continue;
      }
      if (character === "\\") {
        escaped = true;
        continue;
      }
      if (character === quote) {
        quote = null;
        continue;
      }
      if (isCssNewline(character)) {
        quote = null;
        if (character === "\r" && next === "\n") index += 1;
      }
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }
    if (character === "/" && next === "*") {
      index = consumeCssComment(source, index) - 1;
      continue;
    }
    if (character === "{") depth += 1;
    else if (character === "}") {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  throw new Error("unbalanced CSS @property block");
}

export function parseCssPropertyRegistrations(source) {
  if (typeof source !== "string") throw new TypeError("CSS source must be a string");
  const registrations = [];
  let quote = null;
  let escaped = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    const next = source[index + 1];
    if (quote) {
      if (escaped) {
        escaped = false;
        if (character === "\r" && next === "\n") index += 1;
        continue;
      }
      if (character === "\\") {
        escaped = true;
        continue;
      }
      if (character === quote) quote = null;
      else if (isCssNewline(character)) {
        quote = null;
        if (character === "\r" && next === "\n") index += 1;
      }
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }
    if (character === "/" && next === "*") {
      index = consumeCssComment(source, index) - 1;
      continue;
    }
    if (character !== "@") continue;

    const keywordToken = readCssIdentifierToken(source, index + 1);
    const keyword = decodeCssIdentifier(keywordToken.raw).toLowerCase();
    if (keyword !== "property") continue;

    let cursor = skipCssWhitespaceAndComments(source, keywordToken.end);
    const nameToken = readCssIdentifierToken(source, cursor);
    const property = decodeCssIdentifier(nameToken.raw);
    const compactProperty = decodeCssIdentifier(nameToken.raw.replace(/\/\*[\s\S]*?\*\//g, ""));
    cursor = skipCssWhitespaceAndComments(source, nameToken.end);
    if (source[cursor] !== "{") {
      throw new Error(`malformed CSS @property registration for ${property || compactProperty || "unknown"}`);
    }
    const close = findMatchingCssBlock(source, cursor);
    registrations.push({
      property,
      compactProperty,
      ambiguous: keywordToken.ambiguous || nameToken.ambiguous,
      block: source.slice(cursor + 1, close),
    });
    index = close;
  }

  if (quote) throw new Error("unterminated CSS string");
  if (escaped) throw new Error("unterminated CSS escape");
  return registrations;
}

export function cssOwnerContractErrors(cssSources, contract, sameValue = (actual, expected) => actual === expected) {
  const issues = [];
  const entries = cssSources instanceof Map ? [...cssSources.entries()] : cssSources;
  const parsed = new Map();
  for (const [file, source] of entries) {
    try {
      parsed.set(file, parseCssDeclarations(source));
    } catch (error) {
      issues.push(
        `[CSS_DECLARATION_PARSE] ${file}: ${error instanceof Error ? error.message : String(error)}`,
      );
      parsed.set(file, []);
    }
  }

  for (const [token, owners] of contract) {
    if (owners.some(({ values }) => values.some((value) => !value))) {
      issues.push(`[MATERIAL_OWNER_UNAPPROVED] ${token}: canonical expected value is unavailable`);
      continue;
    }
    const allowed = new Set(owners.map(({ file }) => file));
    const actual = [];
    for (const [file, declarations] of parsed) {
      for (const declaration of declarations) {
        if (declaration.property === token) actual.push({ file, value: declaration.value });
      }
    }
    const expectedCount = owners.reduce((total, owner) => total + owner.values.length, 0);
    if (actual.length !== expectedCount) {
      issues.push(
        `[MATERIAL_OWNER_UNAPPROVED] ${token}: expected ${expectedCount} canonical owner(s), found ${actual.length}`,
      );
    }
    for (const occurrence of actual) {
      if (!allowed.has(occurrence.file)) {
        issues.push(`[MATERIAL_OWNER_UNAPPROVED] ${token}: competing owner in ${occurrence.file}`);
      }
    }
    for (const owner of owners) {
      const values = actual.filter(({ file }) => file === owner.file).map(({ value }) => value);
      if (
        values.length !== owner.values.length ||
        values.some((value, index) => !sameValue(value, owner.values[index]))
      ) {
        issues.push(
          `[MATERIAL_OWNER_UNAPPROVED] ${token}: ${owner.file} must own exactly ${owner.values.join(", ")}`,
        );
      }
    }
  }
  return issues;
}

export function cssRegistrationContractErrors(cssSources, protectedTokens) {
  const issues = [];
  const entries = cssSources instanceof Map ? [...cssSources.entries()] : cssSources;
  for (const [file, source] of entries) {
    let registrations;
    try {
      registrations = parseCssPropertyRegistrations(source);
    } catch (error) {
      issues.push(
        `[CSS_REGISTRATION_PARSE] ${file}: ${error instanceof Error ? error.message : String(error)}`,
      );
      continue;
    }
    for (const registration of registrations) {
      const candidates = new Set([registration.property, registration.compactProperty]);
      for (const token of candidates) {
        if (!protectedTokens.has(token)) continue;
        issues.push(
          `[MATERIAL_REGISTRATION_UNAPPROVED] ${token}: @property registration in ${file}${registration.ambiguous ? " (ambiguous spelling)" : ""}`,
        );
        break;
      }
    }
  }
  return issues;
}
