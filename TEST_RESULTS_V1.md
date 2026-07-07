# TEST_RESULTS_V1

## Commands Run

| Command | Result | Notes |
| --- | --- | --- |
| `pnpm run guard:champagne-contracts` | PASS | Validated all safe `valid-*.json` contract fixtures. |
| `node --test tests/contracts/champagne-contract-validator.test.mjs` | PASS | Confirmed valid fixtures pass and invalid fixtures fail closed. |
| `pnpm run guard:hero` | PASS | Hero guard and sacred hero lock passed. |
| `pnpm run guard:canon` | PASS | Canon guard passed; emitted existing Browserslist/Tailwind warnings only. |
| `pnpm run verify` | PASS | Full verify completed, including the new contract guard, aggregate guards, lint, typecheck, and web build; emitted existing non-fatal warnings. |

## Notes
- No provider calls, deploys, PHI/PMS access, secret access, or production mutations were performed.
- No runtime app code was changed.
