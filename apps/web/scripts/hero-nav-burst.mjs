import fs from "node:fs/promises";
import path from "node:path";
import { firefox } from "playwright";
import sharp from "sharp";

const BASE_URL = process.env.HERO_BURST_BASE_URL ?? "http://127.0.0.1:3000";
const OUT_PREFIX = "/tmp/hero_burst_01";
const BURST_MS = [0, 16, 33, 50, 75, 100, 150, 200];

const transitions = [
  { from: "/about", to: "/treatments", label: "about-to-treatments" },
  { from: "/treatments", to: "/", label: "treatments-to-home" },
  { from: "/", to: "/fees", label: "home-to-fees" },
];

const sanitize = (value) => value.replace(/[^a-z0-9-]/gi, "_");

const sampleVariance = async (pngPath, rect) => {
  const image = sharp(pngPath);
  const metadata = await image.metadata();
  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;
  if (!width || !height) return { present: false, variance: 0, samples: [] };

  const left = Math.max(0, Math.floor(rect.left));
  const top = Math.max(0, Math.floor(rect.top));
  const sampleWidth = Math.max(1, Math.min(width - left, Math.floor(rect.width)));
  const sampleHeight = Math.max(1, Math.min(height - top, Math.floor(rect.height)));

  const raw = await image
    .extract({ left, top, width: sampleWidth, height: sampleHeight })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const points = [
    [0.1, 0.1], [0.3, 0.1], [0.5, 0.1], [0.7, 0.1], [0.9, 0.1],
    [0.2, 0.6], [0.4, 0.6], [0.6, 0.6], [0.8, 0.6], [0.5, 0.85],
  ];

  const values = [];
  for (const [px, py] of points) {
    const x = Math.min(sampleWidth - 1, Math.max(0, Math.floor(px * sampleWidth)));
    const y = Math.min(sampleHeight - 1, Math.max(0, Math.floor(py * sampleHeight)));
    const idx = (y * sampleWidth + x) * raw.info.channels;
    const r = raw.data[idx] ?? 0;
    const g = raw.data[idx + 1] ?? 0;
    const b = raw.data[idx + 2] ?? 0;
    values.push((r + g + b) / 3);
  }

  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  return {
    present: variance > 20,
    variance: Number(variance.toFixed(2)),
    samples: values.map((v) => Number(v.toFixed(1))),
  };
};

const collectFrameData = async (page) => page.evaluate(() => {
  const stack = document.querySelector(".hero-renderer-v2 .hero-surface-stack");
  if (!(stack instanceof HTMLElement)) {
    return { missing: true };
  }

  const rect = stack.getBoundingClientRect();
  const stackStyle = getComputedStyle(stack);
  const ancestors = [];
  let node = stack.parentElement;
  let i = 0;
  while (node && i < 5) {
    const style = getComputedStyle(node);
    ancestors.push({
      tagName: node.tagName,
      className: node.className,
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

  return {
    missing: false,
    rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
    stackStyle: {
      opacity: stackStyle.opacity,
      transform: stackStyle.transform,
      filter: stackStyle.filter,
      willChange: stackStyle.willChange,
    },
    ancestors,
  };
});

const run = async () => {
  const browser = await firefox.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const createdPaths = [];
  const tableRows = [];

  for (const transition of transitions) {
    await page.goto(`${BASE_URL}${transition.from}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);

    await page.click(`a[href="${transition.to}"]`, { noWaitAfter: true });
    const clickStart = Date.now();

    for (const ms of BURST_MS) {
      const elapsed = Date.now() - clickStart;
      const waitMs = Math.max(0, ms - elapsed);
      if (waitMs > 0) await page.waitForTimeout(waitMs);

      const frameData = await collectFrameData(page);
      const stamp = `t${String(ms).padStart(3, "0")}`;
      const base = `${OUT_PREFIX}_${sanitize(transition.label)}_${stamp}`;
      const pngPath = `${base}.png`;
      const jsonPath = `${base}.json`;

      await page.screenshot({ path: pngPath, fullPage: false });
      await fs.writeFile(jsonPath, JSON.stringify({ transition, ms, frameData }, null, 2), "utf8");

      createdPaths.push(pngPath, jsonPath);

      if (frameData.missing) {
        tableRows.push({ transition: transition.label, ms, heroPixelsPresent: false, variance: 0, note: "stack missing" });
      } else {
        const varianceData = await sampleVariance(pngPath, frameData.rect);
        tableRows.push({
          transition: transition.label,
          ms,
          heroPixelsPresent: varianceData.present,
          variance: varianceData.variance,
          note: varianceData.present ? "variance>20" : "low variance",
        });
      }
    }
  }

  await browser.close();

  console.log("Created files:");
  createdPaths.forEach((filePath) => console.log(filePath));

  console.log("\nPixel presence table:");
  console.table(tableRows);
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
