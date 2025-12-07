#!/usr/bin/env node
import { execSync } from "node:child_process";
const base = execSync(`git merge-base origin/${process.env.GITHUB_BASE_REF||"main"} HEAD`).toString().trim();
const changed = execSync(`git diff --name-only --diff-filter=AM ${base} HEAD -- public`).toString().trim().split("\n").filter(Boolean);
const MAX = parseInt(process.env.PUBLIC_MAX_MB || "6", 10) * 1024 * 1024;
let bad = [];
for (const f of changed) {
  const size = parseInt(execSync(`wc -c < "${f}"`).toString().trim(),10);
  if (size > MAX) bad.push({f, size});
}
if (bad.length){
  bad.forEach(b => console.error(`❌ ${b.f} is ${(b.size/1024/1024).toFixed(2)} MB > limit`));
  process.exit(1);
}
console.log("✅ Public assets within size limit.");
