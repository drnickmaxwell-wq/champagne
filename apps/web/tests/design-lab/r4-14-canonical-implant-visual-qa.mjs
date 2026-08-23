import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3014";
const output = process.env.ATELIER_R414_QA_OUTPUT ?? "atelier-r4.14-canonical-implant-visual-qa";
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
assert.ok(executablePath, "PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH is required");
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true, executablePath, args: ["--no-sandbox"] });
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
await frame().locator("body").evaluate(() => {
  window.addEventListener("message", event => {
    if (event.data?.type === "CHAMPAGNE_ATELIER_PREVIEW_STATE") window.__ATELIER_R414_QA_STATE__ = event.data.state;
  });
});

await page.getByRole("button", { name: "Generate & explore", exact: true }).click();
const dialog = page.getByRole("dialog", { name: "Judge the design, not the machinery.", exact: true });
await dialog.getByLabel("Describe the change", { exact: true }).fill("Apply the accepted canonical Founder Brand DNA to one complete Implant page beneath the protected Hero seam.");
await dialog.getByRole("button", { name: "Create canonical Implant page", exact: true }).click();
assert.equal(await page.locator(".dl411-candidate").count(), 1);
await page.getByRole("button", { name: "Preview in page context", exact: true }).click();
await frame().locator('[data-r414-canonical="implant-page"]').waitFor();
assert.equal(await frame().locator('[data-semantic-id^="implants."]').count(), 12);
assert.equal(await frame().locator('[data-semantic-id="implants.hero"] [data-design-lab-hero-adapter="canonical-v2"]').count(), 1);
assert.equal(await frame().locator('[data-semantic-id="implants.case-evidence"]').count(), 0);

const state = await frame().locator("body").evaluate(() => window.__ATELIER_R414_QA_STATE__);
assert.ok(state, "preview state must be observed before evidence capture");

const captures = [];
for (const [label, width, height] of [["desktop", 1440, 1000], ["tablet-landscape", 1024, 900], ["tablet-portrait", 768, 1024], ["mobile", 390, 844]]) {
  const evidence = await browser.newContext({ reducedMotion: "reduce", viewport: { width, height } });
  const evidencePage = await evidence.newPage();
  evidencePage.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  evidencePage.on("pageerror", error => errors.push(error.message));
  await evidencePage.goto(`${baseURL}/champagne/design-lab/preview`, { waitUntil: "networkidle" });
  await evidencePage.evaluate(previewState => window.postMessage({ type: "CHAMPAGNE_ATELIER_PREVIEW_STATE", state: previewState }, window.location.origin), state);
  await evidencePage.locator('[data-r414-canonical="implant-page"]').waitFor();
  const path = `${output}/implant-r4.14-${label}-${width}.png`;
  await evidencePage.screenshot({ path, fullPage: true });
  captures.push({ label, width, height, path });
  if (label === "desktop") {
    const assessment = evidencePage.locator('[data-semantic-id="implants.assessment-factors"]');
    await assessment.scrollIntoViewIfNeeded();
    await assessment.screenshot({ path: `${output}/chapter-assessment-cta-wave-luxe.png` });
    await assessment.getByRole("button", { name: "B · Porcelain Editorial", exact: true }).click();
    assert.equal(await assessment.locator(".dl414-cta-context").getAttribute("data-cta-family"), "porcelain-editorial");
    await evidencePage.waitForTimeout(120);
    await assessment.screenshot({ path: `${output}/chapter-assessment-cta-porcelain.png` });
    const components = evidencePage.locator('[data-semantic-id="implants.components-3d"]');
    await components.scrollIntoViewIfNeeded();
    await components.screenshot({ path: `${output}/chapter-components-future-visual-seam.png` });
    const comparison = evidencePage.locator('[data-semantic-id="implants.options-comparison"]');
    await comparison.scrollIntoViewIfNeeded();
    await comparison.screenshot({ path: `${output}/chapter-options-comparison.png` });
    const next = evidencePage.locator('[data-semantic-id="implants.next-step"]');
    await next.scrollIntoViewIfNeeded();
    await next.getByRole("button", { name: "C · Signature Wave Motion", exact: true }).click();
    assert.equal(await next.locator(".dl414-cta-context").getAttribute("data-cta-family"), "signature-wave-motion");
    await evidencePage.waitForTimeout(120);
    await next.screenshot({ path: `${output}/chapter-next-step-cta-signature-wave.png` });
  }
  await evidence.close();
}

assert.equal(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches), true);
const inheritedHeroWarnings = errors.filter(error => error.includes("A tree hydrated but some attributes") && error.includes("hero-surface--motion"));
const r414Errors = errors.filter(error => !inheritedHeroWarnings.includes(error));
assert.deepEqual(r414Errors, []);
await writeFile(`${output}/manifest.json`, JSON.stringify({
  schema: "CHAMPAGNE_ATELIER_R4_14_CANONICAL_IMPLANT_VISUAL_QA_V1",
  generatedAt: new Date().toISOString(),
  brandAuthority: "CHAMPAGNE_FOUNDER_BRAND_DNA_V1@1.0.0",
  captures,
  proof: { completeGovernedSections: 12, protectedHeroAdapter: true, disabledCaseEvidenceAbsent: true, mediaAnd3DIntegrated: false, rejectedImplantEdIntegrated: false, ctaContextInteraction: true, reducedMotion: true, r414ConsoleErrors: 0, inheritedSacredHeroHydrationWarnings: inheritedHeroWarnings.length },
  governance: { productionBinding: false, weosMutation: false, heroMutation: false },
}, null, 2));
await browser.close();
