import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const output = process.env.ATELIER_QA_OUTPUT ?? "atelier-r4.5-visual-qa";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const consoleErrors = [];
page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
const captures = [];
const capture = async (name, scenario) => {
  const path = `${output}/${name}.png`;
  await page.screenshot({ path, fullPage: false });
  captures.push({ name, path, scenario, viewport: page.viewportSize(), url: page.url() });
};

await page.goto(`${baseURL}/champagne/design-lab`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Open Homepage Atelier" }).click();
assert.equal(await page.locator("[data-semantic-id]").count(), 12);
assert.equal(await page.locator('[data-semantic-id="home.proof"]').count(), 0);
await capture("01-home-desktop-auto", "Homepage · Desktop 1440×900 · AUTO / LIVE");

await page.getByLabel("Device preset").selectOption("iphone");
await page.getByLabel("Display scale").fill("75");
assert.match(await page.locator(".dl4-context strong").innerText(), /390 × 844/);
await capture("02-home-iphone-portrait", "Homepage · iPhone 390×844 · portrait");

await page.getByLabel("Time of day").selectOption("night");
await page.getByLabel("Compare time of day").selectOption("morning");
assert.equal(await page.locator(".dl45-preview-frame").count(), 2);
await capture("03-home-night-v-morning", "Homepage · two-up night versus morning");

await page.getByRole("button", { name: "Clean preview" }).click();
assert.equal(await page.locator(".dl4-topbar").isVisible(), false);
await capture("04-clean-preview", "Clean preview · editor chrome hidden");
await page.getByRole("button", { name: "Return to studio" }).click();

await page.getByRole("button", { name: "Experience layers" }).click();
await page.getByRole("button", { name: "concierge" }).click();
await page.getByRole("button", { name: "Compare two" }).click();
await capture("05-concierge-compare", "Concierge · Architectural Light versus Editorial Host");
await page.getByRole("button", { name: "journey" }).click();
await page.getByRole("button", { name: "Open the Host" }).click();
await page.getByRole("button", { name: "Replace a missing tooth" }).click();
await page.getByRole("button", { name: "See how the parts fit" }).click();
await page.getByRole("button", { name: "Open 3D exhibit" }).click();
assert.match(await page.getByText("SYNTHETIC · NOT FINAL · NOT VISUAL AUTHORITY").innerText(), /NOT FINAL/);
await capture("06-implant-3d-synthetic", "Implant 3D · frozen synthetic fixture");
await page.getByRole("button", { name: "Continue to human contact" }).click();
assert.match(await page.getByRole("heading", { name: "Continue with the practice" }).innerText(), /Continue/);
await capture("07-explicit-human-handoff", "Journey · explicit human contact destination");

await page.getByRole("button", { name: "Close" }).press("Escape");
assert.equal(await page.getByRole("dialog", { name: "Experience rooms" }).count(), 0);
assert.deepEqual(consoleErrors, []);
await writeFile(`${output}/manifest.json`, JSON.stringify({ schema: "CHAMPAGNE_ATELIER_R4_5_VISUAL_QA_V1", head: process.env.GITHUB_SHA ?? "LOCAL", base: process.env.ATELIER_BASE_SHA ?? "a00f718a93710028b364930566d7f6a44483bc25", generatedAt: new Date().toISOString(), evidence: "FIXTURE_PROVEN", productionBinding: false, captures }, null, 2));
await browser.close();
