import { mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const evidenceDir = process.env.ATELIER_A0_EVIDENCE_DIR ?? "/tmp/atelier-a0-evidence";
await mkdir(evidenceDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1050 }, deviceScaleFactor: 1 });
const consoleProblems = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleProblems.push(`${message.type()}: ${message.text()}`); });
page.on("pageerror", (error) => consoleProblems.push(`pageerror: ${error.message}`));

await page.goto(`${baseUrl}/champagne/atelier-recovery`, { waitUntil: "networkidle" });
if ((await page.title()) !== "Champagne Atelier Recovery") throw new Error(`Unexpected title: ${await page.title()}`);
await page.getByTestId("atelier-recovery").waitFor();
if (await page.locator("nextjs-portal").count()) throw new Error("Next.js framework overlay is present");
await page.screenshot({ path: path.join(evidenceDir, "01-foundation-desktop.png"), fullPage: true });

for (const [label, testId, fileName] of [
  ["ARCHIVE", "archive-view", "02-archive-desktop.png"],
  ["BRAND AUTHORITY", "brand-view", "03-brand-authority-desktop.png"],
  ["REVIEW", "review-view", "04-review-coming-next.png"],
  ["PAGES", "pages-view", "05-responsive-foundation-desktop.png"],
]) {
  await page.getByRole("button", { name: new RegExp(`^${label}`) }).click();
  await page.getByTestId(testId).waitFor();
  await page.screenshot({ path: path.join(evidenceDir, fileName), fullPage: true });
}

await page.getByRole("button", { name: "390" }).click();
if ((await page.getByTestId("responsive-frame").getAttribute("data-viewport")) !== "390") throw new Error("Responsive viewport control did not update to 390");
await page.screenshot({ path: path.join(evidenceDir, "06-responsive-frame-390-desktop-stage.png"), fullPage: true });

await page.setViewportSize({ width: 390, height: 844 });
await page.reload({ waitUntil: "networkidle" });
await page.getByTestId("atelier-recovery").waitFor();
await page.screenshot({ path: path.join(evidenceDir, "07-foundation-mobile-390.png"), fullPage: true });
await page.getByRole("button", { name: /^ARCHIVE/ }).click();
await page.getByTestId("archive-view").waitFor();
await page.screenshot({ path: path.join(evidenceDir, "08-archive-mobile-390.png"), fullPage: true });

if (consoleProblems.length) throw new Error(`Console problems:\n${consoleProblems.join("\n")}`);
await browser.close();
console.log(`Atelier A0 visual evidence written to ${evidenceDir}`);
