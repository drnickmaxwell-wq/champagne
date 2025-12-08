# Implementing the Hero & Parallax Performance Improvements

This guide walks through applying the performance, accessibility, and stability tweaks that were prototyped for the cinematic hero and micro-interaction utilities. Follow these steps if you're merging the prior proof-of-concept into a fresh checkout or want to understand the moving pieces before adapting them.

## 1. Update the cinematic hero particle system

1. Open `components/hero/cinematic-hero-video.tsx`.
2. Replace the existing `FloatingParticle` implementation so that it:
   - Accepts deterministic `startX`, `startY`, `driftX`, and `driftY` props instead of calling `Math.random()` inside the component.
   - Uses a reduced-motion guard to render static dots when the visitor prefers less animation.
3. Memoize the particle positions in the hero component with `useMemo`, using seeded math (e.g., `Math.sin(seed)`) so each render receives the same layout without recalculating random values.
4. Derive the `particleCount` from both the motion preference and the viewport width. The reference implementation keeps 20 particles on desktop, 12 on mobile, and disables them entirely if reduced motion is requested.
5. Pass the memoized particle collection into the component tree instead of instantiating particles inline in JSX.

> **Tip:** If you're adapting the seeds, keep them deterministic—changing seed math will shift particle layout but still avoid layout thrash.

## 2. Respect reduced-motion and mobile contexts

1. Import `useReducedMotion` from `framer-motion` and call it inside the hero component.
2. Use a `useEffect` hook to keep an `isMobile` boolean in sync with the current window width. Guard the resize handler cleanup.
3. Combine `isMobile` and `prefersReducedMotion` when computing `particleCount` so that devices and users who need quieter visuals automatically receive them.

## 3. Smooth out the reusable parallax helper

1. Open `components/effects/micro-interactions.tsx`.
2. In the `ParallaxElement`, replace the previous `useState`-driven scroll handler with `requestAnimationFrame` batching:
   - Track the most recent `scrollY` with a ref.
   - Schedule the DOM write (`element.style.transform = …`) inside a `requestAnimationFrame` callback.
   - Cancel the animation frame on unmount.
3. Keep the API the same (`speed`, `direction`, etc.) so existing call sites continue to work, but enjoy smoother motion without React re-renders on every scroll tick.

## 4. Re-test locally

Run your usual verification commands after porting the changes:

```bash
pnpm install
pnpm lint
pnpm test
pnpm dev
```

> The reference branch still reports legacy lint violations from untouched files. If you see the same, either filter lint to the touched folders or fix the outstanding rules before merging.

## 5. Ship with confidence

Once the hero and parallax tweaks are in place:

- Confirm the hero renders identical on every reload (no jumping particles).
- Toggle the reduced-motion preference in your OS/browser to ensure the hero downgrades to static dots.
- Scroll through sections that use `ParallaxElement` and note the smoother, less janky movement.

With the above steps complete, the repository will match the optimized experience.
