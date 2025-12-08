# Technology Import Audit

## Asset Presence

| Asset | Status |
| --- | --- |
| /public/brand-polish/wave-light-overlay.webp | ✅ |
| /public/brand-polish/glass-reflect.svg | ✅ |
| /public/brand-polish/gradient-palette.json | ✅ |
| /public/icons/implant.svg | ✅ |
| /public/icons/scan.svg | ✅ |
| /public/icons/smile-curve.svg | ✅ |
| /public/icons/sparkle.svg | ✅ |
| /public/waves/smh-wave-mask.svg | ✅ |
| /public/textures/film-grain-desktop.webp | ✅ |
| /public/textures/film-grain-mobile.webp | ✅ |
| /public/particles/particles-gold.webp | ✅ |
| /public/particles/particles-teal.webp | ✅ |
| /public/particles/particles-magenta.webp | ✅ |
| /styles/tokens/smh-champagne-tokens.css | ✅ |
| /components/brand/BrandHeroGradient.tsx | ✅ |
| /styles/brand/brand-gradient.css | ✅ |

## Import Rewrites

No Manus relative asset imports remained under `app/treatments/technology/components`, so no rewrites were required.

## Hero Overlay

`app/treatments/technology/components/technology-hero.css` now includes the Champagne hero overlay pseudo-element targeting `.tech-hero`.

## Brand Wrapper & JSON-LD

`app/treatments/technology/page.tsx` continues to wrap the hero section in `<BrandHeroGradient …>` and render `<TechnologySchema />` at the top of the page.

## Typecheck Summary

```
> smh-web-bot@0.1.0 typecheck /workspace/please-work
> tsc --noEmit

components/layout/footer.tsx:211:29 - error TS2339: Property 'name' does not exist on type '{ label: string; path: string; }'.

211                   key={link.name}
                                ~~~~

components/layout/footer.tsx:212:30 - error TS2339: Property 'href' does not exist on type '{ label: string; path: string; }'.

212                   href={link.href}
                                 ~~~~

components/layout/footer.tsx:217:25 - error TS2339: Property 'name' does not exist on type '{ label: string; path: string; }'.

217                   {link.name}
                            ~~~~

components/layout/footer.tsx:235:32 - error TS2339: Property 'name' does not exist on type '{ label: string; path: string; }'.

235                 key={treatment.name}
                                   ~~~~

components/layout/footer.tsx:236:33 - error TS2339: Property 'href' does not exist on type '{ label: string; path: string; }'.

236                 href={treatment.href}
                                    ~~~~

components/layout/footer.tsx:245:30 - error TS2339: Property 'name' does not exist on type '{ label: string; path: string; }'.

245                   {treatment.name}
                                 ~~~~

Found 6 errors in the same file, starting at: components/layout/footer.tsx:211
```

## Build Summary

```
CI=1 pnpm run build || true
> smh-web-bot@0.1.0 build /workspace/please-work
> next build --turbopack
   ▲ Next.js 15.5.2 (Turbopack)
   Creating an optimized production build ...
 ✓ Finished writing to disk in 201ms
 ✓ Compiled successfully in 48s
   Skipping validation of types
   Skipping linting
 ✓ Collecting page data
 ✓ Generating static pages (70/70)
 ✓ Collecting build traces
 ✓ Finalizing page optimization

Route (app)                                                Size  First Load JS
┌ ○ /                                                    133 kB         298 kB
├ ○ /_not-found                                             0 B         165 kB
├ ○ /ai-smile-quiz                                      10.7 kB         176 kB
├ ○ /anxiety-dentistry                                  1.19 kB         166 kB
├ ƒ /api/appointments                                       0 B            0 B
├ ƒ /api/chat                                               0 B            0 B
├ ƒ /api/integrations/email                                 0 B            0 B
├ ƒ /api/integrations/stripe                                0 B            0 B
├ ƒ /api/integrations/stripe/webhook                        0 B            0 B
├ ○ /blog                                               4.04 kB         169 kB
├ ○ /emergency-dentist                                   2.8 kB         168 kB
├ ○ /patient-education                                   4.8 kB         170 kB
├ ○ /patient-stories                                     4.6 kB         170 kB
├ ○ /preview/ai24-home                                  2.93 kB         168 kB
├ ○ /preview/lux                                        2.22 kB         167 kB
├ ○ /preview/lux/gallery                                2.83 kB         168 kB
├ ○ /preview/lux/legal                                  2.86 kB         168 kB
├ ○ /preview/lux/legal/cookies                          2.79 kB         168 kB
├ ○ /preview/lux/legal/privacy                          2.81 kB         168 kB
├ ○ /preview/lux/legal/terms                            2.79 kB         168 kB
├ ○ /preview/lux/locations/brighton                         0 B         165 kB
├ ○ /preview/lux/locations/hove                             0 B         165 kB
├ ○ /preview/lux/locations/lancing                          0 B         165 kB
├ ○ /preview/lux/locations/shoreham-by-sea                  0 B         165 kB
├ ○ /preview/lux/locations/steyning                         0 B         165 kB
├ ○ /preview/lux/locations/worthing                         0 B         165 kB
├ ○ /preview/lux/patient-stories                        3.03 kB         168 kB
├ ○ /preview/lux/referrals                              3.02 kB         168 kB
├ ○ /preview/lux/smile-ai                                   0 B         165 kB
├ ○ /preview/lux/team                                   2.94 kB         168 kB
├ ƒ /preview/lux/team/[slug]                            2.91 kB         168 kB
├ ○ /preview/lux/technology                             2.88 kB         168 kB
├ ○ /team                                               4.11 kB         169 kB
├ ○ /team/dr-sarah-mitchell                             6.97 kB         172 kB
├ ○ /treatments                                         3.48 kB         168 kB
├ ○ /treatments/3d-dentistry                            3.35 kB         168 kB
├ ○ /treatments/3d-dentistry/3d-implants-overview           0 B         165 kB
├ ○ /treatments/3d-dentistry/3d-printed-veneers             0 B         165 kB
├ ○ /treatments/3d-dentistry/3d-restorative-dentistry       0 B         165 kB
├ ○ /treatments/3d-dentistry/3d-same-day-dentures           0 B         165 kB
├ ○ /treatments/cosmetic                                    0 B         165 kB
├ ○ /treatments/cosmetic/composite-bonding                  0 B         165 kB
├ ○ /treatments/cosmetic/teeth-whitening                    0 B         165 kB
├ ○ /treatments/cosmetic/veneers                            0 B         165 kB
├ ○ /treatments/general                                     0 B         165 kB
├ ○ /treatments/general/check-ups                           0 B         165 kB
├ ○ /treatments/general/childrens-dentistry                 0 B         165 kB
├ ○ /treatments/general/crowns-and-bridges                  0 B         165 kB
├ ○ /treatments/general/emergency-dentistry                 0 B         165 kB
├ ○ /treatments/general/extractions                         0 B         165 kB
├ ○ /treatments/general/root-canal-treatment                0 B         165 kB
├ ○ /treatments/general/sedation                            0 B         165 kB
├ ○ /treatments/general/tooth-coloured-fillings             0 B         165 kB
├ ○ /treatments/implants                                5.18 kB         426 kB
├ ○ /treatments/implants/3d-printed-restorations            0 B         165 kB
├ ○ /treatments/implants/3d-surgically-guided-implants      0 B         165 kB
├ ○ /treatments/implants/all-on-4-6-same-day                0 B         165 kB
├ ○ /treatments/implants/same-day-implants                  0 B         165 kB
├ ○ /treatments/orthodontics                                0 B         165 kB
├ ○ /treatments/orthodontics/fixed-braces                   0 B         165 kB
├ ○ /treatments/orthodontics/spark-aligners                 0 B         165 kB
├ ○ /treatments/technology                              6.12 kB         171 kB
├ ○ /treatments/technology/3d-scanning-and-printing         0 B         165 kB
├ ○ /treatments/technology/soft-tissue-laser                0 B         165 kB
├ ○ /treatments/technology/the-wand-painless-numbing        0 B         165 kB
├ ○ /treatments/veneers                                 4.69 kB         425 kB
├ ○ /treatments/whitening                               3.94 kB         169 kB
└ ○ /video-consultation                                 4.23 kB         169 kB
+ First Load JS shared by all                            185 kB
  ├ chunks/0621e5500d4d2f8c.js                          20.4 kB
  ├ chunks/07d22f7c1e0f959e.js                          38.5 kB
  ├ chunks/59f0f3ac323133be.js                          58.9 kB
  ├ chunks/85fc10702667037b.js                          10.6 kB
  ├ chunks/ebed64714d994079.js                          17.2 kB
  ├ chunks/1d8baf01245ccb77.css                         18.4 kB
  └ other shared chunks (total)                         20.6 kB

> smh-web-bot@0.1.0 postbuild /workspace/please-work
> next-sitemap

✨ [next-sitemap] Loading next-sitemap config: file:///workspace/please-work/next-sitemap.config.js
✅ [next-sitemap] Generation completed
```
