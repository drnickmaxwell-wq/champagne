import { mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3100";
const evidenceDir = process.env.ATELIER_A2F_EVIDENCE_DIR ?? "/tmp/atelier-a2f-evidence";
await mkdir(evidenceDir, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
const problems = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) problems.push(`${message.type()}: ${message.text()}`); });
page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));

await page.goto(`${baseUrl}/champagne/atelier-recovery`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "COMPONENTS", exact: true }).click();
await page.getByTestId("a2-component-library").waitFor();
await page.getByText(/A2R remains 0 \/ 8/).waitFor();

const calibration = [
  ["A2-DECISION-CLARITY-01", 836],
  ["A2-SPECTRUM-CLOSING-BAND-01", 820],
  ["A2-PORCELAIN-DESCENT-FOOTER-01", 1167],
];
for (const [componentId, nativeWidth] of calibration) {
  await page.getByRole("button", { name: new RegExp(componentId) }).click();
  await page.getByRole("button", { name: `SOURCE ${nativeWidth}` }).click();
  const render = page.getByTestId("a2-component-render");
  const source = page.locator("figure img");
  await Promise.all([render.waitFor(), source.waitFor()]);
  if ((await render.locator("img").count()) !== 0) throw new Error(`${componentId} uses an image in its live body`);
  if (await render.evaluate((element) => element.scrollWidth > element.clientWidth + 1)) throw new Error(`${componentId} overflows its native source viewport`);
  if (componentId === "A2-DECISION-CLARITY-01") {
    const nativeRailIsComplete = await render.evaluate((element) => {
      const root = element.querySelector('[data-a2-component="A2-DECISION-CLARITY-01"]');
      if (!root) return false;
      const rootRect = root.getBoundingClientRect();
      const rails = [...root.querySelectorAll("h3"), root.querySelector("aside")].filter(Boolean);
      return rails.length === 5 && rails.every((rail) => {
        const rect = rail.getBoundingClientRect();
        return rect.left >= rootRect.left && rect.right <= rootRect.right && rect.top >= rootRect.top && rect.bottom <= rootRect.bottom;
      });
    });
    if (!nativeRailIsComplete) throw new Error(`${componentId} does not expose all four information rails and the summary inside its native frame`);
  }
  await page.getByRole("button", { name: "SPLIT", exact: true }).click();
  await page.getByLabel("Source overlay opacity").fill("50");
  await page.getByRole("button", { name: "OVERLAY", exact: true }).click();
  await page.locator("section[aria-label='Director source fidelity workbench']").screenshot({ path: path.join(evidenceDir, `${componentId}-native-overlay-50.png`) });
  await page.getByRole("button", { name: "BLINK", exact: true }).click();
  await page.locator("section[aria-label='Director source fidelity workbench']").screenshot({ path: path.join(evidenceDir, `${componentId}-native-blink-source.png`) });
  await page.waitForTimeout(700);
  await page.locator("section[aria-label='Director source fidelity workbench']").screenshot({ path: path.join(evidenceDir, `${componentId}-native-blink-live.png`) });
  await page.getByRole("button", { name: "SIDE BY SIDE", exact: true }).click();
  await page.setViewportSize({ width: Math.max(2200, (nativeWidth * 2) + 420), height: 1200 });
  await page.locator("section[aria-label='Director source fidelity workbench']").screenshot({ path: path.join(evidenceDir, `${componentId}-native-side-by-side.png`) });
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const width of [1440, 1024, 768, 390]) {
    await page.getByRole("button", { name: String(width), exact: true }).click();
    if (await render.evaluate((element) => element.scrollWidth > element.clientWidth + 1)) throw new Error(`${componentId} overflows at ${width}`);
  }
}

await page.getByText(/Preserved A2R Founder review machinery/).click();
for (const disposition of ["APPROVE", "REFINE", "FAIL"]) {
  if (await page.getByRole("button", { name: disposition, exact: true }).isEnabled()) throw new Error(`${disposition} must remain disabled in A2F`);
}
if (await page.locator("body").evaluate((body) => body.scrollWidth > body.ownerDocument.documentElement.clientWidth + 1)) throw new Error("A2F workbench causes page-level overflow");
if (problems.length) throw new Error(`Console problems:\n${problems.join("\n")}`);
await browser.close();
console.log(`Atelier A2F visual evidence written to ${evidenceDir}`);
