import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const targetEntries = [
  "apps/stock/app/api/stock/events/route.ts",
  "apps/stock/app/api/stock/events/read/route.ts",
  "apps/stock/app/api/stock/_internal/stockProxy.ts",
  "apps/stock/app/api/stock/receipts",
  "apps/stock/app/api/stock/projections/received-since-count",
  "apps/stock/app/api/stock/projections/open-orders",
  "apps/stock/app/api/stock/orders",
  "apps/stock/app/receive",
  "apps/stock/app/reorder"
];

const failures = [];

const collectTsFiles = (relativeEntry) => {
  const absolute = path.join(process.cwd(), relativeEntry);
  const stats = statSync(absolute);

  if (stats.isFile()) {
    return [relativeEntry];
  }

  const files = [];
  const queue = [relativeEntry];

  while (queue.length > 0) {
    const next = queue.shift();
    if (!next) {
      continue;
    }

    const absoluteNext = path.join(process.cwd(), next);
    for (const child of readdirSync(absoluteNext)) {
      const childRelative = path.posix.join(next, child);
      const childAbsolute = path.join(process.cwd(), childRelative);
      const childStats = statSync(childAbsolute);

      if (childStats.isDirectory()) {
        queue.push(childRelative);
        continue;
      }

      if (/\.(ts|tsx|js|jsx)$/.test(childRelative)) {
        files.push(childRelative);
      }
    }
  }

  return files;
};

const targetFiles = [...new Set(targetEntries.flatMap(collectTsFiles))];

for (const relativePath of targetFiles) {
  const filePath = path.join(process.cwd(), relativePath);
  const source = readFileSync(filePath, "utf8");

  if (/\bpatient[a-zA-Z0-9_]*\b/i.test(source)) {
    failures.push(`${relativePath}: contains disallowed patient field reference.`);
  }

  if (/\b(phi|dob|dateOfBirth|nhs|medicalRecord|insuranceNumber)\b/i.test(source)) {
    failures.push(`${relativePath}: contains disallowed PHI-like keyword.`);
  }

  if (
    /(localStorage|sessionStorage)/.test(source) &&
    /(patient|dob|dateOfBirth|medical|insurance|nhs|phone|email)/i.test(source)
  ) {
    failures.push(`${relativePath}: appears to store PHI-like data in browser storage.`);
  }

  const lines = source.split("\n");
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (
      /console\.(log|info|warn|error|debug)/.test(line) &&
      /(body|payload|request|response)/i.test(line)
    ) {
      failures.push(`${relativePath}:${index + 1} logs request/response body or payload.`);
    }
  }
}

if (failures.length > 0) {
  console.error("FAIL: guard-no-phi-logs-stock");
  for (const failure of failures) {
    console.error(` - ${failure}`);
  }
  process.exit(1);
}

console.log("PASS: guard-no-phi-logs-stock");
