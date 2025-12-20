# Guard status (v3)

- `pnpm run guard:rogue-hex` — passed. See terminal output for allowlist scan and success message. 
- `pnpm run guard:canon` — passed (patient portal SSR smoke test succeeded; canon files intact).
- `pnpm run verify` — passed (runs guard:all, lint, typecheck, and Next.js build for web).
