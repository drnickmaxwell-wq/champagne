import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const schema = "CHAMPAGNE_ATELIER_R4_9_FOUNDER_GENERATIVE_DESIGN_STUDIO_QA_V1";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const output = process.env.ATELIER_QA_OUTPUT ?? "atelier-r4.9-founder-generative-design-studio-qa";
const branchHeadSha = process.env.ATELIER_BRANCH_HEAD_SHA ?? "LOCAL";
const executionSha = process.env.ATELIER_EXECUTION_SHA ?? process.env.GITHUB_SHA ?? "LOCAL";
const branchHeadTree = process.env.ATELIER_BRANCH_HEAD_TREE ?? "LOCAL";
const executionTree = process.env.ATELIER_EXECUTION_TREE ?? "LOCAL";
assert.equal(branchHeadTree, executionTree);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const errors = [];
page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
await page.goto(`${baseURL}/champagne/design-lab`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Open Homepage Atelier", exact: true }).click();
await page.getByRole("button", { name: "Generate & explore", exact: true }).click();
const dialog = page.getByRole("dialog", { name: /Generate\. Compare\. Refine\. Remix\./ });
await dialog.waitFor();

const captures = [];
async function capture(filename, viewport, state) {
  await page.setViewportSize(viewport);
  if (viewport.width <= 390) await page.locator(".dl49-candidate").first().scrollIntoViewIfNeeded();
  const buffer = viewport.width <= 390
    ? await page.screenshot({ path: `${output}/${filename}`, fullPage: false })
    : await dialog.screenshot({ path: `${output}/${filename}` });
  const width = buffer.readUInt32BE(16); const height = buffer.readUInt32BE(20);
  assert.ok(width <= viewport.width && width > viewport.width * .9);
  if (viewport.width <= 390) assert.equal(height, viewport.height);
  captures.push({ filename, state, outerViewport: viewport, width, height, productionBinding: false });
}

await capture("01-studio-home-desktop.png", { width: 1440, height: 900 }, "STUDIO_HOME");
await page.getByRole("button", { name: "Generate four proposals", exact: true }).click();
assert.equal(await page.locator(".dl49-candidate").count(), 4);
assert.equal(await page.locator('[data-affinity="DNA_ALIGNED"]').count(), 2);
assert.equal(await page.locator('[data-affinity="EXPLORATORY_OUTLIER"]').count(), 2);
await capture("02-webpage-four-way-comparison.png", { width: 1440, height: 900 }, "WEBPAGE_COMPARE_ABCD");

await page.locator(".dl49-candidate").nth(0).getByRole("button", { name: "love", exact: true }).click();
await page.locator(".dl49-candidate").nth(1).getByRole("button", { name: "keep", exact: true }).click();
await page.locator(".dl49-candidate").nth(0).getByRole("button", { name: "More like this", exact: true }).click();
assert.equal(await page.locator(".dl49-candidate").count(), 4);
await capture("03-more-like-this-lineage.png", { width: 1440, height: 900 }, "MORE_LIKE_THIS");

await page.getByRole("button", { name: /New exploration/ }).click();
await page.getByRole("button", { name: "Concierge UI/UX", exact: true }).click();
await page.getByLabel("Design surface").selectOption("answer");
await page.getByRole("button", { name: "Reference-led", exact: true }).click();
await page.getByLabel("Reference description").fill("A quiet architectural source drawer with editorial evidence rhythm");
await capture("04-reference-led-input.png", { width: 1024, height: 768 }, "REFERENCE_LED_INPUT");
await page.getByRole("button", { name: "Generate four proposals", exact: true }).click();
assert.match(await page.locator(".dl49-compare-head").innerText(), /UX_LOGIC_AUTHORITY ≠ VISUAL_STYLE_AUTHORITY/);
await capture("05-concierge-answer-comparison.png", { width: 1024, height: 768 }, "CONCIERGE_COMPARE");

await page.getByRole("button", { name: /None of these/ }).click();
assert.equal(await page.locator(".dl49-candidate").count(), 4);
await capture("06-none-of-these-new-family.png", { width: 768, height: 1024 }, "NONE_OF_THESE");
await capture("07-mobile-concierge-foundry.png", { width: 390, height: 844 }, "MOBILE_CONCIERGE_FOUNDRY");

await page.getByRole("button", { name: "Design DNA", exact: true }).click();
assert.match(await dialog.innerText(), /explicit decisions/i);
await capture("08-founder-design-dna.png", { width: 768, height: 1024 }, "FOUNDER_DESIGN_DNA");
await page.getByRole("button", { name: "Lineage", exact: true }).click();
assert.ok(await page.locator(".dl49-lineage li").count() >= 12);
await capture("09-proposal-lineage.png", { width: 1440, height: 900 }, "LINEAGE");

await page.getByRole("button", { name: "Close studio", exact: true }).click();
await page.getByRole("button", { name: "Export governed brief", exact: true }).waitFor();
assert.deepEqual(errors, []);
await writeFile(`${output}/manifest.json`, JSON.stringify({ schema, branchHeadSha, branchHeadTree, executionSha, executionTree, base: process.env.ATELIER_BASE_SHA, generatedAt: new Date().toISOString(), captures, responsiveEvidence: [1440, 1024, 768, 390], proposalCounts: { perSet: 4, minimumRequired: 4, maximumRequired: 6 }, governance: { productionBinding: false, generation: "DETERMINISTIC_CODE_NATIVE_PROPOSALS_NOT_AI", designReferenceAuthority: false, uxLogicAuthorityChanged: false, accessibilityEnvelope: "PRESERVED", weosRuntime: false, acceptedR48PreviewMutated: false } }, null, 2));
await browser.close();
