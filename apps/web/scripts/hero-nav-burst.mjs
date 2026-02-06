import fs from "node:fs/promises";
import { firefox } from "playwright";
import sharp from "sharp";

const BASE_URL = process.env.HERO_BURST_BASE_URL ?? "http://127.0.0.1:3000";
const OUT_PREFIX = "/tmp/hero_burst_03";
const BURST_MS = [0, 16, 33, 50, 75, 100, 150, 200, 300, 450, 600, 800, 1000, 1250, 1500];
const NAV_STRIP_DELTA_LUMA_THRESHOLD = 12;
const NAV_STRIP_DELTA_ALPHA_THRESHOLD = -20;

const transitions = [
  { from: "/about", to: "/treatments", label: "about-to-treatments" },
  { from: "/treatments", to: "/", label: "treatments-to-home" },
  { from: "/", to: "/fees", label: "home-to-fees" },
];

const sanitize = (value) => value.replace(/[^a-z0-9-]/gi, "_");

const sampleStripMetrics = async (pngPath, stripRect) => {
  const image = sharp(pngPath);
  const metadata = await image.metadata();
  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;
  if (!width || !height) {
    return {
      meanR: 0,
      meanG: 0,
      meanB: 0,
      meanA: 0,
      meanLuma: 0,
      varianceLuma: 0,
    };
  }

  const left = Math.max(0, Math.floor(stripRect.left));
  const top = Math.max(0, Math.floor(stripRect.top));
  const sampleWidth = Math.max(1, Math.min(width - left, Math.floor(stripRect.width)));
  const sampleHeight = Math.max(1, Math.min(height - top, Math.floor(stripRect.height)));

  const raw = await image
    .extract({ left, top, width: sampleWidth, height: sampleHeight })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const channels = raw.info.channels;
  const pixelCount = sampleWidth * sampleHeight;
  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  let sumA = 0;
  const lumaValues = new Array(pixelCount);
  for (let i = 0, p = 0; i < raw.data.length; i += channels, p += 1) {
    const r = raw.data[i] ?? 0;
    const g = raw.data[i + 1] ?? 0;
    const b = raw.data[i + 2] ?? 0;
    const a = channels > 3 ? raw.data[i + 3] ?? 255 : 255;
    sumR += r;
    sumG += g;
    sumB += b;
    sumA += a;
    lumaValues[p] = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  const meanR = sumR / pixelCount;
  const meanG = sumG / pixelCount;
  const meanB = sumB / pixelCount;
  const meanA = sumA / pixelCount;
  const meanLuma = lumaValues.reduce((sum, v) => sum + v, 0) / lumaValues.length;
  const varianceLuma =
    lumaValues.reduce((sum, v) => sum + (v - meanLuma) ** 2, 0) / lumaValues.length;
  return {
    meanR: Number(meanR.toFixed(2)),
    meanG: Number(meanG.toFixed(2)),
    meanB: Number(meanB.toFixed(2)),
    meanA: Number(meanA.toFixed(2)),
    meanLuma: Number(meanLuma.toFixed(2)),
    varianceLuma: Number(varianceLuma.toFixed(2)),
  };
};

const collectFrameData = async (page) =>
  page.evaluate(() => {
    const clipTextInner = (value) => {
      if (!value) return "";
      return String(value).replace(/\s+/g, " ").trim().slice(0, 120);
    };

    const header = document.querySelector("header");
    const headerBottom = header?.getBoundingClientRect().bottom ?? 96;
    const sampleY = Math.min(window.innerHeight - 2, Math.max(2, Math.round(headerBottom + 12)));

    const stack = document.querySelector(".hero-renderer-v2 .hero-surface-stack");
    const stackRect = stack instanceof HTMLElement ? stack.getBoundingClientRect() : null;
    const stackStyle = stack instanceof HTMLElement ? getComputedStyle(stack) : null;

    const hero =
      document.querySelector(".hero-surface-stack") ?? document.querySelector('[data-hero-engine="v2"]');
    const heroRect = hero instanceof HTMLElement ? hero.getBoundingClientRect() : null;

    const stackAncestors = [];
    if (stack instanceof HTMLElement) {
      let node = stack.parentElement;
      let i = 0;
      while (node && i < 5) {
        const style = getComputedStyle(node);
        stackAncestors.push({
          tagName: node.tagName,
          className: clipTextInner(node.className),
          opacity: style.opacity,
          transform: style.transform,
          filter: style.filter,
          backgroundColor: style.backgroundColor,
          contain: style.contain,
          contentVisibility: style.contentVisibility,
        });
        node = node.parentElement;
        i += 1;
      }
    }

    return {
      viewport: { width: window.innerWidth, height: window.innerHeight },
      headerBottom,
      sampleY,
      hero: {
        exists: hero instanceof HTMLElement,
        rect: heroRect
          ? {
              left: heroRect.left,
              top: heroRect.top,
              width: heroRect.width,
              height: heroRect.height,
            }
          : null,
        coversSampleY: Boolean(heroRect && sampleY >= heroRect.top && sampleY <= heroRect.bottom),
      },
      stack: {
        exists: stack instanceof HTMLElement,
        rect: stackRect
          ? {
              left: stackRect.left,
              top: stackRect.top,
              width: stackRect.width,
              height: stackRect.height,
            }
          : null,
        style: stackStyle
          ? {
              opacity: stackStyle.opacity,
              transform: stackStyle.transform,
              filter: stackStyle.filter,
              willChange: stackStyle.willChange,
            }
          : null,
        ancestors: stackAncestors,
      },
    };
  });

const triggerTransition = async (page, to) => {
  const navLink = page.locator(`a[href="${to}"]`).first();
  if (await navLink.count()) {
    try {
      await navLink.click({ timeout: 3000, noWaitAfter: true });
      return "click";
    } catch (error) {
      // fallback to direct route transition in diagnostics mode
    }
  }

  await page.evaluate((href) => {
    window.history.pushState(null, "", href);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, to);
  return "history-push";
};

const run = async () => {
  const browser = await firefox.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const createdPaths = [];
  const tableRows = [];

  for (const transition of transitions) {
    await page.goto(`${BASE_URL}${transition.from}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(600);

    const navMethod = await triggerTransition(page, transition.to);
    const clickStart = Date.now();
    let baselineMetric = null;

    for (const ms of BURST_MS) {
      const elapsed = Date.now() - clickStart;
      const waitMs = Math.max(0, ms - elapsed);
      if (waitMs > 0) await page.waitForTimeout(waitMs);

      const frameData = await collectFrameData(page);
      const stamp = `t${String(ms).padStart(4, "0")}`;
      const base = `${OUT_PREFIX}_${sanitize(transition.label)}_${stamp}`;
      const pngPath = `${base}.png`;
      const cropPath = `${base}.crop.png`;
      const jsonPath = `${base}.json`;

      await page.screenshot({ path: pngPath, fullPage: false });

      const cropHeight = Math.min(400, frameData.viewport.height);
      await page.screenshot({
        path: cropPath,
        clip: {
          x: 0,
          y: 0,
          width: frameData.viewport.width,
          height: cropHeight,
        },
      });

      const stripRect = {
        left: Math.max(0, Math.floor((frameData.viewport.width - Math.min(600, frameData.viewport.width)) / 2)),
        top: Math.max(0, Math.min(frameData.viewport.height - 2, Math.floor(frameData.sampleY - 1))),
        width: Math.min(600, frameData.viewport.width),
        height: 2,
      };

      const strip = await sampleStripMetrics(pngPath, stripRect);
      if (!baselineMetric) {
        baselineMetric = strip;
      }

      const deltaLuma = strip.meanLuma - baselineMetric.meanLuma;
      const deltaA = strip.meanA - baselineMetric.meanA;
      const flashCandidate =
        Math.abs(deltaLuma) > NAV_STRIP_DELTA_LUMA_THRESHOLD || deltaA < NAV_STRIP_DELTA_ALPHA_THRESHOLD;

      await fs.writeFile(
        jsonPath,
        JSON.stringify(
          {
            transition,
            ms,
            frameData,
            stripRect,
            navStripMetric: {
              present: flashCandidate,
              varianceLuma: strip.varianceLuma,
              meanLuma: strip.meanLuma,
              meanA: strip.meanA,
              meanRGB: { r: strip.meanR, g: strip.meanG, b: strip.meanB },
              deltaLuma: Number(deltaLuma.toFixed(2)),
              deltaA: Number(deltaA.toFixed(2)),
            },
            baseline: {
              meanLuma: baselineMetric.meanLuma,
              meanA: baselineMetric.meanA,
            },
          },
          null,
          2,
        ),
        "utf8",
      );

      createdPaths.push(pngPath, cropPath, jsonPath);

      tableRows.push({
        transition: transition.label,
        navMethod,
        t_ms: ms,
        flashCandidate,
        meanLuma: strip.meanLuma,
        deltaLuma: Number(deltaLuma.toFixed(2)),
        meanA: strip.meanA,
        deltaA: Number(deltaA.toFixed(2)),
        heroCoversSampleY: frameData.hero.coversSampleY,
      });
    }
  }

  await browser.close();

  console.log("Created files:");
  createdPaths.forEach((filePath) => console.log(filePath));

  console.log(
    `\nflashCandidate thresholds: abs(deltaLuma) > ${NAV_STRIP_DELTA_LUMA_THRESHOLD} OR deltaA < ${NAV_STRIP_DELTA_ALPHA_THRESHOLD}`,
  );
  console.log("\nNav-band pixel table:");
  console.table(tableRows);
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
