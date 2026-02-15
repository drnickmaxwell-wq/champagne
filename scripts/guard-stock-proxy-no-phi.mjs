import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const SCOPES = ["apps/stock/app/api/stock", "apps/stock/app/lib"];
const DISALLOWED_TERMS = [
  "patientId",
  "patientName",
  "dob",
  "nhs",
  "medical",
  "diagnosis"
];

const walkFiles = (directory) => {
  const absoluteDirectory = path.join(ROOT, directory);
  const entries = readdirSync(absoluteDirectory);
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(absoluteDirectory, entry);
    const relativePath = path.relative(ROOT, absolutePath);
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) {
      files.push(...walkFiles(relativePath));
      continue;
    }

    if (/\.(ts|tsx|js|mjs|cjs)$/.test(entry)) {
      files.push(relativePath);
    }
  }

  return files;
};

const failures = [];
const filesToScan = SCOPES.flatMap((scope) => walkFiles(scope));

for (const relativeFile of filesToScan) {
  const source = readFileSync(path.join(ROOT, relativeFile), "utf8");

  for (const term of DISALLOWED_TERMS) {
    if (new RegExp(`\\b${term}\\b`, "i").test(source)) {
      failures.push(`${relativeFile}: contains disallowed term \"${term}\".`);
    }
  }

  const lines = source.split("\n");
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? "";
    if (/console\.(log|info|warn|error|debug)/.test(line) && /\b(body|headers)\b/i.test(line)) {
      failures.push(`${relativeFile}:${index + 1}: logs request body/headers.`);
    }
  }
}

if (failures.length > 0) {
  console.error("FAIL: guard-stock-proxy-no-phi");
  for (const failure of failures) {
    console.error(` - ${failure}`);
  }
  process.exit(1);
}

console.log("PASS: guard-stock-proxy-no-phi");
