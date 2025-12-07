/**
 * Blocks stray brand hex usage outside tokens and enforces gradient string.
 */
const { readFileSync, readdirSync, existsSync } = require("fs");
const { join, extname, sep } = require("path");

const SCAN_ROOT = process.env.BRAND_GUARD_ROOT || process.cwd();
const TOKENS_FILE = join(SCAN_ROOT, "styles/tokens/smh-champagne-tokens.css");
const HEX_CODES = Object.freeze({
  PRIMARY_MAGENTA: "#C2185B",
  PRIMARY_TEAL: "#40C4B4",
  GOLD: "#D4AF37",
  KEYLINE: "#F9E8C3",
  GRADIENT_MAGENTA: "#C2185B",
  GRADIENT_TEAL: "#40C4B4",
  GRADIENT_GOLD: "#D4AF37",
  INK: "#0B0D0F",
});
const CANONICAL_DISPLAY = 'linear-gradient(135deg, var(--brand-magenta) 0%, var(--brand-teal) 60%, var(--brand-gold) 100%)';
const CANONICAL_GRAD = 'linear-gradient(135deg,var(--brand-magenta)0%,var(--brand-teal)60%,var(--brand-gold)100%)';
const HEXES = Object.values(HEX_CODES).map(hex=>new RegExp(hex.slice(1),"i"));

const normalize = (value) => value.replace(/\s+/g, "").toLowerCase();

const SCAN_ROOTS = ["app", "components", "styles", "public"];
const SCAN_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".css"]);
const EXCLUDED_SEGMENTS = new Set(["scripts", "tests", ".github", "node_modules", ".next", "dist"]);

const HERO_JOURNEY_FILES = new Set([
  join(SCAN_ROOT, "components/hero/4k-hero-video.tsx"),
  join(SCAN_ROOT, "components/sections/SmileJourney.tsx"),
]);
const LEGACY_GRADIENT_HEXES = [/#d94bc6/i, /#00c2c7/i];
const HEX_FILE_ALLOWLIST = new Set([
  join(SCAN_ROOT, "styles/champagne/hero.css"),
]);

function shouldSkip(relPath){
  if(!relPath) return false;
  const parts = relPath.split(sep);
  return parts.some(part => EXCLUDED_SEGMENTS.has(part));
}

function walk(dir){
  const rel = dir === SCAN_ROOT ? "" : dir.slice(SCAN_ROOT.length + 1);
  if(shouldSkip(rel)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const fullPath = join(dir, entry.name);
    const relative = fullPath.slice(SCAN_ROOT.length + 1);
    if(shouldSkip(relative)) return [];
    if(entry.isDirectory()){
      return walk(fullPath);
    }
    const extension = extname(entry.name).toLowerCase();
    return SCAN_EXTENSIONS.has(extension) ? [fullPath] : [];
  });
}

const files = SCAN_ROOTS.flatMap(base => {
  const dir = join(SCAN_ROOT, base);
  if(!existsSync(dir)) return [];
  return walk(dir);
});

function walkManifests(dir){
  if(!existsSync(dir)) return [];
  const rel = dir === SCAN_ROOT ? "" : dir.slice(SCAN_ROOT.length + 1);
  if(shouldSkip(rel)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const fullPath = join(dir, entry.name);
    const relative = fullPath.slice(SCAN_ROOT.length + 1);
    if(entry.isDirectory()){
      if(shouldSkip(relative)) return [];
      return walkManifests(fullPath);
    }
    return /manifest\.(?:json|webmanifest)$/i.test(entry.name) ? [fullPath] : [];
  });
}

const manifestFiles = ["public", "styles"].flatMap(base => walkManifests(join(SCAN_ROOT, base)));
const manifestWarnings = [];

let violations = [];

const NEXT_SEGMENT = `${sep}.next${sep}`;

for(const file of files){
  if(
    file.includes("node_modules") ||
    file.includes(NEXT_SEGMENT) ||
    file.includes("/.next/") ||
    file.includes(`${sep}dist${sep}`) ||
    file.includes(".min.")
  ) continue;
  if(file === __filename) continue;
  if(file === TOKENS_FILE) continue;

  const txt = readFileSync(file,"utf8");
  const normalized = normalize(txt);
  const isHeroJourneyFile = HERO_JOURNEY_FILES.has(file);
  const skipHexCheck = HEX_FILE_ALLOWLIST.has(file);
  if(!skipHexCheck){
    for(const h of HEXES){
      if(h.test(txt)) violations.push({file, hex: h});
    }
  }
  if(
    file !== TOKENS_FILE &&
    /background\s*:\s*linear-gradient[^;]*#c2185b[^;]*#40c4b4[^;]*#d4af37/i.test(txt)
  ){
    violations.push({ file, hex: 'background-linear-gradient-outside-tokens' });
  }
  const glassBlocks = txt.match(/\.champagne-glass\s*\{[^}]*\}/gs) || [];
  for(const block of glassBlocks){
    if(/color-mix[^}]*var\(\s*--smh-ink\s*\)/i.test(block)){
      violations.push({ file, hex: 'champagne-glass-ink-mix' });
      break;
    }
    if(/mix-blend-mode/i.test(block)){
      violations.push({ file, hex: 'champagne-glass-mix-blend' });
      break;
    }
    const bgMatch = block.match(/background-color\s*:\s*([^;]+);/i);
    if(bgMatch && !/transparent/i.test(bgMatch[1])){
      violations.push({ file, hex: 'champagne-glass-tinted' });
      break;
    }
  }
  const surfaceBlocks = txt.match(/\.champagne-surface(?:-lux)?\s*\{[^}]*\}/g) || [];
  for(const block of surfaceBlocks){
    const inlineGradientMatch = block.match(/background(?:-image)?\s*:\s*[^;]*(linear-gradient|radial-gradient)/i);
    if(inlineGradientMatch){
      violations.push({ file, hex: 'champagne-surface-inline-gradient' });
      break;
    }
  }
  if(isHeroJourneyFile){
    if(/bg-(?:white|black|ink)\//i.test(txt)){
      violations.push({ file, hex: 'hero-journey-bg-tint' });
    }
    if(/background\s*:\s*(?:radial-gradient|linear-gradient)\(/i.test(txt)){
      violations.push({ file, hex: 'hero-journey-background-gradient' });
    }
    if(/opacity\s*:\s*0\.\d+/i.test(txt)){
      violations.push({ file, hex: 'hero-journey-opacity' });
    }
  }
  if(file.includes("brand") && normalized.includes("linear-gradient(") && !normalized.includes(CANONICAL_GRAD)){
    const gradientMatch = txt.match(/linear-gradient\([^)]*\)/i);
    const raw = gradientMatch ? gradientMatch[0].trim() : "";
    violations.push({
      file,
      hex: "non-canonical-gradient",
      expected: CANONICAL_DISPLAY,
      found: raw,
      normalizedExpected: CANONICAL_GRAD,
      normalizedFound: raw ? normalize(raw) : "",
    });
  }
}

const tokensBody = readFileSync(TOKENS_FILE, "utf8");
const gradientMatch = tokensBody.match(/--smh-gradient:\s*([^;]+);/i);
if(!gradientMatch){
  violations.push({file: TOKENS_FILE, hex: "gradient-string-missing"});
} else {
  const gradientRaw = gradientMatch[1].trim();
  const gradientNormalized = normalize(gradientRaw);
  if(gradientNormalized !== CANONICAL_GRAD){
    violations.push({
      file: TOKENS_FILE,
      hex: "gradient-string-mismatch",
      expected: CANONICAL_DISPLAY,
      found: gradientRaw,
      normalizedExpected: CANONICAL_GRAD,
      normalizedFound: gradientNormalized,
    });
  }
}

const manifestResults = manifestFiles.map(file => {
  const body = readFileSync(file, "utf8");
  const hasLegacyGradient = LEGACY_GRADIENT_HEXES.some(pattern => pattern.test(body));
  if(hasLegacyGradient){
    manifestWarnings.push({ file, hex: "legacy-gradient" });
  }
  return { file, hasLegacyGradient };
});

if(violations.length){
  console.error("❌ Brand guard failed. Move brand hexes/gradient into tokens only.");
  for(const v of violations){
    if(v.expected){
      console.error(`- ${v.file} ${String(v.hex)} → expected "${v.expected}" but found "${v.found || 'unknown'}"`);
      if(v.normalizedExpected || v.normalizedFound){
        console.error(`  normalized expected: "${v.normalizedExpected ?? ''}" vs found: "${v.normalizedFound ?? ''}"`);
      }
    } else {
      console.error("-", v.file, String(v.hex));
    }
  }
} else {
  console.log("✅ No rogue hex detected outside approved tokens.");
}

for(const warning of manifestWarnings){
  console.warn(`⚠️ ${warning.file} legacy gradient fallback detected (manifest) — warn only`);
}

const manifestsScanned = manifestResults.length;
const manifestWarnCount = manifestWarnings.length;
const manifestOkCount = manifestsScanned - manifestWarnCount;
console.log(`Manifests scanned: ${manifestsScanned} | WARN: ${manifestWarnCount} | OK: ${manifestOkCount}`);

if(violations.length){
  process.exit(1);
}

process.exit(0);
