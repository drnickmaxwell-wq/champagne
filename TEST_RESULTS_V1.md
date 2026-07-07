# TEST_RESULTS_V1

Status: `PASS_WITH_EXISTING_WARNINGS`

## Commands run

| Command | Result | Notes |
| --- | --- | --- |
| `npm run guard:hero` | PASS | Hero guard and sacred hero lock passed. |
| `npm run guard:canon` | PASS | Canon guard passed; emitted existing npm, Browserslist, and Tailwind content warnings. |
| `npm run verify` | PASS | Token purity, workspace deps guard, SEO launch safety, all guards, lint, typecheck, and web build completed successfully. Existing warnings included stale Browserslist data, Tailwind content pattern warning, Next.js lint deprecation/plugin warning, workspace dependency legacy warnings, SEO inventory mismatch warning, and missing chatbot QA report warning. |
| `node -e "JSON.parse(require('fs').readFileSync('CHAMPAGNE_WEBSITE_OS_CONTRACT_DESIGN_V1.json','utf8'))"` | PASS | Contract JSON parsed successfully. |

## Important warning context

The verify command reported an existing SEO launch-safety warning that the treatment inventory total does not match the live machine manifest (`inventory: 78`, `machine manifest: 79`) and recommends refreshing `REPORTS/TREATMENT_INVENTORY.md`. This design packet does not claim launch readiness and did not remediate that warning.
