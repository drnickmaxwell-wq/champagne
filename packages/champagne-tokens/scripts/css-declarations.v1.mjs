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
  const input = source.includes("{") ? source : `:root{${source}}`;
  const declarations = [];
  let blockDepth = 0;
  let mode = "name";
  let name = "";
  let value = "";
  let quote = null;
  let escaped = false;
  let parenthesisDepth = 0;
  let bracketDepth = 0;
  let valueBraceDepth = 0;

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

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    const next = input[index + 1];
    const target = mode === "name" ? "name" : "value";

    if (quote) {
      if (target === "name") name += character;
      else value += character;
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = null;
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      if (target === "name") name += character;
      else value += character;
      continue;
    }
    if (character === "/" && next === "*") {
      const close = input.indexOf("*/", index + 2);
      if (close < 0) throw new Error("unterminated CSS comment");
      index = close + 1;
      continue;
    }

    if (blockDepth === 0) {
      if (character === "{") {
        blockDepth = 1;
        resetDeclaration();
      }
      continue;
    }

    if (mode === "name") {
      if (character === "(") parenthesisDepth += 1;
      else if (character === ")" && parenthesisDepth > 0) parenthesisDepth -= 1;
      else if (character === "[") bracketDepth += 1;
      else if (character === "]" && bracketDepth > 0) bracketDepth -= 1;

      if (character === "{" && parenthesisDepth === 0 && bracketDepth === 0) {
        blockDepth += 1;
        resetDeclaration();
      } else if (character === "}" && parenthesisDepth === 0 && bracketDepth === 0) {
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
    else if (character === ")" && parenthesisDepth > 0) parenthesisDepth -= 1;
    else if (character === "[") bracketDepth += 1;
    else if (character === "]" && bracketDepth > 0) bracketDepth -= 1;
    else if (character === "{") {
      const property = decodeCssIdentifier(name);
      if (!property.startsWith("--") && parenthesisDepth === 0 && bracketDepth === 0) {
        blockDepth += 1;
        resetDeclaration();
        continue;
      }
      valueBraceDepth += 1;
    } else if (character === "}" && valueBraceDepth > 0) valueBraceDepth -= 1;

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
      blockDepth -= 1;
    } else {
      value += character;
    }
  }
  if (quote) throw new Error("unterminated CSS string");
  if (blockDepth !== 0) throw new Error("unbalanced CSS block");
  return declarations;
}

export function parseCssDefinitions(source, token) {
  return parseCssDeclarations(source)
    .filter((declaration) => declaration.property === token)
    .map((declaration) => declaration.value);
}
