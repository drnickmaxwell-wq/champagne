#!/usr/bin/env node
import fs from "node:fs";
function readJSON(p){ return JSON.parse(fs.readFileSync(p,"utf8")); }
const paths = {
  champagne: "styles/champagne/manifest.json",
  public: "public/brand/manifest.json"
};
if (!fs.existsSync(paths.champagne) || !fs.existsSync(paths.public)) {
  console.log("ℹ️ Manifests missing; skipping sync guard.");
  process.exit(0);
}
const champagne = readJSON(paths.champagne);
const pub = readJSON(paths.public);
const missing = [];

function existsPublic(rel){ const p = rel.replace(/^\/+/,""); return fs.existsSync("public/"+p.replace(/^public\//,"")); }
function check(p){ if (p && !existsPublic(p)) missing.push(p); }

check(champagne?.waves?.mask);
check(champagne?.waves?.bg);
check(pub?.textures?.film_grain);

if (missing.length){
  console.error("❌ Missing assets referenced by manifests:\n" + missing.join("\n"));
  process.exit(1);
}
console.log("✅ Manus/Champagne manifests synced to public assets.");
