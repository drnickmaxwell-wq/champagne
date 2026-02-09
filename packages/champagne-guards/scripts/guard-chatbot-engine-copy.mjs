import fs from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(process.cwd(), "../..");
const conversationsDir = path.join(repoRoot, "config/conversations");
const qaReportPath = path.join(
  repoRoot,
  "reports/CHATBOT_ENGINE_COPY_QA_REPORT_V1.json",
);
const excerptsReportPath = path.join(
  repoRoot,
  "reports/CHATBOT_PAGE_COPY_EXCERPTS_V1.json",
);
const outputReportPath = path.join(
  repoRoot,
  "reports/CHATBOT_ENGINE_GUARD_REPORT_V1.json",
);

const baseAbsolutePhrases = [
  "best",
  "right option",
  "most suitable",
  "quickest",
  "right place",
  "work best",
];

const lower = (value) => value.toLowerCase();

const createPhraseRegex = (phrase) => {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (phrase.includes(" ")) {
    return new RegExp(`\\b${escaped}\\b`, "i");
  }
  return new RegExp(`\\b${escaped}\\b`, "i");
};

const extractQaPhrases = (qaReport) => {
  const phrases = new Set();
  const visit = (node, keyHint = "") => {
    if (Array.isArray(node)) {
      node.forEach((item) => visit(item, keyHint));
      return;
    }
    if (!node || typeof node !== "object") {
      return;
    }
    for (const [key, value] of Object.entries(node)) {
      if (typeof value === "string") {
        const normalizedKey = key.toLowerCase();
        if (
          normalizedKey.includes("absolute") ||
          normalizedKey.includes("comparative") ||
          normalizedKey.includes("flag")
        ) {
          phrases.add(value);
        }
      } else {
        visit(value, key);
      }
    }
  };
  visit(qaReport);
  return Array.from(phrases);
};

const readJsonIfExists = async (filePath) => {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
};

const collectResponseContent = (node, entries, pointer = "$") => {
  if (Array.isArray(node)) {
    node.forEach((item, index) =>
      collectResponseContent(item, entries, `${pointer}[${index}]`),
    );
    return;
  }
  if (!node || typeof node !== "object") {
    return;
  }
  if (
    node.response &&
    typeof node.response === "object" &&
    typeof node.response.content === "string"
  ) {
    entries.push({
      content: node.response.content,
      pointer: `${pointer}.response.content`,
    });
  }
  for (const [key, value] of Object.entries(node)) {
    collectResponseContent(value, entries, `${pointer}.${key}`);
  }
};

const resolveTopic = (document, fallback) => {
  if (!document || typeof document !== "object") {
    return fallback;
  }
  if (typeof document.route === "string") {
    return document.route;
  }
  if (typeof document.topic === "string") {
    return document.topic;
  }
  return fallback;
};

const main = async () => {
  const qaReport = await readJsonIfExists(qaReportPath);
  const qaPhrases = qaReport ? extractQaPhrases(qaReport) : [];
  const absolutePhrases = Array.from(
    new Set([...baseAbsolutePhrases, ...qaPhrases]),
  );
  const absolutePhraseRegexes = absolutePhrases.map((phrase) => ({
    phrase,
    regex: createPhraseRegex(phrase),
  }));

  const excerptsReport = await readJsonIfExists(excerptsReportPath);
  const excerptMap = new Map();
  if (Array.isArray(excerptsReport)) {
    for (const entry of excerptsReport) {
      if (entry && typeof entry.route === "string") {
        excerptMap.set(entry.route, entry.excerptText ?? "");
      }
    }
  }

  let conversationFiles = [];
  try {
    const entries = await fs.readdir(conversationsDir, { withFileTypes: true });
    conversationFiles = entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".core.json"))
      .map((entry) => path.join(conversationsDir, entry.name));
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  const failures = [];
  const warnings = [];
  let responsesScanned = 0;

  for (const filePath of conversationFiles) {
    const raw = await fs.readFile(filePath, "utf-8");
    const document = JSON.parse(raw);
    const topic = resolveTopic(document, path.basename(filePath));
    const entries = [];
    collectResponseContent(document, entries);
    const excerptText = excerptMap.get(topic) ?? "";
    const excerptLower = lower(excerptText);

    for (const entry of entries) {
      responsesScanned += 1;
      const content = entry.content;
      for (const { phrase, regex } of absolutePhraseRegexes) {
        if (regex.test(content)) {
          failures.push({
            file: filePath,
            topic,
            pointer: entry.pointer,
            phrase,
            content,
          });
        }
      }

      if (excerptText) {
        const normalized = lower(content.trim());
        if (normalized && !excerptLower.includes(normalized)) {
          warnings.push({
            file: filePath,
            topic,
            pointer: entry.pointer,
            message: "Response content not found in excerpt text.",
            content,
          });
        }
      }
    }
  }

  const report = {
    report: "CHATBOT_ENGINE_GUARD_REPORT_V1",
    generatedAt: new Date().toISOString(),
    rules: {
      absolutePhraseBlocklist: absolutePhrases,
      qaReportLoaded: Boolean(qaReport),
      qaReportPath: qaReportPath,
      excerptReportLoaded: Array.isArray(excerptsReport),
      excerptReportPath: excerptsReportPath,
      warnOnExcerptMismatch: true,
      requiredResponseField: "response.content",
    },
    filesScanned: conversationFiles,
    responsesScanned,
    failureCount: failures.length,
    warningCount: warnings.length,
    failures,
    warnings,
  };

  await fs.mkdir(path.dirname(outputReportPath), { recursive: true });
  await fs.writeFile(outputReportPath, `${JSON.stringify(report, null, 2)}\n`);

  if (!qaReport) {
    console.warn(
      `⚠️ QA report missing at ${qaReportPath}; using base phrase list only.`,
    );
  }
  if (!Array.isArray(excerptsReport)) {
    console.warn(
      `⚠️ Excerpt report missing at ${excerptsReportPath}; excerpt warnings skipped.`,
    );
  }
  if (conversationFiles.length === 0) {
    console.warn(
      `⚠️ No conversation files found in ${conversationsDir}; nothing to scan.`,
    );
  }

  if (failures.length > 0) {
    console.error(
      `❌ Chatbot engine copy guard failed (${failures.length} violations).`,
    );
    process.exitCode = 1;
    return;
  }

  console.log("✅ Chatbot engine copy guard passed.");
  if (warnings.length > 0) {
    console.warn(`⚠️ ${warnings.length} excerpt warning(s) detected.`);
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
