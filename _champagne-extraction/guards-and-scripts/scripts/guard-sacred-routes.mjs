#!/usr/bin/env node
import { execSync } from "node:child_process";
const base = execSync(`git merge-base origin/${process.env.GITHUB_BASE_REF||"main"} HEAD`).toString().trim();
const changed = execSync(`git diff --name-only ${base} HEAD`).toString().trim().split("\n").filter(Boolean);
const sacred = [
  "components/home/ChampagneHero.tsx",
  "app/champagne/hero/page.tsx",
  "public/brand/manifest.json",
  "public/brand/waves/wave-mask.svg",
  "public/brand/waves/wave-bg.webp"
];
for (const f of changed) {
  if (sacred.includes(f)) {
    console.error(`❌ Sacred path changed: ${f}. Use guarded workflow only.`);
    process.exit(1);
  }
}
console.log("✅ Sacred routes untouched.");
