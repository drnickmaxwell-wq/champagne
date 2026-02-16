const PROHIBITED_PATTERNS: Array<{ pattern: RegExp; replacement: string }> = [
  { pattern: /\bGreat question!?\s*/gi, replacement: "" },
  { pattern: /\bAbsolutely!?\s*/gi, replacement: "Yes. " },
  { pattern: /\bDon['’]?t worry\b[,.!\s]*/gi, replacement: "It is understandable to have concerns. " },
];

const STRICT_REJECTION_PATTERNS: RegExp[] = [
  /[\p{Extended_Pictographic}]/u,
  /!{2,}/,
];

type FormatConciergeResponseOptions = {
  prompt?: string;
};

function normalizeWhitespace(value: string): string {
  return value.replace(/\r\n/g, "\n").replace(/[\t ]+/g, " ").trim();
}

function sanitizeLanguage(rawOutput: string): string {
  const withoutEmoji = rawOutput.replace(/[\p{Extended_Pictographic}]/gu, "");

  const sanitized = PROHIBITED_PATTERNS.reduce((content, rule) => {
    return content.replace(rule.pattern, rule.replacement);
  }, withoutEmoji);

  return sanitized.replace(/!/g, ".").replace(/\s{2,}/g, " ").trim();
}

function containsStrictViolations(content: string): boolean {
  return STRICT_REJECTION_PATTERNS.some((pattern) => pattern.test(content));
}

function splitSentences(content: string): string[] {
  return content
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function resolveOrientationLine(content: string, prompt?: string): { orientationLine: string; remaining: string } {
  const sentences = splitSentences(content);

  if (sentences.length > 0) {
    const [firstSentence, ...rest] = sentences;
    const orientationLine = firstSentence.endsWith(".") ? firstSentence : `${firstSentence}.`;
    const remaining = rest.join(" ").trim();
    return { orientationLine, remaining };
  }

  const promptHint = typeof prompt === "string" ? prompt.toLowerCase() : "";

  if (/cost|price|fee|payment/.test(promptHint)) {
    return {
      orientationLine: "On cost, the most accurate answer depends on treatment scope and clinical findings.",
      remaining: "",
    };
  }

  if (/process|step|timeline|recovery/.test(promptHint)) {
    return {
      orientationLine: "On process, the plan follows a defined sequence from assessment to follow-up.",
      remaining: "",
    };
  }

  if (/fear|anx|nervous|pain/.test(promptHint)) {
    return {
      orientationLine: "On comfort, we can adapt the pace and support strategy to your tolerance.",
      remaining: "",
    };
  }

  return {
    orientationLine: "Here is a structured clinical summary based on your question.",
    remaining: "",
  };
}

function toParagraphs(content: string): string[] {
  const sentences = splitSentences(content);

  if (sentences.length === 0) {
    return ["I can provide a more precise answer once you share one key goal and your timeframe."];
  }

  const targetParagraphCount = Math.min(4, Math.max(2, Math.ceil(sentences.length / 2)));
  const chunkSize = Math.max(1, Math.ceil(sentences.length / targetParagraphCount));
  const paragraphs: string[] = [];

  for (let index = 0; index < sentences.length; index += chunkSize) {
    paragraphs.push(sentences.slice(index, index + chunkSize).join(" "));
  }

  return paragraphs.slice(0, 4);
}

function shouldAddClarifyingVariable(prompt: string | undefined, content: string): boolean {
  const combined = `${prompt ?? ""} ${content}`.toLowerCase();
  return /\b(depends|vary|based on|if |when |typically|may |can )\b/.test(combined);
}

export function formatConciergeResponse(rawOutput: string, options: FormatConciergeResponseOptions = {}): string {
  const cleaned = sanitizeLanguage(normalizeWhitespace(rawOutput));

  if (containsStrictViolations(cleaned)) {
    throw new Error("Response contains prohibited language patterns");
  }

  const { orientationLine, remaining } = resolveOrientationLine(cleaned, options.prompt);
  const explanationParagraphs = toParagraphs(remaining);

  const sections = [orientationLine, ...explanationParagraphs];

  if (shouldAddClarifyingVariable(options.prompt, cleaned)) {
    sections.push(
      "A key variable is your clinical history and treatment priorities, which can change the exact recommendation.",
    );
  }

  sections.push("Next step: share your primary goal and timing, and I will map the most appropriate path.");

  return sections.join("\n\n");
}
