# SEO State Verification Report

Packet: `PACKET_ZONEA_SEO_STATE_VERIFY_READONLY`  
Mode: Evidence-only, read-only audit (no runtime behavior changes)

## 1) Support-page metadata ownership (explicit vs inherited)

### Finding
All checked support page entrypoints are component-only wrappers and **do not define `export const metadata` or `generateMetadata`**. They therefore inherit root metadata from `apps/web/app/layout.tsx`.

### Evidence (files)
- `apps/web/app/contact/page.tsx` only renders `ChampagnePageBuilder` (no metadata export).【F:apps/web/app/contact/page.tsx†L1-L5】
- `apps/web/app/fees/page.tsx` only renders `ChampagnePageBuilder` (no metadata export).【F:apps/web/app/fees/page.tsx†L1-L5】
- `apps/web/app/team/page.tsx` only renders `ChampagnePageBuilder` (no metadata export).【F:apps/web/app/team/page.tsx†L1-L5】
- `apps/web/app/treatments/page.tsx` only renders `ChampagnePageBuilder` (no metadata export).【F:apps/web/app/treatments/page.tsx†L1-L5】
- `apps/web/app/blog/page.tsx` only renders `ChampagnePageBuilder` (no metadata export).【F:apps/web/app/blog/page.tsx†L1-L5】
- `apps/web/app/patient-portal/page.tsx` defines page behavior and rendering, but no metadata export in-file.【F:apps/web/app/patient-portal/page.tsx†L1-L138】
- `apps/web/app/(site)/[page]/page.tsx` resolves route manifest and renders `ChampagnePageBuilder`, with no metadata export.【F:apps/web/app/(site)/[page]/page.tsx†L1-L28】

### Root metadata source
- Root layout exports global metadata object (`metadataBase`, root `title`, root `description`).【F:apps/web/app/layout.tsx†L12-L18】

### Scope mismatch note
Audit input listed `apps/web/app/smile-gallery/page.tsx`, but current repo path is `apps/web/app/(champagne)/smile-gallery/page.tsx` and likewise has no metadata export (wrapper-only).【F:apps/web/app/(champagne)/smile-gallery/page.tsx†L1-L5】

---

## 2) `/treatments/[slug]` metadata fields and fallback behavior

### Finding
`apps/web/app/treatments/[slug]/page.tsx` defines `generateMetadata` and currently sets:
- `title`
- `description`
- `alternates.canonical`
- `openGraph` (`title`, `description`, `url`)
- `twitter` (`card`, `title`, `description`)

Description fallback order is:
1. `manifest.description`
2. `manifest.intro`
3. literal fallback: `"Explore this treatment option."`

### Evidence
- `generateMetadata` exists in file.【F:apps/web/app/treatments/[slug]/page.tsx†L19-L19】
- Fallback literal declaration and fallback chain (`description ?? intro ?? fallback`).【F:apps/web/app/treatments/[slug]/page.tsx†L26-L31】
- Canonical path assignment and `alternates.canonical`.【F:apps/web/app/treatments/[slug]/page.tsx†L32-L39】
- Open Graph fields (`title`, `description`, `url`).【F:apps/web/app/treatments/[slug]/page.tsx†L40-L44】
- Twitter fields (`card`, `title`, `description`).【F:apps/web/app/treatments/[slug]/page.tsx†L45-L49】

---

## 3) Alias URL behavior: redirect vs silent resolution

### Finding
Alias treatment URLs are **silently resolved**, not redirected.

### Evidence path
1. Alias map exists in manifests helper (`TREATMENT_PATH_ALIASES`).【F:packages/champagne-manifests/src/helpers.ts†L99-L106】
2. `getTreatmentManifest()` maps aliased path to canonical manifest entry when available.【F:packages/champagne-manifests/src/helpers.ts†L174-L184】
3. Route handler resolves manifest from incoming slug and sets `pageSlug = manifest?.path ?? /treatments/${slug}`.【F:apps/web/app/treatments/[slug]/page.tsx†L11-L16】
4. Page render uses `<ChampagnePageBuilder slug={pageSlug} />` (canonical content), but no redirect call is made in route file.【F:apps/web/app/treatments/[slug]/page.tsx†L64-L67】
5. The only navigation helper imported from `next/navigation` in this file is `notFound` (no `redirect` import).【F:apps/web/app/treatments/[slug]/page.tsx†L2-L2】

Net: aliased inbound URLs resolve to canonical manifest-backed content and metadata canonical URL, without server redirect.

---

## 4) JSON-LD emission presence

### Finding
No JSON-LD emission was found in runtime app/source files under inspected web/packages code.

### Evidence
- Search command returned no runtime hits for `application/ld+json`, `jsonld`, `@context`, or `schema.org` usage in app/components rendering code (aside from JSON **schema** files in manifests package).  
  Command used:
  - `rg -n "application/ld\+json|jsonld|JSON-LD|schema.org|ld\+json" apps/web packages`
  - `rg -n "ld\+json|schema\.org|@context|@type|dangerouslySetInnerHTML" apps/web/app packages/champagne-*`
- Matches found were only schema-definition files (`$schema`) under `packages/champagne-manifests/schema/*.json`, i.e., validation schemas, not emitted page JSON-LD.【F:packages/champagne-manifests/schema/journey-engine.schema.json†L2-L2】【F:packages/champagne-manifests/schema/media-deck.schema.json†L2-L2】【F:packages/champagne-manifests/schema/section-manifest.schema.json†L2-L2】

---

## Verification command outcomes

- `pnpm run guard:all` → **FAIL** (patient-portal SSR smoke test timeout/abort inside canon guard).
- `pnpm run build:web` → **PASS**.
- `npm run guard:hero` → **PASS**.
- `npm run guard:canon` → **FAIL** (same patient-portal SSR smoke timeout/abort).
- `npm run verify` → **FAIL** (fails transitively at `guard:all` / canon guard patient-portal SSR smoke).

This report is evidence-only and does not change runtime behavior.
