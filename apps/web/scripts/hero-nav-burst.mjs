import fs from "node:fs/promises";
import { firefox } from "playwright";
import sharp from "sharp";

const BASE_URL = process.env.HERO_BURST_BASE_URL ?? "http://127.0.0.1:3000";
const OUT_PREFIX = "/tmp/hero_burst_02";
const BURST_MS = [0, 16, 33, 50, 75, 100, 150, 200, 300, 450, 600, 800, 1000, 1250, 1500];
const NAV_STRIP_VARIANCE_THRESHOLD = 8;

const transitions = [
  { from: "/about", to: "/treatments", label: "about-to-treatments" },
  { from: "/treatments", to: "/", label: "treatments-to-home" },
  { from: "/", to: "/fees", label: "home-to-fees" },
];

const sanitize = (value) => value.replace(/[^a-z0-9-]/gi, "_");

const clipText = (value) => {
  if (!value) return "";
  return String(value).replace(/\s+/g, " ").trim().slice(0, 120);
};

const sampleStripVariance = async (pngPath, stripRect) => {
  const image = sharp(pngPath);
  const metadata = await image.metadata();
  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;
  if (!width || !height) return { present: false, variance: 0 };

  const left = Math.max(0, Math.floor(stripRect.left));
  const top = Math.max(0, Math.floor(stripRect.top));
  const sampleWidth = Math.max(1, Math.min(width - left, Math.floor(stripRect.width)));
  const sampleHeight = Math.max(1, Math.min(height - top, Math.floor(stripRect.height)));

  const raw = await image
    .extract({ left, top, width: sampleWidth, height: sampleHeight })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const values = [];
  for (let x = 0; x < sampleWidth; x += Math.max(1, Math.floor(sampleWidth / 20))) {
    const idx = x * raw.info.channels;
    const r = raw.data[idx] ?? 0;
    const g = raw.data[idx + 1] ?? 0;
    const b = raw.data[idx + 2] ?? 0;
    values.push((r + g + b) / 3);
  }

  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  return {
    present: variance > NAV_STRIP_VARIANCE_THRESHOLD,
    variance: Number(variance.toFixed(2)),
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

    const sampleCount = 20;
    const sampleXs = Array.from({ length: sampleCount }, (_, idx) =>
      Math.round((idx + 1) * (window.innerWidth / (sampleCount + 1))),
    );

    const navBandSamples = sampleXs.map((x) => {
      const target = document.elementFromPoint(x, sampleY);
      if (!(target instanceof HTMLElement)) {
        return {
          x,
          y: sampleY,
          tagName: null,
          id: null,
          className: null,
          heroEngine: null,
          surfaceId: null,
          backgroundColor: null,
          opacity: null,
          transform: null,
          filter: null,
          contain: null,
          contentVisibility: null,
          ancestors: [],
        };
      }

      const style = getComputedStyle(target);
      const ancestors = [];
      let node = target.parentElement;
      let i = 0;
      while (node && i < 5) {
        const aStyle = getComputedStyle(node);
        ancestors.push({
          tagName: node.tagName,
          className: clipTextInner(node.className),
          id: node.id || null,
          heroEngine: node.getAttribute("data-hero-engine"),
          surfaceId: node.getAttribute("data-surface-id"),
          backgroundColor: aStyle.backgroundColor,
          opacity: aStyle.opacity,
          transform: aStyle.transform,
          filter: aStyle.filter,
          contain: aStyle.contain,
          contentVisibility: aStyle.contentVisibility,
        });
        node = node.parentElement;
        i += 1;
      }

      return {
        x,
        y: sampleY,
        tagName: target.tagName,
        id: target.id ? clipTextInner(target.id) : null,
        className: clipTextInner(target.className),
        heroEngine: target.getAttribute("data-hero-engine"),
        surfaceId: target.getAttribute("data-surface-id"),
        backgroundColor: style.backgroundColor,
        opacity: style.opacity,
        transform: style.transform,
        filter: style.filter,
        contain: style.contain,
        contentVisibility: style.contentVisibility,
        ancestors,
      };
    });

    return {
      viewport: { width: window.innerWidth, height: window.innerHeight },
      headerBottom,
      sampleY,
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
      navBandSamples,
    };
  });

const summarizeTopElement = (samples) => {
  const counts = new Map();
  for (const sample of samples) {
    const tag = sample?.tagName ?? "NONE";
    const id = sample?.id ? `#${sample.id}` : "";
    const cls = sample?.className ? `.${sample.className.replace(/\s+/g, ".")}` : "";
    const key = `${tag}${id}${cls}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  let top = "NONE";
  let topCount = -1;
  for (const [key, count] of counts.entries()) {
    if (count > topCount) {
      top = key;
      topCount = count;
    }
  }
  return top;
};

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

      const strip = await sampleStripVariance(pngPath, stripRect);
      const topElementSummary = summarizeTopElement(frameData.navBandSamples);
      const representative = frameData.navBandSamples.find((item) => item?.backgroundColor) ?? null;

      await fs.writeFile(
        jsonPath,
        JSON.stringify({ transition, ms, frameData, stripRect, navStripMetric: strip, topElementSummary }, null, 2),
        "utf8",
      );

      createdPaths.push(pngPath, cropPath, jsonPath);

      tableRows.push({
        transition: transition.label,
        navMethod,
        t_ms: ms,
        navStripPixelsPresent: strip.present,
        "topElement(tag#id.class)": topElementSummary,
        bgColor: representative?.backgroundColor ?? "NONE",
        variance: strip.variance,
      });
    }
  }

  await browser.close();

  console.log("Created files:");
  createdPaths.forEach((filePath) => console.log(filePath));

  console.log(`\nnavStripPixelsPresent threshold: variance > ${NAV_STRIP_VARIANCE_THRESHOLD}`);
  console.log("\nNav-band pixel table:");
  console.table(tableRows);
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
