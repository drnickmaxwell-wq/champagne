# TYPOGRAPHY_DRIFT_AND_COMPONENT_USAGE_AUDIT

Status: `FORENSIC_AUDIT_ONLY`  
Evidence date: 2026-06-05

## Executive finding

Typography usage is decentralized. Active token classes exist, but many production components set typography through Tailwind utility classes, inline `CSSProperties`, and CSS modules. Most component typography controls size/weight/tracking/line-height while inheriting the global body font.

## Drift categories

| Category | Evidence pattern | Drift risk |
| --- | --- | --- |
| Inline typography styles | `fontSize`, `fontWeight`, `letterSpacing`, `lineHeight` in section and hero components. | High: repeated values are not centrally governed. |
| Tailwind typography utilities | `text-sm`, `text-xl`, `font-semibold`, `tracking-tight`, `leading-relaxed`, etc. | Medium/high: Tailwind has no Champagne font extension. |
| CSS module typography | Footer, concierge, handoff, and preview modules define local font sizes/weights/line heights. | Medium: localized but outside type-token file. |
| Token class underuse | `.text-hero`, `.text-title`, `.text-lead`, `.text-body`, `.text-eyebrow` exist. | High: components often recreate these roles manually. |
| Semantic heading inheritance | `h1`, `h2`, `h3` often set size/weight only. | High: heading font remains body font unless explicitly classed. |
| Portal raw utilities | Patient portal uses generic Tailwind typography and neutral colors. | High for canon alignment; portal may be intentionally separate but not documented as typography exception. |

## Component usage findings

### Root/layout

- Root body applies `antialiased` and inherits global theme font-family.
- No root font variable or Next/font class is applied.

### Header/navigation

- Logo/brand text uses `text-lg font-semibold tracking-tight`.
- Strapline uses `text-xs`.
- Nav uses `text-sm`.
- Font family is inherited from body.

### Footer

- Footer CSS module defines local heading, copy, legal, and control typography with `font-size`, `font-weight`, and `line-height`.
- No footer-specific font-family override found.

### Hero

- `ChampagneHeroFrame` sets hero eyebrow size/tracking and h1 size/weight/line-height inline.
- It does not set `fontFamily` or use `.text-hero`.
- Therefore the active hero heading inherits body font.

### Section package

Representative section patterns:

- `Section_TextBlock`: inline `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing` for eyebrow/heading/body.
- `Section_FeatureList`: inline font weights, sizes, and tracking plus local pill/badge typography.
- `Section_TreatmentOverviewRich`: inline heading/body/bullet typography.
- `Section_TreatmentMediaFeature`: inline eyebrow/heading/caption/stat typography.
- `Section_FAQ`: style block and inline heading/body typography.
- `Section_TreatmentRoutingCards`: shared inline style objects for eyebrow/title/card meta/card title/body and injected CSS for data surfaces.
- `Section_PeopleGrid`: Tailwind typography utilities for eyebrow, title, copy, names, roles, summaries.
- `Section_MediaBlock`: inline caption/headline/eyebrow/stat typography.

### CTA package

- `ChampagneCTAButton` uses Tailwind `font-semibold`, `leading-none`, and `tracking-tight`.
- Font family is inherited.

### Patient portal

- Patient portal uses generic Tailwind type utilities and neutral color classes.
- It does not consume the active Champagne type utilities.

## Repeated local role approximations

The following roles are repeatedly re-created instead of referencing one semantic contract:

- Eyebrow: uppercase, 0.08em–0.14em tracking, 0.68rem–0.92rem size.
- Section heading: clamp around 1.15rem–1.85rem, weight 700.
- Body copy: 0.95rem–1.08rem, line-height 1.55–1.7.
- Card title: 1.05rem–1.2rem, weight 600–700.
- CTA/link text: text-sm or inherited, weight 600.

## Drift map by surface

| Surface | Current typography mode | Drift status |
| --- | --- | --- |
| Marketing public body | Inherited Inter-first theme stack | Stable but font not loaded. |
| Marketing sections | Inline/Tailwind values, inherited font | Drift active. |
| Hero frame | Inline values, inherited font | Drift active; display token not applied. |
| Header | Tailwind values, inherited font | Drift active but compact. |
| Footer | CSS module values, inherited font | Drift active but localized. |
| CTA | Tailwind values, inherited font | Drift active but compact. |
| Concierge | CSS module values, inherited font | Drift active. |
| Patient portal | Generic Tailwind values | Potentially separate product typography; not documented in canon. |
| Stock app | Separate CSS stack in `apps/stock/app/styles/stock-ui.css` | Out-of-scope product but uses Inter/system stack. |

## Guard visibility

Existing guards focus on hero integrity, color/token purity, route safety, SEO safety, and build/type/lint. No typography token purity, font loading, heading binding, or component typography drift guard was identified.

## Highest-risk drift examples

1. Hero h1 not using active display token.
2. Section heading styles hard-coded inline across many components.
3. Eyebrow styles duplicated with slight tracking/size variance.
4. Patient portal generic Tailwind typography outside Champagne token roles.
5. Active display/title utility lacks fallback family.

## Future audit automation candidates

- Static scan for `fontSize`, `fontWeight`, `letterSpacing`, `lineHeight` outside approved type token files.
- Static scan for `font-family` declarations outside token/theme files.
- Static scan for `font-*`, `text-*`, `tracking-*`, and `leading-*` Tailwind classes outside approved wrappers.
- Check that hero/title components consume a semantic display class/variable once chosen.
- Check that loaded font names match declared canon names.
