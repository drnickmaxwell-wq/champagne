# Route Framework Report

## Marketing Routes (public, non-PHI)
- `/` — `app/page.tsx` (marketing; wired homepage hero + journey stack)
- `/treatments` — `app/treatments/page.tsx` (marketing hub; wired; shared `app/treatments/layout.tsx`)
  - `/treatments/general` — `app/treatments/general/page.tsx` (marketing; wired)
  - `/treatments/cosmetic` — `app/treatments/cosmetic/page.tsx` (marketing; wired)
  - `/treatments/3d-dentistry` — `app/treatments/3d-dentistry/page.tsx` (marketing; wired)
  - `/treatments/orthodontics` — `app/treatments/orthodontics/page.tsx` (marketing; wired)
  - `/treatments/implants` — `app/treatments/implants/page.tsx` (marketing; wired)
  - `/treatments/whitening` — `app/treatments/whitening/page.tsx` (marketing; wired)
  - `/treatments/veneers` — `app/treatments/veneers/page.tsx` (marketing; wired)
  - `/treatments/dental-implants` — `app/treatments/dental-implants/page.tsx` (marketing; wired)
  - `/treatments/3d-dentistry/page-content` — `app/treatments/3d-dentistry/page-content.tsx` (marketing; wired section file)
  - `/treatments/whitening/page-content` — `app/treatments/whitening/page-content.tsx` (marketing; wired section file)
  - `/treatments/implants/page-content` — `app/treatments/implants/page-content.tsx` (marketing; wired section file)
  - `/treatments/cosmetic` — `app/treatments/cosmetic/page.tsx` (marketing; wired)
  - `/treatments/technology` — `app/treatments/technology/page.tsx` (marketing; wired)
- `/team` — `app/team/page.tsx` (marketing; wired)
  - `/team/dr-sarah-mitchell` — `app/team/dr-sarah-mitchell/page.tsx` (marketing; wired profile)
- `/anxiety-dentistry` — `app/anxiety-dentistry/page.tsx` (marketing; wired)
- `/ai-smile-quiz` — `app/ai-smile-quiz/page.tsx` (marketing; wired)
- `/video-consultation` — `app/video-consultation/page.tsx` (marketing; wired)
- `/emergency-dentist` — `app/emergency-dentist/page.tsx` (marketing; wired)
- `/blog` — `app/blog/page.tsx` (marketing; wired)
- `/stories` — `app/stories/page.tsx` (marketing; wired)
- `/patient-stories` — `app/patient-stories/page.tsx` (marketing; wired via `stories` export)
- `/patient-education` — `app/patient-education/page.tsx` (marketing; wired interactive education hub)
- `/champagne/hero` — `app/champagne/hero/page.tsx` (marketing; frozen hero reference)

## Preview / Lab Routes
- `/champagne-preview` — `app/champagne-preview/page.tsx` (preview; wired hero render)
- `/preview` — `app/preview/layout.tsx` (preview shell)
  - `/preview/home` — `app/preview/home/page.tsx` (preview; wired)
  - `/preview/footer-luxe` — `app/preview/footer-luxe/page.tsx` (preview; wired)
  - `/preview/ai24-home` — `app/preview/ai24-home/page.tsx` (preview; wired)
  - `/preview/skeleton` — `app/preview/skeleton/page.tsx` (preview; wired)
  - `/preview/treatments` — `app/preview/treatments/page.tsx` (preview; wired; dynamic content support)
    - `/preview/treatments/[slug]` — `app/preview/treatments/[slug]/page.tsx` (preview; wired dynamic detail)
    - `/preview/treatments/composite-bonding` — `app/preview/treatments/composite-bonding/page.tsx` (preview; wired)
      - Section files under `_sections` directory (preview; wired to page)
    - `/preview/treatments/implants` — `app/preview/treatments/implants/page.tsx` (preview; wired)
    - `/preview/treatments/whitening` — `app/preview/treatments/whitening/page.tsx` (preview; wired)
    - `/preview/treatments/3d-dentistry` — `app/preview/treatments/3d-dentistry/page.tsx` (preview; wired)
    - `/preview/treatments/veneers` — `app/preview/treatments/veneers/page.tsx` (preview; wired)
    - `/preview/treatments/cosmetic` — `app/preview/treatments/cosmetic/page.tsx` (preview; wired)
    - `/preview/treatments/general` — `app/preview/treatments/general/page.tsx` (preview; wired)
    - `/preview/treatments/dental-implants` — `app/preview/treatments/dental-implants/page.tsx` (preview; wired)
    - `/preview/treatments/technology` — `app/preview/treatments/technology/page.tsx` (preview; wired)
    - `/preview/treatments/orthodontics` — `app/preview/treatments/orthodontics/page.tsx` (preview; wired)
      - `/preview/treatments/orthodontics/spark-aligners` — `app/preview/treatments/orthodontics/spark-aligners/page.tsx` (preview; wired)
  - `/preview/hero-gilded` — `app/preview/hero-gilded/page.tsx` with `layout.tsx` (preview; wired)
  - `/preview/why-hero-grey` — `app/preview/why-hero-grey/page.tsx` (preview; wired)
  - `/preview/treatments-light` — `app/preview/treatments-light/page.tsx` (preview; wired)
  - `/preview/manus-audit` — `app/preview/manus-audit/page.tsx` (preview; wired)
  - `/preview/technology` — `app/preview/technology/page.tsx` (preview; wired)
  - `/preview/lux` — `app/preview/lux/page.tsx` (preview; wired)
    - `/preview/lux/team` — `app/preview/lux/team/page.tsx` (preview; wired)
      - `/preview/lux/team/[slug]` — `app/preview/lux/team/[slug]/page.tsx` (preview; wired dynamic profiles)
    - `/preview/lux/technology` — `app/preview/lux/technology/page.tsx` (preview; wired)
    - `/preview/lux/gallery` — `app/preview/lux/gallery/page.tsx` (preview; wired)
    - `/preview/lux/legal` — `app/preview/lux/legal/page.tsx` (preview; wired)
      - `/preview/lux/legal/privacy` — `app/preview/lux/legal/privacy/page.tsx` (preview; wired)
      - `/preview/lux/legal/cookies` — `app/preview/lux/legal/cookies/page.tsx` (preview; wired)
      - `/preview/lux/legal/terms` — `app/preview/lux/legal/terms/page.tsx` (preview; wired)
    - `/preview/lux/smile-ai` — `app/preview/lux/smile-ai/page.tsx` (preview; wired)
    - `/preview/lux/referrals` — `app/preview/lux/referrals/page.tsx` (preview; wired)
    - `/preview/lux/locations/{location}` — `app/preview/lux/locations/*/page.tsx` (preview; wired for Brighton, Hove, Lancing, Shoreham-by-Sea, Steyning, Worthing)
    - `/preview/lux/patient-stories` — `app/preview/lux/patient-stories/page.tsx` (preview; wired)
  - `/preview/champagne-phase2` — `app/preview/champagne-phase2/page.tsx` (preview; wired)
  - `/preview/brand-lock` — `app/preview/brand-lock/page.tsx` (preview; wired)
  - `/preview/treatments-stubs` — `app/preview/treatments-stubs/page.tsx` (preview; placeholder stubs)
  - `/preview/champagne-skin` — `app/preview/champagne-skin/page.tsx` (preview; wired)
  - `/preview/manus` — `app/preview/manus/README.md` (preview; documentation reference)
  - `/preview/chat` — `app/preview/chat/page.tsx` (preview; wired chat sandbox)
  - `/preview/manus-manifest` — `app/preview/manus-manifest/page.tsx` (preview; wired)
  - `/preview/champagne` — `app/preview/champagne/page.tsx` with `head.tsx` (preview; wired)
  - `/preview/brand-live` — `app/preview/brand-live/page.tsx` (preview; wired)

## Utility / API Routes
- `/api/appointments` — `app/api/appointments/route.ts` (utility API; wired handler)
- `/api/chat` — `app/api/chat/route.ts` (utility API; wired handler)
- `/sitemap.xml` — `app/sitemap.ts` (utility; sitemap generator)

## Future Portal/PHI Routes
- None present; no `/portal`, `/account`, or similar PHI-bearing routes exist yet.

## Launch Route Candidates
- **Likely v1 marketing launch**: `/`, `/treatments` (and major child routes including general, cosmetic, orthodontics, implants, 3d-dentistry, technology, whitening, veneers), `/team`, `/anxiety-dentistry`, `/ai-smile-quiz`, `/video-consultation`, `/emergency-dentist`, `/blog`, `/stories`/`/patient-stories`, `/patient-education`, and the frozen `/champagne/hero` reference.
- **Preview-only**: `/champagne-preview`, all `/preview/*` routes (hero experiments, treatments sandboxes, LUX microsite, schema/manus audits, brand lock, chat sandbox, brand live, etc.).
- **Future portal placeholders**: none currently present.

## For Director AI
- V1-ready surfaces sit in the marketing set (homepage, treatments hub + details, team, patient storytelling, and key conversion CTAs like video consultation and AI smile quiz), plus the locked `/champagne/hero` reference for canonical QA.
- Experimental workstreams are isolated in `/preview/*` and `/champagne-preview`, covering hero iterations, schema-driven treatment previews, LUX legal/patient flows, and brand/manus manifest audits.
- No portal or PHI-bearing routes are live; future portal scaffolding will need fresh routes and guard alignment before activation.
