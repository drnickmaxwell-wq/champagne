# Next Codex Prompt V1

ROLE: CHAMPAGNE_CONTRACT_PACKET_INTAKE_HARDENING_V1

MISSION:
Implement only non-runtime Champagne OS contract packet intake hardening. Do not wire packets into app runtime. Do not mutate UI, hero runtime, manifests, providers, PMS, secrets, or production.

SCOPE:
- Champagne repo only.
- Allowed target area should be limited to `contracts/champagne-os/**`, contract validation scripts/tests, reports, and CI guard wiring if needed.
- No app runtime wiring.
- No launch readiness claims.

OBJECTIVES:
1. Add safe fixtures for `live-canvas-safe-edit`, `evidence-review`, and `rollback-packet`.
2. Add/extend tests proving all approved packet types validate when safe and fail closed for runtime mutation, sacred-zone paths, PHI/PMS, provider/deploy authority, and missing review gates.
3. Add a CI-only/report-only packet classification helper that labels operations as safe non-runtime helper, CI-only validator, app runtime boundary, sacred-zone risk, and founder/clinical review required.
4. Keep packet intake non-runtime: no imports from app runtime into validators, no preview rendering, no deployment, no provider/PMS access.
5. Run required guards: `pnpm run guard:champagne-contracts`, `node --test tests/contracts/champagne-contract-validator.test.mjs`, `pnpm run guard:hero`, `pnpm run guard:canon`, `pnpm run verify`.

STOP CONDITIONS:
- Any required guard is missing or fails.
- Any change would touch sacred hero files or manifests.
- Any change would render Live Canvas output in app runtime.
- Any packet requires runtime mutation, deployment, provider calls, PMS access, secrets, PHI, or production mutation.
- Any clinical/evidence/review content lacks founder/clinical review gating.

DELIVERABLES:
- Updated contract fixtures/tests/validator docs as needed.
- A short report summarizing packet classification behavior.
- No launch readiness claim.
