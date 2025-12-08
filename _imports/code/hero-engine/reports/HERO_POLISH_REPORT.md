# Hero Polish Report

## Files Added / Updated
- app/globals/hero-polish.css
- app/treatments/technology/page.tsx
- components/brand/BrandHeroGradient.tsx
- components/brand/ParticlesSoft.tsx
- components/brand/hooks/useParallax.ts

## Token Usage
| Token | Implementation |
| --- | --- |
| `--brand-magenta` | Radial and linear gradients in `.brand-hero-shell::after`, `.brand-hero-layer--base`, `.brand-hero-layer--accent`, and `.brand-hero-layer--highlight` to deepen magenta edges. |
| `--brand-teal` | Base layer radial blend inside `.brand-hero-layer--base` and ambient glow in `.brand-hero-shell::after` for teal depth. |
| `--brand-gold` | Highlight sheen, shimmer sweep, particle fill, and wave overlay mixing via `.brand-hero-layer--highlight`, `.brand-hero-layer--shimmer::before`, and `.brand-hero-particle`. |
| `--surface-0` | Neutral diffusion base in `.brand-hero-shell`, `.brand-hero-layer--base`, and highlight radial wash for balanced luminosity. |

## Motion Safety
- `app/globals/hero-polish.css` disables `gradientDrift`, `goldShimmer`, `particleFloat`, and motion transitions whenever `prefers-reduced-motion: reduce` is active.
- `useParallax` watches the same media query, returning zeroed transforms and tearing down RAF loops when the user requests reduced motion.
- `MotionDiv` short-circuits its entry animation under reduced motion so hero content renders without temporal offsets.

## Screenshot Commands

```bash
python - <<'PY'
from playwright.async_api import async_playwright
import asyncio

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1440, "height": 900})
        await page.goto("http://127.0.0.1:3000/treatments/technology", wait_until="networkidle")
        await page.wait_for_timeout(2000)
        await page.screenshot(path="artifacts/hero-polish-desktop.png", full_page=True)
        await browser.close()

asyncio.run(main())
PY
```

```bash
python - <<'PY'
from playwright.async_api import async_playwright
import asyncio

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 414, "height": 896}, device_scale_factor=3)
        await page.goto("http://127.0.0.1:3000/treatments/technology", wait_until="networkidle")
        await page.wait_for_timeout(2000)
        await page.screenshot(path="artifacts/hero-polish-mobile.png", full_page=True)
        await browser.close()

asyncio.run(main())
PY
```
