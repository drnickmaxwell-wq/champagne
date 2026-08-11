import { mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3100";
const evidenceDir = process.env.ATELIER_A1_EVIDENCE_DIR ?? "/tmp/atelier-a1-evidence";
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
const deployedWriteStatus = (await page.context().request.put(`${baseUrl}/champagne/atelier-recovery/api/preferences`, { headers: { "Content-Type": "application/json", Origin: baseUrl, "Sec-Fetch-Site": "same-origin" }, data: {} })).status();
if (deployedWriteStatus !== 403) throw new Error(`Preview/production write endpoint did not fail closed: ${deployedWriteStatus}`);
if ((await page.getByTestId("large-artwork").count()) !== 1) throw new Error("Large artwork missing");
if ((await page.locator("body").evaluate((body) => body.scrollWidth > document.documentElement.clientWidth))) throw new Error("Desktop horizontal overflow");
await page.screenshot({ path: path.join(evidenceDir, "01-large-unrated-review.png"), fullPage: true });
await page.getByRole("button", { name: "Zoom in" }).click();
if ((await page.getByLabel("Current zoom").textContent()) !== "120%") throw new Error("Zoom control failed");
await page.getByRole("button", { name: "Focus mode" }).click();
if (!(await page.getByRole("button", { name: "Exit focus" }).count())) throw new Error("Focus mode failed");
await page.getByRole("button", { name: "Exit focus" }).click();

await page.getByRole("button", { name: "ARCHIVE", exact: true }).click();
await page.getByRole("button", { name: /CVA-SURFACE-B038-E01/ }).click();
await page.getByTestId("imported-provenance").waitFor();
await page.screenshot({ path: path.join(evidenceDir, "02-exact-import-provenance.png"), fullPage: true });

await page.getByRole("button", { name: "Parent board context" }).click();
await page.getByRole("dialog").waitFor();
await page.screenshot({ path: path.join(evidenceDir, "03-parent-board-context.png"), fullPage: false });
await page.getByRole("button", { name: "Close parent board context" }).click();

await page.getByRole("button", { name: /LIKE$/ }).click();
await page.getByRole("button", { name: "ARCHIVE", exact: true }).click();
await page.getByRole("button", { name: /CVA-SURFACE-B038-E01/ }).click();
if ((await page.getByRole("button", { name: /LIKE$/ }).getAttribute("aria-pressed")) !== "true") throw new Error("Whole-item rating did not persist");
await page.screenshot({ path: path.join(evidenceDir, "04-whole-item-rating.png"), fullPage: true });

await page.getByRole("button", { name: /Trait evidence/ }).click();
const colourRow = page.getByTestId("trait-evidence").locator("div").filter({ has: page.getByText("colour", { exact: true }) }).first();
await colourRow.getByRole("button", { name: "NEGATIVE", exact: true }).click();
const compositionRow = page.getByTestId("trait-evidence").locator("div").filter({ has: page.getByText("composition", { exact: true }) }).first();
await compositionRow.getByRole("button", { name: "POSITIVE", exact: true }).click();
await page.getByRole("textbox", { name: "colour trait note" }).fill("wrong colour, lovely shape");
await page.getByRole("textbox", { name: "colour trait note" }).blur();
await page.screenshot({ path: path.join(evidenceDir, "05-trait-positive-negative.png"), fullPage: true });

await page.getByRole("button", { name: "Keep concept", exact: true }).click();
await page.getByRole("button", { name: "Needs upgrade", exact: true }).click();
await page.getByRole("button", { name: "Wrong colours", exact: true }).click();
await page.screenshot({ path: path.join(evidenceDir, "06-refinement-flags.png"), fullPage: true });

const notes = page.getByRole("textbox", { name: "Founder note" });
const signalBeforeTyping = await page.getByRole("button", { name: /LIKE$/ }).getAttribute("aria-pressed");
await notes.fill("love the shape but colour is wrong — preserve this verbatim");
await notes.press("1");
if ((await page.getByRole("button", { name: /LIKE$/ }).getAttribute("aria-pressed")) !== signalBeforeTyping) throw new Error("Shortcut fired while typing in notes");
await notes.blur();
await page.screenshot({ path: path.join(evidenceDir, "07-verbatim-notes.png"), fullPage: true });

await page.getByRole("button", { name: /History/ }).click();
await page.getByTestId("decision-history").waitFor();
if ((await page.getByTestId("decision-history").locator("article").count()) < 2) throw new Error("Supersession history missing");
await page.screenshot({ path: path.join(evidenceDir, "08-undo-history.png"), fullPage: true });

await page.selectOption("label:has-text('Work queue') select", "NEEDS_UPGRADE");
await page.getByText("items in queue", { exact: true }).waitFor();
if ((await page.getByTestId("queue-size").textContent()) !== "1") throw new Error("Needs-upgrade queue count is incorrect");
await page.screenshot({ path: path.join(evidenceDir, "09-filter-work-queue.png"), fullPage: true });

await page.getByRole("button", { name: "SUMMARY", exact: true }).click();
await page.getByTestId("summary-view").waitFor();
await page.screenshot({ path: path.join(evidenceDir, "10-progress-summary.png"), fullPage: true });
await page.getByTestId("checkpoint-controls").waitFor();
await page.screenshot({ path: path.join(evidenceDir, "11-checkpoint-export-import.png"), fullPage: false });
const downloadPromise = page.waitForEvent("download");
await page.getByRole("button", { name: "Export review checkpoint" }).click();
const checkpoint = await downloadPromise;
const checkpointPath = await checkpoint.path();
if (!checkpointPath) throw new Error("Checkpoint download path missing");
await page.getByRole("button", { name: "Import review checkpoint" }).click();
await page.locator("input[type=file]").setInputFiles(checkpointPath);
await page.getByRole("button", { name: "REVIEW", exact: true }).click();
await page.getByTestId("persistence-status").getByText(/CHECKPOINT IMPORTED/).waitFor();

for (const width of [1024, 768]) {
  await page.setViewportSize({ width, height: 900 });
  await page.getByRole("button", { name: "REVIEW", exact: true }).click();
  if (await page.locator("body").evaluate((body) => body.scrollWidth > document.documentElement.clientWidth)) throw new Error(`${width}px horizontal overflow`);
  await page.screenshot({ path: path.join(evidenceDir, `${width === 1024 ? "12" : "13"}-review-${width}.png`), fullPage: false });
}

await page.setViewportSize({ width: 390, height: 844 });
await page.reload({ waitUntil: "networkidle" });
await page.getByTestId("large-artwork").waitFor();
if (await page.locator("body").evaluate((body) => body.scrollWidth > document.documentElement.clientWidth)) throw new Error("390px horizontal overflow");
await page.screenshot({ path: path.join(evidenceDir, "14-mobile-review-390.png"), fullPage: true });
if (!(await page.getByText(/BROWSER_WORKING_COPY/).count())) throw new Error("Persistence status missing");
await page.screenshot({ path: path.join(evidenceDir, "15-local-persistence-status.png"), fullPage: false });

await page.selectOption("label:has-text('Work queue') select", "UNRATED");
await page.locator("body").press("1");
await page.getByLabel("39 of 331 decided").waitFor();
if (problems.length) throw new Error(`Console problems:\n${problems.join("\n")}`);
await browser.close();
console.log(`Atelier A1 visual evidence written to ${evidenceDir}`);
