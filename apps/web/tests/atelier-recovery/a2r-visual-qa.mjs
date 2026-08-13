import { mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3100";
const evidenceDir = process.env.ATELIER_A2R_EVIDENCE_DIR ?? "/tmp/atelier-a2r-evidence";
await mkdir(evidenceDir, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
const problems = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) problems.push(`${message.type()}: ${message.text()}`); });
page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));

await page.goto(`${baseUrl}/champagne/atelier-recovery`, { waitUntil: "networkidle" });
await page.evaluate(() => localStorage.removeItem("champagne-atelier-a2r-working-copy-v1"));
await page.reload({ waitUntil: "networkidle" });
await page.getByRole("button", { name: "COMPONENTS", exact: true }).click();
await page.getByTestId("a2-component-library").waitFor();
await page.getByText("0 / 8 reconstruction reviews complete", { exact: true }).waitFor();

const componentIds = [
  "A2-DECISION-CLARITY-01", "A2-CLINICIAN-INSIGHT-01", "A2-SPECTRUM-CLOSING-BAND-01",
  "A2-PORCELAIN-DESCENT-FOOTER-01", "A2-ARCHITECTURAL-CTA-01", "A2-CLINICIAN-CREDENTIAL-CARD-01",
  "A2-PORCELAIN-CONSTELLATION-STRIP-01", "A2-QUESTION-FIRST-PANEL-01",
];
for (const componentId of componentIds) {
  await page.getByRole("button", { name: new RegExp(componentId) }).click();
  const render = page.getByTestId("a2-component-render");
  const source = page.locator("figure img");
  await Promise.all([render.waitFor(), source.waitFor()]);
  if ((await render.locator("img").count()) !== 0) throw new Error(`${componentId} rendered source imagery in the component body`);
  await source.evaluate(async (image) => {
    if (!image.complete || image.naturalWidth < 1) await image.decode();
  });
  if ((await source.evaluate((image) => image.naturalWidth)) < 1) throw new Error(`${componentId} source PNG did not load`);
  for (const width of [1440, 1024, 768, 390]) {
    await page.getByRole("button", { name: String(width), exact: true }).click();
    if (await render.evaluate((element) => element.scrollWidth > element.clientWidth + 1)) throw new Error(`${componentId} overflowed at ${width}`);
  }
}

await page.getByRole("button", { name: new RegExp(componentIds[0]) }).click();
await page.getByText(/SOURCE PREFERENCE = (LOVE|LIKE|MAYBE|NOT ME)/).waitFor();
await page.getByLabel("Too generic").check();
const verbatim = "The original is LOVE but this reconstruction has become flat and generic.";
await page.getByLabel("Verbatim Founder note").fill(verbatim);
await page.getByRole("button", { name: "FAIL", exact: true }).click();
await page.getByText("1 / 8 reconstruction reviews complete", { exact: true }).waitFor();
await page.getByRole("button", { name: "FAILED", exact: true }).click();
if ((await page.locator("aside[aria-label='Reconstructed component index'] button").count()) !== 1) throw new Error("FAILED filter did not isolate the reviewed failure");
await page.screenshot({ path: path.join(evidenceDir, "00-a2r-source-live-failed-review-desktop.png"), fullPage: true });

await page.reload({ waitUntil: "networkidle" });
await page.getByRole("button", { name: "COMPONENTS", exact: true }).click();
await page.getByText("1 / 8 reconstruction reviews complete", { exact: true }).waitFor();
if ((await page.getByLabel("Verbatim Founder note").inputValue()) !== verbatim) throw new Error("Verbatim Founder note did not survive browser checkpoint restore");

await page.setViewportSize({ width: 390, height: 844 });
await page.getByRole("button", { name: "ALL", exact: true }).click();
await page.getByRole("button", { name: "390", exact: true }).click();
if (await page.locator("body").evaluate((body) => body.scrollWidth > body.ownerDocument.documentElement.clientWidth + 1)) throw new Error("A2R library overflows at 390px");
await page.screenshot({ path: path.join(evidenceDir, "01-a2r-source-live-review-mobile-390.png"), fullPage: true });
if (problems.length) throw new Error(`Console problems:\n${problems.join("\n")}`);
await browser.close();
console.log(`Atelier A2R visual evidence written to ${evidenceDir}`);
