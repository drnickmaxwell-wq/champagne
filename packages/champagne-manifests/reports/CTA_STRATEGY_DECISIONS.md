# CTA_STRATEGY_DECISIONS.md

Status: Canon CTA guardrails for phase-home-cta-lock

## Routing priorities
- **Primary rail:** `/contact` for consultation intent, questions, and calm follow-up. This is the default replacement for any legacy `/book` target.
- **Discovery rail:** `/treatments` or treatment-specific slugs for exploration without forcing commitment.
- **Portal rail:** `/patient-portal?intent=login` for authenticated actions. If a CTA conveys a specific portal intent (video, finance, uploads), express it via query on this route until dedicated endpoints ship.
- **Prohibited:** `/book` and any derivatives.

## Copy and treatment alignment
- Use assessment-led language (“Book a consultation”, “Plan a visit”, “Talk to the team”) instead of transactional “book now”.
- Do not promise outcomes; keep CTAs advisory and descriptive.
- Map treatment CTAs to the relevant treatment hub when the visitor is still researching.

## CTA block policy
- Honor manifest-provided CTA blocks exactly as defined. Section-level CTAs take precedence over component presets.
- Only fall back to preset CTAs when the manifest omits a CTA group. Presets must respect the routing priorities above.
- If a preset lacks a destination, default to `/contact` rather than inventing an unvetted path.

## Accessibility & safety
- Ensure all CTA labels remain clear at AA contrast levels when rendered with current tokens.
- Avoid color-only distinctions; rely on presets and tokens already in the system.
- Keep remote and finance CTAs secondary to prevent pressure and to respect eligibility checks.

## Audit hooks
- `/book` must fail guards. New guard coverage lives in:
  - `packages/champagne-guards/scripts/guard-no-book.mjs` (repo-wide routing/manifests).
  - `packages/champagne-manifests/scripts/guard-no-book.mjs` (manifest data + helpers scope).
