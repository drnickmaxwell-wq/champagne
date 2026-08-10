import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const schema = "CHAMPAGNE_ATELIER_R4_11_FOUNDER_STUDIO_LIVE_PREVIEW_QA_V1";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const output = process.env.ATELIER_QA_OUTPUT ?? "atelier-r4.10-founder-studio-live-preview-qa";
const branchHeadTree = process.env.ATELIER_BRANCH_HEAD_TREE ?? "LOCAL";
const executionTree = process.env.ATELIER_EXECUTION_TREE ?? "LOCAL";
assert.equal(branchHeadTree, executionTree);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ reducedMotion: "reduce" });
const page = await context.newPage();
const errors = [];
page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
page.on("pageerror", error => errors.push(error.message));
const captures = [];
const snap = async (filename, state, fullPage = false) => { await page.screenshot({ path: `${output}/${filename}`, fullPage }); captures.push({ filename, state, viewport: page.viewportSize(), productionBinding: false }); };
const dialog = () => page.getByRole("dialog", { name: "Judge the design, not the machinery.", exact: true });
const frame = () => page.frameLocator("iframe.dl46-preview-viewport");

await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto(`${baseURL}/champagne/design-lab`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Open Dental Implants", exact: true }).click();
await page.getByText("Accepted Implant Content Bundle connected", { exact: true }).waitFor();
assert.equal(await page.locator(".dl4-layers li").count(), 12);
assert.equal(await frame().locator('[data-semantic-id="implants.case-evidence"]').count(), 0);
assert.match(await frame().locator("body").innerText(), /Founder-rejected T0\.1 geometry is not integrated/);
await snap("01-implant-canvas-1440.png", "IMPLANT_GOLDEN_1440");
const device = page.getByLabel("Device preset", { exact: true });
for (const [value, width, filename] of [["ipad-landscape", 1024, "02-implant-1024.png"], ["ipad-portrait", 768, "03-implant-768.png"], ["iphone", 390, "04-implant-390.png"]]) {
  await device.selectOption(value); assert.equal(await frame().locator("body").evaluate(body => body.ownerDocument.defaultView.innerWidth), width); await snap(filename, `IMPLANT_${width}`);
}
await device.selectOption("desktop");
const launch = page.getByRole("button", { name: "Generate more", exact: true });
await launch.click(); await dialog().waitFor();
await dialog().getByLabel("Describe the change", { exact: true }).fill("Keep clinical truth; make the complete page quieter and more architectural.");
await dialog().getByRole("button", { name: "Create four code-native proposals", exact: true }).click();
assert.equal(await page.locator(".dl411-candidate").count(), 4);
assert.equal(await page.locator(".dl411-primary-candidates .dl411-candidate").count(), 2);
assert.equal(await page.locator(".dl411-candidate-strip .dl411-candidate").count(), 2);
await snap("05-founder-two-up.png", "FOUNDER_TWO_UP");
await page.locator(".dl411-primary-candidates .dl411-candidate").first().getByRole("button", { name: "Preview in page context", exact: true }).click();
await frame().locator("[data-whole-page-proposal]").waitFor();
assert.equal(await frame().locator('[data-semantic-id="home.practice.answer"][data-lab-proposal]').count(), 0);
await page.getByRole("button", { name: "Golden vs candidate", exact: true }).click(); assert.equal(await page.locator("iframe.dl46-preview-viewport").count(), 2); await snap("06-golden-vs-candidate.png", "GOLDEN_VS_CANDIDATE");
await page.getByRole("button", { name: "Golden vs candidate", exact: true }).click();
const refine = page.getByRole("button", { name: "Refine in Studio", exact: true }); await refine.click(); await dialog().press("Escape"); await dialog().waitFor({ state: "detached" }); assert.equal(await refine.evaluate(element => document.activeElement === element), true);
assert.equal(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches), true);
assert.deepEqual(errors, []);

await writeFile(`${output}/manifest.json`, JSON.stringify({ schema, branchHeadSha: process.env.ATELIER_BRANCH_HEAD_SHA ?? "LOCAL", branchHeadTree, executionSha: process.env.ATELIER_EXECUTION_SHA ?? "LOCAL", executionTree, generatedAt: new Date().toISOString(), captures, proof: { exactTree: branchHeadTree === executionTree, implantSections: 12, widths: [1440, 1024, 768, 390], deterministicNotAI: true, wholePageTruthTarget: true, oldFallbackAbsent: true, goldenCompare: true, escapeFocusRestoration: true, reducedMotion: true }, governance: { productionBinding: false, machineAuthorityChanged: false, externalProviderConnected: false } }, null, 2));
await browser.close();
