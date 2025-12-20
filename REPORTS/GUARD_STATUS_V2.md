# Guard Status (V2)

- `pnpm run guard:rogue-hex` — Passed (allowlist notice for apps/web/app/treatments/page.tsx only).
- `pnpm run guard:canon` — Passed (patient portal SSR probe OK; no retired booking routes).
- `pnpm run verify` — Passed (runs guard:all → hero/rogue-hex/canon/hero-freeze/manifest/brand-structure/no-book, then lint, typecheck, and Next.js build).
