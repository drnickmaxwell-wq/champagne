# CTA canon status

- Searched for `/book` targets with `rg "/book"` (see terminal log) — matches limited to guard/docs references and the CTA registry safeguard; no live CTA hrefs point to `/book`.
- CTA registry continues to sanitize `/book` via `forbiddenTarget` handling in `packages/champagne-cta/src/CTARegistry.ts`.
