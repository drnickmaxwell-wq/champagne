# BOUNDED_NAVIGATION_FLASH_FIX_OPTIONS

Role: `HERO_V2_NAVIGATION_FLASH_FAILURE_RESPONSE_DIRECTOR`  
Evidence date: 2026-06-05

## Option A — Make Hero V2 persistent across route transitions if architecture allows

### Strategy

Move or restructure the Hero V2 surface/motion stack so it is not recreated during public route navigation. Keep page-specific content/model changes separate from the persistent motion/base stack.

### Potential benefits

- Best match for the user-visible symptom: motion layers would not restart because video DOM nodes and CSS animation phase would survive route changes.
- Reduces need for repeated media readiness/reveal gates.
- Aligns with the concept of a sacred hero that appears globally.

### Risks

- Requires high confidence in Next App Router layout lifecycle and current `headers()` usage.
- May conflict with route-specific hero model/variant identity if those are meant to change per route later.
- Could require splitting stable visual stack from route-dependent content; that is more architectural than a one-line fix.

### Evidence needed before implementation

- Vercel Preview proof that stack id changes on navigation.
- Confirmation whether full document reloads are occurring. If navigation is full document reload, React persistence alone cannot solve the reset; link/navigation behavior must be addressed first.

### Safety rating

**Potentially high impact, medium safety.** Best if architecture permits a stable client island under root layout and navigation is same-document.

## Option B — Prevent motion initial replay after first hero mount

### Strategy

Track a first-hero-mount/session flag and render subsequent route navigations with motion videos already at target opacity and with minimized initial reveal behavior. This can reduce perceived flash even if media elements remount.

### Potential benefits

- Smaller than a persistence refactor.
- Builds on the existing `window.__heroMotionEverRevealed` concept.
- Can avoid opacity/readiness flashes on remount.

### Limits

- Does not preserve video `currentTime` or CSS animation phase.
- User may still perceive a motion reset if the video content begins from frame zero.
- If navigation is a full document reload, window memory is lost and this option will not survive.

### Safety rating

**Medium impact, medium-high safety** for same-document remounts; **low impact** for hard reloads.

## Option C — Stabilize route-level hero model/key identity

### Strategy

Ensure the global sacred hero uses a stable identity/key/model across routes, or explicitly separate stable sacred visual model from route page metadata.

### Potential benefits

- Avoids unnecessary stack replacement caused by changing identity props or model object churn.
- Useful if evidence shows React is remounting because route-specific props/key identity change.

### Limits

- No explicit route key was found on the V2 frame/stack path.
- Captured evidence points to parent/document replacement, not only child key churn.
- Route-specific variants are explicitly out of scope for this mission.

### Safety rating

**Medium safety, uncertain impact** until React key/parent replacement is proven in Vercel.

## Option D — Add transition-aware reduced remount/reveal gating

### Strategy

Detect route transitions and avoid hiding/revealing the hero/content/motion stack during navigation after first load. This could include making `HeroContentFade` first-load-only or disabling it for the sacred global hero.

### Potential benefits

- Directly addresses a known remaining replay gate: `HeroContentFade` sets opacity to 0 on every pathname change.
- Smaller than making the entire stack persistent.
- Can be flag-gated or bounded to Hero V2.

### Limits

- Does not preserve video currentTime if the stack is remounted.
- May solve content flash but not motion reset.

### Safety rating

**High safety for content fade only**, **medium impact**. Good first bounded implementation if Vercel evidence shows same-document route changes with content opacity flash but persistent stack.

## Option E — Rollback previous fix if irrelevant or harmful

### Strategy

Revert the root/base local `--hero-gradient` first-paint stabilization.

### Benefits

- Removes an irrelevant change if it is proven to cause a new visual regression.

### Risks

- The previous direct-load proof showed root/body ink exposure through transparent hero surfaces. Rolling back may reintroduce or worsen direct-load first-frame flash.
- Current evidence does not show the previous fix is harmful; it shows it is insufficient for navigation reset.

### Safety rating

**Not recommended on current evidence.** Keep as a contingency only if visual proof shows the local gradient base is materially wrong or causing the Vercel flash.

## Comparative recommendation

| Option | Current recommendation | Why |
| --- | --- | --- |
| A | Investigate first, likely best long-term if same-document navigation can be guaranteed. | It solves true motion continuity. |
| B | Consider as bounded mitigation. | It reduces reveal replay but not media phase reset. |
| C | Hold unless key/model churn is proven. | No explicit route key found. |
| D | Strong small-fix candidate for content flash. | Known route-change fade replay exists. |
| E | Do not do now. | Previous fix likely still helps direct-load first paint. |

## Bounded implementation prompt only if evidence supports it

Use this prompt only after Vercel Preview confirms same-document navigation and either stack persistence or remount behavior:

> ROLE: HERO_V2_NAVIGATION_FLASH_BOUNDED_FIX_IMPLEMENTER  
> Scope: Fix only the confirmed Hero V2 navigation flash/reset cause. Do not redesign hero, do not change brand colours, do not implement Persian Midnight, typography, variants, or global theming. Preserve sacred engine/manifests.  
> Evidence gate: Use Vercel/local production debug evidence to choose exactly one of: persistent stack island, first-mount-only content fade, or motion reveal replay suppression.  
> Allowed files: only the minimal Hero V2 client/renderer files required by the chosen option; no layout/global/header/footer/token edits unless separately authorized.  
> Requirements: preserve token-only styling, preserve existing layer ids and PRM behavior, add or use debug logs proving stack id and video currentTime before/after navigation, run guards and production capture.  
> Stop if navigation is a full document reload; in that case produce a navigation behavior report instead of patching hero visuals.
