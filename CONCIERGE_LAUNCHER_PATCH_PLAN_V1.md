# CONCIERGE_LAUNCHER_PATCH_PLAN_V1

- **Owner:** Dr Nick Maxwell
- **Date:** 2026-02-15
- **Status:** ARCHETYPE_SELECTED
- **Selected launcher archetype:** `A1_HERO_ANCHOR_PLAQUE`
- **Fallback:** `A2_EDGE_KEYLINE_HANDLE`

## Selection decision

`A1_HERO_ANCHOR_PLAQUE` is selected as the canonical launcher direction.

This best preserves the intended identity of the concierge entry as an **architectural access point** rather than a support-style widget, while staying restrained and premium.

## Non-negotiable constraints (carried forward)

- No Hero V2 engine changes
- No token-system changes
- No CTA engine changes
- No manifest routing changes
- No engine contract changes
- No nomenclature drift
- No new `ui.kind` values

## Minimal patch scope (Concierge-only)

### In scope

- `apps/web/app/components/concierge/ConciergeLayer.tsx`
  - Update launcher anchoring/placement logic so the launcher reads as hero-adjacent architectural plaque.
- `apps/web/app/components/concierge/ConciergeShell.tsx`
  - Keep launcher as always-present entry; no auto-open behavior.
- `apps/web/app/components/concierge/concierge.module.css`
  - Add restrained plaque styling (quiet rest state, subtle contrast lift on hover/focus, short-lived gold state trace on open/close only).

### Out of scope

- Sacred hero engine/manifests/render entry edits
- Global style/layout edits
- Token authoring edits
- CTA/manifest/contract changes
- Structural duplication for SaaS tiering

## Interaction contract (locked)

- Launcher is always present
- Launcher does not auto-open
- Close paths preserved:
  - Escape
  - Overlay click
  - Explicit close button
- Focus restore on close:
  - Return to launcher; fallback to last focused element
- Gold is state-change trace only (open/close), never persistent
- No desktop modal takeover
- Mobile remains compatible with future full-screen consultation entry mode

## SaaS tiering contract

Tiering is implemented via **classes/flags only**:

- tenant-level enable/disable
- tier-based skin selection
- tier-based behaviour flags (future)
- emergency kill switch (admin)

No component structure duplication.

## Implementation sequencing (diagnostic-first)

1. Confirm current launcher DOM ownership and focus-return anchor points.
2. Confirm no dependence on hero render timing for launcher visibility.
3. Apply positioning logic updates in Concierge layer/shell only.
4. Apply plaque visual treatment in concierge CSS only (token-only usage).
5. Validate keyboard and pointer access for launcher target.
6. Validate open/close trace behavior (gold appears only on transition).
7. Validate no layout shifts and no hero/CTA contract impacts.

## Verification gates

Run and require pass:

- `npm run guard:hero`
- `npm run guard:canon`
- `npm run verify`

## Exit criteria

- Launcher reads as embedded architectural plaque, not widget/tab/bubble.
- Locked interaction rules remain intact.
- No prohibited systems touched.
- All required guards pass.
