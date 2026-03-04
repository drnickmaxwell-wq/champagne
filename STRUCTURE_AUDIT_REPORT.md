# STRUCTURE AUDIT REPORT

## Scope
Read-only structural audit of treatment architecture for:
- Dental Implants hub expectation
- Implant leaf coverage including `surgically-guided-implants`
- Aligner service positioning (generic vs brand-specific)
- Veneers presence as cosmetic leaf
- Cosmetic dentistry hub presence

## Safe verification checks
- `pnpm install` ✅ pass
- `pnpm run guard:all` ✅ pass
- `pnpm run build:web` ✅ pass

## Findings by target

### 1) Manifest file
File checked: `packages/champagne-manifests/data/champagne_machine_manifest_full.json`

- `/treatments/implants` → **FOUND** (`pages.implants`)
  - Includes routing cluster section (`implants_full_inventory`) with 12 implant-related routes.
  - This is strong evidence implants is modeled as a hub-style page.
- `/treatments/surgically-guided-implants` → **MISSING**
- `/treatments/veneers` → **FOUND** (`pages.veneers`)
- `/treatments/aligners` → **MISSING**
- `/treatments/clear-aligners` → **FOUND** (`pages.clear_aligners`)
  - Generic service page exists.
  - Brand-specific leaf (`/treatments/clear-aligners-spark`) also exists as related/child page.

### 2) Layout registry
File checked: `packages/champagne-manifests/src/core.ts`

`champagneSectionLayouts` includes registration for:
- implants
- veneers
- aligners
- clear-aligners
- cosmetic-dentistry

Result: implants layout registration exists as expected.

### 3) Layout JSON presence
Folder checked: `packages/champagne-manifests/data/sections/smh/`

Confirmed present:
- `treatments.implants.json`
- `treatments.veneers.json`
- `treatments.aligners.json`
- `treatments.clear-aligners.json`
- `treatments.cosmetic-dentistry.json`

Not found:
- `treatments.surgically-guided-implants.json`

Hub determination:
- `treatments.implants.json` includes hub-like composition and inventory-style routing behavior (via treatment cluster pattern and matching manifest routing cards), indicating implants functions as a hub.

### 4) Route structure
Path checked: `apps/web/app/treatments/`

Observed filesystem routes:
- `apps/web/app/treatments/page.tsx`
- `apps/web/app/treatments/[slug]/page.tsx`

This app uses dynamic treatment routing; route existence is manifest-driven rather than folder-per-treatment.

Manifest-backed route resolution status:
- implants ✅
- surgically-guided-implants ❌
- veneers ✅
- aligners ❌ (generic equivalent is clear-aligners)
- clear-aligners ✅

### 5) Hub verification summary
- **Implants is acting as a hub**: confirmed by inventory/routing cluster references listing many implant leaf pages.

## Required stop-condition flags
- Implants not hub: **NO FLAG** (it is a hub)
- Aligners page brand-specific: **NO FLAG** (generic clear-aligners exists; Spark is a separate brand leaf)
- Missing treatment routes: **FLAGGED**
  - `/treatments/surgically-guided-implants` missing
  - `/treatments/aligners` missing (service represented as `/treatments/clear-aligners`)

## Deliverables
- `STRUCTURE_AUDIT_REPORT.md`
- `STRUCTURE_AUDIT_EVIDENCE.json`
- `HUB_CLUSTER_MAP.json`
