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
  "packages/champagne-sections/src/Section_TreatmentOverviewRich.tsx",
  "packages/champagne-sections/src/Section_TreatmentMediaFeature.tsx",
  "packages/champagne-sections/src/Section_FAQ.tsx",
  "packages/champagne-sections/src/Section_TreatmentClosingCTA.tsx",
  "packages/champagne-sections/src/Section_TreatmentMidCTA.tsx",
  "packages/champagne-sections/src/Section_TreatmentRoutingCards.tsx",
  "apps/web/app/components/layout/Footer.tsx",
  "apps/web/app/components/layout/FooterLuxe.module.css",
  "scripts/verify-token-purity.cjs",
].map((file) => path.resolve(repoRoot, file));

const forbiddenMatchers = [
  { label: "hex", regex: /#[0-9a-fA-F]{3,8}\b/g },
  { label: "rgb", regex: /\brgba?\(/g },
  { label: "linear-gradient", regex: /linear-gradient\([^)]*(#|rgba?\()/g },
  { label: "radial-gradient", regex: /radial-gradient\([^)]*(#|rgba?\()/g },
  { label: "var-fallback-hex", regex: /var\(--[^,]+,\s*#[0-9a-fA-F]{3,8}\b/g },
  { label: "var-fallback-rgb", regex: /var\(--[^,]+,\s*rgba?\(/g },
];

const scanFile = async (filePath) => {
  const content = await fs.readFile(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  const matches = [];

  lines.forEach((line, index) => {
    forbiddenMatchers.forEach(({ label, regex }) => {
      const lineMatches = Array.from(line.matchAll(regex));
      lineMatches.forEach((match) => {
        matches.push({
          filePath,
          line: index + 1,
          label,
          value: match[0],
          lineText: line.trim(),
        });
      });
    });
  });

  return matches;
};

const run = async () => {
  const allMatches = [];

  for (const filePath of targetFiles) {
    const matches = await scanFile(filePath);
    allMatches.push(...matches);
  }

  if (allMatches.length > 0) {
    console.error("FAIL: token purity");
    allMatches.forEach((match) => {
      const relativePath = path.relative(repoRoot, match.filePath);
      console.error(
        `${relativePath}:${match.line} [${match.label}] ${match.value} :: ${match.lineText}`
      );
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
