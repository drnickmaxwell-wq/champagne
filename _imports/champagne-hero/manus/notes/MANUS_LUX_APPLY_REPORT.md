# Manus Lux Canon – Apply Report

**Repo:** drnickmaxwell-wq/please-work  
**Stack:** Next.js App Router, TypeScript, Tailwind v4, Node 20+ (pnpm)

## Changes in this patch
- Tokens: Adopted Manus Lux 3-stop gradient and keyline gold (#F9E8C3); legacy two-stop kept as `--smh-gradient-legacy`.
- Guards: `brand-guard.cjs` blocks legacy hex outside tokens; `brand-report.cjs` & `verify-hue.cjs` enforce the new canonical gradient.
- Surfaces: `styles/champagne/surface.css` remapped to canonical `/assets/champagne/*` paths and correct layer order.
- Components: `components/sections/HeroLuxury.tsx` wired to surface stack + tokenised CTAs.
- Tests: New `tests/brand-lux.spec.ts` asserts gradient stops and keyline gold at runtime.
- CI/Dev UX: Package scripts run guard + verify + brand tests; CI steps scaffolded.

## What you still need to do
- Upload binaries listed in `UPLOAD_ASSETS_TODO.md` (Codex cannot commit binaries).
- Re-run guard/tests/build locally, then push and open PR: `feat/canon-manus-lux-v1`.

## Quick local verification
```bash
pnpm i
pnpm brand:guard
pnpm verify:hue
pnpm test:brand
pnpm build
```

Notes

Preview pages /preview/brand-lock and /preview/brand-live must be reachable for Playwright checks.

Future PRs: refit SmileJourney, FooterLuxe, TreatmentGrid to tokens; extend tests to assert section-specific layers.
