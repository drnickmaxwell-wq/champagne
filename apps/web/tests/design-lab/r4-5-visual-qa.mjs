import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const output = process.env.ATELIER_QA_OUTPUT ?? "atelier-r4.5.1-visual-qa";
const branchHeadSha = process.env.ATELIER_BRANCH_HEAD_SHA ?? "LOCAL";
const executionSha = process.env.ATELIER_EXECUTION_SHA ?? process.env.GITHUB_SHA ?? "LOCAL";
const branchHeadTree = process.env.ATELIER_BRANCH_HEAD_TREE ?? "LOCAL";
const executionTree = process.env.ATELIER_EXECUTION_TREE ?? "LOCAL";
assert.equal(branchHeadTree, executionTree);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const consoleErrors = [];
page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
const captures = [];
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
const capture = async (name, scenario, locator = null) => {
  const path = `${output}/${name}.png`;
  if (locator) await locator.screenshot({ path });
  else await page.screenshot({ path, fullPage: false });
  captures.push({
    artifactSchema: "CHAMPAGNE_ATELIER_R4_5_1_VISUAL_QA_V1",
    branchHeadSha, branchHeadTree, executionSha, executionTree,
    productionBinding: false, screenshotFilename: `${name}.png`,
    scenario, outerBrowserViewport: page.viewportSize(), url: page.url(),
    ...(await previewState()),
  });
};

await page.goto(`${baseURL}/champagne/design-lab`, { waitUntil: "networkidle" });
await capture("01-atelier-welcome", "Atelier welcome");
await page.getByRole("button", { name: "Open the Brand Workshop", exact: true }).click();
await capture("02-brand-workshop", "Brand Workshop");
await page.getByRole("button", { name: "Apply to page canvas", exact: false }).click();

const ids = await page.locator("[data-semantic-id]").evaluateAll((els) => els.map((el) => el.getAttribute("data-semantic-id")));
assert.equal(ids.length, 12);
assert.equal(ids.includes("home.proof"), false);
assert.deepEqual(ids, ["home.hero.v2","home.practice.answer","home.patient.pathways","home.complex-care","home.care-process","home.founder-authority","home.team-continuity","home.technology-purpose","home.heritage-story","home.visit","home.focused-faq","home.closing-invitation"]);

const chooseDevice = async (device, width, height, orientation) => {
  await page.getByLabel("Device preset", { exact: true }).selectOption(device);
  assert.equal(await page.locator(".dl45-preview-stage").getAttribute("data-viewport-width"), String(width));
  assert.equal(await page.locator(".dl45-preview-stage").getAttribute("data-viewport-height"), String(height));
  assert.equal(await page.locator(".dl45-preview-stage").getAttribute("data-orientation"), orientation);
};
await chooseDevice("desktop", 1440, 900, "landscape");
await capture("03-desktop-edit", "Desktop 1440×900");
await chooseDevice("ipad-portrait", 768, 1024, "portrait");
await capture("04-ipad-portrait", "iPad portrait 768×1024");
await chooseDevice("ipad-landscape", 1024, 768, "landscape");
await capture("05-ipad-landscape", "iPad landscape 1024×768");
await chooseDevice("iphone", 390, 844, "portrait");
await capture("06-iphone-portrait", "iPhone portrait 390×844");
await page.getByLabel("Device preset", { exact: true }).selectOption("custom");
await page.getByRole("button", { name: "landscape", exact: true }).click();
await page.getByLabel("Custom viewport width", { exact: true }).fill("1180");
await page.getByLabel("Custom viewport height", { exact: true }).fill("760");
assert.equal(await page.locator(".dl45-preview-stage").getAttribute("data-viewport-width"), "1180");
assert.equal(await page.locator(".dl45-preview-stage").getAttribute("data-viewport-height"), "760");
await capture("07-custom-1180x760", "Custom viewport 1180×760");

await chooseDevice("desktop", 1440, 900, "landscape");
await page.getByLabel("Time of day", { exact: true }).selectOption("morning");
assert.equal(await page.locator(".dl45-canvas").evaluate((el) => getComputedStyle(el).filter), "none");
await capture("08-temporal-morning", "Morning · simulation only · Hero preview only");
await page.getByLabel("Compare time of day", { exact: true }).selectOption("night");
assert.equal(await page.locator(".dl45-preview-frame").count(), 2);
await capture("09-morning-v-night", "Morning versus Night · identical content/device/Brand DNA");
await page.getByLabel("Time of day", { exact: true }).selectOption("afternoon");
await page.getByLabel("Compare time of day", { exact: true }).selectOption("dusk");
await capture("10-afternoon-v-dusk", "Afternoon versus Dusk · identical content/device/Brand DNA");
await page.getByLabel("Compare time of day", { exact: true }).selectOption("off");
await page.getByLabel("Time of day", { exact: true }).selectOption("canonical");

await page.getByRole("button", { name: "Clean preview", exact: true }).click();
assert.equal(await page.locator(".dl4-pages").isVisible(), false);
assert.equal(await page.getByRole("button", { name: "Return to studio", exact: true }).isVisible(), true);
await capture("11-desktop-clean-single", "Desktop single-device Clean Preview");
await capture("12-home-desktop-complete", "Complete 12-chapter Homepage desktop", page.locator(".dl45-canvas").first());
await page.getByRole("button", { name: "Return to studio", exact: true }).click();

await chooseDevice("iphone", 390, 844, "portrait");
await page.getByRole("button", { name: "Clean preview", exact: true }).click();
await capture("13-home-iphone-complete", "Complete 12-chapter Homepage iPhone", page.locator(".dl45-canvas").first());
await page.getByRole("button", { name: "Return to studio", exact: true }).click();
await chooseDevice("desktop", 1440, 900, "landscape");

await page.getByRole("button", { name: "Fullscreen", exact: true }).click();
await page.waitForTimeout(100);
const nativeFullscreen = await page.evaluate(() => Boolean(document.fullscreenElement));
const fullscreenMode = await page.locator(".dl45-preview-stage").getAttribute("data-fullscreen-mode");
assert.ok(nativeFullscreen ? fullscreenMode === "NATIVE" : fullscreenMode === "FALLBACK");
await capture("14-fullscreen-proof", nativeFullscreen ? "Native Fullscreen" : "Truthful viewport-filling fallback");
if (nativeFullscreen) await page.keyboard.press("Escape");
else await page.getByRole("button", { name: "Return to studio", exact: true }).click();
await page.waitForFunction(() => document.querySelector(".dl45-preview-stage")?.getAttribute("data-fullscreen-mode") === "OFF");

await page.getByRole("button", { name: "Experience layers", exact: true }).click();
await page.getByRole("button", { name: "media", exact: true }).click();
await capture("15-media-studio", "Media Studio");
await page.getByRole("button", { name: "concierge", exact: true }).click();
const territoryOptions = [["architectural-light","16-concierge-architectural"],["editorial-host","17-concierge-editorial"],["luminous-digital","18-concierge-luminous"],["quiet-companion","19-concierge-quiet"]];
for (const [value,name] of territoryOptions) {
  await page.getByLabel("Direction A", { exact: true }).selectOption(value);
  await capture(name, `Concierge ${value}`);
}
await page.getByLabel("Direction A", { exact: true }).selectOption("architectural-light");
await page.getByRole("button", { name: "Compare two", exact: true }).click();
await capture("20-concierge-two-up", "Architectural Light versus Editorial Host");
await capture("21-selected-hybrid", "Selected intentional hybrid", page.locator(".dl44-mix"));
await page.getByRole("button", { name: "journey", exact: true }).click();
await page.getByRole("button", { name: "Open the Host", exact: true }).click();
await page.getByRole("button", { name: "Replace a missing tooth", exact: true }).click();
await page.getByRole("button", { name: "See how the parts fit", exact: true }).click();
await capture("22-synthetic-journey", "Synthetic Homepage to implant journey");
await page.getByRole("button", { name: "Open 3D exhibit", exact: true }).click();
assert.equal(await page.getByText("SYNTHETIC · NOT FINAL · NOT VISUAL AUTHORITY", { exact: true }).isVisible(), true);
await capture("23-implant-synthetic-exhibit", "Implant synthetic exhibit");
await page.getByRole("button", { name: "Continue to human contact", exact: true }).click();
assert.equal(await page.getByRole("heading", { name: "Continue with the practice", exact: true }).isVisible(), true);
await capture("24-final-human-handoff", "Explicit final human handoff");
await page.getByRole("button", { name: "Close", exact: true }).press("Escape");
assert.equal(await page.getByRole("dialog", { name: "Experience rooms" }).count(), 0);
assert.deepEqual(consoleErrors, []);
await writeFile(`${output}/manifest.json`, JSON.stringify({
  schema: "CHAMPAGNE_ATELIER_R4_5_1_VISUAL_QA_V1",
  branchHeadSha, executionSha, branchHeadTree, executionTree,
  base: process.env.ATELIER_BASE_SHA, generatedAt: new Date().toISOString(),
  evidence: "EXACT_TREE_FIXTURE_PROVEN", productionBinding: false, captures,
}, null, 2));
await browser.close();
