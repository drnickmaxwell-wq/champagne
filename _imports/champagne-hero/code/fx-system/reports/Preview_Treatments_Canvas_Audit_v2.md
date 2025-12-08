# Preview Treatments Canvas Audit v2

Audit scope: `/app/preview/treatments/**` pages plus shared preview shells/styles that could influence their full-height canvases. Focused on selectors/components that paint a background on wrappers with `min-height: 100vh` or other page-level shells.

## Canvas-level wrappers

| File | Selector / Component | Class / Selector | Level | Routes under `/preview/treatments` using it |
| --- | --- | --- | --- | --- |
| `app/preview/treatments/layout.tsx` | Layout wrapper | `className="cpv-page cpv-page--champagne-dark cpv-page--treatments"` | canvas-level | **All** routes in the subtree inherit this wrapper. | 
| `styles/preview/champagne-preview.css` | `.cpv-page` | `.cpv-page` sets `min-height: 100vh` with transparent background; base canvas for treatments pages. | canvas-level | Applied via the layout wrapper on every treatments preview. |
| `styles/preview/champagne-preview.css` | `.cpv-page--champagne-dark` | Adds the champagne gradient background on the page shell. | canvas-level | Applied via `cpv-page cpv-page--champagne-dark` class from layout across all treatments routes. |
| `styles/preview/champagne-preview.css` | `.cpv-page.cpv-page--champagne-dark.cpv-page--treatments` | Treatment-specific override: sets dark ink background/color mix and keeps `min-height: 100vh`; competes directly with any other canvas rule. | canvas-level | Active on every `/preview/treatments` route because the layout sets both classes and the treatments modifier. |
| `styles/preview/dusk.css` | `[data-theme="preview-dusk"]` | Attribute selector enforces `min-height: 100vh` and `background-color: var(--smh-ink)` on any element carrying the theme token. | canvas-level | Active on every treatments preview because the subtree now renders inside `PreviewShell`, which sets `data-theme="preview-dusk"` on its root. |
| `components/preview/layout/preview-shell.module.css` | `.cpvShell` | Shell component provides `min-height: 100vh` and a three-stop gradient background. | canvas-level | Mounted for `/preview/treatments/**` now that they use `PreviewShell`, but the treatments override clears the gradient while keeping the shell chrome. |
| `components/preview/layout/preview-shell.module.css` | `.cpvShell:has(.cpv-page--treatments)` | Special-case override that forces the shell background transparent and hides backdrop/particles when a treatments canvas is inside. | canvas-level | Active for the treatments subtree so the Champagne canvas remains the sole painter beneath the shared preview header/footer. |
| `styles/preview/preview-v2-treatments.css` | `.cpv-v2-shell` | Experimental shell with `min-height: 100vh` and layered gradients. | canvas-level | No current usage found in `/preview/treatments/**`, but if adopted it would compete with `cpv-page cpv-page--champagne-dark`. |

## Notes
- Every treatments route is wrapped by `cpv-page cpv-page--champagne-dark cpv-page--treatments`, so the champagne dark canvas (including the treatments-specific override) is the active background today.
- The preview shell (`data-theme="preview-dusk"` on `.cpvShell`) now wraps the treatments subtree; its gradient/backdrop are neutralized by the treatments override, leaving the champagne canvas visible while still carrying the shared tokens and chrome.
- No hero-level or section-level backgrounds with full-page height requirements were found in the inspected files; the remaining backgrounds live on cards/sections rather than page canvases.
- `/preview/treatments/**` now renders inside `PreviewShell`, which supplies the preview header/footer and theme tokens while deferring the full-canvas paint to `cpv-page cpv-page--champagne-dark cpv-page--treatments`, keeping the Champagne treatments canvas as the sole background painter.
