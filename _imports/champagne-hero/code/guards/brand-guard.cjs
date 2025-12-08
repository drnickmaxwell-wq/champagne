#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const ROOT = process.cwd();
const SELF = path.join(ROOT, 'brand-guard.cjs');
const BLOCKED = ['#D94BC6', '#00C2C7']; // legacy two-stop drift
const TOKENS_ALLOWLIST_DIRS = ['styles/tokens'];

function walk(dir, files=[]) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules','.next','.turbo','.vercel','dist','build','coverage','public'].includes(entry.name)) continue;
      walk(p, files);
    } else {
      if (!/\.(c|m)?(t|j)sx?$|\.css|\.mdx?$|\.json$/i.test(entry.name)) continue;
      files.push(p);
    }
  }
  return files;
}

function isInAllowlistedTokens(file) {
  return TOKENS_ALLOWLIST_DIRS.some(d => file.replace(/\\/g,'/').includes(d + '/'));
}

let failures = [];
for (const file of walk(ROOT)) {
  if (file === SELF) continue;
  const txt = fs.readFileSync(file, 'utf8');
  for (const hex of BLOCKED) {
    if (txt.includes(hex) && !isInAllowlistedTokens(file)) {
      failures.push(`${file}: legacy hex ${hex}`);
    }
  }
}
if (failures.length) {
  console.error('Brand Guard failed (legacy two-stop hex detected outside tokens):');
  for (const f of failures) console.error(' - ' + f);
  process.exit(1);
}
console.log('Brand Guard passed.');
