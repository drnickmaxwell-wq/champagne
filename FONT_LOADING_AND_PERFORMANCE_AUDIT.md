# FONT_LOADING_AND_PERFORMANCE_AUDIT

Status: `FORENSIC_AUDIT_ONLY`  
Evidence date: 2026-06-05

## Executive finding

The repository declares font-family names but does not implement web font loading for the public web app. There is no production evidence of `next/font`, `@font-face`, Google Fonts imports, local font assets, or font preload hints.

## Font-loading scan results

Audited search categories:

- `next/font`
- `@font-face`
- `fonts.googleapis`
- `fonts.gstatic`
- `rel="preload"` with font intent
- `font-display`
- font import/preload patterns in `apps`, `packages`, `docs`, `reports`, and `scripts`

Result: no active production font-loading implementation found.

## Runtime consequence

| Font family name | Declared where | Loaded by repository? | Runtime consequence |
| --- | --- | --- | --- |
| Inter | `theme.css`, `.text-lead`, `.text-body`, `.text-eyebrow` | No | Uses local Inter if installed; otherwise falls to system stack for body. |
| Playfair Display | `.text-hero`, `.text-title`, imported manifests | No | Uses local Playfair if installed; otherwise fallback behavior is uncontrolled because active utility lacks an explicit serif fallback. |
| Montserrat | Historical Director doc | No | Not used by active runtime. |
| Lora | Historical Director doc | No | Not used by active runtime. |
| Poppins | Historical Blueprint doc | No | Not used by active runtime. |
| IBM Plex Mono | Historical Blueprint doc | No | Not used by active runtime. |

## Current fallback truth

### Body fallback stack

The active body fallback stack is:

```css
Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
```

This is explicit and browser-safe. Because Inter is not loaded in-repo, the practical result for many users may be system UI.

### Display/title fallback stack

The active display/title utilities use:

```css
'Playfair Display'
```

No `Georgia`, `serif`, or other fallback is declared in the active token utility. If the font is unavailable, browser fallback resolution is not canon-controlled.

## Performance assessment

### Positive findings

- No external font CSS requests are currently introduced by the repository.
- No font files are bundled, so no direct font asset weight is added.
- The body stack can fall through to system fonts, which can be fast.

### Risk findings

- Brand typography is non-deterministic because named fonts are declared without controlled loading.
- If a future implementation adds remote font loading without `next/font` or self-hosting strategy, it could introduce render-blocking CSS, extra DNS/TLS costs, FOIT/FOUT, and Core Web Vitals risk.
- Because Playfair is declared without a fallback stack in active utilities, layout/appearance can vary more sharply by device.
- There is no repository budget for font files, subsets, weights, preload strategy, or `font-display` behavior.

## Weight/subset inventory

No implemented font files or configured font weights were found. The only active numeric weights are component declarations such as 600, 700, and 800. These are CSS weights, not loaded font assets.

## Performance readiness gaps

A future font implementation needs a decision record for:

1. Self-hosted vs `next/font/google` vs system-only.
2. Which weights are truly needed for display/body/UI.
3. Latin subset requirements.
4. `display` behavior (`swap`, `optional`, etc.).
5. Preload strategy for critical display/body fonts.
6. Fallback metrics/adjustment strategy to limit CLS.
7. CWV budgets for added font bytes.
8. Font license/provenance evidence.

## Do-not-implement recommendation

This audit does not recommend a final font. It recommends that any future typography decision pack treat font loading as unresolved and high-impact, not as already solved.
