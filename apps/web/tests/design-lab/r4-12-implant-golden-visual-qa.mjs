import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const output = process.env.ATELIER_R412_QA_OUTPUT ?? "atelier-r4.12-implant-golden-visual-qa";
const branchHeadTree = process.env.ATELIER_BRANCH_HEAD_TREE ?? "LOCAL";
const executionTree = process.env.ATELIER_EXECUTION_TREE ?? "LOCAL";
assert.equal(branchHeadTree, executionTree);
const territories = [
  ["Persian Architectural", "aperture", "A"],
  ["Architectural Editorial Hybrid", "luminous", "C"],
  ["Porcelain Editorial", "folio", "B"],
  ["Mineral Gallery Promenade", "monolith", "D"],
];
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const errors = [];
page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
page.on("pageerror", error => errors.push(error.message));
await page.goto(`${baseURL}/champagne/design-lab`, { waitUntil: "networkidle" });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: "networkidle" });
await page.getByRole("button", { name: "Open Dental Implants", exact: true }).click();
await page.getByText("Accepted Implant Content Bundle connected", { exact: true }).waitFor();
const frame = () => page.frameLocator("iframe.dl46-preview-viewport");
const dialog = () => page.getByRole("dialog", { name: "Judge the design, not the machinery.", exact: true });
await page.locator("iframe.dl46-preview-viewport").screenshot({ path: `${output}/00-r4.11-golden-before.png` });
await page.getByRole("button", { name: "Generate & explore", exact: true }).click();
await dialog().getByLabel("Describe the change", { exact: true }).fill("Create the first luxury architectural educational Implant Golden candidates while preserving every governed word.");
await dialog().getByRole("button", { name: "Create four code-native proposals", exact: true }).click();
assert.equal(await page.locator(".dl411-candidate").count(), 4);
await page.screenshot({ path: `${output}/01-founder-strongest-two-and-alternatives.png` });
const captures = [];
for (const [title, family, letter] of territories) {
  const card = page.locator(".dl411-candidate", { has: page.getByRole("heading", { name: title, exact: true }) });
  await card.getByRole("button", { name: "Preview in page context", exact: true }).click();
  await frame().locator(`[data-whole-page-proposal="${family}"]`).waitFor();
  assert.equal(await frame().locator('[data-semantic-id^="implants."]').count(), 12);
  assert.equal(await frame().locator('[data-semantic-id="implants.case-evidence"]').count(), 0);
  assert.match(await frame().locator("body").innerText(), /Real media required/);
  assert.match(await frame().locator("body").innerText(), /Founder-rejected T0\.1 geometry is not integrated/);
  await frame().locator("article.dl46-canvas").screenshot({ path: `${output}/${letter}-${family}-full-page.png` });
  captures.push({ title, family, fullPage: `${letter}-${family}-full-page.png` });
  await page.getByRole("button", { name: "Generate & explore", exact: true }).click();
  await dialog().getByRole("button", { name: /Compare/ }).click();
}
for (const [title, family, letter] of territories.slice(0, 2)) {
  const card = page.locator(".dl411-candidate", { has: page.getByRole("heading", { name: title, exact: true }) });
  await card.getByRole("button", { name: "Preview in page context", exact: true }).click();
  const device = page.getByLabel("Device preset", { exact: true });
  for (const [value, width] of [["desktop", 1440], ["ipad-landscape", 1024], ["ipad-portrait", 768], ["iphone", 390]]) {
    await device.selectOption(value);
    assert.equal(await frame().locator("body").evaluate(body => body.ownerDocument.defaultView.innerWidth), width);
    await page.locator("iframe.dl46-preview-viewport").screenshot({ path: `${output}/${letter}-${family}-${width}.png` });
  }
  await device.selectOption("desktop");
  await page.getByRole("button", { name: "Generate & explore", exact: true }).click();
  await dialog().getByRole("button", { name: /Compare/ }).click();
}
assert.equal(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches), true);
assert.deepEqual(errors, []);
await writeFile(`${output}/manifest.json`, JSON.stringify({ schema: "CHAMPAGNE_ATELIER_R4_12_IMPLANT_GOLDEN_VISUAL_QA_V1", branchHeadSha: process.env.ATELIER_BRANCH_HEAD_SHA ?? "LOCAL", branchHeadTree, executionTree, generatedAt: new Date().toISOString(), captures, strongest: ["Persian Architectural", "Architectural Editorial Hybrid"], widths: [1440, 1024, 768, 390], proof: { completeGovernedSections: 12, disabledCaseEvidenceAbsent: true, realMediaAbsentAndTruthful: true, rejectedT01Absent: true, deterministicNotAI: true, reducedMotion: true }, governance: { productionBinding: false, weosMutation: false, externalProviderConnected: false } }, null, 2));
await browser.close();
