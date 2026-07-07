# Test Results V1

Date: 2026-07-07

| Command | Result | Notes |
| --- | --- | --- |
| `pnpm run guard:champagne-contracts` | PASS | Valid safe fixtures passed. |
| `node --test tests/contracts/champagne-contract-validator.test.mjs` | PASS | 5 tests passed. |
| `pnpm run guard:hero` | PASS | Hero guard and sacred hero lock passed. |
| `pnpm run guard:canon` | PASS | Canon guard passed; observed Browserslist and Tailwind content warnings during SSR probe. |
| `pnpm run verify` | PASS | Full verify completed, including token purity, workspace deps, SEO launch safety, contract guard, guard:all, lint, typecheck, and production web build. |

## Warnings observed

- Browserslist/caniuse-lite data is stale.
- Tailwind content pattern warning for `../../packages/**/*.ts`.
- Workspace dependency guard emitted legacy allowlist warnings but passed.
- SEO launch safety warned that treatment inventory total does not match live machine manifest: inventory 78 vs machine manifest 79.
- Chatbot engine copy guard warned that `reports/CHATBOT_ENGINE_COPY_QA_REPORT_V1.json` is missing and no conversation files were found in `config/conversations`; guard passed.
- Next lint/build warned that the Next.js plugin was not detected in ESLint configuration; lint/build passed.

No runtime mutation or deployment was performed.
