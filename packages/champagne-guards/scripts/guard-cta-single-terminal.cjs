const path = require("node:path");
const repoRoot = path.resolve(__dirname, "..", "..", "..");
process.env.TS_NODE_PROJECT = path.join(repoRoot, "tsconfig.base.json");
require.extensions[".css"] = () => undefined;

require("ts-node").register({
  transpileOnly: true,
  skipProject: false,
  esm: true,
  extensions: [".ts", ".tsx", ".js"],
  compilerOptions: { module: "node16", moduleResolution: "node16", jsx: "react-jsx" },
});
require("tsconfig-paths/register");

const { champagneMachineManifest } = require(path.join(repoRoot, "packages/champagne-manifests/src/core"));
const { getSectionStack } = require(path.join(repoRoot, "packages/champagne-sections/src/SectionRegistry"));

function collectIndices(sections, kind) {
  return sections
    .map((section, index) => ({ section, index }))
    .filter(({ section }) => (section.kind ?? section.type) === kind)
    .map(({ index }) => index);
}

const failures = [];
const treatments = champagneMachineManifest.treatments ?? {};

Object.values(treatments).forEach((treatment) => {
  const slug = treatment.path ?? `/treatments/${treatment.id ?? "unknown"}`;
  const sections = getSectionStack(slug);
  const closingIndices = collectIndices(sections, "treatment_closing_cta");
  const midIndices = collectIndices(sections, "treatment_mid_cta");

  if (closingIndices.length !== 1) {
    failures.push(`${slug}: expected 1 closing CTA, found ${closingIndices.length}`);
  }
  if (midIndices.length > 1) {
    failures.push(`${slug}: expected at most 1 mid CTA, found ${midIndices.length}`);
  }

  if (closingIndices.length > 0 && midIndices.length > 0) {
    const minDistance = midIndices.reduce((closest, midIndex) => {
      const nearestClosing = Math.min(...closingIndices.map((index) => Math.abs(index - midIndex)));
      return Math.min(closest, nearestClosing);
    }, Number.MAX_SAFE_INTEGER);

    if (minDistance <= 2) {
      failures.push(`${slug}: mid CTA sits too close to closing CTA (distance ${minDistance})`);
    }
  }
});

if (failures.length > 0) {
  console.error("❌ CTA single-terminal guard failed:\n" + failures.join("\n"));
  process.exit(1);
}

console.log("✅ CTA single-terminal invariant holds for treatment stacks.");
