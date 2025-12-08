# Champagne Asset Audit

**Repo:** please-work
**When:** 2025-10-25T15:38:38.313Z

## Required files

| File | Exists | Size |
|---|:--:|:---:|
| public/waves/smh-wave-mask.svg | ✅ | 0.5 KB |
| public/textures/film-grain-mobile.webp | ✅ | 506.4 KB |
| public/textures/film-grain-desktop.webp | ✅ | 790.9 KB |
| public/particles/particles-gold.webp | ❌ | — |
| public/particles/particles-teal.webp | ❌ | — |
| public/particles/particles-magenta.webp | ❌ | — |
| styles/tokens/smh-champagne-tokens.css | ✅ | 4.3 KB |
| styles/brand/brand-gradient.css | ✅ | 2.0 KB |
| components/brand/BrandHeroGradient.tsx | ✅ | 2.1 KB |

## Token pack

Path: `styles/tokens/smh-champagne-tokens.css` — ✅ found

| Variable | Present |
|---|:--:|
| --brand-magenta | ❌ |
| --brand-teal | ❌ |
| --brand-gold | ❌ |
| --surface-0 | ❌ |
| --radius | ❌ |
| --shadow-soft | ❌ |

## Wiring sightings (imports/references)

- `app/layout.tsx:5` → …"./globals.css"; import "@/styles/brand/brand-gradient.css"; import PerformanceOptimizedLayout from '@/components/layout…
- `components/brand/BrandHeroGradient.tsx:1` → …// components/brand/BrandHeroGradient.tsx "use client"; import React from "react"; import { asset } …
- `components/brand/BrandHeroGradient.tsx:18` → … "wave-top" | "wave-bottom"; };  /**  * BrandHeroGradient renders the Champagne gradient + wave + particles + film grain…
- `components/brand/BrandHeroGradient.tsx:22` → …ia asset().  */ export default function BrandHeroGradient({   intensity = "standard",   waveOpacity = 0.18,   goldDensit…
- `components/brand/BrandHeroGradient.tsx:36` → …/>        {/* Wave mask (provide /public/waves/smh-wave-mask.svg in repo or via CDN) */}       <div         className="b…
- `components/brand/BrandHeroGradient.tsx:41` → …         backgroundImage: `url(${asset("/waves/smh-wave-mask.svg")})`,         }}       />        {/* Tri-palette partic…
- `components/brand/BrandHeroGradient.tsx:63` → …set(             url(${asset("/textures/film-grain-desktop.webp")}) 1x           )`,         }}       />     </div>   );…
- `components/brand/BrandHeroGradient.tsx:51` → …e: `             url(${asset("/textures/particles-gold.webp")}),             url(${asset("/textures/particles-teal.webp"…
- `components/brand/BrandHeroGradient.tsx:52` → …)}),             url(${asset("/textures/particles-teal.webp")}),             url(${asset("/textures/particles-magenta.we…
- `components/brand/BrandHeroGradient.tsx:53` → …)}),             url(${asset("/textures/particles-magenta.webp")})           `,         }}       />        {/* Film grai…

## Key pages present

- `app/page.tsx`

## Next steps
- If any files are ❌ missing, add them to the paths above.
- If variables are ❌ missing, extend the token file rather than hard-coding colors.
- Ensure at least one page imports `styles/brand/brand-gradient.css` and uses `<BrandHeroGradient>`.

## Tokens Completed ✅

- Added placeholder Champagne token pack values for magenta, teal, gold, and supporting surfaces while awaiting final art direction.
- Introduced particles feature flag wiring and inline SVG particle placeholders so BrandHeroGradient stays stable without shipping binary textures.
