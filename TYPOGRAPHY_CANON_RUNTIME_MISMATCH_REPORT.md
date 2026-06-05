# TYPOGRAPHY_CANON_RUNTIME_MISMATCH_REPORT

Status: `FORENSIC_AUDIT_ONLY`  
Evidence date: 2026-06-05

## Primary mismatch summary

There is no single complete active typography canon. Runtime typography is governed by active CSS inheritance plus component-local overrides. Historical imported canon files name different font systems that are not implemented.

## Mismatch matrix

| Area | Canon / intent evidence | Runtime evidence | Mismatch |
| --- | --- | --- | --- |
| Heading font | Active `.text-title` says `'Playfair Display'`; historical Director says Montserrat; historical Blueprint says Poppins. | Most headings use Tailwind or inline size/weight only and inherit body `Inter`. | Heading authority is ambiguous; runtime mostly Inter. |
| Body font | Active theme says Inter-first stack; active `.text-body` says Inter; historical Director says Lora body. | Body receives Inter-first stack from `theme.css`. | Historical Lora body canon is not implemented. |
| Hero/display font | Active `.text-hero` says `'Playfair Display'`; imported hero manifests say Playfair Display display. | `ChampagneHeroFrame` h1 only sets fontSize/fontWeight/lineHeight; no fontFamily/class. | Hero display font token exists but is not applied in current hero frame. |
| Font loading | Historical docs mention font prefetch/preload direction. | No `next/font`, `@font-face`, Google stylesheet, or preload found. | Named fonts may not resolve unless installed locally. |
| Fallback stack | Theme body stack is explicit for Inter. | `.text-hero` and `.text-title` specify only `'Playfair Display'` without serif fallback in active token CSS. | Display/title utility fallback stack is incomplete. |
| Tailwind type tokens | Expected design systems normally encode font family/scale in Tailwind. | `tailwind.config.cjs` has empty `theme.extend` and no typography plugin. | Tailwind typography is not canonized. |
| Component typography | Token classes exist. | Components duplicate font sizes, weights, line heights, letter spacing inline and via Tailwind. | High drift risk. |
| Guards | Canon/hero/token guards exist. | No typography-specific guard found. | Typography drift can pass existing guard suite. |

## Runtime facts that supersede assumptions

1. The active app has no Next font import in `apps/web/app/layout.tsx`.
2. The app loads typography only through CSS imports, not through font files or external font CSS.
3. Body font-family is defined only in theme CSS.
4. Active display/title font-family utilities exist, but application is opt-in.
5. Hero and section heading elements largely do not opt in to `.text-hero` or `.text-title`.
6. The browser receives font-family names for Playfair/Inter but no repository-provided font source.

## Canon conflict log

### Conflict A: Playfair Display vs Montserrat vs Poppins

- Active token utility: Playfair Display for `.text-hero` and `.text-title`.
- Imported Director: Montserrat for headings.
- Imported Blueprint: Poppins for display.
- Runtime semantic headings: inherited Inter unless explicitly classed.

Conclusion: final heading/display authority is unresolved.

### Conflict B: Inter body vs Lora body

- Active theme CSS: Inter-first body stack.
- Imported Director: Lora body.
- Runtime: Inter-first stack.

Conclusion: implemented runtime body authority is Inter-first, not Lora.

### Conflict C: token classes vs component-local typography

- Active typography token classes define a small type vocabulary.
- Components define sizes, weights, and tracking inline or via Tailwind.

Conclusion: the token classes are not the universal component contract.

## Severity assessment

| Risk | Severity | Why |
| --- | --- | --- |
| Named web fonts not actually loading | High | Brand typography may differ by user device. |
| Display font token not applied to hero runtime | High | Hero is a primary brand surface. |
| Conflicting historical canons | High | Future agents could choose wrong authority. |
| No Tailwind font family extension | Medium | Tailwind classes remain generic and unconstrained. |
| No typography drift guard | Medium | Component-local drift can continue silently. |
| Missing display fallback stack | Medium | If Playfair is unavailable, fallback is UA/default rather than canon-controlled. |

## Required future decision inputs

A future luxury typography decision pack must decide:

1. Whether active authority should be Playfair/Inter, Montserrat/Lora/Inter, Poppins/Inter/IBM Plex Mono, or a new luxury system.
2. Whether display/title should be web-loaded or system-only.
3. Whether headings should bind globally (`h1`-`h6`) or via semantic classes/components.
4. Whether Tailwind should expose `font-display`, `font-body`, `font-ui`, `font-mono`.
5. Whether token classes should become CSS variables or stay utility classes.
6. Whether typography drift must be guarded like color/token drift.
