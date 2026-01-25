# HERO ROUTING CONTRACT V1

## How derived

### layout.tsx category logic
```ts
  if (pathname.startsWith("/treatments/")) {
    mode = "treatment";
    treatmentSlug = pathname.split("/")[2] || undefined;
    pageCategory = "treatment";
  } else if (pathname.startsWith("/team/")) {
    pageCategory = "profile";
  } else if (pathname === "/team") {
    pageCategory = "utility";
  } else if (pathname === "/about") {
    pageCategory = "utility";
  } else if (pathname === "/contact") {
    pageCategory = "utility";
  } else if (pathname === "/blog") {
    pageCategory = "editorial";
  } else if (pathname === "/treatments") {
    pageCategory = "utility";
  } else if (pathname === "/fees") {
    pageCategory = "utility";
  } else if (pathname === "/smile-gallery") {
    pageCategory = "utility";
  } else if (pathname === "/") {
    pageCategory = "home";
  } else {
    pageCategory = (manifest as { category?: string })?.category;
  }

  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <div className="flex min-h-screen flex-col">
```

### buildHeroV2Model binding override
```ts
  const heroBinding = getHeroBindingForPathnameKey(pathnameKey);
  const boundHeroId = heroBinding?.heroId;
  const boundVariantId = heroBinding?.variantId;
  const runtimeVariantOverride = boundVariantId ?? boundHeroId;
  const resolvedTreatmentSlug = runtimeVariantOverride ? undefined : runtimeTreatmentSlug;
  const bindingMatched = Boolean(runtimeVariantOverride);

  try {
    runtime = await getHeroRuntime({
      mode: runtimeMode,
      treatmentSlug: resolvedTreatmentSlug,
      prm,
      timeOfDay,
      particles,
      filmGrain,
      pageCategory: resolvedPageCategory,
      variantId: runtimeVariantOverride ?? (runtimeMode === "home" ? "default" : undefined),
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Hero runtime failed", error);
    }
  }

  if (!runtime) {
    try {
      runtime = await getHeroRuntime({
        mode: "home",
        treatmentSlug: undefined,
        prm,
```

### HeroRuntime resolveVariantIdForCategory
```ts
function resolveVariantIdForCategory(category?: string): string | undefined {
  if (!category) return undefined;
  switch (category) {
    case "home":
      return "default";
    case "treatment":
      return "hero.variant.treatment_v1";
    case "editorial":
      return "hero.variant.editorial_v1";
    case "utility":
      return "hero.variant.utility_v1";
    case "marketing":
      return "hero.variant.marketing_v1";
    default:
      return "hero.variant.marketing_v1";
  }
}

function filterSurfacesByAllowlist(
  surfaces: ResolvedHeroSurfaceConfig,
  allowed?: string[],
): ResolvedHeroSurfaceConfig {
  if (!allowed || allowed.length === 0) return surfaces;
  const allowedSet = new Set(allowed);
  const isAllowed = (id?: string | null) => (id ? allowedSet.has(id) : false);

  const grainAllowed = allowedSet.has("overlay.filmGrain");

  return {
    waveMask: isAllowed("mask.waveHeader")
```

## Treatment Groups
| id | label | hub |
| --- | --- | --- |
| general | General Dentistry | /treatments/preventative-and-general-dentistry |
| restorative | Restorative Dentistry | /treatments/dental-crowns |
| implants | Dental Implants | /treatments/implants |
| ortho_retainers | Orthodontics & Retainers | /treatments/orthodontics |
| aesthetic | Aesthetic Dentistry | /treatments/teeth-whitening |
| night_guards | Night Guards & Occlusal Therapy | /treatments/night-guards-occlusal-splints |
| digital_3d | 3D & Digital Dentistry | /treatments/3d-digital-dentistry |
| emergency | Emergency Dentistry | /treatments/emergency-dentistry |
| facial_rejuv | Facial Rejuvenation | /treatments/facial-therapeutics |

## Routes with heroBinding
| path | heroId | variantId |
| --- | --- | --- |
| / | sacred-home-hero | default |
| /team | sacred-home-hero | default |
| /treatments | sacred-home-hero | default |
| /treatments/emergency-dentistry | treatment.emergency | treatment.emergency |
| /treatments/implants | treatment.implants | treatment.implants |
| /treatments/implants | treatment.implants | treatment.implants |

## Routes with non-standard layoutDerived.pageCategory
| path | layoutDerived.pageCategory | manifestCategory |
| --- | --- | --- |
| /dental-checkups-oral-cancer-screening | site | site |
| /legal/accessibility | legal | legal |
| /legal/complaints | legal | legal |
| /legal/cookies | legal | legal |
| /legal/privacy | legal | legal |
| /legal/terms | legal | legal |
| /team/nick-maxwell | profile | profile |
| /team/sara-burden | profile | profile |
| /team/sylvia-krafft | profile | profile |
