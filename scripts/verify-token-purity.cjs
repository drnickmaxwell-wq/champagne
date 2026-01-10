const fs = require("node:fs/promises");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const targetFiles = [
  "AGENTS.md",
  "packages/champagne-cta/src/ChampagneCTAButton.tsx",
  "packages/champagne-sections/src/Section_TextBlock.tsx",
  "packages/champagne-sections/src/Section_FeatureList.tsx",
  "packages/champagne-sections/src/Section_GoogleReviews.tsx",
  "packages/champagne-sections/src/Section_PatientStoriesRail.tsx",
  "packages/champagne-sections/src/Section_MediaBlock.tsx",
  "packages/champagne-sections/src/Section_TreatmentToolsTrio.tsx",
  "packages/champagne-sections/src/Section_TreatmentOverviewRich.tsx",
  "packages/champagne-sections/src/Section_TreatmentMediaFeature.tsx",
  "packages/champagne-sections/src/Section_FAQ.tsx",
  "packages/champagne-sections/src/Section_TreatmentClosingCTA.tsx",
  "packages/champagne-sections/src/Section_TreatmentMidCTA.tsx",
  "packages/champagne-sections/src/Section_TreatmentRoutingCards.tsx",
  "apps/web/app/(champagne)/_builder/ChampagnePageBuilder.tsx",
  "apps/web/app/components/layout/Footer.tsx",
  "apps/web/app/components/layout/FooterLuxe.module.css",
  "scripts/verify-token-purity.cjs",
].map((file) => path.resolve(repoRoot, file));

const offenderTypes = {
  HEX: "HEX",
  RGB: "RGB/RGBA",
  GRADIENT: "GRADIENT_LITERAL",
  VAR_FALLBACK: "VAR_FALLBACK_LITERAL",
  BOX_SHADOW: "BOX_SHADOW_LITERAL",
};

const forbiddenMatchers = {
  [offenderTypes.VAR_FALLBACK]:
    /var\(--[^,]+,\s*(#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\))/g,
  [offenderTypes.GRADIENT]:
    /\b(?:linear|radial)-gradient\([^)]*(#[0-9a-fA-F]{3,8}\b|rgba?\()[^)]*\)/g,
  [offenderTypes.BOX_SHADOW]:
    /\bbox-shadow\s*:[^;\n]*(#[0-9a-fA-F]{3,8}\b|rgba?\()/g,
  [offenderTypes.HEX]: /#[0-9a-fA-F]{3,8}\b/g,
  [offenderTypes.RGB]: /\brgba?\(/g,
};

const orderedTypes = [
  offenderTypes.HEX,
  offenderTypes.RGB,
  offenderTypes.GRADIENT,
  offenderTypes.VAR_FALLBACK,
  offenderTypes.BOX_SHADOW,
];

const sampleReport = [
  {
    filePath: "path/to/file.tsx",
    line: 12,
    type: offenderTypes.HEX,
    value: "HEX_LITERAL",
    lineText: "color: HEX_LITERAL;",
  },
  {
    filePath: "path/to/styles.css",
    line: 47,
    type: offenderTypes.GRADIENT,
    value: "GRADIENT_LITERAL",
    lineText: "background: GRADIENT_LITERAL;",
  },
  {
    filePath: "path/to/file.tsx",
    line: 88,
    type: offenderTypes.VAR_FALLBACK,
    value: "VAR_FALLBACK_LITERAL",
    lineText: "background: VAR_FALLBACK_LITERAL;",
  },
];

const collectMatches = (line, index, filePath, matches) => {
  const excludeRanges = [];
  const addMatches = (type, regex) => {
    Array.from(line.matchAll(regex)).forEach((match) => {
      const start = match.index ?? 0;
      const end = start + match[0].length;
      excludeRanges.push([start, end]);
      matches.push({
        filePath,
        line: index + 1,
        type,
        value: match[0],
        lineText: line.trim(),
      });
    });
  };

  addMatches(offenderTypes.VAR_FALLBACK, forbiddenMatchers[offenderTypes.VAR_FALLBACK]);
  addMatches(offenderTypes.GRADIENT, forbiddenMatchers[offenderTypes.GRADIENT]);
  addMatches(offenderTypes.BOX_SHADOW, forbiddenMatchers[offenderTypes.BOX_SHADOW]);

  const isExcluded = (matchIndex) =>
    excludeRanges.some(([start, end]) => matchIndex >= start && matchIndex < end);

  [offenderTypes.HEX, offenderTypes.RGB].forEach((type) => {
    const regex = forbiddenMatchers[type];
    Array.from(line.matchAll(regex)).forEach((match) => {
      const matchIndex = match.index ?? 0;
      if (isExcluded(matchIndex)) {
        return;
      }
      matches.push({
        filePath,
        line: index + 1,
        type,
        value: match[0],
        lineText: line.trim(),
      });
    });
  });
};

const scanFile = async (filePath) => {
  const content = await fs.readFile(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  const matches = [];

  lines.forEach((line, index) => {
    collectMatches(line, index, filePath, matches);
  });

  return matches;
};

const formatReportLine = (match) => {
  const relativePath = path.relative(repoRoot, match.filePath);
  return `${relativePath}:${match.line} [${match.type}] ${match.value} :: ${match.lineText}`;
};

const run = async () => {
  const allMatches = [];

  for (const filePath of targetFiles) {
    const matches = await scanFile(filePath);
    allMatches.push(...matches);
  }

  if (process.argv.includes("--demo")) {
    console.log("FAIL: token purity");
    orderedTypes.forEach((type) => {
      const typeMatches = sampleReport.filter((match) => match.type === type);
      if (typeMatches.length === 0) {
        return;
      }
      console.log(`\n${type}`);
      typeMatches.forEach((match) => {
        console.log(formatReportLine(match));
      });
    });
    console.log("\n(End of demo output)");
    return;
  }

  if (allMatches.length > 0) {
    console.error("FAIL: token purity");
    orderedTypes.forEach((type) => {
      const typeMatches = allMatches.filter((match) => match.type === type);
      if (typeMatches.length === 0) {
        return;
      }
      console.error(`\n${type}`);
      typeMatches.forEach((match) => {
        console.error(formatReportLine(match));
      });
    });
    process.exit(1);
  }

  console.log("PASS: token purity");
};

run().catch((error) => {
  console.error("FAIL: token purity");
  console.error(error);
  process.exit(1);
});
