import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import sharp from "sharp";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const output = process.env.ATELIER_QA_OUTPUT ?? "atelier-r4.5.2-founder-visual-qa";
const branchHeadSha = process.env.ATELIER_BRANCH_HEAD_SHA ?? "LOCAL";
const executionSha = process.env.ATELIER_EXECUTION_SHA ?? process.env.GITHUB_SHA ?? "LOCAL";
const branchHeadTree = process.env.ATELIER_BRANCH_HEAD_TREE ?? "LOCAL";
const executionTree = process.env.ATELIER_EXECUTION_TREE ?? "LOCAL";
assert.equal(branchHeadTree, executionTree);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1800, height: 1200 }, deviceScaleFactor: 1 });
const consoleErrors = [];
page.on("console", m => { if (m.type() === "error") consoleErrors.push(m.text()); });
const captures = [];
const expectedHomepageOrder = ["home.hero.v2","home.practice.answer","home.patient.pathways","home.complex-care","home.care-process","home.founder-authority","home.team-continuity","home.technology-purpose","home.heritage-story","home.visit","home.focused-faq","home.closing-invitation"];

const previewState = async () => page.evaluate(() => {
  const stage = document.querySelector(".dl45-preview-stage");
  const canvas = document.querySelector(".dl45-canvas");
  if (!stage || !canvas) return {};
  return {
    canonicalPage: "home",
    internalViewportWidth: Number(stage.getAttribute("data-viewport-width")),
    internalViewportHeight: Number(stage.getAttribute("data-viewport-height")),
    devicePreset: stage.getAttribute("data-device"),
    orientation: stage.getAttribute("data-orientation"),
    displayScale: Number(stage.getAttribute("data-display-scale")),
    deviceFrame: stage.getAttribute("data-device-frame") === "true",
    brandTerritory: stage.getAttribute("data-brand-territory"),
    accent: stage.getAttribute("data-brand-accent"),
    typography: stage.getAttribute("data-brand-type"),
    rhythm: stage.getAttribute("data-brand-rhythm"),
    persianCandidate: stage.getAttribute("data-persian-candidate"),
    porcelainCandidate: stage.getAttribute("data-porcelain-candidate"),
    timeLabel: stage.getAttribute("data-studio-time"),
    mappedCanonTime: stage.getAttribute("data-time-canon"),
    mappedRuntimeTime: stage.getAttribute("data-time-runtime"),
    timeScope: stage.getAttribute("data-time-scope"),
    mode: document.querySelector(".dl45-app")?.getAttribute("data-clean-preview") === "true" ? "CLEAN" : "EDIT",
    fullscreenMode: stage.getAttribute("data-fullscreen-mode") ?? "OFF",
    comparisonState: stage.getAttribute("data-comparing") === "true",
  };
});
const pngDimensions = buffer => {
  assert.equal(buffer.subarray(1, 4).toString("ascii"), "PNG");
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
};
const assertHomepage = async () => {
  const canvas = page.locator(".dl45-canvas").first();
  const ids = await canvas.locator("[data-semantic-id]").evaluateAll(elements => elements.map(element => element.getAttribute("data-semantic-id")));
  assert.deepEqual(ids, expectedHomepageOrder);
  assert.equal(ids.includes("home.proof"), false);
  assert.equal(await page.locator('[data-semantic-id="home.proof"]').count(), 0);
  assert.equal((await canvas.innerText()).includes("home.proof"), false);
};
const capture = async (name, scenario, locator, widthRange) => {
  const path = `${output}/${name}.png`;
  const dimensions = pngDimensions(await locator.screenshot({ path }));
  assert.ok(dimensions.width >= widthRange.min && dimensions.width <= widthRange.max, `${name} width ${dimensions.width}px is outside truthful 100%-scale range ${widthRange.min}-${widthRange.max}px`);
  const state = await previewState();
  assert.equal(state.displayScale, 100);
  assert.equal(state.mode, "CLEAN");
  captures.push({ artifactSchema: "CHAMPAGNE_ATELIER_R4_5_2_FOUNDER_VISUAL_QA_V1", branchHeadSha, branchHeadTree, executionSha, executionTree, productionBinding: false, screenshotFilename: `${name}.png`, scenario, actualPngWidth: dimensions.width, actualPngHeight: dimensions.height, outerBrowserViewport: page.viewportSize(), url: page.url(), ...state });
};
const captureCompletePage = async (name, scenario, widthRange) => {
  const segments = [];
  let compositeWidth = null;
  let compositeHeight = 0;
  for (const semanticId of expectedHomepageOrder) {
    const buffer = await page.locator(`[data-semantic-id="${semanticId}"]`).first().screenshot();
    const metadata = await sharp(buffer).metadata();
    assert.ok(metadata.width && metadata.height, `${semanticId} did not produce measurable PNG evidence`);
    assert.ok(metadata.width >= widthRange.min && metadata.width <= widthRange.max, `${semanticId} width ${metadata.width}px is outside native 100%-scale range`);
    if (compositeWidth === null) compositeWidth = metadata.width;
    assert.equal(metadata.width, compositeWidth);
    segments.push({ input: buffer, top: compositeHeight, left: 0 });
    compositeHeight += metadata.height;
  }
  assert.ok(compositeWidth);
  const buffer = await sharp({
    create: { width: compositeWidth, height: compositeHeight, channels: 4, background: { r: 31, g: 32, b: 33, alpha: 1 } },
  }).composite(segments).png().toBuffer();
  const path = `${output}/${name}.png`;
  await writeFile(path, buffer);
  const dimensions = pngDimensions(buffer);
  assert.equal(dimensions.width, compositeWidth);
  assert.equal(dimensions.height, compositeHeight);
  const state = await previewState();
  assert.equal(state.displayScale, 100);
  assert.equal(state.mode, "CLEAN");
  captures.push({
    artifactSchema: "CHAMPAGNE_ATELIER_R4_5_2_FOUNDER_VISUAL_QA_V1",
    branchHeadSha, branchHeadTree, executionSha, executionTree,
    productionBinding: false, screenshotFilename: `${name}.png`, scenario,
    captureMethod: "NATIVE_SECTION_PNG_VERTICAL_STITCH_NO_RESIZE",
    stitchedSemanticIds: expectedHomepageOrder,
    actualPngWidth: dimensions.width, actualPngHeight: dimensions.height,
    outerBrowserViewport: page.viewportSize(), url: page.url(), ...state,
  });
};

const chooseDevice = async (device, width, height, orientation) => {
  await page.getByLabel("Device preset", { exact: true }).selectOption(device);
  const stage = page.locator(".dl45-preview-stage");
  assert.equal(await stage.getAttribute("data-viewport-width"), String(width));
  assert.equal(await stage.getAttribute("data-viewport-height"), String(height));
  assert.equal(await stage.getAttribute("data-orientation"), orientation);
};
const enterCleanPreview = async () => {
  await page.getByRole("button", { name: "Clean preview", exact: true }).click();
  await page.locator(".dl45-preview-scroll").evaluate(element => element.scrollTo({ top: 0, left: 0, behavior: "instant" }));
  await page.waitForTimeout(50);
  assert.equal(await page.locator(".dl45-preview-scroll").evaluate(element => element.scrollTop), 0);
  assert.equal(await page.locator(".dl4-pages").isVisible(), false);
  assert.equal(await page.getByRole("button", { name: "Return to studio", exact: true }).isVisible(), true);
  assert.equal(await page.locator(".dl45-preview-stage").getAttribute("data-display-scale"), "100");
  await assertHomepage();
};
const returnToStudio = async () => {
  await page.getByRole("button", { name: "Return to studio", exact: true }).click();
  assert.equal(await page.locator(".dl4-pages").isVisible(), true);
};

await page.goto(`${baseURL}/champagne/design-lab`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Open Homepage Atelier", exact: true }).click();
await page.getByLabel("Display scale", { exact: true }).fill("100");
assert.equal(await page.locator(".dl45-preview-stage").getAttribute("data-display-scale"), "100");
const deviceFrame = page.getByLabel("Device frame", { exact: true });
if (await deviceFrame.isChecked()) await deviceFrame.uncheck();
assert.equal(await page.locator(".dl45-preview-stage").getAttribute("data-device-frame"), "false");
await assertHomepage();

await chooseDevice("desktop", 1440, 900, "landscape");
await enterCleanPreview();
await capture("01-desktop-clean-first-viewport", "Desktop Clean Preview first viewport · 1440×900 · native 100% scale", page.locator(".dl45-preview-frame").first(), { min: 1400, max: 1480 });
await captureCompletePage("02-home-desktop-complete", "Complete 12-chapter Homepage desktop · native 100% scale", { min: 1400, max: 1480 });
await returnToStudio();

await chooseDevice("ipad-portrait", 768, 1024, "portrait");
await enterCleanPreview();
await capture("03-ipad-portrait-clean-first-viewport", "iPad portrait Clean Preview · 768×1024 · native 100% scale", page.locator(".dl45-preview-frame").first(), { min: 740, max: 800 });
await returnToStudio();

await chooseDevice("ipad-landscape", 1024, 768, "landscape");
await enterCleanPreview();
await capture("04-ipad-landscape-clean-first-viewport", "iPad landscape Clean Preview · 1024×768 · native 100% scale", page.locator(".dl45-preview-frame").first(), { min: 990, max: 1050 });
await returnToStudio();

await chooseDevice("iphone", 390, 844, "portrait");
await enterCleanPreview();
await capture("05-iphone-clean-first-viewport", "iPhone Clean Preview first viewport · 390×844 · native 100% scale", page.locator(".dl45-preview-frame").first(), { min: 370, max: 410 });
await captureCompletePage("06-home-iphone-complete", "Complete 12-chapter Homepage iPhone · native 100% scale", { min: 370, max: 410 });

assert.equal(captures.length, 6);
assert.ok(captures.every(item => item.displayScale === 100 && item.mode === "CLEAN" && item.productionBinding === false));
assert.deepEqual(consoleErrors, []);
await writeFile(`${output}/manifest.json`, JSON.stringify({
  schema: "CHAMPAGNE_ATELIER_R4_5_2_FOUNDER_VISUAL_QA_V1", branchHeadSha, executionSha, branchHeadTree, executionTree,
  base: process.env.ATELIER_BASE_SHA, generatedAt: new Date().toISOString(),
  evidence: "EXACT_TREE_100_PERCENT_FOUNDER_VISUAL_EVIDENCE_PROVEN",
  productionBinding: false, expectedHomepageOrder, excludedSemanticIds: ["home.proof"], captures,
}, null, 2));
await browser.close();
