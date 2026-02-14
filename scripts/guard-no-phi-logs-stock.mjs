import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const targetFiles = [
  "apps/stock/app/api/stock/events/route.ts",
  "apps/stock/app/api/stock/events/read/route.ts",
  "apps/stock/app/api/stock/_internal/stockProxy.ts"
];

const failures = [];

for (const relativePath of targetFiles) {
  const filePath = path.join(process.cwd(), relativePath);
  const source = readFileSync(filePath, "utf8");

  if (/\bpatient[a-zA-Z0-9_]*\b/i.test(source)) {
    failures.push(`${relativePath}: contains disallowed patient field reference.`);
  }

  const lines = source.split("\n");
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (/console\.(log|info|warn|error|debug)/.test(line) && /(body|payload|request)/i.test(line)) {
      failures.push(`${relativePath}:${index + 1} logs request body/payload.`);
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
