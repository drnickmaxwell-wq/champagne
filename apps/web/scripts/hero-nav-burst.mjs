import fs from "node:fs/promises";
import { firefox } from "playwright";
import sharp from "sharp";

const BASE_URL = process.env.HERO_BURST_BASE_URL ?? "http://127.0.0.1:3000";
const OUT_PREFIX = "/tmp/hero_burst_04";
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
    const insideHeaderY = Math.min(window.innerHeight - 2, Math.max(2, Math.round(headerBottom - 2)));
    const belowHeaderY = Math.min(window.innerHeight - 2, Math.max(2, Math.round(headerBottom + 12)));

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
      insideHeaderY,
      belowHeaderY,
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
        coversInsideHeaderY: Boolean(heroRect && insideHeaderY >= heroRect.top && insideHeaderY <= heroRect.bottom),
        coversBelowHeaderY: Boolean(heroRect && belowHeaderY >= heroRect.top && belowHeaderY <= heroRect.bottom),
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
  const escaped = to.replace("/", "\\/");
  const urlPattern = new RegExp(`${escaped}(\\?|$)`);
  const link = page.locator(`header a[href="${to}"]`).first();
  if (await link.count()) {
    await link.scrollIntoViewIfNeeded();
    await Promise.all([
      page.waitForURL(urlPattern, { timeout: 10000 }),
      link.click({ timeout: 5000, noWaitAfter: true }),
    ]);
    return "link-click";
  }

  const altLink = page.locator(`header [data-nav-to="${to}"]`).first();
  if (await altLink.count()) {
    await altLink.scrollIntoViewIfNeeded();
    await Promise.all([
      page.waitForURL(urlPattern, { timeout: 10000 }),
      altLink.click({ timeout: 5000, noWaitAfter: true }),
    ]);
    return "link-click";
  }

  throw new Error("Nav click failed: cannot reproduce App Router navigation in this run.");
};

const run = async () => {
  const browser = await firefox.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const createdPaths = [];
  const tableRows = [];
  const warmRoutes = Array.from(new Set(transitions.flatMap((item) => [item.from, item.to])));

  for (const route of warmRoutes) {
    await page.goto(`${BASE_URL}${route}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(400);
  }

  for (const transition of transitions) {
    await page.goto(`${BASE_URL}${transition.from}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(600);

    const navMethod = await triggerTransition(page, transition.to);
    const clickStart = Date.now();
    let baselineInside = null;
    let baselineBelow = null;

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

      const stripWidth = Math.min(600, frameData.viewport.width);
      const stripLeft = Math.max(0, Math.floor((frameData.viewport.width - stripWidth) / 2));

      const stripRectInside = {
        left: stripLeft,
        top: Math.max(0, Math.min(frameData.viewport.height - 2, Math.floor(frameData.insideHeaderY - 1))),
        width: stripWidth,
        height: 2,
      };

      const stripRectBelow = {
        left: stripLeft,
        top: Math.max(0, Math.min(frameData.viewport.height - 2, Math.floor(frameData.belowHeaderY - 1))),
        width: stripWidth,
        height: 2,
      };

      const stripInside = await sampleStripMetrics(pngPath, stripRectInside);
      const stripBelow = await sampleStripMetrics(pngPath, stripRectBelow);
      if (!baselineInside) {
        baselineInside = stripInside;
      }
      if (!baselineBelow) {
        baselineBelow = stripBelow;
      }

      const deltaLumaInside = stripInside.meanLuma - baselineInside.meanLuma;
      const deltaAInside = stripInside.meanA - baselineInside.meanA;
      const flashInside =
        Math.abs(deltaLumaInside) > NAV_STRIP_DELTA_LUMA_THRESHOLD ||
        deltaAInside < NAV_STRIP_DELTA_ALPHA_THRESHOLD;

      const deltaLumaBelow = stripBelow.meanLuma - baselineBelow.meanLuma;
      const deltaABelow = stripBelow.meanA - baselineBelow.meanA;
      const flashBelow =
        Math.abs(deltaLumaBelow) > NAV_STRIP_DELTA_LUMA_THRESHOLD ||
        deltaABelow < NAV_STRIP_DELTA_ALPHA_THRESHOLD;

      await fs.writeFile(
        jsonPath,
        JSON.stringify(
          {
            transition,
            ms,
            frameData,
            stripRectInside,
            stripRectBelow,
            navStripMetricInsideHeader: {
              present: flashInside,
              varianceLuma: stripInside.varianceLuma,
              meanLuma: stripInside.meanLuma,
              meanA: stripInside.meanA,
              meanRGB: { r: stripInside.meanR, g: stripInside.meanG, b: stripInside.meanB },
              deltaLuma: Number(deltaLumaInside.toFixed(2)),
              deltaA: Number(deltaAInside.toFixed(2)),
            },
            navStripMetricBelowHeader: {
              present: flashBelow,
              varianceLuma: stripBelow.varianceLuma,
              meanLuma: stripBelow.meanLuma,
              meanA: stripBelow.meanA,
              meanRGB: { r: stripBelow.meanR, g: stripBelow.meanG, b: stripBelow.meanB },
              deltaLuma: Number(deltaLumaBelow.toFixed(2)),
              deltaA: Number(deltaABelow.toFixed(2)),
            },
            baseline: {
              insideHeader: {
                meanLuma: baselineInside.meanLuma,
                meanA: baselineInside.meanA,
              },
              belowHeader: {
                meanLuma: baselineBelow.meanLuma,
                meanA: baselineBelow.meanA,
              },
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
        flashInsideHeader: flashInside,
        deltaLumaInside: Number(deltaLumaInside.toFixed(2)),
        deltaAInside: Number(deltaAInside.toFixed(2)),
        heroCoversInside: frameData.hero.coversInsideHeaderY,
        flashBelowHeader: flashBelow,
        deltaLumaBelow: Number(deltaLumaBelow.toFixed(2)),
        deltaABelow: Number(deltaABelow.toFixed(2)),
        heroCoversBelow: frameData.hero.coversBelowHeaderY,
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
