// tools/audit-champagne.ts
import fs from "fs";
import path from "path";

type Found = { path: string; exists: boolean; bytes?: number };
type ImportUse = { file: string; line: number; snippet: string };

const root = process.cwd();
const mustExist: string[] = [
  "public/waves/smh-wave-mask.svg",
  "public/textures/film-grain-mobile.webp",
  "public/textures/film-grain-desktop.webp",
  // allow either webp or png for particles
  "public/particles/particles-gold.webp",
  "public/particles/particles-teal.webp",
  "public/particles/particles-magenta.webp",
  "styles/tokens/smh-champagne-tokens.css",
  "components/brand/BrandHeroGradient.tsx"
];

function statFile(rel: string): Found {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) return { path: rel, exists: false };
  const bytes = fs.statSync(abs).size;
  return { path: rel, exists: true, bytes };
}

function scan(globRoots: string[], patterns: RegExp[]): ImportUse[] {
  const hits: ImportUse[] = [];
  const include = (p: string) => /\.(tsx?|css|mdx|mjs|cjs|jsx)$/.test(p);
  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir)) {
      const p = path.join(dir, entry);
      const rel = path.relative(root, p);
      const st = fs.statSync(p);
      if (st.isDirectory()) walk(p);
      else if (include(p)) {
        const txt = fs.readFileSync(p, "utf8");
        patterns.forEach((re) => {
          let m: RegExpExecArray | null;
          const r = new RegExp(re, re.flags.includes("g") ? re.flags : re.flags + "g");
          while ((m = r.exec(txt))) {
            const before = txt.slice(Math.max(0, m.index - 40), m.index + 80).replace(/\n/g, " ");
            hits.push({ file: rel, line: (txt.slice(0, m.index).match(/\n/g) || []).length + 1, snippet: before });
          }
        });
      }
    }
  }
  globRoots.forEach((dir) => fs.existsSync(dir) && walk(path.join(root, dir)));
  return hits;
}

const files = mustExist.map(statFile);

// token checks
const tokenPath = path.join(root, "styles/tokens/smh-champagne-tokens.css");
const tokenVars: Record<string, boolean> = {};
const tokenNotes: string[] = [];
const requiredVars = [
  "--brand-magenta", "--brand-teal", "--brand-gold",
  "--surface-0", "--radius", "--shadow-soft"
];
if (fs.existsSync(tokenPath)) {
  const css = fs.readFileSync(tokenPath, "utf8");
  requiredVars.forEach(v => tokenVars[v] = new RegExp(`${v}\\s*:`).test(css));
  if (!/linear-gradient/i.test(css)) tokenNotes.push("No gradient token detected");
} else {
  tokenNotes.push("Token file missing; cannot verify variables");
}

// wiring checks
const imports = scan(["app","components"], [
  /BrandHeroGradient/,
  /smh-champagne-tokens\.css/,
  /\/waves\/smh-wave-mask\.svg/,
  /film-grain-(mobile|desktop)\.webp/,
  /particles-(gold|teal|magenta)\.(webp|png)/
]);

// page presence (optional)
const likelyPages = [
  "app/page.tsx",
  "app/treatments/composite-bonding/page.tsx",
  "app/technology/page.tsx"
].filter(p => fs.existsSync(path.join(root,p)));

const result = {
  summary: {
    repo: path.basename(root),
    timestamp: new Date().toISOString()
  },
  files,
  tokens: { present: fs.existsSync(tokenPath), vars: tokenVars, notes: tokenNotes },
  wiring: { imports },
  pagesChecked: likelyPages
};

const reportsDir = path.join(root, "reports");
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);

fs.writeFileSync(path.join(reportsDir, "CHAMPAGNE_INVENTORY.json"), JSON.stringify(result,null,2));

// pretty MD
function fmtBytes(n?: number){ return n? `${(n/1024).toFixed(1)} KB` : "—"; }
const md = [
  "# Champagne Asset Audit",
  "",
  `**Repo:** ${result.summary.repo}`,
  `**When:** ${result.summary.timestamp}`,
  "",
  "## Required files",
  "",
  "| File | Exists | Size |",
  "|---|:--:|:---:|",
  ...result.files.map(f => `| ${f.path} | ${f.exists ? "✅" : "❌"} | ${fmtBytes(f.bytes)} |`),
  "",
  "## Token pack",
  "",
  `Path: \`styles/tokens/smh-champagne-tokens.css\` — ${result.tokens.present ? "✅ found" : "❌ missing"}`,
  "",
  "| Variable | Present |",
  "|---|:--:|",
  ...requiredVars.map(v => `| ${v} | ${result.tokens.vars[v] ? "✅" : "❌"} |`),
  ...(result.tokens.notes.length ? ["", "**Notes:**", ...result.tokens.notes.map(n => `- ${n}`)] : []),
  "",
  "## Wiring sightings (imports/references)",
  "",
  result.wiring.imports.length ? 
    result.wiring.imports.map(h => `- \`${h.file}:${h.line}\` → …${h.snippet}…`).join("\n") :
    "_No references found to BrandHeroGradient, tokens, wave, film grain, or particles._",
  "",
  "## Key pages present",
  "",
  result.pagesChecked.length ? result.pagesChecked.map(p => `- \`${p}\``).join("\n") : "_None of the usual pages found._",
  "",
  "## Next steps",
  "- If any files are ❌ missing, add them to the paths above.",
  "- If variables are ❌ missing, extend the token file rather than hard-coding colors.",
  "- Ensure at least one page imports `styles/brand/brand-gradient.css` and uses `<BrandHeroGradient>`."
].join("\n");

fs.writeFileSync(path.join(reportsDir, "CHAMPAGNE_AUDIT.md"), md);

console.log("Wrote reports/CHAMPAGNE_AUDIT.md and reports/CHAMPAGNE_INVENTORY.json");
