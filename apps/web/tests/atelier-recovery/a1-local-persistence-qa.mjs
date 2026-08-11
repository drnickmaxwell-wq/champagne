import process from "node:process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { applyReview, currentDecisionMap } from "../../app/champagne/atelier-recovery/data/preferences/preference-model.mjs";

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3105";
const endpoint = `${baseUrl}/champagne/atelier-recovery/api/preferences`;
const initialResponse = await fetch(endpoint);
if (!initialResponse.ok) throw new Error(`GET failed: ${initialResponse.status}`);
const { dataset, persistence } = await initialResponse.json();
if (!persistence.canonicalWriteEnabled || persistence.mode !== "WORKTREE_FILE_PERSISTENCE") throw new Error("Explicit local persistence did not enable");
if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE && process.env.ATELIER_A1_EVIDENCE_DIR) {
  await mkdir(process.env.ATELIER_A1_EVIDENCE_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(`${baseUrl}/champagne/atelier-recovery`, { waitUntil: "networkidle" });
  await page.getByTestId("persistence-status").getByText("WORKTREE_FILE_PERSISTENCE", { exact: true }).waitFor();
  await page.getByTestId("persistence-status").screenshot({ path: path.join(process.env.ATELIER_A1_EVIDENCE_DIR, "16-local-worktree-persistence-status.png") });
  await browser.close();
}
const existing = currentDecisionMap(dataset);
const target = "CVA-BAND-B019-E01";
if (existing.has(target)) throw new Error("Persistence QA target must begin unrated");
const next = applyReview(dataset, target, { wholeItemSignal: "LIKE", notes: "A1 atomic persistence QA" }, "2026-08-11T02:00:00.000Z");
const response = await fetch(endpoint, {
  method: "PUT",
  headers: { "Content-Type": "application/json", Origin: baseUrl, "Sec-Fetch-Site": "same-origin" },
  body: JSON.stringify({ dataset: next, expectedRevision: dataset.datasetRevision }),
});
const body = await response.json();
if (!response.ok) throw new Error(`PUT failed: ${response.status} ${body.error}`);
if (currentDecisionMap(body.dataset).get(target)?.wholeItemSignal !== "LIKE") throw new Error("Persisted decision missing");
const stale = await fetch(endpoint, {
  method: "PUT",
  headers: { "Content-Type": "application/json", Origin: baseUrl, "Sec-Fetch-Site": "same-origin" },
  body: JSON.stringify({ dataset: next, expectedRevision: dataset.datasetRevision }),
});
if (stale.status !== 409) throw new Error(`Stale overwrite was not rejected: ${stale.status}`);
const crossOrigin = await fetch(endpoint, {
  method: "PUT",
  headers: { "Content-Type": "application/json", Origin: "https://example.invalid", "Sec-Fetch-Site": "cross-site" },
  body: JSON.stringify({ dataset: next, expectedRevision: next.datasetRevision }),
});
if (crossOrigin.status !== 403) throw new Error(`Cross-origin mutation was not rejected: ${crossOrigin.status}`);
console.log("A1 explicit local worktree persistence, stale-write rejection and cross-origin rejection passed");
