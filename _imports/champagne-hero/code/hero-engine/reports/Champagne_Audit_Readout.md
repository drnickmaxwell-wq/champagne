# Champagne Repo State Audit

## Branch Context
- Current branch: `work`.
- Default branch: not discoverable (no remote `origin` configured).
- Ahead/behind status relative to default branch: not determinable without remote.

## Hero Engine Inventory
- `components/champagne/hero/HeroEngine.tsx` – Preview-gated hero renderer that validates a `HeroSchema` and renders it via `HeroFrame`, importing `hero-engine.css`; exports `HeroEngine` component with `schema`/`allowNonPreview` props.
- `components/champagne/hero/HeroFrame.tsx` – Layout shell applying tone/intensity classes, wiring wave/shimmer/CTA subcomponents to the validated `HeroSchema`.
- `components/champagne/hero/HeroWaveStack.tsx` – Renders layered SVG wave masks based on `HeroSchema` wave config.
- `components/champagne/hero/HeroShimmer.tsx` – Optional shimmer overlay driven by `HeroSchema` shimmer settings.
- `components/champagne/hero/HeroCTABar.tsx` – CTA plate rendering hero CTA pair according to schema CTA config.
- `lib/champagne/hero-presets.ts` – Defines preset `HeroSchema` objects including `whitening_hero` and `composite_bonding_hero`.
- `components/preview/treatments/whitening/WhiteningHero.tsx` – Whitening route hero band that renders `<HeroEngine schema={whitening_hero} />`.

## CTA System v2 and Tonal Pack Docs
- `docs/champagne/Champagne_CTA_System.md` – Present; documents preview Regal Glass–Gold CTA classes, hero plate usage, and implementation notes.
- `docs/champagne/Champagne_Tonal_Pack_v1.md` – Present; describes Tonal Pack v1 principles, tone catalogue (e.g., `whitening_dawn`), and layer/CTA guidance for future Hero Engine consumption.

## Whitening & Composite Preview Templates
- Whitening page: `app/preview/treatments/whitening/page.tsx` – Wraps content in `.cpv-page` div using `whitening-preview.module.css`; renders `<WhiteningHero />` (Hero Engine with whitening preset) followed by overview, AI tools, clinician insight, stories, FAQ, and CTA sections within `<main>`.
- Composite bonding page: `app/preview/treatments/composite-bonding/page.tsx` – Similar `.cpv-page` wrapper with composite styles; renders `<CompositeBondingHero />` (ChampagnePreviewHero with CTA pair) then overview, AI tools, clinician insight, stories, FAQ, CTA sections within `<main>`.
- Whitening hero uses Hero Engine; composite bonding hero remains a static preview hero component.
- Composite bonding uses shared layout/card styling on the preview canvas; whitening mirrors section structure but uses the same preview canvas rather than a distinct dark treatment wrapper.

## Canvas / Tonal Treatment
- `styles/preview/champagne-preview.css` applies light, paper-based gradient background and overlays to `.cpv-page` for all treatments, including whitening and composite; no whitening-specific overrides found.
- Whitening stylesheet (`components/preview/treatments/whitening/whitening-preview.module.css`) defines layout/padding but does not override the global light preview canvas; no dark-canvas enforcement present.
- Composite bonding stylesheet (`components/preview/treatments/composite-bonding/composite-bonding-preview.module.css`) likewise relies on the shared preview canvas without custom background settings.

## Final Summary
- Hero Engine implementation is present (`components/champagne/hero`), and whitening hero is already wired to it via `WhiteningHero` using the `whitening_hero` preset.
- CTA System v2 and Tonal Pack v1 docs are present under `docs/champagne`.
- Whitening currently sits on the shared light preview canvas (no dedicated dark treatment wrapper); composite bonding also uses the same preview canvas rather than a darker treatment shell.
- Minimal future change: wrap the whitening preview page in the dark treatment layout used by composite bonding (if introduced) and ensure its sections adopt that canvas; wiring to Hero Engine is already in place via `WhiteningHero`.
