import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const targetPaths = [
  "apps/stock/app/api/stock/events/route.ts",
  "apps/stock/app/api/stock/events/read/route.ts",
  "apps/stock/app/api/stock/_internal/stockProxy.ts",
  "apps/stock/app/api/stock/receipts",
  "apps/stock/app/api/stock/projections/received-since-count",
  "apps/stock/app/receive"
];

const sourceFileExtensions = new Set([".ts", ".tsx", ".mts", ".cts", ".js", ".jsx", ".mjs", ".cjs"]);

const collectFiles = (relativePath) => {
  const absolutePath = path.join(process.cwd(), relativePath);
  const stats = statSync(absolutePath);

  if (stats.isFile()) {
    return [relativePath];
  }

  const stack = [relativePath];
  const files = [];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) {
      continue;
    }

    const absoluteCurrent = path.join(process.cwd(), current);
    for (const entry of readdirSync(absoluteCurrent)) {
      const nextRelative = path.join(current, entry);
      const nextAbsolute = path.join(process.cwd(), nextRelative);
      const nextStats = statSync(nextAbsolute);

      if (nextStats.isDirectory()) {
        stack.push(nextRelative);
        continue;
      }

      if (sourceFileExtensions.has(path.extname(entry))) {
        files.push(nextRelative);
      }
    }
  }

  return files;
};

const targetFiles = [...new Set(targetPaths.flatMap((targetPath) => collectFiles(targetPath)))];

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
    if (!/console\.(log|info|warn|error|debug)/.test(line)) {
      continue;
    }

    if (/(body|payload|request|response)/i.test(line)) {
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
