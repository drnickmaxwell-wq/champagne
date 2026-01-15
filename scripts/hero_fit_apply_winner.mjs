import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const reportPath = path.join(repoRoot, "reports", "hero-fit", "report.json");
const manifestPath = path.join(
  repoRoot,
  "packages",
  "champagne-manifests",
  "data",
  "hero",
  "sacred_hero_surfaces.json",
);

const requiredKeys = ["causticsBlend", "causticsOpacity", "shimmerBlend", "shimmerOpacity"];

const readJson = (filePath) => {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
};

const ensureCandidate = (candidate) => {
  if (!candidate || typeof candidate !== "object") {
    throw new Error("Missing best.candidate in report.json");
  }
  for (const key of requiredKeys) {
    if (!(key in candidate)) {
      throw new Error(`Missing ${key} in best.candidate`);
    }
  }
  return candidate;
};

const applyWinner = () => {
  if (!fs.existsSync(reportPath)) {
    throw new Error(`report.json missing at ${reportPath}`);
  }
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`manifest missing at ${manifestPath}`);
  }

  const report = readJson(reportPath);
  const candidate = ensureCandidate(report.best?.candidate);
  const manifest = readJson(manifestPath);

  if (!manifest.motion || typeof manifest.motion !== "object") {
    throw new Error("Manifest missing motion section");
  }

  const caustics = manifest.motion["overlay.caustics"];
  const shimmer = manifest.motion["overlay.glassShimmer"];

  if (!caustics || !shimmer) {
    throw new Error("Manifest missing motion overlay entries");
  }

  caustics.blendMode = candidate.causticsBlend;
  caustics.opacity = candidate.causticsOpacity;
  shimmer.blendMode = candidate.shimmerBlend;
  shimmer.opacity = candidate.shimmerOpacity;

  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log("Applied best candidate to manifest:", candidate);
};

try {
  applyWinner();
} catch (error) {
  console.error("hero_fit_apply_winner failed:", error instanceof Error ? error.message : error);
  process.exit(1);
}
