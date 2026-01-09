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

const ensureReference = () => {
  if (fs.existsSync(referencePath)) return referencePath;
  const legacyPath = "/mnt/data/sacred-hero.png";
  if (fs.existsSync(legacyPath)) {
    fs.mkdirSync(referenceDir, { recursive: true });
    fs.copyFileSync(legacyPath, referencePath);
    return referencePath;
  }
  throw new Error(
    `Reference image not found. Place sacred-hero.png at ${referencePath} (or ${legacyPath}) before running this script.`,
  );
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
  const maskOpacities = [0.45, 0.55, 0.65, 0.75];
  const backdropOpacities = [0.2, 0.27, 0.35];
  const ringsOpacities = [0.35, 0.45];
  const dotsOpacities = [0.35, 0.45];
  const causticsOpacities = [0.25, 0.35, 0.45];
  const causticsBlends = ["soft-light", "screen"];

  const candidates = [];
  for (const maskOpacity of maskOpacities) {
    for (const backdropOpacity of backdropOpacities) {
      for (const ringsOpacity of ringsOpacities) {
        for (const dotsOpacity of dotsOpacities) {
          for (const causticsOpacity of causticsOpacities) {
            for (const causticsBlend of causticsBlends) {
              candidates.push({
                maskOpacity,
                backdropOpacity,
                ringsOpacity,
                dotsOpacity,
                causticsOpacity,
                causticsBlend,
                causticsSource: "motion",
              });
            }
          }
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

    applyStyle("field.waveBackdrop", { opacity: String(params.backdropOpacity) });
    applyStyle("field.waveRings", { opacity: String(params.ringsOpacity) });
    applyStyle("field.dotGrid", { opacity: String(params.dotsOpacity) });
    applyStyle("mask.waveHeader", { opacity: String(params.maskOpacity) });

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
  }, candidate);
};

const captureHero = async (page) => {
  const hero = page.locator(".hero-renderer");
  await hero.waitFor({ state: "visible", timeout: 15000 });
  return hero.screenshot({ type: "png" });
};

const main = async () => {
  ensureReference();
  fs.mkdirSync(reportsDir, { recursive: true });

  const { child } = await startDevServer();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const referenceBuffer = fs.readFileSync(referencePath);
  const candidates = buildCandidates();
  const results = [];

  for (const candidate of candidates) {
    await page.goto(`${baseUrl}/?heroDebug=1`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    await applyOverrides(page, candidate);
    await page.waitForTimeout(500);

    const shot = await captureHero(page);
    const { width, height } = await sharp(shot).metadata();
    if (!width || !height) throw new Error("Unable to read screenshot dimensions.");

    const [labShot, labRef, edgeShot, edgeRef] = await Promise.all([
      loadLab(shot, width, height),
      loadLab(referenceBuffer, width, height),
      loadEdges(shot, width, height),
      loadEdges(referenceBuffer, width, height),
    ]);

    const labMse = mse(labShot, labRef);
    const edgeMse = mse(edgeShot, edgeRef);
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

  await page.goto(`${baseUrl}/?heroDebug=1`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await applyOverrides(page, best.candidate);
  await page.waitForTimeout(500);

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
