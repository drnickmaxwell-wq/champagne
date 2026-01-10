import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import http from "node:http";
import process from "node:process";
import { chromium } from "playwright";
import sharp from "sharp";

const repoRoot = process.cwd();
const referenceDir = path.join(repoRoot, "reference");
const referencePath = path.join(referenceDir, "sacred-hero.png");
const reportsDir = path.join(repoRoot, "reports", "hero-match");
const resultsPath = path.join(reportsDir, "results.json");
const bestPath = path.join(reportsDir, "best.png");
const baseUrl = process.env.HERO_MATCH_URL ?? "http://localhost:3000";
const targetPath = process.env.HERO_MATCH_PATH ?? "/champagne/hero-debug";

const missingReferenceMessage = [
  "Reference image not found for hero_match_sacred.",
  `Place sacred-hero.png at ${referencePath} (or /mnt/data/sacred-hero.png) and re-run manually.`,
  "This matcher never runs in verify/guards/CI; it is manual only.",
].join(" ");

const ensureReference = () => {
  if (fs.existsSync(referencePath)) return referencePath;
  const legacyPath = "/mnt/data/sacred-hero.png";
  if (fs.existsSync(legacyPath)) {
    fs.mkdirSync(referenceDir, { recursive: true });
    fs.copyFileSync(legacyPath, referencePath);
    return referencePath;
  }
  return null;
};

const waitForHttpOk = async (url, timeoutMs = 30000) => {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const ok = await new Promise((resolve) => {
      const req = http.get(url, (res) => {
        res.resume();
        resolve(res.statusCode && res.statusCode >= 200 && res.statusCode < 500);
      });
      req.on("error", () => resolve(false));
      req.setTimeout(2000, () => {
        req.destroy();
        resolve(false);
      });
    });
    if (ok) return true;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return false;
};

const startDevServer = async () => {
  const alreadyUp = await waitForHttpOk(baseUrl);
  if (alreadyUp) return { child: null, started: false };

  const child = spawn("pnpm", ["--filter", "web", "dev", "--hostname", "0.0.0.0", "--port", "3000"], {
    cwd: repoRoot,
    stdio: "pipe",
    env: { ...process.env },
  });

  const ready = await new Promise((resolve) => {
    const onData = (chunk) => {
      const text = chunk.toString();
      if (text.includes("Ready") || text.includes("ready in")) resolve(true);
    };
    child.stdout.on("data", onData);
    child.stderr.on("data", onData);
    setTimeout(() => resolve(false), 45000);
  });

  if (!ready) throw new Error("Dev server did not become ready in time.");
  return { child, started: true };
};

const mse = (a, b) => {
  let sum = 0;
  for (let i = 0; i < a.length; i += 1) {
    const diff = a[i] - b[i];
    sum += diff * diff;
  }
  return sum / a.length;
};

const loadLab = async (buffer, width, height) => {
  const image = sharp(buffer).resize(width, height).toColourspace("lab");
  const { data } = await image.raw().toBuffer({ resolveWithObject: true });
  return data;
};

const buildCandidates = () => {
  const causticsOpacities = Array.from({ length: 21 }, (_, i) => Number((i * 0.03).toFixed(2)));
  const shimmerOpacities = Array.from({ length: 16 }, (_, i) => Number((i * 0.02).toFixed(2)));
  const blends = ["screen", "soft-light"];

  const candidates = [];
  for (const causticsOpacity of causticsOpacities) {
    for (const shimmerOpacity of shimmerOpacities) {
      for (const causticsBlend of blends) {
        for (const shimmerBlend of blends) {
          if (causticsBlend === "screen" && shimmerBlend === "screen") continue;
          candidates.push({
            causticsOpacity,
            causticsBlend,
            shimmerOpacity,
            shimmerBlend,
          });
        }
      }
    }
  }
  return candidates;
};

const applyOverrides = async (page, candidate) => {
  await page.evaluate((params) => {
    const applyStyle = (id, style) => {
      const el = document.querySelector(`[data-surface-id="${id}"]`);
      if (!el) return false;
      Object.assign(el.style, style);
      return true;
    };

    const heroContent = document.querySelector(".hero-content");
    if (heroContent) heroContent.style.display = "none";
    applyStyle("hero.contentFrame", { opacity: "0" });

    const overlayCaustics = document.querySelector('[data-surface-id="overlay.caustics"]');
    if (overlayCaustics) {
      overlayCaustics.style.opacity = "0";
      overlayCaustics.style.display = "none";
    }

    const motionCaustics = document.querySelector('[data-surface-id="sacred.motion.waveCaustics"]');
    if (motionCaustics) {
      motionCaustics.style.opacity = String(params.causticsOpacity);
      motionCaustics.style.mixBlendMode = params.causticsBlend;
    }

    const motionShimmer = document.querySelector('[data-surface-id="sacred.motion.glassShimmer"]');
    if (motionShimmer) {
      motionShimmer.style.opacity = String(params.shimmerOpacity);
      motionShimmer.style.mixBlendMode = params.shimmerBlend;
    }
  }, candidate);
};

const captureHero = async (page) => {
  const isolateHero = page.locator(".heroDebugIsolate .hero-renderer");
  const target = (await isolateHero.count()) > 0 ? isolateHero.first() : page.locator(".hero-renderer").first();
  await target.waitFor({ state: "visible", timeout: 15000 });
  return target.screenshot({ type: "png" });
};

const main = async () => {
  const resolvedReference = ensureReference();
  if (!resolvedReference) {
    console.error(missingReferenceMessage);
    process.exitCode = 1;
    return;
  }
  fs.mkdirSync(reportsDir, { recursive: true });

  const { child } = await startDevServer();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 960, height: 600 } });

  const referenceBuffer = fs.readFileSync(resolvedReference);
  const candidates = buildCandidates();
  const results = [];
  let referenceLab = null;
  let referenceSize = null;

  await page.goto(`${baseUrl}${targetPath}?heroDebug=1`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(300);

  for (const [index, candidate] of candidates.entries()) {
    await applyOverrides(page, candidate);
    await page.waitForTimeout(75);

    const shot = await captureHero(page);
    const { width, height } = await sharp(shot).metadata();
    if (!width || !height) throw new Error("Unable to read screenshot dimensions.");

    if (!referenceLab || referenceSize?.width !== width || referenceSize?.height !== height) {
      referenceLab = await loadLab(referenceBuffer, width, height);
      referenceSize = { width, height };
    }

    const labShot = await loadLab(shot, width, height);

    const labMse = mse(labShot, referenceLab);
    const score = labMse;

    results.push({
      candidate,
      score,
      labMse,
    });

    if ((index + 1) % 20 === 0) {
      console.log(`Processed ${index + 1}/${candidates.length} candidates...`);
    }
  }

  results.sort((a, b) => a.score - b.score);
  const best = results[0];

  await applyOverrides(page, best.candidate);
  await page.waitForTimeout(75);

  const bestShot = await captureHero(page);
  fs.writeFileSync(bestPath, bestShot);
  fs.writeFileSync(resultsPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    totalCandidates: results.length,
    top10: results.slice(0, 10),
    best,
  }, null, 2));

  await browser.close();
  if (child) child.kill("SIGTERM");

  console.log("Top 10 candidates:");
  results.slice(0, 10).forEach((entry, index) => {
    console.log(`#${index + 1}`, entry.score.toFixed(4), entry.candidate);
  });
  console.log(`Best candidate saved to ${bestPath}`);
  console.log(`Results saved to ${resultsPath}`);
};

main().catch((error) => {
  console.error("hero_match_sacred failed:", error);
  process.exitCode = 1;
});
