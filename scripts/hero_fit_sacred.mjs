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
const candidateTimeoutMs = Number.parseInt(process.env.HERO_FIT_CANDIDATE_TIMEOUT_MS ?? "25000", 10);
const motionRewardWeight = Number.parseFloat(process.env.HERO_FIT_MOTION_WEIGHT ?? "0.9");
const motionRewardCap = Number.parseFloat(process.env.HERO_FIT_MOTION_REWARD_CAP ?? "0.6");
const colorEnergyWeight = Number.parseFloat(process.env.HERO_FIT_COLOR_ENERGY_WEIGHT ?? "0.4");
const chromaTolerance = Number.parseFloat(process.env.HERO_FIT_CHROMA_TOLERANCE ?? "1.4");
const chromaPenaltyWeight = Number.parseFloat(process.env.HERO_FIT_CHROMA_WEIGHT ?? "1.2");
const chromaRoiPenaltyWeight = Number.parseFloat(process.env.HERO_FIT_CHROMA_ROI_WEIGHT ?? "2.4");
const washoutTolerance = Number.parseFloat(process.env.HERO_FIT_WASHOUT_TOLERANCE ?? "1.1");
const washoutPenaltyWeight = Number.parseFloat(process.env.HERO_FIT_WASHOUT_WEIGHT ?? "1.6");
const midFieldTolerance = Number.parseFloat(process.env.HERO_FIT_MIDFIELD_TOLERANCE ?? "0.8");
const midFieldPenaltyWeight = Number.parseFloat(process.env.HERO_FIT_MIDFIELD_WEIGHT ?? "1.8");
const hueDriftTolerance = Number.parseFloat(process.env.HERO_FIT_HUE_DRIFT_TOLERANCE ?? "0.35");
const hueDriftPenaltyWeight = Number.parseFloat(process.env.HERO_FIT_HUE_DRIFT_WEIGHT ?? "1.6");
const huePenaltyCap = Number.parseFloat(process.env.HERO_FIT_HUE_PENALTY_CAP ?? "2.0");
const candidateLimit = process.env.HERO_FIT_CANDIDATE_LIMIT
  ? Number.parseInt(process.env.HERO_FIT_CANDIDATE_LIMIT, 10)
  : null;
const candidateSeed = process.env.HERO_FIT_SEED ?? "sacred-fit";
const causticsOpacityMax = Number.parseFloat(process.env.HERO_FIT_CAUSTICS_OPACITY_MAX ?? "0.28");
const shimmerOpacityMax = Number.parseFloat(process.env.HERO_FIT_SHIMMER_OPACITY_MAX ?? "0.28");
const combinedOpacityMax = Number.parseFloat(process.env.HERO_FIT_COMBINED_OPACITY_MAX ?? "0.55");
const epsilon = 0.0001;

const missingReferenceMessage = [
  "Reference image not found for hero_fit_sacred.",
  "Set SACRED_HERO_TARGET, place sacred_preview_static.png at reference/candidates/",
  "or sacred-hero.png at reference/sacred-hero.png, or /mnt/data/sacred-hero.png and re-run manually.",
  "This fitter never runs in verify/guards/CI; it is manual only.",
].join(" ");

const WATCHDOG_TIMEOUT_MS = Number.parseInt(process.env.HERO_FIT_WATCHDOG_MS ?? "720000", 10);
const CHILD_KILL_TIMEOUT_MS = 2000;

const resolveReference = () => {
  const envPath = process.env.SACRED_HERO_TARGET ? path.resolve(process.env.SACRED_HERO_TARGET) : null;
  if (envPath && fs.existsSync(envPath)) return envPath;
  if (fs.existsSync(staticReferencePath)) return staticReferencePath;
  if (fs.existsSync(legacyReferencePath)) return legacyReferencePath;
  const legacyPath = "/mnt/data/sacred-hero.png";
  if (fs.existsSync(legacyPath)) return legacyPath;
  return null;
};

const resolveViewportOverride = () => {
  const raw = process.env.HERO_FIT_VIEWPORT;
  if (raw) {
    const [widthRaw, heightRaw] = raw.toLowerCase().split("x");
    const width = Number.parseInt(widthRaw, 10);
    const height = Number.parseInt(heightRaw, 10);
    if (Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
      return { width, height };
    }
  }
  const width = process.env.HERO_FIT_VIEWPORT_WIDTH
    ? Number.parseInt(process.env.HERO_FIT_VIEWPORT_WIDTH, 10)
    : null;
  const height = process.env.HERO_FIT_VIEWPORT_HEIGHT
    ? Number.parseInt(process.env.HERO_FIT_VIEWPORT_HEIGHT, 10)
    : null;
  if (width && height && Number.isFinite(width) && Number.isFinite(height)) {
    return { width, height };
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

const waitForChildExit = (child, timeoutMs) =>
  new Promise((resolve) => {
    if (!child || child.exitCode !== null || child.killed) {
      resolve(true);
      return;
    }
    const onExit = () => resolve(true);
    child.once("exit", onExit);
    const timer = setTimeout(() => {
      child.removeListener("exit", onExit);
      resolve(false);
    }, timeoutMs);
    timer.unref?.();
  });

const terminateChild = async (child) => {
  if (!child || child.exitCode !== null) return;
  try {
    child.kill("SIGTERM");
  } catch (error) {
    console.warn("[Hero Fit] failed to SIGTERM dev server", error);
  }
  const exited = await waitForChildExit(child, CHILD_KILL_TIMEOUT_MS);
  if (!exited && child.exitCode === null) {
    try {
      child.kill("SIGKILL");
    } catch (error) {
      console.warn("[Hero Fit] failed to SIGKILL dev server", error);
    }
    await waitForChildExit(child, CHILD_KILL_TIMEOUT_MS);
  }
  child.unref?.();
};

const logActiveHandles = (label) => {
  if (process.env.CI !== "true") return;
  try {
    if (typeof process._getActiveHandles !== "function") return;
    const handles = process._getActiveHandles();
    const summary = handles.map((handle) => handle?.constructor?.name ?? typeof handle);
    console.log(`[Hero Fit] active handles (${label}):`, summary.length, summary);
  } catch (error) {
    console.warn("[Hero Fit] unable to read active handles", error);
  }
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

  if (!ready) {
    child.kill("SIGTERM");
    throw new Error("Dev server did not become ready in time.");
  }
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
  let sumA = 0;
  let sumB = 0;
  let sumC = 0;
  let count = 0;
  for (let i = 0; i < data.length; i += channels) {
    const l = data[i];
    const a = data[i + 1];
    const b = data[i + 2];
    sumL += l;
    sumA += a;
    sumB += b;
    sumC += Math.sqrt(a * a + b * b);
    count += 1;
  }
  return {
    meanL: sumL / count,
    meanA: sumA / count,
    meanB: sumB / count,
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
  const causticsOpacities = [0.08, 0.12, 0.15, 0.18, 0.22, 0.25, 0.28];
  const shimmerOpacities = [0.06, 0.1, 0.14, 0.18, 0.22, 0.25, 0.28];
  const blends = ["soft-light", "screen", "overlay"];

  const candidates = [];
  for (const causticsOpacity of causticsOpacities) {
    for (const shimmerOpacity of shimmerOpacities) {
      if (causticsOpacity > causticsOpacityMax || shimmerOpacity > shimmerOpacityMax) continue;
      if (causticsOpacity + shimmerOpacity > combinedOpacityMax) continue;
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

const hashSeed = (input) => {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const createRng = (seedValue) => {
  let seed = seedValue >>> 0;
  return () => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 0xffffffff;
  };
};

const limitCandidates = (candidates) => {
  if (!candidateLimit || candidateLimit <= 0 || candidateLimit >= candidates.length) {
    return { list: candidates, sampled: false };
  }
  const rng = createRng(hashSeed(candidateSeed));
  const shuffled = [...candidates];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return { list: shuffled.slice(0, candidateLimit), sampled: true };
};

const clampRoi = (roi, viewport) => ({
  left: Math.max(0, Math.min(viewport.width - 1, roi.left)),
  top: Math.max(0, Math.min(viewport.height - 1, roi.top)),
  width: Math.max(1, Math.min(viewport.width - roi.left, roi.width)),
  height: Math.max(1, Math.min(viewport.height - roi.top, roi.height)),
});

const buildRois = (viewport) => {
  const midField = clampRoi(
    {
      left: Math.round(viewport.width * 0.2),
      top: Math.round(viewport.height * 0.35),
      width: Math.round(viewport.width * 0.6),
      height: Math.round(viewport.height * 0.3),
    },
    viewport,
  );
  const hue = {
    magenta: clampRoi(
      {
        left: Math.round(viewport.width * 0.08),
        top: Math.round(viewport.height * 0.08),
        width: Math.round(viewport.width * 0.22),
        height: Math.round(viewport.height * 0.22),
      },
      viewport,
    ),
    teal: clampRoi(
      {
        left: Math.round(viewport.width * 0.68),
        top: Math.round(viewport.height * 0.34),
        width: Math.round(viewport.width * 0.24),
        height: Math.round(viewport.height * 0.24),
      },
      viewport,
    ),
    gold: clampRoi(
      {
        left: Math.round(viewport.width * 0.62),
        top: Math.round(viewport.height * 0.66),
        width: Math.round(viewport.width * 0.26),
        height: Math.round(viewport.height * 0.24),
      },
      viewport,
    ),
  };
  return { midField, hue };
};

const computeHueDrift = (reference, candidate) => {
  const deltaA = (candidate.meanA - reference.meanA) / 128;
  const deltaB = (candidate.meanB - reference.meanB) / 128;
  return Math.sqrt(deltaA * deltaA + deltaB * deltaB);
};

const withTimeout = async (promise, timeoutMs, label) => {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      const suffix = label ? ` (${label})` : "";
      reject(new Error(`Candidate timed out after ${timeoutMs}ms${suffix}`));
    }, timeoutMs);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId);
  }
};

const handlePlaywrightError = (error) => {
  const message = error instanceof Error ? error.message : String(error);
  const lower = message.toLowerCase();
  if (lower.includes("executable") || lower.includes("playwright") || lower.includes("browser")) {
    console.error("Playwright not available in this environment; run locally.");
    return true;
  }
  return false;
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
  const override = resolveViewportOverride();
  if (override) return override;
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

const evaluateCandidate = async ({
  page,
  candidate,
  viewport,
  referenceLab,
  referenceStats,
  referenceRoiStats,
  referenceHueStats,
  rois,
}) => {
  await applyOverrides(page, candidate);
  await page.waitForTimeout(75);

  const staticShot = await captureHero(page);
  const labShot = await loadLab(staticShot, viewport.width, viewport.height);

  const staticScore = mse(labShot, referenceLab);
  const staticScoreNormalized = staticScore / (255 * 255);
  const candidateStats = await loadLabStats(staticShot, viewport.width, viewport.height);
  const candidateRoiStats = await loadLabStats(staticShot, viewport.width, viewport.height, rois.midField);
  const candidateHueStats = {
    magenta: await loadLabStats(staticShot, viewport.width, viewport.height, rois.hue.magenta),
    teal: await loadLabStats(staticShot, viewport.width, viewport.height, rois.hue.teal),
    gold: await loadLabStats(staticShot, viewport.width, viewport.height, rois.hue.gold),
  };

  const chromaDeficit = Math.max(0, referenceStats.meanChroma - candidateStats.meanChroma - chromaTolerance);
  const chromaDeficitRoi = Math.max(
    0,
    referenceRoiStats.meanChroma - candidateRoiStats.meanChroma - chromaTolerance,
  );
  const chromaPenalty = chromaDeficit * chromaPenaltyWeight + chromaDeficitRoi * chromaRoiPenaltyWeight;
  const referenceOutsideChroma = Math.max(0, referenceStats.meanChroma - referenceRoiStats.meanChroma);
  const candidateOutsideChroma = Math.max(0, candidateStats.meanChroma - candidateRoiStats.meanChroma);
  const colorEnergyGain = Math.max(0, candidateOutsideChroma - referenceOutsideChroma);
  const colorEnergyReward = colorEnergyGain * colorEnergyWeight;

  const washoutDelta = Math.max(0, candidateStats.meanL - referenceStats.meanL - washoutTolerance);
  const washoutPenalty = washoutDelta * washoutPenaltyWeight;
  const midFieldDelta = Math.max(0, candidateRoiStats.meanL - referenceRoiStats.meanL - midFieldTolerance);
  const midFieldPenalty = midFieldDelta * midFieldPenaltyWeight;

  const hueDrift = {
    magenta: computeHueDrift(referenceHueStats.magenta, candidateHueStats.magenta),
    teal: computeHueDrift(referenceHueStats.teal, candidateHueStats.teal),
    gold: computeHueDrift(referenceHueStats.gold, candidateHueStats.gold),
  };
  const huePenaltyRaw =
    Math.max(0, hueDrift.magenta - hueDriftTolerance) * hueDriftPenaltyWeight +
    Math.max(0, hueDrift.teal - hueDriftTolerance) * hueDriftPenaltyWeight +
    Math.max(0, hueDrift.gold - hueDriftTolerance) * hueDriftPenaltyWeight;
  const huePenalty = Math.min(huePenaltyRaw, huePenaltyCap);

  const motionStart = staticShot;
  await page.waitForTimeout(motionDelayMs);
  const motionEnd = await captureHero(page);
  const motionEnergy = await computeMotionEnergy(motionStart, motionEnd, rois.midField);
  const motionEnergyNormalized = normalizeEnergy(motionEnergy);
  const motionRewardBase = motionEnergyNormalized * motionRewardWeight;
  const motionRewardLimit = Math.max(0.05, chromaPenalty + washoutPenalty + midFieldPenalty + huePenalty);
  const motionReward = Math.min(motionRewardBase, motionRewardLimit, motionRewardCap);

  const objective =
    staticScoreNormalized +
    chromaPenalty +
    washoutPenalty +
    midFieldPenalty +
    huePenalty -
    motionReward -
    colorEnergyReward +
    epsilon;

  return {
    candidate,
    staticScore,
    staticScoreNormalized,
    chromaPenalty,
    washoutPenalty,
    midFieldPenalty,
    huePenalty,
    huePenaltyRaw,
    colorEnergyReward,
    motionScore: motionEnergy,
    motionScoreNormalized: motionEnergyNormalized,
    motionRewardBase,
    motionRewardLimit,
    motionRewardCap,
    motionReward,
    objective,
    stats: {
      meanL: candidateStats.meanL,
      meanA: candidateStats.meanA,
      meanB: candidateStats.meanB,
      meanChroma: candidateStats.meanChroma,
      roiMeanL: candidateRoiStats.meanL,
      roiMeanA: candidateRoiStats.meanA,
      roiMeanB: candidateRoiStats.meanB,
      roiMeanChroma: candidateRoiStats.meanChroma,
      hueZones: {
        magenta: candidateHueStats.magenta,
        teal: candidateHueStats.teal,
        gold: candidateHueStats.gold,
      },
      hueDrift,
    },
  };
};

const main = async () => {
  let watchdogId;
  let shuttingDown = false;
  let shutdownResolve;
  const shutdownPromise = new Promise((resolve) => {
    shutdownResolve = resolve;
  });

  let child = null;
  let browser = null;
  let context = null;
  let page = null;

  const teardown = async (reason = "teardown") => {
    if (shuttingDown) return shutdownPromise;
    shuttingDown = true;
    if (watchdogId) {
      clearTimeout(watchdogId);
    }
    console.log("[Hero Fit] teardown start", reason);
    if (page) {
      try {
        await page.close();
      } catch (closeError) {
        console.warn("[Hero Fit] page close failed", closeError);
      }
    }
    if (context) {
      try {
        await context.close();
      } catch (closeError) {
        console.warn("[Hero Fit] context close failed", closeError);
      }
    }
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.warn("[Hero Fit] browser close failed", closeError);
      }
    }
    if (child) {
      await terminateChild(child);
    }
    logActiveHandles("post-teardown");
    shutdownResolve?.();
    return shutdownPromise;
  };

  const handleSignal = (signal) => {
    console.warn(`[Hero Fit] received ${signal}, tearing down...`);
    teardown(signal).then(() => {
      process.exit(signal === "SIGINT" ? 130 : 143);
    });
  };

  process.once("SIGINT", handleSignal);
  process.once("SIGTERM", handleSignal);

  watchdogId = setTimeout(() => {
    console.error("[Hero Fit] watchdog timeout exceeded", {
      timeoutMs: WATCHDOG_TIMEOUT_MS,
    });
    logActiveHandles("watchdog");
    teardown("watchdog").then(() => {
      process.exit(1);
    });
  }, WATCHDOG_TIMEOUT_MS);
  watchdogId.unref?.();

  const resolvedReference = resolveReference();
  const resolvedExists = resolvedReference ? fs.existsSync(resolvedReference) : false;
  console.log("[Hero Fit] resolved target", resolvedReference ?? "missing", "exists", resolvedExists);
  if (!resolvedReference) {
    console.error(missingReferenceMessage);
    await teardown("missing-reference");
    process.exit(1);
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
  console.log("[Hero Fit] toggles confirmed", heroQuery);

  try {
    const devServer = await startDevServer();
    child = devServer.child;

    browser = await chromium.launch();
    context = await browser.newContext({ viewport, deviceScaleFactor });
    page = await context.newPage();
    page.setDefaultTimeout(15000);
    page.setDefaultNavigationTimeout(15000);

    await page.goto(captureUrl, { waitUntil: "domcontentloaded" });
    await waitForHeroReady(page);
    await hideHeroContent(page);

    const candidatesRaw = buildCandidates();
    const { list: candidates, sampled } = limitCandidates(candidatesRaw);
    console.log("[Hero Fit] candidates", {
      total: candidatesRaw.length,
      evaluated: candidates.length,
      sampled,
      seed: candidateSeed,
      limit: candidateLimit,
    });
    const results = [];
    const referenceLab = await loadLab(referenceBuffer, viewport.width, viewport.height);
    const referenceStats = await loadLabStats(referenceBuffer, viewport.width, viewport.height);
    const rois = buildRois(viewport);
    const referenceRoiStats = await loadLabStats(referenceBuffer, viewport.width, viewport.height, rois.midField);
    const referenceHueStats = {
      magenta: await loadLabStats(referenceBuffer, viewport.width, viewport.height, rois.hue.magenta),
      teal: await loadLabStats(referenceBuffer, viewport.width, viewport.height, rois.hue.teal),
      gold: await loadLabStats(referenceBuffer, viewport.width, viewport.height, rois.hue.gold),
    };

    for (const [index, candidate] of candidates.entries()) {
      try {
        const result = await withTimeout(
          evaluateCandidate({
            page,
            candidate,
            viewport,
            referenceLab,
            referenceStats,
            referenceRoiStats,
            referenceHueStats,
            rois,
          }),
          candidateTimeoutMs,
          `candidate ${index + 1}`,
        );
        results.push(result);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const timedOut = message.includes("timed out");
        console.warn("[Hero Fit] candidate failed", {
          index: index + 1,
          candidate,
          timedOut,
          error: message,
        });
        results.push({
          candidate,
          failed: true,
          timedOut,
          error: message,
          objective: Number.POSITIVE_INFINITY,
        });
        try {
          await page.reload({ waitUntil: "domcontentloaded" });
          await waitForHeroReady(page);
          await hideHeroContent(page);
        } catch (reloadError) {
          console.warn("[Hero Fit] page reload failed after candidate error", reloadError);
        }
      }

      if ((index + 1) % 30 === 0) {
        console.log(`Processed ${index + 1}/${candidates.length} candidates...`);
      }
    }

    const successfulResults = results.filter((entry) => !entry.failed);
    successfulResults.sort((a, b) => a.objective - b.objective);
    const best = successfulResults[0];
    if (!best) {
      throw new Error("No candidates completed successfully.");
    }
    const top12 = successfulResults.slice(0, 12);

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
        candidateTimeoutMs,
      },
      rois,
      objective: {
        formula:
          "staticScoreNormalized + chromaPenalty + washoutPenalty + midFieldPenalty + huePenalty - motionReward - colorEnergyReward + epsilon",
        motionRewardWeight,
        motionRewardCap,
        colorEnergyWeight,
        chromaTolerance,
        chromaPenaltyWeight,
        chromaRoiPenaltyWeight,
        washoutTolerance,
        washoutPenaltyWeight,
        midFieldTolerance,
        midFieldPenaltyWeight,
        hueDriftTolerance,
        hueDriftPenaltyWeight,
        huePenaltyCap,
        epsilon,
      },
      candidates: {
        total: candidatesRaw.length,
        evaluated: candidates.length,
        sampled,
        seed: candidateSeed,
        limit: candidateLimit,
        blends: ["soft-light", "screen", "overlay"],
        causticsOpacityMax,
        shimmerOpacityMax,
        combinedOpacityMax,
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
      rois,
      objective: resultsOutput.objective,
      candidates: resultsOutput.candidates,
      grid: resultsOutput.grid,
      motionDelta: resultsOutput.motionDelta,
      totalCandidates: results.length,
      top12: top12.map((entry) => ({
        candidate: entry.candidate,
        objective: entry.objective,
        chromaPenalty: entry.chromaPenalty,
        washoutPenalty: entry.washoutPenalty,
        midFieldPenalty: entry.midFieldPenalty,
        huePenalty: entry.huePenalty,
        huePenaltyRaw: entry.huePenaltyRaw,
        colorEnergyReward: entry.colorEnergyReward,
        motionReward: entry.motionReward,
        stats: entry.stats,
      })),
      best,
      explanation:
        "Best chosen because it preserves chroma authority while maximizing motion energy within constraints.",
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
  } catch (error) {
    const handled = handlePlaywrightError(error);
    if (!handled) {
      console.error("[Hero Fit] fatal error", error);
    }
    await teardown(handled ? "playwright-error" : "fatal-error");
    process.exit(1);
  }
  await teardown("success");
  process.exit(0);
};

main().catch((error) => {
  console.error("hero_fit_sacred failed:", error);
  process.exit(1);
});
