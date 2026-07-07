# TEST_RESULTS_V1

## Targeted Tests
- `node --test tests/contracts/champagne-contract-validator.test.mjs` — PASS.
- `node scripts/validate-champagne-contract-packet.mjs contracts/champagne-os/fixtures/valid-website-os-import-packet.json contracts/champagne-os/fixtures/valid-website-os-patch-proposal.json` — PASS.

## Required Guards
- `npm run guard:hero` — PASS.
- `npm run guard:canon` — PASS.
- `npm run verify` — PASS.

## Notes
- `npm run verify` emitted existing non-fatal warnings about Browserslist age, Tailwind content pattern breadth, workspace dependency legacy allowlist entries, SEO inventory count drift, and missing optional chatbot QA/conversation files. The command exited successfully.
