# NEXT_CODEX_PROMPT_V1

ROLE: CHAMPAGNE_CONTRACT_RUNTIME_READINESS_DIAGNOSTIC_V1

MISSION:
Perform a read-only readiness review for future Website OS / Live Canvas runtime wiring. Do not implement runtime code.

SCOPE:
- Read-only diagnostics only.
- No runtime app code changes.
- No UI changes.
- No deploy.
- No provider calls.
- No PHI/PMS/secrets access.
- No production mutation.

OBJECTIVES:
1. Confirm `contract:validate` and `guard:champagne-contracts` are still wired and passing.
2. Identify the exact files that would require fresh Director authorization before runtime wiring.
3. Propose a disabled-by-default dry-run adapter design that cannot mutate production.
4. Propose additional failure tests needed before any runtime adapter is implemented.
5. Produce a readiness report only.

REQUIRED COMMANDS:
- `pnpm run guard:champagne-contracts`
- `node --test tests/contracts/champagne-contract-validator.test.mjs`
- `pnpm run guard:hero`
- `pnpm run guard:canon`
- `pnpm run verify`

DELIVERABLE:
- `CHAMPAGNE_CONTRACT_RUNTIME_READINESS_REPORT_V1.md`
