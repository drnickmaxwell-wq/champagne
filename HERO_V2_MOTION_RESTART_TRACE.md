# HERO_V2_MOTION_RESTART_TRACE

Role: `HERO_V2_NAVIGATION_FLASH_FAILURE_RESPONSE_DIRECTOR`  
Evidence date: 2026-06-05

## Motion implementation trace

## 1. CSS animation layer

Hero V2 CSS assigns `animation-name: heroMotionTide`, long animation duration, infinite iteration, and opacity transitions to `.hero-surface--motion` video layers. If the DOM node is recreated, the CSS animation begins again from its initial keyframe.

## 2. Video media layer

`HeroSurfaceStackV2` renders each motion entry as a `<video>` element with:

- `autoPlay`
- `playsInline`
- `loop`
- `muted`
- `preload="metadata"`
- `data-ready="false"`
- `onLoadedData={handleVideoReady}`
- `onCanPlay={handleVideoReady}`
- `style={entry.style}`

The video key is `entry.id`, but if the surface stack remounts, each video element is new and starts at `currentTime=0`.

## 3. Motion reveal script

`HeroV2Frame` injects a script that initializes `.hero-surface--motion` videos. It stores `window.__heroMotionEverRevealed = true` after the first reveal, so later video instances can apply target opacity immediately. This helps avoid opacity blackout after the first reveal but does not preserve video playback time, CSS animation phase, or stack continuity.

## 4. Visual-ready gate

The client fallback `HeroRendererV2` tracks `isHeroVisuallyReady`, resets it to false on `[pathnameKey, renderModel]`, and marks ready after video frame/playback callbacks. The server-built `HeroMount` path does not use this client fallback state directly, but the presence of this logic is important if future fixes target the fallback path.

## 5. Content fade replay

`HeroContentFade` watches `usePathname()`. On every pathname change, unless PRM is active or `NEXT_PUBLIC_HERO_CONTENT_FADE=0`, it sets `isVisible=false`, schedules `isVisible=true` on the next animation frame, and applies an opacity transition of 220ms. This is an intentional route-change reveal gate and can contribute to perceived hero “flash/reset” even if the surface stack were persistent.

## Captured motion restart evidence

| Transition | Layer set | Before `currentTime` | +120ms `currentTime` | +1500ms `currentTime` | Readiness after +120ms |
| --- | --- | --- | --- | --- | --- |
| `/` → `/treatments` | four sacred motion videos | ~0.417–0.423s | `0` | ~1.105–1.106s | `data-ready=false`, `motionReady=null` at +120ms |
| `/treatments` → `/treatments/composite-bonding` | four sacred motion videos | ~2.074–2.117s | `0` | ~1.059–1.060s | already `true/true` due global ever-revealed shortcut |
| `/treatments/composite-bonding` → `/` | four sacred motion videos | ~1.400–1.432s | `0` | ~0.968–0.969s | `data-ready=false`, `motionReady=null` at +120ms |

The same four layer ids were present in each route:

- `sacred.motion.waveCaustics`
- `sacred.motion.glassShimmer`
- `sacred.motion.particleDrift`
- `sacred.motion.goldDust`

## Motion restart conclusion

The remaining flash/reset is consistent with motion media and CSS animation restart. The current global `__heroMotionEverRevealed` shortcut can restore opacity, but it cannot keep motion phase continuous after new video elements are created.

Therefore, a bounded fix that only removes a transparent base cannot solve the reported reset. The next mission should either make the motion stack truly persistent across route transitions or intentionally suppress/reduce motion initial replay after the first mount.
