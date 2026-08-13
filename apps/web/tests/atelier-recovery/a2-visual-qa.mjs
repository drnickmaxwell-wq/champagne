import { mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3100";
const evidenceDir = process.env.ATELIER_A2_EVIDENCE_DIR ?? "/tmp/atelier-a2-evidence";
await mkdir(evidenceDir, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
const problems = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) problems.push(`${message.type()}: ${message.text()}`); });
page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));

await page.goto(`${baseUrl}/champagne/atelier-recovery`, { waitUntil: "networkidle" });
if ((await page.title()) !== "Champagne Atelier Recovery") throw new Error(`Unexpected title: ${await page.title()}`);
await page.getByTestId("atelier-recovery").waitFor();
if (await page.getByText(/Build Error|Runtime Error|Unhandled Runtime Error/).count()) throw new Error("Framework error overlay present");
await page.getByRole("button", { name: "COMPONENTS", exact: true }).click();
await page.getByTestId("a2-component-library").waitFor();
await page.screenshot({ path: path.join(evidenceDir, "00-a2-library-desktop.png"), fullPage: true });

const componentIds = [
  "A2-DECISION-CLARITY-01", "A2-CLINICIAN-INSIGHT-01", "A2-SPECTRUM-CLOSING-BAND-01",
  "A2-PORCELAIN-DESCENT-FOOTER-01", "A2-ARCHITECTURAL-CTA-01", "A2-CLINICIAN-CREDENTIAL-CARD-01",
  "A2-PORCELAIN-CONSTELLATION-STRIP-01", "A2-QUESTION-FIRST-PANEL-01",
];
for (const [index, componentId] of componentIds.entries()) {
  await page.getByRole("button", { name: new RegExp(componentId) }).click();
  const render = page.getByTestId("a2-component-render");
  await render.waitFor();
  if ((await render.locator("img").count()) !== 0) throw new Error(`${componentId} rendered a PNG/image body`);
  const source = page.locator("figure img");
  if ((await source.evaluate((image) => image.naturalWidth)) < 1) throw new Error(`${componentId} source reference failed to load`);
  for (const width of [1440, 1024, 768, 390]) {
    await page.getByRole("button", { name: String(width), exact: true }).click();
    const overflow = await render.evaluate((element) => element.scrollWidth > element.clientWidth + 1);
    if (overflow) throw new Error(`${componentId} overflows at ${width}px preview`);
  }
  await page.getByRole("button", { name: "1440", exact: true }).click();
  await render.screenshot({ path: path.join(evidenceDir, `${String(index + 1).padStart(2, "0")}-${componentId}-desktop.png`) });
  await page.getByRole("button", { name: "390", exact: true }).click();
  await render.screenshot({ path: path.join(evidenceDir, `${String(index + 1).padStart(2, "0")}-${componentId}-mobile.png`) });
}

await page.setViewportSize({ width: 390, height: 844 });
await page.reload({ waitUntil: "networkidle" });
await page.getByRole("button", { name: "COMPONENTS", exact: true }).click();
await page.getByTestId("a2-component-library").waitFor();
if (await page.locator("body").evaluate((body) => body.scrollWidth > document.documentElement.clientWidth + 1)) throw new Error("A2 library overflows at 390px");
await page.screenshot({ path: path.join(evidenceDir, "17-a2-library-mobile-390.png"), fullPage: true });
if (problems.length) throw new Error(`Console problems:\n${problems.join("\n")}`);
await browser.close();
console.log(`Atelier A2 visual evidence written to ${evidenceDir}`);
