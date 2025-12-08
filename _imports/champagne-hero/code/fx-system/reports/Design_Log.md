# Design Log

## Preview Treatments Champagne Polish

- **/preview/treatments/veneers** — Wrapped in `ChampagneSectionShell`, layered gradient + grain + wave/gold/glass FX, added parallax hero/CTA, goldGlow CTAs, ThreeDViewerSlot placeholder, wave divider, and tokenised typography with PRM-safe fallbacks.
- **/preview/treatments/dental-implants** — Mirrored Champagne shell layering with parallax, inserted Spark-ready ThreeDViewerSlot, refreshed typography, goldGlow CTAs, and FX wave divider while respecting prefers-reduced-motion (gradient + grain only).
- **/preview/treatments/orthodontics/spark-aligners** — New preview shell featuring gradient stack, aligner journey sections, wave divider, parallax CTA, goldGlow CTAs, and documented `<model-viewer>` slot for future 3D mount with PRM compliance.

All preview pages verified to keep motion layers disabled when `prefers-reduced-motion: reduce` is active, leaving only gradient and grain visible.
