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
const heroMatchPath = process.env.HERO_MATCH_PATH ?? "/champagne/hero-debug";

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

const sobelKernelX = {
  width: 3,
  height: 3,
  kernel: [-1, 0, 1, -2, 0, 2, -1, 0, 1],
};

const sobelKernelY = {
  width: 3,
  height: 3,
  kernel: [-1, -2, -1, 0, 0, 0, 1, 2, 1],
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

const loadEdges = async (buffer, width, height) => {
  const image = sharp(buffer)
    .resize(width, height)
    .greyscale()
    .convolve(sobelKernelX)
    .composite([
      {
        input: await sharp(buffer).resize(width, height).greyscale().convolve(sobelKernelY).toBuffer(),
        blend: "add",
      },
    ]);
  const { data } = await image.raw().toBuffer({ resolveWithObject: true });
  return data;
};

const buildCandidates = () => {
  const waveCausticsOpacities = [];
  for (let value = 0; value <= 0.6001; value += 0.03) {
    waveCausticsOpacities.push(Number(value.toFixed(2)));
  }

  const glassShimmerOpacities = [];
  for (let value = 0; value <= 0.3001; value += 0.02) {
    glassShimmerOpacities.push(Number(value.toFixed(2)));
  }

  const blendModes = ["screen", "soft-light"];
  const candidates = [];

  for (const waveCausticsOpacity of waveCausticsOpacities) {
    for (const glassShimmerOpacity of glassShimmerOpacities) {
      for (const waveCausticsBlend of blendModes) {
        for (const glassShimmerBlend of blendModes) {
          if (waveCausticsBlend === "screen" && glassShimmerBlend === "screen") continue;
          candidates.push({
            waveCausticsOpacity,
            glassShimmerOpacity,
            waveCausticsBlend,
            glassShimmerBlend,
          });
        }
      }
    }
  }

  return candidates;
};

const applyOverrides = async (page, candidate) => {
  await page.evaluate((params) => {
    const applyStyle = (selector, style) => {
      const nodes = document.querySelectorAll(selector);
      if (!nodes.length) return false;
      nodes.forEach((node) => Object.assign(node.style, style));
      return true;
    };

    applyStyle('.hero-content', { display: "none" });
    applyStyle('[data-surface-id="hero.contentFrame"]', { opacity: "0", display: "none" });

    applyStyle('[data-surface-id="overlay.caustics"]', {
      opacity: String(params.waveCausticsOpacity),
      mixBlendMode: params.waveCausticsBlend,
    });
    applyStyle('[data-surface-id="sacred.motion.waveCaustics"]', {
      opacity: String(params.waveCausticsOpacity),
      mixBlendMode: params.waveCausticsBlend,
    });

    applyStyle('[data-surface-id="overlay.glassShimmer"]', {
      opacity: String(params.glassShimmerOpacity),
      mixBlendMode: params.glassShimmerBlend,
    });
    applyStyle('[data-surface-id="sacred.motion.glassShimmer"]', {
      opacity: String(params.glassShimmerOpacity),
      mixBlendMode: params.glassShimmerBlend,
    });
  }, candidate);
};

const captureHero = async (page) => {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const heroSurface = page.locator(".hero-debug-hero-shell .hero-renderer .hero-surface-stack");
    try {
      await heroSurface.waitFor({ state: "visible", timeout: 15000 });
      return await heroSurface.screenshot({ type: "png" });
    } catch (error) {
      lastError = error;
      await page.waitForTimeout(200);
    }
  }
  throw lastError;
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
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const referenceBuffer = fs.readFileSync(resolvedReference);
  const candidates = buildCandidates();
  const results = [];

  await page.goto(`${baseUrl}${heroMatchPath}?heroDebug=1`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(800);

  await applyOverrides(page, candidates[0]);
  await page.waitForTimeout(150);
  const baselineShot = await captureHero(page);
  const { width, height } = await sharp(baselineShot).metadata();
  if (!width || !height) throw new Error("Unable to read screenshot dimensions.");
  const matchWidth = Math.min(480, width);
  const matchHeight = Math.max(1, Math.round((matchWidth / width) * height));

  const [referenceLab, referenceEdge] = await Promise.all([
    loadLab(referenceBuffer, matchWidth, matchHeight),
    loadEdges(referenceBuffer, matchWidth, matchHeight),
  ]);

  for (const candidate of candidates) {
    await applyOverrides(page, candidate);
    await page.waitForTimeout(150);

    const shot = await captureHero(page);

    const [labShot, edgeShot] = await Promise.all([
      loadLab(shot, matchWidth, matchHeight),
      loadEdges(shot, matchWidth, matchHeight),
    ]);

    const labMse = mse(labShot, referenceLab);
    const edgeMse = mse(edgeShot, referenceEdge);
    const score = labMse * 0.7 + edgeMse * 0.3;

    results.push({
      candidate,
      score,
      labMse,
      edgeMse,
    });
  }

  results.sort((a, b) => a.score - b.score);
  const best = results[0];

  await applyOverrides(page, best.candidate);
  await page.waitForTimeout(150);

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
