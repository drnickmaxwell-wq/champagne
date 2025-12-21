import type { CSSProperties } from "react";
import "@champagne/tokens";
import { ChampagneCTAGroup, resolveCTAList } from "@champagne/cta";
import type { ChampagneCTAConfig, ChampagneCTAInput } from "@champagne/cta";
import { BaseChampagneSurface } from "@champagne/hero";
import {
  getCTAIntentConfigForRoute,
  getCTAIntentLabels,
  getRouteIdFromSlug,
  getTreatmentJourneyForRoute,
  type ChampagneCTAIntentConfig,
} from "@champagne/manifests";
import type { SectionRegistryEntry } from "./SectionRegistry";

// Expected manifest shape:
// {
//   id: "composite_closing_cta",
//   type: "treatment_closing_cta",
//   title: string,
//   strapline?: string,
//   ctas?: [{ label: string, href?: string, preset?: string }]
// }

export interface SectionTreatmentClosingCTAProps {
  section?: SectionRegistryEntry;
  ctas?: ChampagneCTAConfig[];
  pageSlug?: string;
}

const wrapperStyle: CSSProperties = {
  display: "grid",
  gap: "0.75rem",
  alignItems: "center",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
};

function mapSectionCTAs(section?: SectionRegistryEntry): ChampagneCTAInput[] {
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

function dedupeCTAs(ctas: ChampagneCTAInput[]): ChampagneCTAConfig[] {
  const seen = new Set<string>();
  const cleaned: ChampagneCTAConfig[] = [];

  ctas.forEach((cta, index) => {
    const normalized = typeof cta === "string" ? { href: cta, label: cta } : cta;
    const href = normalized?.href;
    const label = normalized?.label ?? href;
    if (!href || !label || seen.has(href)) return;
    seen.add(href);
    cleaned.push({
      id: normalized.id ?? `cta-${index + 1}`,
      label,
      href,
      variant:
        normalized.variant === "primary" || normalized.variant === "secondary" || normalized.variant === "ghost"
          ? normalized.variant
          : undefined,
    });
  });

  return cleaned;
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

export function Section_TreatmentClosingCTA({ section, ctas, pageSlug }: SectionTreatmentClosingCTAProps = {}) {
  const title = section?.title ?? "Ready for a seamless smile refresh?";
  const strapline = section?.strapline
    ?? "Book a consultation or preview your smile with AI-guided mock-ups.";
  const fallbackCTAs = getFallbackCTAs(section);
  const mappedSectionCTAs = mapSectionCTAs(section);
  const journeyCTAs = mapJourneyCTAs(pageSlug);
  const routeId = pageSlug ? getRouteIdFromSlug(pageSlug) : undefined;
  const intentSupportCTA = mapIntentSupportCTA(routeId);

  const baseCTAs = (ctas && ctas.length > 0 ? ctas : undefined) ?? (mappedSectionCTAs.length > 0 ? mappedSectionCTAs : []);
  const baseFromJourney = baseCTAs.length === 0 && journeyCTAs.length > 0;
  const primaryCTAs = baseFromJourney ? [journeyCTAs[0]] : baseCTAs;
  const journeySupporting = journeyCTAs.filter((_, index) => !(baseFromJourney && index === 0)).slice(0, 2);
  const intentSupporting = intentSupportCTA ? [intentSupportCTA] : [];

  let combinedCTAs = dedupeCTAs([...primaryCTAs, ...journeySupporting, ...intentSupporting]);

  if (combinedCTAs.length === 0) {
    combinedCTAs = fallbackCTAs;
  } else if (combinedCTAs.length < 2) {
    combinedCTAs = dedupeCTAs([...combinedCTAs, ...fallbackCTAs]);
  }

  const cappedCTAs = combinedCTAs.slice(0, 4);

  const resolvedCTAs = resolveCTAList(cappedCTAs, "primary", {
    component: "Section_TreatmentClosingCTA",
    page: section?.id,
  });

  const renderedCTAs = (resolvedCTAs.length > 0 ? resolvedCTAs : fallbackCTAs).slice(0, 4);

  return (
    <BaseChampagneSurface
      variant="inkGlass"
      style={{
        padding: "clamp(1.35rem, 3vw, 2.5rem)",
        border: "1px solid var(--champagne-keyline-gold, rgba(255, 215, 137, 0.24))",
        background:
          "radial-gradient(circle at 16% 10%, color-mix(in srgb, var(--smh-white, #ffffff) 16%, transparent), transparent 35%), linear-gradient(135deg, color-mix(in srgb, var(--champagne-ink, #0b0f17) 82%, transparent), color-mix(in srgb, var(--bg-ink-soft, #0c0f16) 72%, transparent))",
      }}
    >
      <div style={wrapperStyle}>
        <div style={{ display: "grid", gap: "0.5rem" }}>
          <h3 style={{ fontSize: "clamp(1.25rem, 2.2vw, 1.65rem)", fontWeight: 700, lineHeight: 1.35 }}>{title}</h3>
          <p style={{ margin: 0, color: "var(--text-medium, rgba(235,235,235,0.82))", lineHeight: 1.6 }}>{strapline}</p>
        </div>
        <ChampagneCTAGroup ctas={renderedCTAs} label="Closing CTA" direction="row" defaultVariant="primary" />
      </div>
    </BaseChampagneSurface>
  );
}
