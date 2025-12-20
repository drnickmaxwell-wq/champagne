# Manifest Discovery Map

## Where page manifests load from
- `packages/champagne-manifests/src/core.ts` imports the unified machine manifest (`data/champagne_machine_manifest_full.json`), nav manifest, brand manifest, styles manifest, Manus import manifest, and section layout defaults on module load.【F:packages/champagne-manifests/src/core.ts†L1-L75】【F:packages/champagne-manifests/src/core.ts†L270-L333】
- `getPageManifestBySlug` walks both `pages` and `treatments` collections from the machine manifest to resolve a slug to a manifest entry.【F:packages/champagne-manifests/src/core.ts†L431-L470】
- `getHeroManifest` derives hero presets from the resolved page manifest (or styles manifest) when explicit hero config exists.【F:packages/champagne-manifests/src/helpers.ts†L156-L214】

## How treatment manifests are resolved
- `collectTreatmentEntries` (via `getTreatmentPages`/`getTreatmentManifest`) normalizes manifests whose `category` is `treatment` and whose path starts with `/treatments/`, preserving slug/path for listing and detail routes.【F:packages/champagne-manifests/src/helpers.ts†L30-L115】
- `getSectionStackForPage` computes section stacks in order: (1) look for a section layout manifest matching the routeId, (2) fall back to page/treatment manifest `sections`, (3) fall back to page-type defaults when present.【F:packages/champagne-manifests/src/core.ts†L333-L520】
- Treatment section layouts are imported and collected into `champagneSectionLayouts`, enabling SMH layouts (e.g., implants variations) to override manifest sections when present.【F:packages/champagne-manifests/src/core.ts†L270-L333】

## How site pages are resolved
- The site catch-all route (`apps/web/app/(site)/[page]/page.tsx`) normalizes the path, calls `getPageManifest`, and rejects treatment paths, ensuring only site/utility/editorial pages use this path.【F:apps/web/app/(site)/[page]/page.tsx†L1-L27】
- `ChampagnePageBuilder` resolves the manifest via `getPageManifestBySlug` and injects hero/CTA/section rendering based on the manifest path, so any page using it is manifest-driven.【F:apps/web/app/(champagne)/_builder/ChampagnePageBuilder.tsx†L14-L78】【F:apps/web/app/(champagne)/_builder/ChampagnePageBuilder.tsx†L96-L180】

## `_imports/**` usage confirmation
- `_imports` holds archived manifest copies; `reports/MANIFESTS_REPORT.json` flags them as `referencedByRuntime: false`, confirming they are reference-only and not loaded by runtime code.【F:reports/MANIFESTS_REPORT.json†L254-L282】
