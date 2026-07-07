# NEXT_CODEX_PROMPT_V1

ROLE: CHAMPAGNE_CONTRACT_SCHEMA_VALIDATOR_PROGRAMME_V1_FOLLOWUP

MISSION:
Review the non-runtime Champagne OS contract schemas and validators added under `contracts/champagne-os/` and decide whether to add CI-only validation wiring. Do not wire schemas into runtime app code.

SCOPE:
- Champagne repo only.
- No runtime app code.
- No UI changes.
- No deployment.
- No provider calls.
- No secrets, PHI, PMS, or production mutation.
- Preserve sacred-zone boundaries.

REQUIRED CHECKS:
- Run targeted contract tests.
- Run `npm run guard:hero`.
- Run `npm run guard:canon`.
- Run `npm run verify`.

OUTPUT:
- Report whether CI-only wiring is recommended.
- If implemented, keep it non-runtime and fail-closed.
