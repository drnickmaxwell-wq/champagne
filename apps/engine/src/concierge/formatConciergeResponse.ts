type FormatConciergeResponseOptions = {
  prompt?: string;
};

const GENERIC_ASSISTANT_PHRASES: Array<{ pattern: RegExp; replacement: string }> = [
  { pattern: /\bGreat question!?\s*/gi, replacement: "" },
  { pattern: /\bAbsolutely!?\s*/gi, replacement: "" },
  { pattern: /\bDon['’]?t worry\b[,.!\s]*/gi, replacement: "It is understandable to have concerns. " },
  { pattern: /\bI('m| am) happy to help\b[,.!\s]*/gi, replacement: "" },
  { pattern: /\bThanks for asking\b[,.!\s]*/gi, replacement: "" },
];

const SALESY_LANGUAGE: Array<{ pattern: RegExp; replacement: string }> = [
  { pattern: /\bbest-in-class\b/gi, replacement: "evidence-aligned" },
  { pattern: /\bworld-?class\b/gi, replacement: "high-standard" },
  { pattern: /\bexclusive offer\b/gi, replacement: "available option" },
  { pattern: /\bamazing\b/gi, replacement: "appropriate" },
  { pattern: /\bperfect\b/gi, replacement: "suitable" },
];

const QUESTION_MARK_BURST = /\?{2,}/g;
const EMOJI_PATTERN = /[\p{Extended_Pictographic}]/gu;
const MAX_PARAGRAPHS = 4;
const EXPLANATION_SENTENCES_PER_PARAGRAPH = 2;

function normalizeWhitespace(value: string): string {
  return value.replace(/\r\n/g, "\n").replace(/[\t ]+/g, " ").trim();
}

function splitSentences(content: string): string[] {
  return content
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function sanitizeLanguage(rawOutput: string): string {
  const noEmoji = rawOutput.replace(EMOJI_PATTERN, "");

  const withoutGenericPhrases = GENERIC_ASSISTANT_PHRASES.reduce((content, rule) => {
    return content.replace(rule.pattern, rule.replacement);
  }, noEmoji);

  const withoutSalesyLanguage = SALESY_LANGUAGE.reduce((content, rule) => {
    return content.replace(rule.pattern, rule.replacement);
  }, withoutGenericPhrases);

  const normalizedQuestions = withoutSalesyLanguage
    .replace(QUESTION_MARK_BURST, "?")
    .replace(/\?(?=.*\?)/g, ".");

  return normalizedQuestions
    .replace(/!/g, ".")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function resolveOrientationLine(content: string, prompt?: string): { orientationLine: string; remaining: string } {
  const sentences = splitSentences(content);

  if (sentences.length > 0) {
    const [firstSentence, ...rest] = sentences;
    const orientationLine = firstSentence.endsWith(".") ? firstSentence : `${firstSentence}.`;
    return { orientationLine, remaining: rest.join(" ") };
  }

  const promptHint = (prompt ?? "").toLowerCase();
  if (/cost|price|fee|payment/.test(promptHint)) {
    return {
      orientationLine: "On cost, the exact estimate depends on clinical findings and treatment scope.",
      remaining: "",
    };
  }

  if (/process|step|timeline|recovery/.test(promptHint)) {
    return {
      orientationLine: "On process, care follows a sequenced plan from assessment to follow-up.",
      remaining: "",
    };
  }

  if (/fear|anx|nervous|pain/.test(promptHint)) {
    return {
      orientationLine: "On comfort, care can be adapted to your tolerance and pace.",
      remaining: "",
    };
  }

  return {
    orientationLine: "Here is a structured clinical summary based on your question.",
    remaining: "",
  };
}

function toStructuredParagraphs(content: string): string[] {
  const sentences = splitSentences(content);
  if (sentences.length === 0) {
    return [
      "I can provide a more precise answer when you share one key goal, current symptoms, and preferred timing.",
      "That context allows a narrower recommendation with clear trade-offs.",
    ];
  }

  const paragraphs: string[] = [];
  for (let index = 0; index < sentences.length; index += EXPLANATION_SENTENCES_PER_PARAGRAPH) {
    paragraphs.push(sentences.slice(index, index + EXPLANATION_SENTENCES_PER_PARAGRAPH).join(" "));
  }

  if (paragraphs.length === 1) {
    paragraphs.push("I can refine this further with one or two details about your goals and timing.");
  }

  return paragraphs;
}

function shouldAddClarifyingVariable(prompt: string | undefined, content: string): boolean {
  const combined = `${prompt ?? ""} ${content}`.toLowerCase();
  return /\b(depends|vary|based on|if |when |typically|may |can )\b/.test(combined);
}

function buildGuidedNextStep(prompt: string | undefined): string {
  const promptHint = (prompt ?? "").toLowerCase();

  if (/cost|price|fee|payment/.test(promptHint)) {
    return "Next step: choose one option: request a provisional cost range or schedule an assessment to confirm scope.";
  }

  if (/process|step|timeline|recovery/.test(promptHint)) {
    return "Next step: choose one option: review the typical timeline summary or share your target date for a sequenced plan.";
  }

  return "Next step: choose one option: share your primary goal or share your preferred timeline.";
}

function enforceGuidedNextStepGovernance(nextStep: string): string {
  const normalized = nextStep.replace(/\?{2,}/g, "?").replace(/!/g, ".").trim();
  const optionMatches = normalized.match(/\bor\b/gi);
  const optionsCount = optionMatches ? optionMatches.length + 1 : 1;

  if (optionsCount > 2) {
    const [beforeFirstOr, ...rest] = normalized.split(/\bor\b/i);
    const secondOption = rest[0] ? rest[0].trim() : "";
    const clamped = `${beforeFirstOr.trim()} or ${secondOption}`.trim();
    return clamped.replace(/\?(?=.*\?)/g, ".");
  }

  return normalized.replace(/\?(?=.*\?)/g, ".");
}

export function formatConciergeResponse(rawOutput: string, options: FormatConciergeResponseOptions = {}): string {
  const cleaned = sanitizeLanguage(normalizeWhitespace(rawOutput));
  const { orientationLine, remaining } = resolveOrientationLine(cleaned, options.prompt);
  const explanationParagraphs = toStructuredParagraphs(remaining);
  const nextStep = enforceGuidedNextStepGovernance(buildGuidedNextStep(options.prompt));

  const clarifyingVariable =
    "A clarifying variable is your clinical history and treatment priorities, which can change the final recommendation.";

  const middleSections: string[] = [...explanationParagraphs];
  const includeClarifyingVariable = shouldAddClarifyingVariable(options.prompt, cleaned);
  if (includeClarifyingVariable) {
    middleSections.push(clarifyingVariable);
  }

  const maxMiddleSections = MAX_PARAGRAPHS - 2;
  let limitedMiddleSections = middleSections;
  if (middleSections.length > maxMiddleSections) {
    if (includeClarifyingVariable && maxMiddleSections >= 2) {
      limitedMiddleSections = [middleSections[0], clarifyingVariable];
    } else {
      limitedMiddleSections = middleSections.slice(0, maxMiddleSections);
    }
  }

  return [orientationLine, ...limitedMiddleSections, nextStep].join("\n\n");
}
