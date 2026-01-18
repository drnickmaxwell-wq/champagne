# Hero Copy Restore Proof

## Root cause
Hero copy existed in the DOM, but the copy layer shared the same stacking context and clipping as the surface stack. The hero container had overflow clipping applied at the root, allowing motion layers to overlap/obscure the copy layer and causing click targets to be masked. The per-layer motion readiness script also introduced layout thrash on load, contributing to perceived jumpiness.

## Files changed
- apps/web/app/components/hero/HeroRenderer.tsx
- apps/web/app/components/hero/v2/HeroRendererV2.tsx
- apps/web/app/champagne/hero-debug/HeroDebugClientPanel.tsx

## Proof (computed styles, rects, stacking)
Captured via runtime evaluation on `/` and `/treatments/implants`:

```
{'url': '/', 'heroContent': {'exists': True, 'rect': {'width': 960, 'height': 342.8500061035156}, 'opacity': '1', 'zIndex': '10'}, 'heroCopyLayer': {'exists': True, 'rect': {'width': 1232, 'height': 342.8500061035156}, 'opacity': '1', 'zIndex': '20'}, 'surfaceStack': {'exists': True, 'rect': {'width': 1232, 'height': 518.4000244140625}, 'overflow': 'hidden', 'zIndex': 'auto'}}
{'url': '/treatments/implants', 'heroContent': {'exists': True, 'rect': {'width': 960, 'height': 342.8500061035156}, 'opacity': '1', 'zIndex': '10'}, 'heroCopyLayer': {'exists': True, 'rect': {'width': 1232, 'height': 342.8500061035156}, 'opacity': '1', 'zIndex': '20'}, 'surfaceStack': {'exists': True, 'rect': {'width': 1232, 'height': 518.4000244140625}, 'overflow': 'hidden', 'zIndex': 'auto'}}
```

Notes:
- `hero-copy-layer` is z-index 20 above surface stack layers.
- `hero-content` rects are non-zero with opacity `1`.
- `hero-surface-stack` handles overflow clipping while the copy layer is outside its clipping context.

## Screenshot list (artifact paths)
- browser:/tmp/codex_browser_invocations/19053ce8bcc9232d/artifacts/artifacts/home-1440x900.png
- browser:/tmp/codex_browser_invocations/54afb137264d8f3e/artifacts/artifacts/home-390x844.png
- browser:/tmp/codex_browser_invocations/6e9d73a8803e674e/artifacts/artifacts/treatments-implants-1440x900.png
- browser:/tmp/codex_browser_invocations/13973c3be8b4c459/artifacts/artifacts/treatments-implants-390x844.png
