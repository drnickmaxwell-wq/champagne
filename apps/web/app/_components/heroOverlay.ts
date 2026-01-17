import { getHeroRuntime } from "@champagne/hero";
import { resolveCTAList } from "@champagne/cta";
import { getCTASlotsForPage, getSectionStackForPage, type ChampagnePageSection } from "@champagne/manifests";

export type HeroOverlaySource = "pageOverride" | "variantDefault" | "siteDefault" | "none";
type HeroRuntime = Awaited<ReturnType<typeof getHeroRuntime>>;
export type HeroOverlayContentConfig = HeroRuntime["content"];
export type HeroOverlayLayoutConfig = HeroRuntime["layout"];
export type HeroOverlayMode = NonNullable<Parameters<typeof getHeroRuntime>[0]>["mode"];

export interface HeroOverlayResolution {
  content: HeroOverlayContentConfig;
  layout: HeroOverlayLayoutConfig;
  source: HeroOverlaySource;
  debug?: {
    pageOverride: Partial<HeroOverlayContentConfig> | null;
    variantDefaults: Partial<HeroOverlayContentConfig> | null;
    siteDefaults: Partial<HeroOverlayContentConfig> | null;
  };
}

const hasContent = (content?: Partial<HeroOverlayContentConfig> | null) => {
  if (!content) return false;
  return Boolean(content.eyebrow || content.headline || content.subheadline || content.cta || content.secondaryCta);
};

const mergeContent = (
  base: Partial<HeroOverlayContentConfig> | undefined,
  variant: Partial<HeroOverlayContentConfig> | undefined,
): HeroOverlayContentConfig => {
  return {
    ...base,
    ...variant,
    cta: variant?.cta ?? base?.cta,
    secondaryCta: variant?.secondaryCta ?? base?.secondaryCta,
  };
};

const normalizeText = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : undefined);

const resolveHeroSectionOverride = (sections: (ChampagnePageSection | string)[] | undefined) => {
  if (!sections) return null;
  const heroSection = sections.find(
    (section) => typeof section !== "string" && section.seoRole === "hero",
  ) as ChampagnePageSection | undefined;

  if (!heroSection || typeof heroSection === "string") return null;

  const eyebrow = normalizeText(heroSection.eyebrow);
  const headline = normalizeText(heroSection.title ?? heroSection.headline ?? heroSection.label);
  const subheadline =
    normalizeText(heroSection.body ?? heroSection.copy ?? heroSection.strapline ?? heroSection.subheadline);

  const resolvedCtas = resolveCTAList(
    (Array.isArray(heroSection.ctas) ? heroSection.ctas : undefined) ?? [],
    "primary",
    { component: "HeroOverlay", page: heroSection.id ?? "unknown" },
  );

  const primaryCta = resolvedCtas[0]
    ? { label: resolvedCtas[0].label, href: resolvedCtas[0].href }
    : undefined;
  const secondaryCta = resolvedCtas[1]
    ? { label: resolvedCtas[1].label, href: resolvedCtas[1].href }
    : undefined;

  return {
    content: {
      eyebrow,
      headline,
      subheadline,
      ...(primaryCta ? { cta: primaryCta } : {}),
      ...(secondaryCta ? { secondaryCta } : {}),
    } satisfies Partial<HeroOverlayContentConfig>,
    hasCtas: resolvedCtas.length > 0,
  };
};

export async function resolveHeroOverlay({
  pathname,
  mode,
  treatmentSlug,
  pageCategory,
}: {
  pathname: string;
  mode?: HeroOverlayMode;
  treatmentSlug?: string;
  pageCategory?: string;
}): Promise<HeroOverlayResolution> {
  const runtime = await getHeroRuntime({
    mode,
    treatmentSlug,
    pageCategory,
    variantId: mode === "home" ? "default" : undefined,
  });

  const sections = getSectionStackForPage(pathname) ?? [];
  const heroSectionOverride = resolveHeroSectionOverride(sections);
  const pageCtas = getCTASlotsForPage(pathname);
  const resolvedHeroCtas = resolveCTAList(pageCtas.heroCTAs, "primary", {
    component: "HeroOverlay",
    page: pathname,
  });
  const pageHeroCta = resolvedHeroCtas[0]
    ? { label: resolvedHeroCtas[0].label, href: resolvedHeroCtas[0].href }
    : undefined;
  const pageSecondaryCta = resolvedHeroCtas[1]
    ? { label: resolvedHeroCtas[1].label, href: resolvedHeroCtas[1].href }
    : undefined;

  const pageOverride: Partial<HeroOverlayContentConfig> = {
    ...((heroSectionOverride?.content ?? {}) satisfies Partial<HeroOverlayContentConfig>),
    ...(pageHeroCta ? { cta: pageHeroCta } : {}),
    ...(pageSecondaryCta ? { secondaryCta: pageSecondaryCta } : {}),
  };

  const siteRuntime = await getHeroRuntime({ mode: "home", pageCategory: "home", variantId: "default" });
  const siteDefaults = siteRuntime.content ?? {};
  const variantDefaults = mergeContent(siteDefaults, runtime.variant?.content);
  const resolvedContent = mergeContent(variantDefaults, pageOverride);

  const source: HeroOverlaySource = hasContent(pageOverride)
    ? "pageOverride"
    : hasContent(runtime.variant?.content)
      ? "variantDefault"
      : hasContent(siteDefaults)
        ? "siteDefault"
        : "none";

  return {
    content: resolvedContent,
    layout: runtime.layout,
    source,
    debug: {
      pageOverride: hasContent(pageOverride) ? pageOverride : null,
      variantDefaults: hasContent(runtime.variant?.content) ? runtime.variant?.content ?? null : null,
      siteDefaults: hasContent(siteDefaults) ? siteDefaults : null,
    },
  };
}
