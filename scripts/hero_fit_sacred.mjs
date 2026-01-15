import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import http from "node:http";
import process from "node:process";
import { chromium } from "playwright";
import sharp from "sharp";

const repoRoot = process.cwd();
const referenceDir = path.join(repoRoot, "reference");
const defaultReferencePath = path.join(referenceDir, "sacred-hero.png");
const reportsDir = path.join(repoRoot, "reports", "hero-fit");
const bestPath = path.join(reportsDir, "best.png");
const motionDeltaPath = path.join(reportsDir, "motion_delta.png");
const resultsPath = path.join(reportsDir, "results.json");

const baseUrl = process.env.HERO_FIT_URL ?? "http://localhost:3000";
const heroRoute = process.env.HERO_FIT_ROUTE ?? "/champagne/hero-preview";
const heroQuery = process.env.HERO_FIT_QUERY ?? "theme=dark&particles=1&filmGrain=1&prm=0";
const captureUrl = `${baseUrl}${heroRoute}?${heroQuery}`;

const deviceScaleFactor = Number.parseFloat(process.env.HERO_FIT_DPR ?? "1");
const motionDelayMs = Number.parseInt(process.env.HERO_FIT_MOTION_MS ?? "600", 10);
const lambda = Number.parseFloat(process.env.HERO_FIT_LAMBDA ?? "0.12");
const epsilon = 0.0001;

const missingReferenceMessage = [
  "Reference image not found for hero_fit_sacred.",
  "Set SACRED_HERO_TARGET, place sacred-hero.png at reference/sacred-hero.png,",
  "or /mnt/data/sacred-hero.png and re-run manually.",
  "This fitter never runs in verify/guards/CI; it is manual only.",
].join(" ");

const resolveReference = () => {
  const envPath = process.env.SACRED_HERO_TARGET;
  if (envPath && fs.existsSync(envPath)) return path.resolve(envPath);
  if (fs.existsSync(defaultReferencePath)) return defaultReferencePath;
  const legacyPath = "/mnt/data/sacred-hero.png";
  if (fs.existsSync(legacyPath)) return legacyPath;
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
  const causticsOpacities = [0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5];
  const shimmerOpacities = [0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4];
  const blends = ["soft-light", "screen", "overlay"];

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

const waitForHeroReady = async (page) => {
  const selectors = [
    '[data-surface-id="hero.contentFrame"]',
    '[data-surface-id="mask.waveHeader"]',
    '[data-surface-id="sacred.motion.waveCaustics"]',
    '[data-surface-id="sacred.motion.glassShimmer"]',
  ];
  await Promise.all(selectors.map((selector) => page.waitForSelector(selector, { state: "attached", timeout: 15000 })));
};

const hideHeroContent = async (page) => {
  await page.addStyleTag({
    content: `
      .hero-content { display: none !important; }
      [data-surface-id="hero.contentFrame"] { opacity: 0 !important; }
    `,
  });
};

const captureHero = async (page) => {
  const target = page.locator(".hero-renderer").first();
  await target.waitFor({ state: "visible", timeout: 15000 });
  return target.screenshot({ type: "png" });
};

const resolveViewport = async (referenceBuffer) => {
  const meta = await sharp(referenceBuffer).metadata();
  if (!meta.width || !meta.height) throw new Error("Unable to read reference dimensions.");
  return { width: meta.width, height: meta.height };
};

const computeMotionEnergy = async (bufferA, bufferB, roi) => {
  const extract = async (buffer) =>
    sharp(buffer)
      .extract(roi)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

  const { data: dataA, info } = await extract(bufferA);
  const { data: dataB } = await extract(bufferB);

  let sum = 0;
  const pixelCount = info.width * info.height;
  for (let i = 0; i < dataA.length; i += 4) {
    const diffR = Math.abs(dataA[i] - dataB[i]);
    const diffG = Math.abs(dataA[i + 1] - dataB[i + 1]);
    const diffB = Math.abs(dataA[i + 2] - dataB[i + 2]);
    sum += (diffR + diffG + diffB) / 3;
  }
  return sum / pixelCount;
};

const buildMotionDeltaImage = async (bufferA, bufferB) => {
  const { data: dataA, info } = await sharp(bufferA).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { data: dataB } = await sharp(bufferB).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const diff = Buffer.alloc(info.width * info.height);
  const scale = 4;

  for (let i = 0, p = 0; i < dataA.length; i += 4, p += 1) {
    const diffR = Math.abs(dataA[i] - dataB[i]);
    const diffG = Math.abs(dataA[i + 1] - dataB[i + 1]);
    const diffB = Math.abs(dataA[i + 2] - dataB[i + 2]);
    const mean = (diffR + diffG + diffB) / 3;
    diff[p] = Math.min(255, Math.round(mean * scale));
  }

  await sharp(diff, { raw: { width: info.width, height: info.height, channels: 1 } }).png().toFile(motionDeltaPath);
  return { width: info.width, height: info.height, scale };
};

const main = async () => {
  const resolvedReference = resolveReference();
  if (!resolvedReference) {
    console.error(missingReferenceMessage);
    process.exitCode = 1;
    return;
  }

  fs.mkdirSync(reportsDir, { recursive: true });

  const referenceBuffer = fs.readFileSync(resolvedReference);
  const viewport = await resolveViewport(referenceBuffer);

  console.log("[Hero Fit] capture route", captureUrl);
  console.log("[Hero Fit] target", resolvedReference);
  console.log("[Hero Fit] viewport", viewport, "dpr", deviceScaleFactor);
  console.log("[Hero Fit] toggles", {
    particles: true,
    filmGrain: true,
    prm: false,
    theme: heroQuery.includes("theme=light") ? "light" : "dark",
  });

  const { child } = await startDevServer();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport, deviceScaleFactor });

  await page.goto(captureUrl, { waitUntil: "domcontentloaded" });
  await waitForHeroReady(page);
  await hideHeroContent(page);

  const candidates = buildCandidates();
  const results = [];
  let referenceLab = null;

  const roi = {
    left: Math.round(viewport.width * 0.2),
    top: Math.round(viewport.height * 0.35),
    width: Math.round(viewport.width * 0.6),
    height: Math.round(viewport.height * 0.3),
  };

  for (const [index, candidate] of candidates.entries()) {
    await applyOverrides(page, candidate);
    await page.waitForTimeout(75);

    const staticShot = await captureHero(page);
    const labShot = await loadLab(staticShot, viewport.width, viewport.height);
    if (!referenceLab) {
      referenceLab = await loadLab(referenceBuffer, viewport.width, viewport.height);
    }

    const staticScore = mse(labShot, referenceLab);

    const motionStart = staticShot;
    await page.waitForTimeout(motionDelayMs);
    const motionEnd = await captureHero(page);
    const motionEnergy = await computeMotionEnergy(motionStart, motionEnd, roi);

    const objective = staticScore + lambda * (1 / (motionEnergy + epsilon));

    results.push({
      candidate,
      staticScore,
      motionScore: motionEnergy,
      objective,
    });

    if ((index + 1) % 30 === 0) {
      console.log(`Processed ${index + 1}/${candidates.length} candidates...`);
    }
  }

  results.sort((a, b) => a.objective - b.objective);
  const best = results[0];

  await applyOverrides(page, best.candidate);
  await page.waitForTimeout(75);
  const bestShot = await captureHero(page);
  fs.writeFileSync(bestPath, bestShot);

  const motionStart = bestShot;
  await page.waitForTimeout(motionDelayMs);
  const motionEnd = await captureHero(page);
  const motionMeta = await buildMotionDeltaImage(motionStart, motionEnd);

  const output = {
    generatedAt: new Date().toISOString(),
    capture: {
      url: captureUrl,
      route: heroRoute,
      query: heroQuery,
      viewport,
      dpr: deviceScaleFactor,
      motionDelayMs,
    },
    roi,
    objective: {
      formula: "staticScore + lambda * (1 / (motionScore + epsilon))",
      lambda,
      epsilon,
    },
    motionDelta: {
      file: "reports/hero-fit/motion_delta.png",
      scale: motionMeta.scale,
      width: motionMeta.width,
      height: motionMeta.height,
    },
    totalCandidates: results.length,
    top10: results.slice(0, 10),
    best,
  };

  fs.writeFileSync(resultsPath, JSON.stringify(output, null, 2));

  console.log("Best candidate:", best.candidate);
  console.log("Best scores:", {
    staticScore: best.staticScore,
    motionScore: best.motionScore,
    objective: best.objective,
  });
  console.log(`Best static frame saved to ${bestPath}`);
  console.log(`Motion delta saved to ${motionDeltaPath}`);
  console.log(`Results saved to ${resultsPath}`);

  await browser.close();
  if (child) child.kill("SIGTERM");
};

main().catch((error) => {
  console.error("hero_fit_sacred failed:", error);
  process.exitCode = 1;
});
