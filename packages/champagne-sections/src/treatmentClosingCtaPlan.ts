import { resolveCTAList, type ChampagneCTAConfig } from "@champagne/cta";
import {
  getCTAIntentConfigForRoute,
  getCTAIntentLabels,
  getTreatmentJourneyForRoute,
  resolveTreatmentPathAlias,
  type ChampagneCTAIntentConfig,
} from "@champagne/manifests/src/helpers";
import { getRouteIdFromSlug } from "@champagne/manifests/src/core";
import type { SectionRegistryEntry } from "./SectionRegistry";
import { dedupeButtons, dedupeSupportingLines } from "./ctaDedupe";

type CTAPlanEntry = Partial<ChampagneCTAConfig> & { preset?: string };

function mapSectionCTAs(section?: SectionRegistryEntry): CTAPlanEntry[] {
  const asVariant = (value?: string) => {
    if (value === "primary" || value === "secondary" || value === "ghost") return value;
    return undefined;
  };

  return (
    section?.ctas?.map((cta, index) => ({
      id: cta.id ?? (section?.id ? `${section.id}-cta-${index + 1}` : `cta-${index + 1}`),
      label: cta.label,
      href: cta.href,
      variant: asVariant(cta.variant ?? (cta as { preset?: string }).preset),
    })) ?? []
  );
}

function intentToCTAConfig(
  intent: string,
  intentConfig?: Record<string, ChampagneCTAIntentConfig>,
  intentLabels?: Record<string, string>,
  variant: ChampagneCTAConfig["variant"] = "primary",
): ChampagneCTAConfig | undefined {
  const mapped = intentConfig?.[intent]
    ?? intentConfig?.primary_intent
    ?? intentConfig?.secondary_intent
    ?? intentConfig?.reassurance_intent;

  const label = mapped?.label ?? intentLabels?.[intent] ?? intent.replace(/[_-]/g, " ");
  const href = mapped?.href ?? "/contact";
  const normalizedVariant =
    mapped?.variant === "primary" || mapped?.variant === "secondary" || mapped?.variant === "ghost"
      ? mapped.variant
      : variant;

  if (!label || !href) return undefined;

  return {
    id: intent,
    label,
    href,
    variant: normalizedVariant,
  } satisfies ChampagneCTAConfig;
}

function mapIntentSupportCTA(routeId?: string): ChampagneCTAConfig | undefined {
  if (!routeId) return undefined;
  const intentConfig = getCTAIntentConfigForRoute(routeId);
  const intentLabels = getCTAIntentLabels();
  const journey = getTreatmentJourneyForRoute(routeId);
  const primaryIntentKey = (journey as { journey?: { primary_intent?: string } } | undefined)?.journey?.primary_intent;

  const mappedConfig =
    (primaryIntentKey ? intentConfig?.[primaryIntentKey] : undefined)
    ?? intentConfig?.primary_intent
    ?? intentConfig?.secondary_intent
    ?? intentConfig?.reassurance_intent;

  const label = mappedConfig?.label ?? (primaryIntentKey ? intentLabels[primaryIntentKey] : undefined);
  const href = mappedConfig?.href;
  const variant =
    mappedConfig?.variant === "primary" || mappedConfig?.variant === "ghost" ? mappedConfig.variant : "secondary";

  if (!label || !href) return undefined;

  return {
    id: primaryIntentKey ?? mappedConfig.label ?? href,
    label,
    href,
    variant,
  } satisfies ChampagneCTAConfig;
}

function mapJourneyCTAs(pageSlug?: string): ChampagneCTAConfig[] {
  if (!pageSlug) return [];
  const routeId = getRouteIdFromSlug(pageSlug);
  const journey = getTreatmentJourneyForRoute(routeId);
  const intentConfig = getCTAIntentConfigForRoute(routeId);
  const intentLabels = getCTAIntentLabels();

  const journeyTargets = (journey as { cta_targets?: Record<string, { label?: string; href?: string }> } | undefined)
    ?.cta_targets;
  const journeyId = (journey as { journey?: { id?: string; page_role?: string } } | undefined)?.journey?.id;
  const journeyRole = (journey as { journey?: { page_role?: string } } | undefined)?.journey?.page_role;

  const journeyCtas: ChampagneCTAConfig[] = [];
  if (journeyTargets) {
    (["primary", "secondary", "tertiary"] as const).forEach((slot, index) => {
      const target = journeyTargets[slot];
      if (!target?.label || !target?.href) return;
      journeyCtas.push({
        id: [journeyId ?? routeId, journeyRole ?? "page", slot].filter(Boolean).join("-"),
        label: target.label,
        href: target.href,
        variant: index === 0 ? "primary" : "secondary",
      });
    });
  }

  if (journeyCtas.length > 0) return journeyCtas;

  const latePageIntents = journey?.cta_plan?.late_page?.filter((entry: { target?: string }) => entry.target === "cta") ?? [];

  return latePageIntents
    .map((entry: { intent?: string }, index: number) =>
      entry.intent ? intentToCTAConfig(entry.intent, intentConfig, intentLabels, index === 0 ? "primary" : "secondary") : undefined,
    )
    .filter((cta): cta is ChampagneCTAConfig => Boolean(cta?.label && cta?.href));
}

function getFallbackCTAs(section?: SectionRegistryEntry): ChampagneCTAConfig[] {
  const preventativeCheckupIds = new Set([
    "preventative-general-checkups-card",
    "preventative-general-cta",
  ]);

  if (section?.id && preventativeCheckupIds.has(section.id)) {
    return [
      {
        id: "dental-checkups-primary",
        label: "Dental check-ups & oral cancer screening",
        href: "/dental-checkups-oral-cancer-screening",
        variant: "primary",
      },
      { id: "book-consultation", label: "Book a consultation", href: "/contact", variant: "secondary" },
    ];
  }

  return [
    { id: "book-consultation", label: "Book a consultation", href: "/contact", variant: "primary" },
    {
      id: "ai-smile-preview",
      label: "Preview your smile with AI",
      href: "/treatments/digital-smile-design",
      variant: "secondary",
    },
  ];
}

function normalizeHrefForDedupe(href?: string) {
  if (!href || typeof href !== "string") return href;
  if (!href.startsWith("/treatments/")) return href;
  const { resolvedPath } = resolveTreatmentPathAlias(href);
  return resolvedPath ?? href;
}

export interface TreatmentClosingCTAPlan {
  buttons: ChampagneCTAConfig[];
  supportingLines: string[];
  audit: {
    beforeButtons: CTAPlanEntry[];
    afterButtons: ChampagneCTAConfig[];
    duplicatesRemoved: { buttons: number; supportingLines: number };
  };
}

export function resolveTreatmentClosingCTAPlan({
  section,
  ctas,
  pageSlug,
}: { section?: SectionRegistryEntry; ctas?: ChampagneCTAConfig[]; pageSlug?: string } = {}): TreatmentClosingCTAPlan {
  const fallbackCTAs = getFallbackCTAs(section);
  const mappedSectionCTAs = mapSectionCTAs(section);
  const journeyCTAs = mapJourneyCTAs(pageSlug);
  const routeId = pageSlug ? getRouteIdFromSlug(pageSlug) : undefined;
  const intentSupportCTA = mapIntentSupportCTA(routeId);

  const baseCTAs: CTAPlanEntry[] = (ctas && ctas.length > 0 ? ctas : undefined)
    ?? (mappedSectionCTAs.length > 0 ? mappedSectionCTAs : []);
  const baseFromJourney = baseCTAs.length === 0 && journeyCTAs.length > 0;
  const primaryCTAs: CTAPlanEntry[] = baseFromJourney ? [journeyCTAs[0]] : baseCTAs;
  const journeySupporting: CTAPlanEntry[] = journeyCTAs.filter((_, index) => !(baseFromJourney && index === 0)).slice(0, 2);
  const intentSupporting: CTAPlanEntry[] = intentSupportCTA ? [intentSupportCTA] : [];
  const supportingCandidates: CTAPlanEntry[] = [...journeySupporting, ...intentSupporting];

  const beforeButtons: CTAPlanEntry[] =
    primaryCTAs.length > 0 || supportingCandidates.length > 0
      ? [...primaryCTAs, ...supportingCandidates]
      : [...fallbackCTAs];

  const primaryDedupe = dedupeButtons(beforeButtons, { normalizeHref: normalizeHrefForDedupe });
  let buttons = primaryDedupe.buttons;
  let duplicateButtonsRemoved = primaryDedupe.dropped.length;

  if (buttons.length === 0) {
    buttons = fallbackCTAs;
  } else if (buttons.length < 2) {
    const fallbackResult = dedupeButtons([...buttons, ...fallbackCTAs], { normalizeHref: normalizeHrefForDedupe });
    duplicateButtonsRemoved += fallbackResult.dropped.length;
    buttons = fallbackResult.buttons;
  }

  const cappedButtons = buttons.slice(0, 4);

  const resolvedButtons = resolveCTAList(cappedButtons, "primary", {
    component: "Section_TreatmentClosingCTA",
    page: section?.id,
  });

  const supportingLineCandidates = supportingCandidates
    .map((entry) => (typeof entry === "string" ? entry : entry.label ?? ""))
    .filter(Boolean) as string[];
  const supportingLinesResult = dedupeSupportingLines(supportingLineCandidates, resolvedButtons.map((cta) => cta.label));

  const renderedButtons = (resolvedButtons.length > 0 ? resolvedButtons : fallbackCTAs).slice(0, 4);

  return {
    buttons: renderedButtons,
    supportingLines: supportingLinesResult.lines,
    audit: {
      beforeButtons,
      afterButtons: renderedButtons,
      duplicatesRemoved: {
        buttons: duplicateButtonsRemoved,
        supportingLines: supportingLinesResult.dropped.length,
      },
    },
  };
}
