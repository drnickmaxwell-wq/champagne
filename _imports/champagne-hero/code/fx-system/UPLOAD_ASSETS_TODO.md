# Upload Required Binaries (Manus Lux Canon)

Upload these files to the repo **exactly** at the paths below:

- `public/assets/champagne/film-grain-desktop.webp`   (~791 KB)
- `public/assets/champagne/film-grain-mobile.webp`    (~506 KB)
- `public/assets/champagne/home-hero-particles.webp`  (~325–335 KB)
- `public/assets/champagne/wave-mask-desktop.webp`    (match Manus mask)
- `public/assets/champagne/wave-mask-mobile.webp`     (match Manus mask)

**Notes**
- Filenames and locations must match — `styles/champagne/surface.css` references these paths.
- Do **not** commit legacy fallbacks at `/brand/textures/*.png` or `/brand/particles/*.webm`. The new canon uses WEBP textures.
- After uploading, run locally:


pnpm i
pnpm brand:guard
pnpm verify:hue
pnpm test:brand
pnpm build

- In CI, ensure Brand Guard + Verify Hue + Brand Tests pass before merging.
