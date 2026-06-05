# HERO_FLASH_BLOCKER_ANALYSIS

## Purpose

This analysis identifies implemented flash-related blockers in the Hero system using repository evidence only. It does not redesign or patch hero behavior.

## Flash definition for this audit

A flash blocker is any implemented behavior that can make the hero first paint differ from the intended steady-state hero, including static-to-motion transitions, transparent-background exposure, V1/V2 engine mismatch, late route binding, hidden layers, or client-only reveal logic.

## Primary flash findings

### 1. V2 is not guaranteed to run

`HeroMount` selects V2 only when `NEXT_PUBLIC_HERO_ENGINE` normalizes exactly to `v2`. Otherwise, V1 renders. Evidence: `apps/web/app/_components/HeroMount.tsx` lines 17-25 and 99-112.

Impact:

- V2 flash diagnostics are absent unless the env flag is set.
- Any V2-only fix/proof is irrelevant on default V1 runtime.
- Historical report `reports/hero/hero-v2-truth-report.md` observed HOME using `data-hero-engine="v1"`, which matches this switch behavior.

### 2. V2 pathname can default to home

V2 reads the `next-url` header to infer pathname. If unavailable or unparsable, pathname defaults to `/`. Evidence: `apps/web/app/_components/HeroMount.tsx` lines 26-46.

Impact:

- Non-home routes can receive home binding/model during SSR if the header is absent.
- First paint can be home-hero truth before client/route state catches up.
- This directly affects route-bound variant-family rollout.

### 3. Motion layers intentionally start hidden

V1 `resolveMotionStyle()` sets motion opacity to zero first, stores target opacity in `--hero-motion-target-opacity`, and relies on scripts/events/timeouts to reveal. Evidence: `apps/web/app/components/hero/HeroRenderer.tsx` lines 235-269 and 1076-1149.

V2 has analogous client motion event diagnostics and surface-stack mounting in `HeroV2Client.tsx`, and V2 frame diagnostics in `HeroRendererV2.tsx`.

Impact:

- First paint may show non-motion surfaces only.
- If media events are late, reveal happens after a timeout.
- If target opacity is missing due to governance, the layer can remain effectively hidden.

### 4. Hero video is explicitly denied in V1

V1 defines `videoDenylist = ["dental-hero-4k.mp4"]` and excludes that video from active rendering. Evidence: `apps/web/app/components/hero/HeroRenderer.tsx` lines 100-108 and lines 1173-1192.

Impact:

- A manifest video entry using this asset will not create expected V1 video paint.
- Flash analysis must distinguish missing video by design from loading failure.

### 5. Runtime PRM suppresses motion and video

`applyPrm()` removes disabled motion IDs and only allows PRM-safe video. Evidence: `packages/champagne-hero/src/hero-engine/HeroRuntime.ts` lines 225-233.

`mapSurfaceStack()` also marks non-PRM-safe layers suppressed when PRM is active. Evidence: `packages/champagne-hero/src/hero-engine/HeroSurfaceMap.ts` lines 409-459.

Impact:

- Reduced-motion users legitimately see different hero layers.
- Debugging must record PRM state before treating missing motion as a blocker.

### 6. Surface stack token mismatch for gold dust

Manifest `surfaceStack` uses `overlay.goldDustDrift`. Runtime internal `SURFACE_STACK_ORDER` uses `overlay.goldDust`. Motion tokens and motion map include `overlay.goldDustDrift`, so gold dust can render as a motion video layer but not as a matching stack-layer token.

Evidence: `sacred_hero_surfaces.json` surface stack and `packages/champagne-hero/src/hero-engine/HeroSurfaceMap.ts` lines 62-76.

Impact:

- Debug/truth tables can show different surface IDs between manifest stack and runtime stack.
- Surface ordering expectations can be wrong if based only on manifest comments/reports.

### 7. Governance-missing layers are disabled or zeroed

V1 tracks missing opacity/blend/z-index governance and records action `disabled; not rendered`. Motion without opacity or blend is kept at opacity zero. Evidence: `apps/web/app/components/hero/HeroRenderer.tsx` lines 127-150 and 235-267.

Impact:

- A layer with an asset can still not paint.
- Flash can look like missing assets while actually being missing governance.

### 8. Transparent hero root depends on surrounding surfaces

V1 root surface uses `backgroundColor: "transparent"`, `backgroundImage: "none"`, `boxShadow: "none"`, and disables internal overlays. Evidence: `apps/web/app/components/hero/HeroRenderer.tsx` lines 924-943.

Impact:

- Hero first paint is dependent on page/body/main background and below-hero background.
- V2 diagnostics explicitly log background sources, which indicates this is known to be observable.

### 9. Duplicate variant IDs can select different surfaces than expected

Duplicate variant IDs across sacred and standalone family variant manifests can cause the first loaded variant to win. Evidence: `HeroManifestAdapter.ts` load order and `HeroRuntime.pickVariant()` first-match behavior.

Impact:

- A route can be bound to a family variant ID but receive surfaces from the sacred variants file instead of the standalone family file.
- Flash/proof based on the standalone family file can be invalid.

### 10. Reports can be stale

`REPORTS/HERO_ROUTING_CONTRACT_V1.json` currently reports `heroBindingCount: 5`, while a direct manifest query found 101 `heroBinding` objects. The report is stale.

Impact:

- A future agent must regenerate route contracts before making rollout decisions.

## Non-blockers proven by repository evidence

### Static asset availability

Every asset path listed in `HeroAssetRegistry.ts` was checked in both public asset trees. All checked assets exist in:

- `public/assets/champagne/...`
- `apps/web/public/assets/champagne/...`

Therefore, current flash investigation should not start by assuming missing static files.

### Guard script existence

Required root commands exist in `package.json`:

- `guard:hero`
- `guard:canon`
- `verify`

This does not prove they pass until run, but the commands are wired.

## Flash debug protocol

For each suspect route, capture all of the following before patching:

1. `data-hero-engine` on the hero wrapper.
2. `data-hero-flag-normalized`.
3. pathname passed to V2 model builder.
4. route `heroBinding` from manifest.
5. selected runtime variant ID and manifest source.
6. PRM state.
7. surface IDs rendered.
8. motion IDs rendered.
9. inline/computed opacity, blend, and z-index for each layer.
10. body/main/below-hero background colors.
11. media event timeline for motion videos.
12. whether reveal timeout fired.

## Execution-ready capture commands

Use these commands after starting a dev server with V2 enabled:

```bash
NEXT_PUBLIC_HERO_ENGINE=v2 NEXT_PUBLIC_HERO_DEBUG=1 pnpm --filter web dev --hostname 0.0.0.0 --port 3000
```

Then visit representative routes with:

```text
?heroDebug=1&heroTruth=1&bloomDebug=1
```

Minimum route set:

- `/`
- `/about`
- `/blog`
- `/contact`
- `/treatments`
- `/treatments/teeth-whitening`
- `/treatments/implants-single-tooth`
- `/treatments/3d-digital-dentistry`

Success condition for flash proof:

- first capture shows correct engine and variant binding
- steady-state capture shows intended surfaces visible
- no motion layer remains opacity zero unless intentionally disabled by PRM/governance/variant allowlist
- background sources are documented
- no conclusion relies on stale reports
