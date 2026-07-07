#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { validateFile } from "../contracts/champagne-os/contract-validator.mjs";

const repoRoot = path.resolve(new URL("..", import.meta.url).pathname);
const fixturesDir = path.join(repoRoot, "contracts/champagne-os/fixtures");
const safeFixturePattern = /^valid-.*\.json$/;

const files = fs
  .readdirSync(fixturesDir)
  .filter((file) => safeFixturePattern.test(file))
  .sort()
  .map((file) => path.join(fixturesDir, file));

if (files.length === 0) {
  console.error("FAIL no safe Champagne contract fixtures found.");
  process.exit(1);
}

let failed = false;
for (const file of files) {
  const relativeFile = path.relative(repoRoot, file);
  const result = validateFile(file);
  if (result.valid) {
    console.log(`PASS ${relativeFile}`);
  } else {
    failed = true;
    console.error(`FAIL ${relativeFile}`);
    for (const error of result.errors) console.error(`- ${error}`);
  }
}

if (failed) process.exit(1);

console.log(`Champagne contract guard passed (${files.length} safe fixture${files.length === 1 ? "" : "s"}).`);
