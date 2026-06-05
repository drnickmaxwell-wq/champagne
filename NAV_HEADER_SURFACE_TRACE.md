# NAV_HEADER_SURFACE_TRACE

Mode: read-only trace  
Evidence date: 2026-06-05

## Header/nav implementation

`apps/web/app/components/layout/Header.tsx` currently:

- obtains nav items from manifests;
- defines `headerStyle` inline;
- renders a `<header className="border-b" style={headerStyle}>`;
- renders a site-name link, subtitle, nav links, and consultation CTA.

## Surface assignments

| Element | Current surface/color behavior | Diagnostic implication |
| --- | --- | --- |
| Header root | `borderBottom: 1px solid color-mix(in srgb, var(--bg-ink) 72%, transparent)` and `background: color-mix(in srgb, var(--bg-ink) 85%, transparent)`. | Header samples root ink directly and is translucent; no dedicated nav surface token found. |
| Site-name link | `text-[var(--text-high)]`. | Text follows current ink/porcelain alias context; header is outside porcelain wrapper, so normally ink text aliases apply. |
| Subtitle | `text-[var(--text-medium)]`. | Same inherited text alias model. |
| Nav links | `text-[var(--text-medium)]`; hover uses `color-mix(in_srgb,var(--bg-ink)_82%,transparent)` and `hover:text-[var(--text-high)]`. | Hover surface remains ink-derived. |
| Consultation CTA | border `var(--border-subtle)`, text `var(--text-high)`, hover background `color-mix(... var(--bg-ink) ...)`. | CTA mixes porcelain-derived border token with ink-derived hover surface. |
| Sticky wrapper | Root layout wraps `<Header />` in `<div className="sticky top-0 z-50">`. | Header remains visually stable above route/hero/content swaps. |

## Flash risk

The header/nav is not the only likely flash cause, but it can make the issue visible because it is sticky and semitransparent. During route loads, it continues to show an ink-derived material while the area below may briefly move between root ink, hero imagery/fx, gradient fallback, and porcelain content.

## Evidence still needed

A future browser capture should log computed background and backdrop for:

- sticky wrapper;
- `<header>`;
- first nav link hover/non-hover state if interaction flash is reported;
- hero root directly below header;
- first below-hero porcelain surface.
