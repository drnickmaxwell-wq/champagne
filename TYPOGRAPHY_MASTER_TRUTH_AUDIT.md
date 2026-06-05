# TYPOGRAPHY_MASTER_TRUTH_AUDIT

Status: `FORENSIC_AUDIT_ONLY`  
Role: `CHAMPAGNE_TYPOGRAPHY_FORENSIC_AUDITOR`  
Repository: `drnickmaxwell-wq/champagne`  
Evidence date: 2026-06-05  
Scope: Repository evidence only. No font choice, no implementation, no sacred-file edits.

## Executive truth

The current runtime typography truth is not a single complete typography canon. It is a partial token/CSS implementation plus component-local typography decisions.

| Question | Implemented truth |
| --- | --- |
| Authoritative active production body font | `Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` via `packages/champagne-tokens/styles/champagne/theme.css`. |
| Authoritative tokenized display/heading intent | `.text-hero` and `.text-title` use `'Playfair Display'`, but those utility classes are not globally applied to semantic headings by default. |
| Implemented heading font at runtime | Headings inherit body `Inter` unless a component explicitly uses `.text-hero`, `.text-title`, or its own font-family. Most audited headings do not set font-family. |
| Implemented body font at runtime | `Inter` stack from `body, .champagne-page`. |
| Implemented hero/display font at runtime | Hero frame heading uses inline size/weight/line-height only; it inherits body `Inter`. Token class `.text-hero` exists but is not used there. |
| Font loading | No `next/font`, no `@font-face`, no Google Fonts stylesheet import, no font preload evidence found in production `apps/web`, `packages`, `docs`, `reports`, or `scripts` scan. |
| Tailwind typography setup | Tailwind content scans `apps/web/app` and `packages`; `theme.extend` is empty; no typography plugin is registered. |
| Typography guard coverage | Existing guards enforce color/token/hero/canon issues. No dedicated typography drift guard was found. |

## Source hierarchy discovered

### Active runtime source chain

1. `apps/web/app/layout.tsx` imports `./globals.css` and renders `<body className="min-h-screen antialiased">`.
2. `apps/web/app/globals.css` imports `packages/champagne-tokens/styles/champagne/theme.css`.
3. `theme.css` imports `typography.css` and defines the actual `body, .champagne-page` font-family stack.
4. Components either inherit this body stack or override typography locally with Tailwind classes / inline styles / CSS modules.

### Active typography token file

`packages/champagne-tokens/styles/champagne/typography.css` defines only five class utilities:

- `.text-hero` = `'Playfair Display'`, clamp size, weight 600.
- `.text-title` = `'Playfair Display'`, 2rem, weight 600.
- `.text-lead` = `Inter`, 1.05rem, opacity 0.95.
- `.text-body` = `Inter`, 0.98rem, opacity 0.95.
- `.text-eyebrow` = `Inter`, 0.8rem, uppercase, letter spacing 0.12em, opacity 0.75.

These are class utilities, not CSS variables, not Tailwind theme tokens, and not automatically bound to `h1`-`h6`, `p`, `body`, hero renderer, or page-builder primitives.

## Canon evidence discovered

### Active canon files do not define a complete type canon

The active material/token canon defines material, color, surface, and token philosophy, including that product surfaces may adjust typography scale, but it does not name a canonical heading/body/display font pair.

The active Champagne OS master spec lists canon domains but does not include typography as a dedicated domain.

### Historical/imported typography evidence conflicts

Imported/historical design files contain multiple competing typography statements:

| Evidence source | Typography statement | Runtime status |
| --- | --- | --- |
| Imported hero manifest | `display: Playfair Display`, `body: Inter` | Partially mirrored by active `typography.css`, but not loaded as actual web fonts. |
| Imported Director file | `Montserrat (Headings) · Lora (Body) · Inter (UI)` | Not implemented in active runtime body or tokens. |
| Imported Blueprint | Display `Poppins`, body `Inter`, numeric `IBM Plex Mono` | Not implemented in active runtime body, Tailwind theme, or font loading. |
| Active token typography CSS | `Playfair Display` display/title and `Inter` lead/body/eyebrow | Implemented as CSS classes only; not globally enforced. |
| Active theme CSS | `Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` | Implemented as global runtime body stack. |

## Current authoritative typography canon determination

Repository truth supports this conclusion:

1. **The current operational authority is the active token/theme CSS, not the imported historical canons.** The active web app imports `globals.css`, which imports active Champagne theme CSS.
2. **The active token/theme CSS canon is incomplete.** It declares a body font stack and five utility classes, but it does not define semantic type roles, CSS variables, a Tailwind type scale, heading bindings, font loading, fallback governance, or drift guards.
3. **The current heading font cannot truthfully be described as Playfair Display at runtime.** Playfair Display exists in `.text-hero` and `.text-title`, but most headings inherit the body font because they only set size/weight/line-height.
4. **The current implemented body font is Inter-first with system fallbacks.** Because Inter is not loaded, browser behavior depends on local availability; otherwise the stack falls through to system UI fonts.

## Implemented typography roles

| Role | Current implementation | Audit confidence |
| --- | --- | --- |
| Body | `Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` from theme CSS. | High |
| Lead | Optional `.text-lead` class with `Inter`, `1.05rem`, opacity. Not globally bound. | High |
| Body utility | Optional `.text-body` class with `Inter`, `0.98rem`, opacity. Not globally bound. | High |
| Eyebrow | Optional `.text-eyebrow`; many components independently recreate eyebrow styles inline/Tailwind. | High |
| Display/Hero | `.text-hero` declares Playfair Display, but hero frame does not use it. | High |
| Title | `.text-title` declares Playfair Display, but most section headings do not use it. | High |
| Navigation | Header uses Tailwind size/weight/tracking classes and inherits body font. | High |
| CTA | CTA button uses Tailwind `font-semibold`, `leading-none`, `tracking-tight`, inherits body font. | High |
| Portal | Patient portal uses raw Tailwind typography and neutral color classes, inherits body font. | High |
| Numeric/mono | Historical Blueprint mentions IBM Plex Mono; no active production implementation found. | High |

## File evidence index

- `apps/web/app/layout.tsx`: root CSS import and body class.
- `apps/web/app/globals.css`: theme import and antialiasing.
- `packages/champagne-tokens/styles/champagne/theme.css`: global body stack.
- `packages/champagne-tokens/styles/champagne/typography.css`: display/body utility classes.
- `apps/web/tailwind.config.cjs`: no Tailwind typography extension.
- `packages/champagne-hero/src/ChampagneHeroFrame.tsx`: hero heading inherits body font.
- `apps/web/app/components/layout/Header.tsx`: navigation typography via Tailwind classes.
- `packages/champagne-sections/src/*`: section typography mostly inline size/weight/line-height and inherited font family.
- `_imports/champagne-hero/code/hero-engine/DIRECTOR.md`: historical Montserrat/Lora/Inter statement.
- `_imports/champagne-hero/code/hero-engine/docs/Blueprint.md`: historical Poppins/Inter/IBM Plex Mono statement.
