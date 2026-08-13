import { applyReconstructionReview, currentReconstructionReviewMap, EMPTY_FIDELITY_FLAGS } from "../../app/champagne/atelier-recovery/data/reconstruction-review/reconstruction-review-model.mjs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const index = JSON.parse(await readFile(path.resolve(testDir, "../../app/champagne/atelier-recovery/data/reconstruction/ATELIER_A2_RECONSTRUCTED_COMPONENT_INDEX_V1.json"), "utf8"));

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3106";
const endpoint = `${baseUrl}/champagne/atelier-recovery/api/reconstruction-reviews`;
const initialResponse = await fetch(endpoint);
if (!initialResponse.ok) throw new Error(`GET failed: ${initialResponse.status}`);
const { dataset, persistence } = await initialResponse.json();
if (!persistence.canonicalWriteEnabled || persistence.mode !== "WORKTREE_FILE_PERSISTENCE") throw new Error("Explicit A2R local persistence did not enable");
const component = index.components[0];
const next = applyReconstructionReview(dataset, index, component.componentId, {
  disposition: "REFINE", fidelityFlags: { ...EMPTY_FIDELITY_FLAGS, tooGeneric: true },
  founderNote: "A2R atomic persistence QA — preserve verbatim.", reviewedResponsiveViewports: [1440, 1024, 768, 390],
}, "2026-08-14T03:00:00.000Z");
const response = await fetch(endpoint, {
  method: "PUT", headers: { "Content-Type": "application/json", Origin: baseUrl, "Sec-Fetch-Site": "same-origin" },
  body: JSON.stringify({ dataset: next, expectedRevision: dataset.datasetRevision }),
});
const body = await response.json();
if (!response.ok) throw new Error(`PUT failed: ${response.status} ${body.error}`);
const persisted = currentReconstructionReviewMap(body.dataset).get(component.componentId);
if (persisted?.founderNote !== "A2R atomic persistence QA — preserve verbatim.") throw new Error("Verbatim review note was not persisted");
const stale = await fetch(endpoint, {
  method: "PUT", headers: { "Content-Type": "application/json", Origin: baseUrl, "Sec-Fetch-Site": "same-origin" },
  body: JSON.stringify({ dataset: next, expectedRevision: dataset.datasetRevision }),
});
if (stale.status !== 409) throw new Error(`Stale overwrite was not rejected: ${stale.status}`);
const crossOrigin = await fetch(endpoint, {
  method: "PUT", headers: { "Content-Type": "application/json", Origin: "https://example.invalid", "Sec-Fetch-Site": "cross-site" },
  body: JSON.stringify({ dataset: next, expectedRevision: next.datasetRevision }),
});
if (crossOrigin.status !== 403) throw new Error(`Cross-origin mutation was not rejected: ${crossOrigin.status}`);
console.log("A2R explicit worktree persistence, verbatim note, stale-write and cross-origin guards passed");
