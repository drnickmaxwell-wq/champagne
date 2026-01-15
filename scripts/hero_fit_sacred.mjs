import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import http from "node:http";
import process from "node:process";
import { chromium } from "playwright";
import sharp from "sharp";

const repoRoot = process.cwd();
const referenceDir = path.join(repoRoot, "reference");
const staticReferencePath = path.join(referenceDir, "candidates", "sacred_preview_static.png");
const legacyReferencePath = path.join(referenceDir, "sacred-hero.png");
const reportsDir = path.join(repoRoot, "reports", "hero-fit");
const bestPath = path.join(reportsDir, "best.png");
const motionDeltaPath = path.join(reportsDir, "motion_delta.png");
const topGridPath = path.join(reportsDir, "top_12_grid.png");
const resultsPath = path.join(reportsDir, "results.json");
const reportPath = path.join(reportsDir, "report.json");

const baseUrl = process.env.HERO_FIT_URL ?? "http://localhost:3000";
const heroRoute = process.env.HERO_FIT_ROUTE ?? "/champagne/hero-preview";
const heroQuery = process.env.HERO_FIT_QUERY ?? "theme=dark&particles=1&filmGrain=1&prm=0";
const captureUrl = `${baseUrl}${heroRoute}?${heroQuery}`;

const deviceScaleFactor = Number.parseFloat(process.env.HERO_FIT_DPR ?? "1");
const motionDelayMs = Number.parseInt(process.env.HERO_FIT_MOTION_MS ?? "600", 10);
const motionRewardWeight = Number.parseFloat(process.env.HERO_FIT_MOTION_WEIGHT ?? "0.7");
const chromaTolerance = Number.parseFloat(process.env.HERO_FIT_CHROMA_TOLERANCE ?? "1.4");
const chromaPenaltyWeight = Number.parseFloat(process.env.HERO_FIT_CHROMA_WEIGHT ?? "1.2");
const chromaRoiPenaltyWeight = Number.parseFloat(process.env.HERO_FIT_CHROMA_ROI_WEIGHT ?? "2.4");
const washoutTolerance = Number.parseFloat(process.env.HERO_FIT_WASHOUT_TOLERANCE ?? "1.1");
const washoutPenaltyWeight = Number.parseFloat(process.env.HERO_FIT_WASHOUT_WEIGHT ?? "1.6");
const midFieldTolerance = Number.parseFloat(process.env.HERO_FIT_MIDFIELD_TOLERANCE ?? "0.8");
const midFieldPenaltyWeight = Number.parseFloat(process.env.HERO_FIT_MIDFIELD_WEIGHT ?? "1.8");
const epsilon = 0.0001;

const missingReferenceMessage = [
  "Reference image not found for hero_fit_sacred.",
  "Set SACRED_HERO_TARGET, place sacred_preview_static.png at reference/candidates/",
  "or sacred-hero.png at reference/sacred-hero.png, or /mnt/data/sacred-hero.png and re-run manually.",
  "This fitter never runs in verify/guards/CI; it is manual only.",
].join(" ");

const resolveReference = () => {
  const envPath = process.env.SACRED_HERO_TARGET ? path.resolve(process.env.SACRED_HERO_TARGET) : null;
  if (envPath && fs.existsSync(envPath)) return envPath;
  if (fs.existsSync(staticReferencePath)) return staticReferencePath;
  if (fs.existsSync(legacyReferencePath)) return legacyReferencePath;
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

const computeLabStats = (data, channels) => {
  let sumL = 0;
  let sumC = 0;
  let count = 0;
  for (let i = 0; i < data.length; i += channels) {
    const l = data[i];
    const a = data[i + 1];
    const b = data[i + 2];
    sumL += l;
    sumC += Math.sqrt(a * a + b * b);
    count += 1;
  }
  return {
    meanL: sumL / count,
    meanChroma: sumC / count,
  };
};

const loadLabStats = async (buffer, width, height, roi) => {
  const pipeline = sharp(buffer).resize(width, height);
  if (roi) pipeline.extract(roi);
  const { data, info } = await pipeline.toColourspace("lab").raw().toBuffer({ resolveWithObject: true });
  return computeLabStats(data, info.channels ?? 3);
};

const buildCandidates = () => {
  const causticsOpacities = [0.08, 0.12, 0.15, 0.18];
  const shimmerOpacities = [0.06, 0.1, 0.14, 0.18];
  const blends = ["soft-light", "screen", "overlay"];

  const candidates = [];
  for (const causticsOpacity of causticsOpacities) {
    for (const shimmerOpacity of shimmerOpacities) {
      if (causticsOpacity > 0.18 || shimmerOpacity > 0.18) continue;
      if (causticsOpacity + shimmerOpacity > 0.35) continue;
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

const normalizeEnergy = (energy) => energy / 255;

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

const buildTopGrid = async (page, candidates, viewport) => {
  const columns = 4;
  const rows = Math.ceil(candidates.length / columns);
  const composites = [];
  for (const [index, entry] of candidates.entries()) {
    await applyOverrides(page, entry.candidate);
    await page.waitForTimeout(75);
    const shot = await captureHero(page);
    composites.push({
      input: shot,
      left: (index % columns) * viewport.width,
      top: Math.floor(index / columns) * viewport.height,
    });
  }
  await sharp({
    create: {
      width: columns * viewport.width,
      height: rows * viewport.height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(composites)
    .png()
    .toFile(topGridPath);
  return { columns, rows };
};

const main = async () => {
  const resolvedReference = resolveReference();
  const resolvedExists = resolvedReference ? fs.existsSync(resolvedReference) : false;
  console.log("[Hero Fit] resolved target", resolvedReference ?? "missing", "exists", resolvedExists);
  if (!resolvedReference) {
    console.error(missingReferenceMessage);
    process.exitCode = 1;
    return;
  }

  fs.mkdirSync(reportsDir, { recursive: true });

  const referenceBuffer = fs.readFileSync(resolvedReference);
  const viewport = await resolveViewport(referenceBuffer);
  const queryParams = new URLSearchParams(heroQuery);
  const theme = queryParams.get("theme") ?? "dark";
  const reducedMotion = queryParams.get("prm") === "1";
  const enabledLayers = {
    particles: queryParams.get("particles") === "1",
    filmGrain: queryParams.get("filmGrain") === "1",
    motion: !reducedMotion,
  };

  console.log("[Hero Fit] capture route", captureUrl);
  console.log("[Hero Fit] target", resolvedReference, "exists", fs.existsSync(resolvedReference));
  console.log("[Hero Fit] viewport", viewport, "dpr", deviceScaleFactor);
  console.log("[Hero Fit] toggles", {
    ...enabledLayers,
    reducedMotion,
    theme,
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
  const referenceStats = await loadLabStats(referenceBuffer, viewport.width, viewport.height);

  const roi = {
    left: Math.round(viewport.width * 0.2),
    top: Math.round(viewport.height * 0.35),
    width: Math.round(viewport.width * 0.6),
    height: Math.round(viewport.height * 0.3),
  };
  const referenceRoiStats = await loadLabStats(referenceBuffer, viewport.width, viewport.height, roi);

  for (const [index, candidate] of candidates.entries()) {
    await applyOverrides(page, candidate);
    await page.waitForTimeout(75);

    const staticShot = await captureHero(page);
    const labShot = await loadLab(staticShot, viewport.width, viewport.height);
    if (!referenceLab) {
      referenceLab = await loadLab(referenceBuffer, viewport.width, viewport.height);
    }

    const staticScore = mse(labShot, referenceLab);
    const staticScoreNormalized = staticScore / (255 * 255);
    const candidateStats = await loadLabStats(staticShot, viewport.width, viewport.height);
    const candidateRoiStats = await loadLabStats(staticShot, viewport.width, viewport.height, roi);

    const chromaDeficit = Math.max(0, referenceStats.meanChroma - candidateStats.meanChroma - chromaTolerance);
    const chromaDeficitRoi = Math.max(0, referenceRoiStats.meanChroma - candidateRoiStats.meanChroma - chromaTolerance);
    const chromaPenalty = chromaDeficit * chromaPenaltyWeight + chromaDeficitRoi * chromaRoiPenaltyWeight;

    const washoutDelta = Math.max(0, candidateStats.meanL - referenceStats.meanL - washoutTolerance);
    const washoutPenalty = washoutDelta * washoutPenaltyWeight;
    const midFieldDelta = Math.max(0, candidateRoiStats.meanL - referenceRoiStats.meanL - midFieldTolerance);
    const midFieldPenalty = midFieldDelta * midFieldPenaltyWeight;

    const motionStart = staticShot;
    await page.waitForTimeout(motionDelayMs);
    const motionEnd = await captureHero(page);
    const motionEnergy = await computeMotionEnergy(motionStart, motionEnd, roi);
    const motionEnergyNormalized = normalizeEnergy(motionEnergy);
    const motionReward = motionEnergyNormalized * motionRewardWeight;

    const objective =
      staticScoreNormalized + chromaPenalty + washoutPenalty + midFieldPenalty - motionReward + epsilon;

    results.push({
      candidate,
      staticScore,
      staticScoreNormalized,
      chromaPenalty,
      washoutPenalty,
      midFieldPenalty,
      motionScore: motionEnergy,
      motionScoreNormalized: motionEnergyNormalized,
      motionReward,
      objective,
      stats: {
        meanL: candidateStats.meanL,
        meanChroma: candidateStats.meanChroma,
        roiMeanL: candidateRoiStats.meanL,
        roiMeanChroma: candidateRoiStats.meanChroma,
      },
    });

    if ((index + 1) % 30 === 0) {
      console.log(`Processed ${index + 1}/${candidates.length} candidates...`);
    }
  }

  results.sort((a, b) => a.objective - b.objective);
  const best = results[0];
  const top12 = results.slice(0, 12);

  await applyOverrides(page, best.candidate);
  await page.waitForTimeout(75);
  const bestShot = await captureHero(page);
  fs.writeFileSync(bestPath, bestShot);

  const motionStart = bestShot;
  await page.waitForTimeout(motionDelayMs);
  const motionEnd = await captureHero(page);
  const motionMeta = await buildMotionDeltaImage(motionStart, motionEnd);

  const gridMeta = await buildTopGrid(page, top12, viewport);

  const resultsOutput = {
    generatedAt: new Date().toISOString(),
    target: resolvedReference,
    capture: {
      url: captureUrl,
      route: heroRoute,
      query: heroQuery,
      viewport,
      dpr: deviceScaleFactor,
      deviceScaleFactor,
      theme,
      reducedMotion,
      enabledLayers,
      motionDelayMs,
    },
    roi,
    objective: {
      formula:
        "staticScoreNormalized + chromaPenalty + washoutPenalty + midFieldPenalty - motionReward + epsilon",
      motionRewardWeight,
      chromaTolerance,
      chromaPenaltyWeight,
      chromaRoiPenaltyWeight,
      washoutTolerance,
      washoutPenaltyWeight,
      midFieldTolerance,
      midFieldPenaltyWeight,
      epsilon,
    },
    motionDelta: {
      file: "reports/hero-fit/motion_delta.png",
      scale: motionMeta.scale,
      width: motionMeta.width,
      height: motionMeta.height,
    },
    grid: {
      file: "reports/hero-fit/top_12_grid.png",
      columns: gridMeta.columns,
      rows: gridMeta.rows,
      count: top12.length,
    },
    totalCandidates: results.length,
    best,
    results,
  };

  const reportOutput = {
    generatedAt: resultsOutput.generatedAt,
    target: resolvedReference,
    capture: resultsOutput.capture,
    roi,
    objective: resultsOutput.objective,
    grid: resultsOutput.grid,
    motionDelta: resultsOutput.motionDelta,
    totalCandidates: results.length,
    top12,
    best,
  };

  fs.writeFileSync(resultsPath, JSON.stringify(resultsOutput, null, 2));
  fs.writeFileSync(reportPath, JSON.stringify(reportOutput, null, 2));

  console.log("Best candidate:", best.candidate);
  console.log("Best scores:", {
    staticScore: best.staticScore,
    motionScore: best.motionScore,
    chromaPenalty: best.chromaPenalty,
    washoutPenalty: best.washoutPenalty,
    midFieldPenalty: best.midFieldPenalty,
    objective: best.objective,
  });
  console.log(`Best static frame saved to ${bestPath}`);
  console.log(`Motion delta saved to ${motionDeltaPath}`);
  console.log(`Top grid saved to ${topGridPath}`);
  console.log(`Results saved to ${resultsPath}`);
  console.log(`Report saved to ${reportPath}`);

  await browser.close();
  if (child) child.kill("SIGTERM");
};

main().catch((error) => {
  console.error("hero_fit_sacred failed:", error);
  process.exitCode = 1;
});
