#!/usr/bin/env node
import { execSync } from "node:child_process";
const branch = process.env.GITHUB_HEAD_REF || execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
const base = execSync(`git merge-base origin/${process.env.GITHUB_BASE_REF||"main"} HEAD`).toString().trim();
const changed = execSync(`git diff --name-only ${base} HEAD`).toString().trim().split("\n").filter(Boolean);

const prodRoots = [/^app\/treatments\//, /^app\/blog\//, /^app\/page\.tsx$/, /^app\/(stories|team|video-consultation)\//];
const isRelease = /^release\//.test(branch);

if (!isRelease) {
  for (const f of changed) {
    if (prodRoots.some(r => r.test(f)) && !f.startsWith("app/preview/")) {
      console.error(`❌ ${f} is a production path. Work in /app/preview/** or use a 'release/*' branch.`);
      process.exit(1);
    }
  }
}
console.log("✅ Preview-only rule satisfied.");
