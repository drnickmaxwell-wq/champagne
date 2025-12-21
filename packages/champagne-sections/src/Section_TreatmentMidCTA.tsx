import type { CSSProperties } from "react";
import "@champagne/tokens";
import { ChampagneCTAGroup, resolveCTAList } from "@champagne/cta";
import type { ChampagneCTAConfig, ChampagneCTAInput } from "@champagne/cta";
import { BaseChampagneSurface } from "@champagne/hero";
import {
  getRouteIdFromSlug,
  getCTAIntentConfigForRoute,
  getCTAIntentLabels,
  getTreatmentJourneyForRoute,
  getTreatmentPages,
  type ChampagneTreatmentPage,
} from "@champagne/manifests";
import type { SectionRegistryEntry } from "./SectionRegistry";

type CTAPlanEntry = Partial<Pick<ChampagneCTAConfig, "id" | "label" | "href" | "variant">> & { preset?: string };

const treatmentPages = getTreatmentPages();
const treatmentPathLookup = new Map<string, ChampagneTreatmentPage>();
for (const page of treatmentPages) {
  treatmentPathLookup.set(page.path, page);
}
const treatmentPaths = new Set(treatmentPathLookup.keys());

function toTitleCase(text?: string) {
  if (!text) return "";
  return text
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function pathFromRouteId(routeId?: string) {
  if (!routeId) return undefined;
  return `/${routeId.replace(/\./g, "/")}`;
}

function mapSectionCTAs(section?: SectionRegistryEntry): CTAPlanEntry[] {
  const asVariant = (value?: string) => {
    if (value === "primary" || value === "secondary" || value === "ghost") return value;
    return undefined;
  };

  return (section?.ctas ?? []).map((cta, index) => ({
    id: cta.id ?? (section?.id ? `${section.id}-cta-${index + 1}` : `cta-${index + 1}`),
    label: cta.label ?? cta.href ?? `CTA ${index + 1}`,
    href: cta.href,
    variant: asVariant(cta.variant ?? (cta as { preset?: string }).preset) ?? "secondary",
    preset: (cta as { preset?: string }).preset,
  }));
}

function buildIntentCTA(routeId: string): CTAPlanEntry[] {
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

  if (!href || !label) return [];

  return [
    {
      id: primaryIntentKey ?? mappedConfig.label ?? href,
      label,
      href,
      variant,
    },
  ];
}

function buildFallbackLinks(slug: string) {
  const lower = slug.toLowerCase();
  const basePaths = [
    "/treatments/preventative-and-general-dentistry",
    "/dental-checkups-oral-cancer-screening",
    "/treatments/nervous-patients",
  ];

  const keywordMap: { keywords: string[]; paths: string[] }[] = [
    {
      keywords: ["aligner", "orthodontic", "brace"],
      paths: [
        "/treatments/clear-aligners-spark",
        "/treatments/teeth-whitening",
        "/treatments/digital-smile-design",
      ],
    },
    {
      keywords: ["whitening"],
      paths: [
        "/treatments/home-teeth-whitening",
        "/treatments/whitening-top-ups",
        "/treatments/digital-smile-design",
      ],
    },
    {
      keywords: ["implant"],
      paths: [
        "/treatments/implant-consultation",
        "/treatments/implants-single-tooth",
        "/treatments/implants-aftercare",
      ],
    },
    {
      keywords: ["veneer", "bond"],
      paths: [
        "/treatments/3d-printed-veneers",
        "/treatments/digital-smile-design",
        "/treatments/teeth-whitening",
      ],
    },
    {
      keywords: ["denture"],
      paths: [
        "/treatments/chrome-dentures",
        "/treatments/peek-partial-dentures",
        "/treatments/implants-retained-dentures",
      ],
    },
    {
      keywords: ["emergency", "urgent"],
      paths: [
        "/treatments/endodontics-root-canal",
        "/treatments/extractions-and-oral-surgery",
        "/treatments/sedation-dentistry",
      ],
    },
    {
      keywords: ["endo", "root-canal"],
      paths: [
        "/treatments/endodontics-root-canal",
        "/treatments/dental-crowns",
        "/treatments/sedation-dentistry",
      ],
    },
    {
      keywords: ["periodontal", "gum"],
      paths: [
        "/treatments/periodontal-gum-care",
        "/treatments/preventative-and-general-dentistry",
        "/treatments/night-guards-occlusal-splints",
      ],
    },
    {
      keywords: ["night-guard", "occlusal", "tmj"],
      paths: [
        "/treatments/night-guards-occlusal-splints",
        "/treatments/tmj-disorder-treatment",
        "/treatments/bruxism-and-jaw-clenching",
      ],
    },
    {
      keywords: ["3d", "digital"],
      paths: [
        "/treatments/3d-digital-dentistry",
        "/treatments/3d-printing-lab",
        "/treatments/digital-smile-design",
      ],
    },
    {
      keywords: ["nervous", "sedation"],
      paths: [
        "/treatments/nervous-patients",
        "/treatments/sedation-dentistry",
        "/treatments/painless-numbing-the-wand",
      ],
    },
  ];

  const matching = keywordMap.find((entry) => entry.keywords.some((keyword) => lower.includes(keyword)));
  const fallbacks = matching ? matching.paths : basePaths;

  return fallbacks.filter((path) => treatmentPaths.has(path)).map((href) => ({ href }));
}

function buildJourneyCTAs(routeId: string) {
  const journey = getTreatmentJourneyForRoute(routeId);
  const ctas: ChampagneCTAInput[] = [];

  const journeyMidCTA = (journey as { journey?: { mid_page_cta?: { label?: string; href?: string } } } | undefined)?.journey
    ?.mid_page_cta;
  if (journeyMidCTA?.href && journeyMidCTA.label) {
    ctas.push({ href: journeyMidCTA.href, label: journeyMidCTA.label, variant: "secondary" });
  }

  const relatedTreatments = (journey as { related_treatments?: string[] } | undefined)?.related_treatments ?? [];
  relatedTreatments.forEach((route) => {
    const path = pathFromRouteId(route);
    if (!path || !treatmentPaths.has(path)) return;
    const manifest = treatmentPathLookup.get(path);
    const label = manifest?.label ?? toTitleCase(route.split(".").pop()?.replace(/[-_]/g, " ") ?? "");
    const relatedLabel = label ? `Explore related treatment: ${label}` : label;
    ctas.push({ href: path, label: relatedLabel ?? label, variant: "secondary" });
  });

  const journeyTargets = (journey as { cta_targets?: Record<string, { label?: string; href?: string }> } | undefined)?.cta_targets;
  if (journeyTargets) {
    ["secondary", "tertiary"].forEach((slot) => {
      const target = journeyTargets[slot];
      if (target?.href && target.label && treatmentPaths.has(target.href)) {
        ctas.push({ href: target.href, label: target.label, variant: "secondary" });
      }
    });
  }

  return ctas;
}

function ensureInternalLinks(ctas: CTAPlanEntry[], slug: string): CTAPlanEntry[] {
  const valid = ctas
    .map((cta) => (typeof cta === "string" ? { href: cta, label: cta } : cta))
    .filter((cta) => {
      const href = cta.href;
      if (!href) return false;
      return (
        href.startsWith("/contact")
        || treatmentPaths.has(href)
        || href.startsWith("/treatments/")
        || href === "/dental-checkups-oral-cancer-screening"
      );
    })
    .map((cta) => ({ ...cta, label: cta.label ?? cta.href }));

  const hasInternal = valid.some((cta) => cta.href && treatmentPaths.has(cta.href));
  if (hasInternal) return valid;

  const defaults = buildFallbackLinks(slug);
  return [...valid, ...defaults];
}

function dedupeCTAs(ctas: ChampagneCTAInput[]): CTAPlanEntry[] {
  const seen = new Set<string>();
  const cleaned: CTAPlanEntry[] = [];
  ctas.forEach((cta) => {
    const normalized = typeof cta === "string" ? { href: cta, label: cta } : cta;
    const href = normalized.href;
    const label = normalized.label ?? href;
    if (!href || !label) return;
    const key = href;
    if (seen.has(key)) return;
    seen.add(key);
    cleaned.push({ ...normalized, label });
  });
  return cleaned;
}

export interface SectionTreatmentMidCTAProps {
  section?: SectionRegistryEntry;
  pageSlug?: string;
}

const wrapperStyle: CSSProperties = {
  display: "grid",
  gap: "0.75rem",
  alignItems: "center",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
};

export function Section_TreatmentMidCTA({ section, pageSlug }: SectionTreatmentMidCTAProps) {
  const slug = pageSlug?.split("/").filter(Boolean).pop() ?? "treatment";
  const routeId = getRouteIdFromSlug(pageSlug ?? slug);

  const sectionCTAs = mapSectionCTAs(section);
  const journeyCTAs = buildJourneyCTAs(routeId);
  const intentCTAs = buildIntentCTA(routeId);
  const fallbackLinks = buildFallbackLinks(slug);

  const candidateCTAs = dedupeCTAs([...sectionCTAs, ...journeyCTAs, ...intentCTAs, ...fallbackLinks])
    .map((cta, index) => ({
      id: cta.id ?? `${slug}-mid-cta-${index + 1}`,
      label: cta.label,
      href: cta.href,
      variant: cta.variant ?? "secondary",
    }))
    .filter((cta) => Boolean(cta.label && cta.href));

  const resolvedCTAs = resolveCTAList(ensureInternalLinks(candidateCTAs, slug).slice(0, 4), "secondary", {
    component: "Section_TreatmentMidCTA",
    page: section?.id,
  });

  const title = section?.title ?? "Explore related care";
  const strapline = section?.strapline ?? "See nearby treatments and plan your next step.";

  return (
      <BaseChampagneSurface
        variant="glass"
        style={{
          padding: "clamp(1.15rem, 2.5vw, 2rem)",
          border: "1px solid var(--champagne-keyline-gold)",
        }}
      >
        <div style={wrapperStyle}>
          <div style={{ display: "grid", gap: "0.4rem" }}>
            <h3 style={{ fontSize: "clamp(1.1rem, 2vw, 1.45rem)", fontWeight: 700, lineHeight: 1.35 }}>{title}</h3>
            <p style={{ margin: 0, color: "var(--text-medium)", lineHeight: 1.6 }}>{strapline}</p>
          </div>
          <ChampagneCTAGroup ctas={resolvedCTAs} label="Mid-page CTAs" direction="row" defaultVariant="secondary" />
        </div>
      </BaseChampagneSurface>
  );
}
