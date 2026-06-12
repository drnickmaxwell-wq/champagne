# Champagne To Agent Handoff Manifest V1

## CAPABILITY_ADDED
- Added a handoff manifest for the already-created Creative Connector read-only Champagne page inventory export.
- This manifest adds no website execution authority, performs no source/content/route/metadata mutation, and makes no launch-ready claim.
- Manual copy destination in the agent repo import drop: `tools/agent/data/imports/champagne-page-inventory/`.

## EXECUTION_ADDED
- No runtime execution, provider call, crawl, screenshot, deployment, publishing, PHI access, route change, content edit, or metadata change was added.
- Validation rerun command: `node creative-connector-page-inventory-export-v1/validate-export.mjs`.
- Validation result: PASS.
- Validation output summary: `valid: true`, `pages: 103`, `EXTRACTED_DECLARED: 46`, `PARTIAL: 57`.

## Required Export/Support Files
| Status | File path | Size (bytes) | Copy destination |
| --- | --- | ---: | --- |
| Present | `creative-connector-page-inventory-export-v1/CHAMPAGNE_PAGE_INVENTORY_EXPORT_V1.json` | 1084517 | `tools/agent/data/imports/champagne-page-inventory/CHAMPAGNE_PAGE_INVENTORY_EXPORT_V1.json` |
| Present | `creative-connector-page-inventory-export-v1/CHAMPAGNE_PAGE_INVENTORY_EXPORT_STATUS_V1.json` | 578 | `tools/agent/data/imports/champagne-page-inventory/CHAMPAGNE_PAGE_INVENTORY_EXPORT_STATUS_V1.json` |
| Present | `creative-connector-page-inventory-export-v1/CHAMPAGNE_PAGE_INVENTORY_EXPORT_REPORT_V1.md` | 13834 | `tools/agent/data/imports/champagne-page-inventory/CHAMPAGNE_PAGE_INVENTORY_EXPORT_REPORT_V1.md` |
| Present | `creative-connector-page-inventory-export-v1/CHAMPAGNE_PAGE_INVENTORY_IMPORT_INSTRUCTIONS_FOR_AGENT_V1.md` | 2725 | `tools/agent/data/imports/champagne-page-inventory/CHAMPAGNE_PAGE_INVENTORY_IMPORT_INSTRUCTIONS_FOR_AGENT_V1.md` |

## Page Count
- Total pages in export: 103.

## Extraction Summary
- Schema version: `CHAMPAGNE_PAGE_INVENTORY_EXPORT_V1`.
- Source repo: `champagne`.
- Generation mode: `STATIC_SOURCE_INSPECTION_ONLY`.
- Page types: home (1), hub (1), editorial (2), utility (9), site (1), legal (5), team_hub (1), team_detail (3), treatment_hub (1), treatment_detail (79).
- Extraction coverage: EXTRACTED_DECLARED (46), PARTIAL (57).
- Clinical/treatment-review risk pages: 80.
- CTA blocks recorded: 306.
- Media slots recorded: 128.
- Non-page route handlers observed: 6.
- Source files read by export metadata: 10.

## HUMAN_DECISIONS_REQUIRED
- A human must manually copy the four required export/support files into `tools/agent/data/imports/champagne-page-inventory/` in the agent repo.
- A human or authorized agent-side importer must decide how to store the read-only imported page read-model in the agent repo.
- Any future rewrite, publishing, deployment, provider call, PHI handling, metadata change, route change, or website mutation requires separate authorization and is outside this handoff.

## TOP_LAUNCH_BLOCKERS
- This export is not a launch artifact and must not be treated as launch-ready approval.
- H1 values remain intentionally `UNKNOWN` because runtime-rendered markup was not extracted.
- 57 pages are `PARTIAL`, primarily where runtime section defaults or page-truth alignment could not be fully declared from static inventory.
- Four manifest treatment routes are absent from the existing page-truth index and remain partial evidence records: `/treatments/cosmetic-dentistry`, `/treatments/preventive-dentistry`, `/treatments/surgically-guided-implants`, `/treatments/teeth-replacement`.
- Clinical/treatment-review risk flags must be preserved and must not be treated as approved rewrite eligibility.

## NEXT_CAMPAIGN
CREATIVE_CONNECTOR_PHASE_15A3_AGENT_IMPORT_FROM_SUPPLIED_EXPORT_FILES_V1

## EXACT_PROMPT_PATH
- Agent import drop path: `tools/agent/data/imports/champagne-page-inventory/`.
- Agent import instructions file after copy: `tools/agent/data/imports/champagne-page-inventory/CHAMPAGNE_PAGE_INVENTORY_IMPORT_INSTRUCTIONS_FOR_AGENT_V1.md`.
- Source prompt/instructions path in Champagne repo: `creative-connector-page-inventory-export-v1/CHAMPAGNE_PAGE_INVENTORY_IMPORT_INSTRUCTIONS_FOR_AGENT_V1.md`.

## Manual Copy Readiness
- Yes. The four required export/support files exist, validation passes, and they can be copied manually into `tools/agent/data/imports/champagne-page-inventory/` in the agent repo import drop.
