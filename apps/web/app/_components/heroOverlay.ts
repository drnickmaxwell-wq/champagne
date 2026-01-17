import { getHeroRuntime } from "@champagne/hero";
import { resolveCTAList } from "@champagne/cta";
import {
  getCTASlotsForPage,
  getPageManifest,
  getSectionStackForPage,
  type ChampagnePageSection,
} from "@champagne/manifests";

export type HeroOverlaySource = "pageOverride" | "section" | "variantDefault" | "siteDefault" | "none";
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
const normalizeCta = (value: unknown) => {
  if (!value || typeof value !== "object") return undefined;
  const label = normalizeText((value as { label?: unknown }).label);
  const href = normalizeText((value as { href?: unknown }).href);
  if (!label || !href) return undefined;
  return { label, href };
};

const normalizeContent = (content?: Partial<HeroOverlayContentConfig> | null) => {
  if (!content) return undefined;
  const normalized: Partial<HeroOverlayContentConfig> = {};
  const eyebrow = normalizeText(content.eyebrow);
  const headline = normalizeText(content.headline);
  const subheadline = normalizeText(content.subheadline);
  const cta = normalizeCta(content.cta);
  const secondaryCta = normalizeCta(content.secondaryCta);

  if (eyebrow) normalized.eyebrow = eyebrow;
  if (headline) normalized.headline = headline;
  if (subheadline) normalized.subheadline = subheadline;
  if (cta) normalized.cta = cta;
  if (secondaryCta) normalized.secondaryCta = secondaryCta;

  return normalized;
};

const resolvePageHeroOverride = (hero?: string | Record<string, unknown>) => {
  if (!hero || typeof hero === "string") return null;
  const heroContent = (hero as { content?: Record<string, unknown> }).content ?? hero;
  const eyebrow = normalizeText(heroContent.eyebrow);
  const headline = normalizeText(heroContent.headline ?? heroContent.title);
  const subheadline = normalizeText(heroContent.subheadline ?? heroContent.subhead ?? heroContent.strapline);
  const explicitCta = normalizeCta(heroContent.cta ?? heroContent.primaryCta ?? heroContent.ctaPrimary);
  const explicitSecondary = normalizeCta(
    heroContent.secondaryCta ?? heroContent.ctaSecondary ?? heroContent.secondaryCTA,
  );
  const resolvedCtas = resolveCTAList(Array.isArray(heroContent.ctas) ? heroContent.ctas : [], "primary", {
    component: "HeroOverlay",
    page: (hero as { id?: string }).id ?? "page-hero",
  });
  const fallbackPrimary = resolvedCtas[0]
    ? { label: resolvedCtas[0].label, href: resolvedCtas[0].href }
    : undefined;
  const fallbackSecondary = resolvedCtas[1]
    ? { label: resolvedCtas[1].label, href: resolvedCtas[1].href }
    : undefined;

  return {
    content: normalizeContent({
      eyebrow,
      headline,
      subheadline,
      cta: explicitCta ?? fallbackPrimary,
      secondaryCta: explicitSecondary ?? fallbackSecondary,
    }),
  };
};

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

  const pageManifest = getPageManifest(pathname);
  const sections = getSectionStackForPage(pathname) ?? [];
  const pageHeroOverride = resolvePageHeroOverride((pageManifest as { hero?: string | Record<string, unknown> })?.hero);
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

  const sectionContent = normalizeContent(heroSectionOverride?.content ?? null);
  const pageContent = normalizeContent(pageHeroOverride?.content ?? null);
  const pageOverride: Partial<HeroOverlayContentConfig> = {
    ...(pageContent ?? {}),
    cta: pageContent?.cta ?? pageHeroCta,
    secondaryCta: pageContent?.secondaryCta ?? pageSecondaryCta,
  };

  const siteRuntime = await getHeroRuntime({ mode: "home", pageCategory: "home", variantId: "default" });
  const siteDefaults = normalizeContent(siteRuntime.content) ?? {};
  const variantDefaults = normalizeContent(runtime.variant?.content ?? null) ?? {};
  const resolvedContent = mergeContent(
    mergeContent(mergeContent(siteDefaults, variantDefaults), sectionContent),
    pageOverride,
  );

  const source: HeroOverlaySource = hasContent(pageOverride)
    ? "pageOverride"
    : hasContent(sectionContent)
      ? "section"
      : hasContent(variantDefaults)
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
      variantDefaults: hasContent(variantDefaults) ? variantDefaults : null,
      siteDefaults: hasContent(siteDefaults) ? siteDefaults : null,
    },
  };
}
