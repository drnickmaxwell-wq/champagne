# HERO_SURFACE_AND_FALLBACK_TRACE

Mode: read-only trace  
Evidence date: 2026-06-05

## Hero mount selection

`HeroMount` chooses V2 only when `NEXT_PUBLIC_HERO_ENGINE` normalizes to `v2`; otherwise it dynamically imports the V1 `HeroRenderer`. In V2 mode it reads request headers, normalizes pathname, checks `heroDebug`, builds a V2 model, and returns a wrapper with `data-hero-engine="v2"` and `style={{ minHeight: "72vh" }}`.

## Hero V2 surface model

The V2 model builder:

- resolves pathname and mode;
- gets route hero binding;
- obtains runtime surfaces;
- builds CSS variables for wave masks/backgrounds/overlays/particles/grain;
- filters surface stack entries based on suppression, active motion IDs, particle/grain governance, bloom state, and PRM;
- assigns layer inline styles for known surface tokens;
- emits motion video layers if not PRM and not denylisted.

## Surface/fallback behaviors relevant to flash

| Area | Current behavior | Flash implication |
| --- | --- | --- |
| V2 wrapper | `HeroMount` sets `minHeight: 72vh` before the V2 frame. | Space is reserved, but background depends on child frame/surfaces/root. |
| V2 fallback | `HeroFallback()` uses `BaseChampagneSurface variant="inkGlass"` with `background: var(--smh-gradient)` and text saying assets are unavailable. | If fallback appears then model resolves, the visual surface can jump from gradient to hero stack. |
| V2 frame CSS | `.hero-renderer-v2` sets layout, min-height, color, containment, overflow, and motion variables, but no explicit background declaration. | If no layer paints immediately, root/main ink can show through. |
| V2 optical isolation | First two internal overlay children are forced to `background: none`, `opacity: 0`, and no backdrop filter. | Internal BaseChampagneSurface overlays are intentionally suppressed. |
| `gradient.base` | Model style currently sets z-index only. | A `gradient.base` layer may not provide a visible base unless class/external CSS supplies background. |
| `field.waveBackdrop` | Uses `backgroundImage: var(--hero-wave-background-desktop)` plus opacity/blend/z-index governance. | Missing governance sets opacity 0 and records missing fields. |
| `field.waveRings` / `field.dotGrid` | Use hero overlay variables, glue, opacity/blend/z-index governance. | Missing opacity sets layer to 0. |
| `overlay.particles` / `overlay.filmGrain` | Can be filtered out or zeroed when governance is missing. | Decorative layers may be legitimately absent. |
| `hero.contentFrame` | Explicitly transparent and no backdrop filter. | Content frame does not hide root/hero base mismatch. |
| Motion videos | Render with `preload="metadata"`, `data-ready="false"`, and readiness events; opacity is controlled by style variables and CSS transition. | Media load timing can reveal underlying root/hero/base surfaces. |
| Content fade | On route/path changes, opacity is set to 0 for one animation frame unless disabled or PRM. | Can make surface changes more visible during navigation. |

## V1 note

V1 remains a fallback path unless `NEXT_PUBLIC_HERO_ENGINE=v2` is active. Prior repository evidence states V1 root surface is transparent and disables internal overlays, so V1 also depends on surrounding/root surfaces for first paint. This mission did not modify or live-test V1.

## Required future capture fields

For each suspect route, capture:

- `data-hero-engine`, `data-hero-flag-normalized`, and V2 identity key;
- selected hero/variant IDs;
- PRM state;
- presence/count of layers and motion layers;
- computed opacity/background/mix-blend/z-index for every `[data-surface-id]`;
- whether fallback rendered;
- media events and ready states;
- content fade opacity at first frame and after 80ms/1500ms;
- body/main/header/below-hero computed surfaces.
