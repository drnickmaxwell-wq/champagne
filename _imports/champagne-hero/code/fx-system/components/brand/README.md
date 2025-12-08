# BrandHeroGradient — usage

Decorative brand layer (gradient + wave + particles + film grain). Always place as the first child inside a `relative` section wrapper to sit behind content:

```tsx
<section id="hero" className="relative overflow-hidden">
  <BrandHeroGradient intensity="bold" waveOpacity={0.2} goldDensity="med" />
  {/* content */}
</section>
```

Assets are resolved at runtime via asset() and can be served from /public or a CDN using NEXT_PUBLIC_CDN.
Do not hard-code hex colors; rely on tokens in CSS.
