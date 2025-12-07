#!/usr/bin/env node
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import micromatch from "micromatch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const allowConfigPath = resolve(__dirname, "guard-rogue-hex.allow.json");
const allowConfig = JSON.parse(readFileSync(allowConfigPath, "utf8"));
const allowGlobs = allowConfig.allow ?? [];
const allowExtensions = new Set(allowConfig.allowExtensions ?? []);
const warnOnlyExtensions = new Set(allowConfig.warnOnlyExtensions ?? []);
const enforcedFiles = [
  "app/preview/layout.tsx",
  "app/preview/treatments/layout.tsx",
].filter((file) => existsSync(resolve(process.cwd(), file)));

const targetBase = process.env.GITHUB_BASE_REF || "main";
const base = (() => {
  const candidates = [`origin/${targetBase}`, targetBase];
  for (const candidate of candidates) {
    try {
      return execSync(`git merge-base ${candidate} HEAD 2>/dev/null`)
        .toString()
        .trim();
    } catch (error) {
      // try next candidate
    }
  }
  try {
    return execSync("git rev-parse HEAD^ 2>/dev/null").toString().trim();
  } catch (error) {
    // fall back to repository root commit
  }
  const roots = execSync("git rev-list --max-parents=0 HEAD")
    .toString()
    .trim()
    .split("\n")
    .filter(Boolean);
  return roots[roots.length - 1];
})();

const filesOutput = execSync(
  `git diff --name-only --diff-filter=AM ${base} HEAD`
)
  .toString()
  .trim();

const files = filesOutput ? filesOutput.split("\n").filter(Boolean) : [];
const fileSet = new Set([...files, ...enforcedFiles]);
const ignorePrefixes = ["reports/"];
const hexRegex = /#[0-9a-fA-F]{3,8}\b/;

let failed = false;
for (const file of fileSet) {
  if (ignorePrefixes.some((prefix) => file.startsWith(prefix))) {
    console.log(`ALLOW generated artifact: ${file}`);
    continue;
  }
  const extension = extname(file);
  if (allowExtensions.has(extension)) {
    console.log(`ALLOW extension (${extension}): ${file}`);
    continue;
  }

  const diff = files.includes(file)
    ? execSync(`git diff ${base} HEAD -- "${file}"`).toString()
    : readFileSync(file, "utf8");
  const hasHex = hexRegex.test(diff);
  if (!hasHex) {
    continue;
  }

  const isAllowlisted = micromatch.isMatch(file, allowGlobs);
  if (isAllowlisted) {
    if (warnOnlyExtensions.has(extension)) {
      console.warn(`WARN allowlisted manifest: ${file}`);
    } else {
      console.warn(`WARN allowlisted: ${file}`);
    }
    continue;
  }

  console.error(`❌ Rogue HEX detected in ${file}. Use Champagne tokens instead.`);
  failed = true;
}

if (failed) {
  process.exit(1);
}

console.log("✅ No rogue HEX outside token files.");
