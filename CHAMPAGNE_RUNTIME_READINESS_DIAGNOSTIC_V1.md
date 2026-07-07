# Champagne Runtime Readiness Diagnostic V1

Role: `CHAMPAGNE_RUNTIME_READINESS_DIAGNOSTIC_PROGRAMME_V1`  
Date: 2026-07-07  
Scope: Champagne repo only. Read-only diagnostic plus diagnostic artefacts. No runtime wiring, no provider/PMS access, no deployment, no UI/app runtime mutation.

## Executive position

Do **not** claim launch readiness. Current evidence shows a useful contract-validator foundation exists, but future Website OS / Live Canvas runtime consumption must remain blocked until review gates, CI visibility, packet storage conventions, rollback rehearsal, and runtime-boundary authorization are formalized.

## Evidence reviewed

- `package.json` scripts for contract guard, contract validation, website truth export, and full verify chain.
- `contracts/champagne-os/contract-validator.mjs` and packet schemas/fixtures.
- `ops/contracts/PAGE_SURFACE_V1.json`, `PAGE_FAMILY_ROUTE_CANON_V1.json`, `EVIDENCE_REVIEW_METADATA_CONTRACT_V1.json`, `WEBSITE_TRUTH_EXPORT_CONTRACT_V1.json`, and `CHAMPAGNE_MANIFEST_IMPLEMENTATION_BRIDGE_V1.json`.
- `reports/PAGE_SURFACE_AND_ROUTE_CANON_FRAMEWORK_REPORT_V1.json`, `reports/WEBSITE_TRUTH_EXPORT_REPORT_V1.json`, and related audit output.
- Existing app runtime boundary files for future mapping only: `apps/web/app/(champagne)/_builder/ChampagnePageBuilder.tsx` and `apps/web/app/treatments/[slug]/page.tsx`.

## Current readiness findings

1. Contract packet types are present for Website OS import/export, Website OS safe patch, Live Canvas safe edit, evidence review, and rollback packets.
2. The current validator is fail-closed for forbidden runtime mutation authority, deployment/provider calls, PMS access, PHI/PMS text patterns, and sacred-zone operation paths.
3. The contract guard currently validates only safe fixtures matching `valid-*.json` under `contracts/champagne-os/fixtures`; it is not yet a runtime intake guard for arbitrary import/proposal directories.
4. The app runtime currently resolves manifests and renders the existing page-builder/section pipeline directly; no evidence was found of Website OS or Live Canvas packets being consumed by runtime.
5. Existing treatment pages emit JSON-LD and pass through `ChampagnePageBuilder`, which is an app runtime boundary for later work, not a safe place for packet intake until a Director-authorized runtime packet exists.
6. PAGE_SURFACE_V1 and evidence-review contracts are framework infrastructure and explicitly block launch claims without separate review evidence.

## Future runtime-wiring points

| Future wiring point | Current evidence | Likely files/modules touched later | Classification | Readiness verdict |
| --- | --- | --- | --- | --- |
| Website OS import packet intake | `website-os-import-envelope` packet type, schema, safe fixture, and validator exist. | `contracts/champagne-os/imports/**` or a new non-runtime intake directory; `scripts/validate-champagne-contract-packet.mjs`; possibly `scripts/guard-champagne-contracts.mjs`; CI workflow. | Safe non-runtime helper first; CI-only validator before runtime; app runtime boundary only in a later packet. | Safe to implement as non-runtime file intake and validation only. Not safe for app consumption yet. |
| Website OS safe patch proposal review | `website-os-safe-patch` packet type and safe fixture exist; validator rejects sacred-zone paths and forbidden authority. | `contracts/champagne-os/proposals/**`; validator; review report generator; CI guard; never direct app mutation in the review packet. | Safe non-runtime helper and CI-only validator; founder/clinical review required for content/clinical patches; sacred-zone risk if operations target hero files. | Safe as proposal review. Runtime mutation blocked until approved follow-up patch. |
| Live Canvas safe-edit preview | `live-canvas-safe-edit` packet type/schema exists but no safe fixture or runtime preview adapter was found. | Future preview-only packet directory; future adapter around `ChampagnePageBuilder` or preview routes; possibly `apps/web/app/champagne/**` preview zones. | App runtime boundary if rendered; founder/clinical review required for visible/clinical content; sacred-zone risk if hero renderer/manifests are referenced. | Not ready for runtime preview. Build validator and static preview report first. |
| Evidence review packet | `evidence-review` packet type/schema exists; PAGE_SURFACE evidence metadata contract requires source/reviewer metadata and blocks fabricated reviews. | `contracts/champagne-os/evidence/**`; `ops/contracts/EVIDENCE_REVIEW_METADATA_CONTRACT_V1.json`; future manifest/content review registries. | Safe non-runtime helper; CI-only validator; founder/clinical review required. | Safe to formalize non-runtime evidence packets. Runtime use requires clinical sign-off. |
| Rollback packet | `rollback-packet` packet type/schema exists; validator allows `rollback` operations but forbids deployment/runtime mutation authority. | `contracts/champagne-os/rollback/**`; validator; rollback rehearsal report; CI guard. | Safe non-runtime helper first; app runtime boundary only if it changes manifests/routes; sacred-zone risk if rollback touches hero files. | Safe to document and validate rollback proposals. Not safe to execute rollback mutation without explicit authority. |

## Minimum safe implementation sequence for later work

1. Create non-runtime packet storage conventions under `contracts/champagne-os/` for imports, proposals, evidence, previews, and rollback packets.
2. Extend validation coverage with safe fixtures for every packet type, including `live-canvas-safe-edit`, `evidence-review`, and `rollback-packet`.
3. Add a CI-only guard that validates only packet directories and emits a report; do not touch app runtime.
4. Add review report generation that classifies proposed operation paths as safe helper, CI-only validator, app runtime boundary, sacred-zone risk, or founder/clinical review required.
5. Add founder/clinical approval ledger requirements for any content, clinical, review, evidence, or visible UI output.
6. Add rollback packet rehearsal in CI using non-runtime fixtures only.
7. Only after the above passes, request a fresh Director-authorized runtime packet for any app-boundary preview adapter.
8. For any future app-boundary work, start in debug/preview routes and avoid sacred hero files unless explicit Sacred Hero Surgeon authority is granted.

## Stop conditions before runtime mutation is allowed

- Any required guard command is missing or fails.
- `guard:champagne-contracts`, contract validator tests, `guard:hero`, `guard:canon`, or `verify` fails.
- A packet requests `runtimeMutation`, deployment, provider calls, PMS access, secrets, production mutation, PHI, or PMS data.
- A packet operation touches a sacred-zone path without explicit applicable authority.
- A packet lacks `reviewGate.required: true`, reviewer roles, or approved/pending status.
- Clinical, evidence, review, or public-content changes lack founder/clinical review metadata.
- Live Canvas preview would render unapproved clinical copy or reviews.
- Rollback cannot be rehearsed from a non-runtime packet and audited before execution.
- A future change would create public routes, mutate production, alter hero runtime semantics, or claim launch readiness.

## Guard/test results

See `TEST_RESULTS_V1.md`. All requested commands completed with exit code 0. Existing warnings were observed for Browserslist freshness, Tailwind content globs, workspace dependency legacy allowlist, chatbot QA/report absence, and SEO inventory mismatch; none changed the exit code.
