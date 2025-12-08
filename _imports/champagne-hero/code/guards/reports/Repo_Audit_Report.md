# Repo Audit Summary

## Route Coverage
- Enumerated all production routes including treatments, team, stories, and education paths with explicit component exports.
- Captured preview surfaces such as `/preview/lux/**`, `/preview/champagne**`, and locked `/preview/brand-lock` along with the frozen `/champagne/hero` hero shell.
- Documented API handlers for appointments, brand manifests, chat, and integrations.

## Component Inventory Highlights
- Frozen set tracks champagne hero, luxury hero video stack, and luxe footer implementations plus associated layout shells.
- Preview components mapped for hero, footer, and treatment banner experiments.
- Manus-referencing components include hero experiences, SmileJourney onboarding, and linked manifests at `public/assets/champagne/manifest.json`, `public/brand/manifest.json`, and `styles/champagne/manifest.json`.

## Tokens & Guards
- Token coverage anchored by `styles/tokens/smh-champagne-tokens.css`.
- Guard toolchain includes hero freeze, brand structure, hue verification, and supporting Playwright checks exposed through package scripts.

## Risks & Follow-ups
- **Rogue Tailwind Hues**: Hardcoded colour values detected in hero polish styles, technology module CSS, navigation breadcrumbs, and preview layers. Align with tokens or register guard exceptions.
- **Blueprint Gaps**: No parallax/sticky scroll framework present; integrate Lenis/GSAP ScrollTrigger (or equivalent) to meet advanced interaction goals.

## Recommended Actions
1. Refactor flagged files to consume design tokens or document sanctioned deviations within guard scripts.
2. Introduce a scroll choreography library and connect priority hero/treatment surfaces to parity with blueprint requirements.
