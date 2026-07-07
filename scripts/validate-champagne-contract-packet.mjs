#!/usr/bin/env node
import { validateFile } from "../contracts/champagne-os/contract-validator.mjs";

const files = process.argv.slice(2);
if (!files.length) {
  console.error("Usage: node scripts/validate-champagne-contract-packet.mjs <packet.json> [...]");
  process.exit(2);
}

let failed = false;
for (const file of files) {
  const result = validateFile(file);
  if (result.valid) console.log(`PASS ${file}`);
  else {
    failed = true;
    console.error(`FAIL ${file}`);
    for (const error of result.errors) console.error(`- ${error}`);
  }
}
process.exit(failed ? 1 : 0);
