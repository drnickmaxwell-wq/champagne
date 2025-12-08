# Preview Treatments Canvas and Hero Alignment Report

## Layout structure
- `app/preview/treatments/layout.tsx` wraps all treatment preview routes in a shared wrapper: `<div className="cpv-page cpv-page--champagne-dark" data-treatment={...}>`.
- Treatment pages and the reusable template no longer attach their own `cpv-page` wrappers; the layout owns the canvas class stack.
- Shared preview CSS (champagne preview skin, preview layout/typography, treatments preview skin) is loaded once in the layout for the entire subtree.

## Canvas class stack
- Canonical canvas classes: `cpv-page cpv-page--champagne-dark`.
- Legacy canvas modifiers have been removed from the stylesheet so the dark Champagne canvas is defined in one place.

## Hero tone containment
- Hero tone classes remain scoped to hero components only; no hero tone utilities are attached to `.cpv-page` or other page-level wrappers.
- The canvas styling ignores tonal pack variants at the page level, keeping tone effects within the hero band.

## Navigation behaviour (whitening & composite bonding)
- Whitening and composite bonding preview pages render on the shared dark Champagne canvas via the layout while keeping their hero presets and CTA System v2 styling.
- Navigating hub → whitening → composite bonding → hub (and other treatment previews) retains the same dark canvas with no light/washed transitions because page-level wrappers no longer override backgrounds.

## Neutralised tonal/background overrides
- Replaced prior canvas modifiers with the canonical `.cpv-page--champagne-dark` gradient and scoped canvas overlays to that class, preventing tonal packs from repainting the page.
- Removed the template-level gradient on `.implantsCanvas` and confined CTA/canvas variables to the shared layout instead of per-page global selectors.
- Converted `styles/preview/treatments.css` to inherit the shared dark canvas with on-dark tokens so the schema preview route no longer introduces a light background.
- Kept template and card backgrounds section-scoped so whitening/composite-specific skins no longer affect the global canvas.

ALL /preview/treatments routes now share a stable dark Champagne canvas; hero tones are constrained to the hero band only, with no navigation-induced light canvas states.
