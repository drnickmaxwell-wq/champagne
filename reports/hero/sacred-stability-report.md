# Sacred Hero V2 Stability Report

## Scope
**Allowed files:**
- `apps/web/app/components/hero/v2/HeroRendererV2.tsx`
- `apps/web/app/components/hero/v2/HeroV2Client.tsx`
- `apps/web/app/_components/HeroMount.tsx` (logging only; unchanged)
- `reports/hero/sacred-stability-report.md`

**Goal:** Eliminate visual flashing/banding and prevent below-page background flashing during navigation by removing timeout-based reveal and preventing repeated opacity resets in V2 only.

---

## Phase 1 — Observed Behavior (Before Patch)
**Playwright nav loop:**
- **Command used:** `node - <<'NODE' ...` (Playwright Chromium) navigating `/` → `/contact` → `/` with `waitForTimeout(5000)`.
- **Note:** No repo-provided nav loop command was found in the working tree. **UNKNOWN — EVIDENCE NOT PRESENT.**

**Key console evidence (from `/tmp/hero_v2_logs.txt`):**
- **Hero V2 mounts** occur on navigation:
  - `HERO_V2_MOUNT_DATA {id: v2-stack-845lqoee, pathname: /}`
  - `HERO_V2_MOUNT_DATA {id: v2-stack-dow64qdk, pathname: /contact}`
- **Motion layers start at opacity 0**:
  - `HERO_V2_MOTION_INIT_DATA {id: sacred.motion.waveCaustics, opacity: 0, ... opacityIsZero: true}`
  - (Similar for glassShimmer, particleDrift, goldDust)
- **Timeout-based forced reveal exists**:
  - `[hero] Motion layer still hidden after 1400ms, forcing target opacity.`
- **Motion events fire** (loadeddata/canplay/playing/waiting/stalled/error coverage confirmed):
  - Example: `HERO_V2_MOTION_EVENT_DATA {id: sacred.motion.glassShimmer, event: canplay, ...}`
- **Content container visibility is stable** (no evidence of opacity 0 at the content container):
  - `HERO_V2_CONTENT_FADE_STATE_DATA {pathname: /, isVisible: false, prefersReducedMotion: false, opacity: 1, fadeOpacity: 1}`
  - `HERO_V2_CONTENT_VISIBILITY_DATA {found: true, opacity: 1, visibility: visible, zIndex: 10, ...}`
- **Background sources** captured:
  - `HERO_V2_BACKGROUND_SOURCES_DATA {documentElement: oklab(...), body: oklab(...), main: rgba(0, 0, 0, 0), belowHero: oklab(...)}`

**Conclusion:**
- Timeout-based reveal path is active and can force motion opacity.
- Motion layers are initially opacity 0 and then revealed.
- Content opacity is not observed as 0 (no change required for content fade).

---

## Phase 2 — Patch Applied (V2 Only)
### Changes
1) **Removed timeout-based forced reveal** in the V2 motion script. Motion opacity now changes only after readiness events (`loadeddata`, `canplay`, `playing`).
2) **Prevented repeated opacity resets** by adding a module-level `motionEverRevealed` flag and skipping initial opacity gating after first successful reveal.
3) **Maintained content fade** because Phase 1 logs showed no opacity 0 on the content container.
4) **Added logging** for mount/unmount, motion init, motion events, content visibility, background sources, and content fade state to satisfy diagnostics.

### File diff snippets
**HeroRendererV2 (motion gating + reveal logic):**
```ts
let motionEverRevealed = false;

const allowMotionGate = !motionEverRevealed;
// ...
style.opacity = allowMotionGate ? 0 : resolvedOpacity;
```
```js
const getEverRevealed = () => window.__heroMotionEverRevealed === true;
const setEverRevealed = () => { window.__heroMotionEverRevealed = true; };
// ...
if (getEverRevealed()) {
  applyTargetOpacity(video);
  video.dataset.motionReady = 'true';
  return;
}
// reveal only on loadeddata/canplay/playing
```

**HeroV2Client (diagnostic logging):**
```ts
console.groupCollapsed("HERO_V2_MOUNT");
console.log("HERO_V2_MOUNT_DATA", { id: stackId, pathname: window.location.pathname });
console.groupEnd();
```

---

## Phase 3 — Evidence After Patch
**Playwright nav loop:**
- **Command used:** `node - <<'NODE' ...` (Playwright Chromium) navigating `/` → `/contact` → `/` with `waitForTimeout(5000)`.

**Key console evidence (from `/tmp/hero_v2_after_logs.txt`):**
- **No timeout warnings** (no `[hero] Motion layer still hidden after 1400ms...` entries).
- **Motion reveal happens on readiness events only** (reveal logs still present, without timeout warnings).
- **Repeated opacity resets prevented** in the same session:
  - Later mounts show **motion init opacity at target** values:
    - `HERO_V2_MOTION_INIT_DATA {id: sacred.motion.waveCaustics, opacity: 0.14, ... opacityIsZero: false}`
    - `HERO_V2_MOTION_INIT_DATA {id: sacred.motion.glassShimmer, opacity: 0.13, ... opacityIsZero: false}`
- **Content container remains visible** (no evidence of opacity 0):
  - `HERO_V2_CONTENT_FADE_STATE_DATA {pathname: /, isVisible: false, prefersReducedMotion: false, opacity: 1, fadeOpacity: 1}`

---

## Rollback Instructions
To revert all behavior changes:
```bash
git checkout -- apps/web/app/components/hero/v2/HeroRendererV2.tsx \
  apps/web/app/components/hero/v2/HeroV2Client.tsx
rm -f reports/hero/sacred-stability-report.md
```
