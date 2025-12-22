import {
  getCTAIntentConfigForRoute,
  getCTAIntentLabels,
  getTreatmentJourneyForRoute,
  getTreatmentPages,
  resolveTreatmentPathAlias,
  type ChampagneTreatmentPage,
} from "@champagne/manifests/src/helpers";
import { getRouteIdFromSlug } from "@champagne/manifests/src/core";
import type { SectionRegistryEntry } from "./SectionRegistry";
import { dedupeButtons } from "./ctaDedupe";
import { enforceCtaLabelTruth } from "./ctaLabelTruth";
import {
  createRelationAudit,
  labelFromHref,
  normalizeCtaRelation,
  updateRelationAudit,
  type CTARelationAudit,
  type CTARelationship,
} from "./ctaRelation";

type ChampagneCTAVariant = "primary" | "secondary" | "ghost";

interface ChampagneCTAConfig {
  id: string;
  label: string;
  href: string;
  variant: ChampagneCTAVariant;
}

type ChampagneCTAInput =
  | string
  | {
      id?: string;
      label?: string;
      href?: string;
      variant?: ChampagneCTAVariant;
      preset?: string;
    };

type CTAPlanEntry = Partial<Pick<ChampagneCTAConfig, "id" | "label" | "href" | "variant">> & { preset?: string };

const forbiddenTarget = `/${"book"}`;
let hasLoggedForbiddenTarget = false;

type CTAContext = {
  component?: string;
  page?: string;
  instanceId?: string;
};

function normalizeVariant(value: string | undefined, fallback: ChampagneCTAVariant): ChampagneCTAVariant {
  if (value === "primary" || value === "secondary" || value === "ghost") return value;
  return fallback;
}

function deriveId(input: ChampagneCTAInput, index: number) {
  if (typeof input === "string") return input || `cta-${index + 1}`;
  return input.id ?? `cta-${index + 1}`;
}

function deriveLabel(input: ChampagneCTAInput, fallbackId: string) {
  if (typeof input === "string") return input.replace(/[-_]/g, " ").trim() || fallbackId;
  const fallbackLabel = fallbackId.replace(/[-_]/g, " ").trim() || "Call to action";
  return input.label ?? fallbackLabel;
}

function deriveHref(input: ChampagneCTAInput) {
  if (typeof input === "string") return input.startsWith("/") ? input : "#";
  const hrefFromId = typeof input.id === "string" && input.id.startsWith("/") ? (input.id as string) : "#";
  const href = input.href ?? hrefFromId;
  return typeof href === "string" ? href : hrefFromId;
}

function sanitizeHref(href: string, context?: CTAContext) {
  if (href !== forbiddenTarget) return href;

  if (!hasLoggedForbiddenTarget) {
    console.error("[CHAMPAGNE_CTA_FORBIDDEN_TARGET]", {
      target: href,
      component: context?.component,
      page: context?.page,
      instanceId: context?.instanceId,
    });
    hasLoggedForbiddenTarget = true;
  }

  if (process.env.NODE_ENV !== "production") {
    throw new Error(`Forbidden CTA target detected: ${href}`);
  }

  return "/contact";
}

function resolveCTA(
  reference: ChampagneCTAInput,
  index = 0,
  defaultVariant: ChampagneCTAVariant = "ghost",
  context?: CTAContext,
): ChampagneCTAConfig {
  const fallbackId = deriveId(reference, index);

  const variant = normalizeVariant(
    typeof reference === "object" ? (reference.variant as string | undefined) ?? (reference as { preset?: string }).preset : undefined,
    defaultVariant,
  );

  return {
    id: fallbackId,
    label: deriveLabel(reference, fallbackId),
    href: sanitizeHref(deriveHref(reference), context),
    variant,
  } satisfies ChampagneCTAConfig;
}

function resolveCTAList(
  references: ChampagneCTAInput[] = [],
  defaultVariant: ChampagneCTAVariant = "ghost",
  context?: CTAContext,
): ChampagneCTAConfig[] {
  return references
    .map((reference, index) => resolveCTA(reference, index, defaultVariant, context))
    .filter((cta) => Boolean(cta.label && cta.href));
}

export type MidCTAStatus = "OK" | "INVALID_HREF" | "RAW_LABEL";

export interface MidCTAButtonAudit {
  id?: string;
  label?: string;
  href?: string;
  resolvedLabel?: string;
  resolvedHref?: string;
  finalLabel?: string;
  relationship?: CTARelationship;
  alternativeLabelBanned?: boolean;
  status: MidCTAStatus;
  invalidReason?: string;
}

export interface MidCTAAuditReport {
  before: {
    buttons: MidCTAButtonAudit[];
    invalidHrefCount: number;
    rawLabelCount: number;
  };
  after: {
    buttons: MidCTAButtonAudit[];
    invalidHrefCount: number;
    rawLabelCount: number;
  };
  dropped: { id?: string; label?: string; href?: string; reason: string }[];
  deduped: { buttonsRemoved: number };
  usedFallbackDefaults: boolean;
  relation: CTARelationAudit;
}

export interface MidCTAPlanResult {
  resolvedCTAs: ChampagneCTAConfig[];
  audit: MidCTAAuditReport;
}

const treatmentPages = getTreatmentPages();
const treatmentPathLookup = new Map<string, ChampagneTreatmentPage>();
for (const page of treatmentPages) {
  treatmentPathLookup.set(page.path, page);
}
const treatmentPaths = new Set(treatmentPathLookup.keys());

const allowedStaticRoutes = new Set<string>([
  "/contact",
  "/treatments",
  "/patient-portal",
  "/practice-plan",
  "/video-consultation",
  "/finance",
  "/smile-gallery",
  "/team",
  "/blog",
]);

const allowedPortalIntents = new Set(["login", "upload", "finance", "video"]);

const safeFallbackCTAs: CTAPlanEntry[] = [
  {
    id: "mid-cta-book-consultation",
    label: "Book a consultation",
    href: "/contact",
    variant: "primary",
  },
  {
    id: "mid-cta-explore-treatments",
    label: "Explore treatments",
    href: "/treatments",
    variant: "secondary",
  },
];

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

function buildJourneyCTAs(routeId: string): CTAPlanEntry[] {
  const journey = getTreatmentJourneyForRoute(routeId);
  const ctas: CTAPlanEntry[] = [];

  const journeyMidCTA = (journey as { journey?: { mid_page_cta?: { label?: string; href?: string } } } | undefined)?.journey
    ?.mid_page_cta;
  if (journeyMidCTA?.href && journeyMidCTA.label) {
    ctas.push({ href: journeyMidCTA.href, label: journeyMidCTA.label, variant: "secondary" });
  }

  const journeyTargets = (journey as { cta_targets?: Record<string, { label?: string; href?: string }> } | undefined)?.cta_targets;
  if (journeyTargets) {
    ["secondary", "tertiary"].forEach((slot) => {
      const target = journeyTargets[slot];
      if (target?.href && target.label && treatmentPaths.has(target.href)) {
        ctas.push({ href: target.href, label: target.label, variant: "secondary" });
      }
    });
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

  return ctas;
}

function buildRouteTruthSet() {
  const truth = new Set<string>([...allowedStaticRoutes, ...treatmentPaths]);

  allowedPortalIntents.forEach((intent) => {
    truth.add(`/patient-portal?intent=${intent}`);
  });

  return truth;
}

function validateHref(href: string, truthSet: Set<string>): { valid: boolean; reason?: string } {
  if (!href.startsWith("/")) {
    return { valid: false, reason: "not starting with \"/\"" };
  }

  if (href.startsWith("/book")) {
    return { valid: false, reason: "points to /book (should be blocked)" };
  }

  let parsed: URL;
  try {
    parsed = new URL(href, "https://champagne.local");
  } catch {
    return { valid: false, reason: "not in allowed route set" };
  }

  const path = parsed.pathname;
  const normalized = parsed.search ? `${path}${parsed.search}` : path;

  if (path === "/patient-portal") {
    const intent = parsed.searchParams.get("intent");
    if (!intent || allowedPortalIntents.has(intent)) {
      return { valid: true };
    }
    return { valid: false, reason: "not in allowed route set" };
  }

  if (truthSet.has(normalized) || truthSet.has(path)) {
    return { valid: true };
  }

  if (path.startsWith("/treatments/")) {
    return { valid: false, reason: "missing /treatments/<slug> match" };
  }

  return { valid: false, reason: "not in allowed route set" };
}

function isRawLabel(label?: string) {
  if (!label) return true;
  if (label.includes("/")) return true;
  if (/\.(json|md)$/i.test(label)) return true;
  if (label.includes("treatments.")) return true;
  if (label.includes("smh_")) return true;
  if (label.toLowerCase().includes("variantid")) return true;
  const trimmed = label.trim();
  const looksLikeSlug = /^[a-z0-9]+(?:[-_][a-z0-9]+)+$/.test(trimmed);
  if (looksLikeSlug && trimmed === trimmed.toLowerCase()) return true;
  return false;
}

function humanizeLabel(
  label: string | undefined,
  href: string | undefined,
  variant: ChampagneCTAConfig["variant"] | undefined,
): { resolvedLabel: string; wasRaw: boolean } {
  const detectedRaw = isRawLabel(label);
  const resolvedFromHref = labelFromHref(href);
  if (!detectedRaw && label) {
    return { resolvedLabel: label, wasRaw: false };
  }

  if (resolvedFromHref) {
    return { resolvedLabel: resolvedFromHref, wasRaw: true };
  }

  const cleaned = label ? toTitleCase(label.replace(/[./]/g, " ")) : undefined;
  if (cleaned && !isRawLabel(cleaned)) {
    return { resolvedLabel: cleaned, wasRaw: true };
  }

  return {
    resolvedLabel: variant === "primary" ? "Book a consultation" : "Learn more",
    wasRaw: true,
  };
}

function resolveTreatmentHrefAlias(href?: string): { href?: string; wasAlias: boolean } {
  if (!href || !href.startsWith("/treatments/")) {
    return { href, wasAlias: false };
  }

  const { resolvedPath, wasAlias } = resolveTreatmentPathAlias(href);
  return { href: resolvedPath, wasAlias };
}

function normalizeHrefForDedupe(href?: string) {
  if (!href || typeof href !== "string") return href;
  return resolveTreatmentHrefAlias(href).href ?? href;
}

function normalizePlanEntry(entry: CTAPlanEntry, slug: string, index: number): CTAPlanEntry {
  return {
    id: entry.id ?? `${slug}-mid-cta-${index + 1}`,
    href: entry.href,
    label: entry.label,
    variant: entry.variant ?? (index === 0 ? "primary" : "secondary"),
  };
}

function buildCandidateCTAs(section: SectionRegistryEntry | undefined, routeId: string, slug: string): CTAPlanEntry[] {
  const sectionCTAs = mapSectionCTAs(section);
  const journeyCTAs = buildJourneyCTAs(routeId);
  const intentCTAs = buildIntentCTA(routeId);
  const fallbackLinks = buildFallbackLinks(slug);

  const [journeyMidCTA, ...journeySupporting] = journeyCTAs;

  return [
    ...(journeyMidCTA ? [journeyMidCTA] : []),
    ...journeySupporting,
    ...sectionCTAs,
    ...intentCTAs,
    ...fallbackLinks,
  ];
}

function summarizeButtons(buttons: MidCTAButtonAudit[]) {
  const invalidHrefCount = buttons.filter((button) => button.status === "INVALID_HREF").length;
  const rawLabelCount = buttons.filter((button) => button.status === "RAW_LABEL").length;
  return { invalidHrefCount, rawLabelCount };
}

export function resolveTreatmentMidCTAPlan(
  section: SectionRegistryEntry | undefined,
  pageSlug: string | undefined,
  limit = 2,
): MidCTAPlanResult {
  const slug = pageSlug?.split("/").filter(Boolean).pop() ?? "treatment";
  const routeId = getRouteIdFromSlug(pageSlug ?? slug);
  const truthSet = buildRouteTruthSet();
  const candidateCTAs = buildCandidateCTAs(section, routeId, slug)
    .map((cta, index) => normalizePlanEntry(cta, slug, index))
    .filter((cta) => Boolean(cta.label && cta.href));

  const beforeButtons: MidCTAButtonAudit[] = [];
  const afterButtons: MidCTAButtonAudit[] = [];
  const dropped: { id?: string; label?: string; href?: string; reason: string }[] = [];
  const relationAudit = createRelationAudit();

  const validated = candidateCTAs.map((cta) => {
    const { href: resolvedHref } = resolveTreatmentHrefAlias(cta.href);
    const validation = validateHref(resolvedHref ?? "", truthSet);
    const { resolvedLabel, wasRaw } = humanizeLabel(cta.label, resolvedHref, cta.variant);
    const relationNormalization = normalizeCtaRelation({
      href: resolvedHref,
      label: resolvedLabel,
      defaultVariant: cta.variant,
    });
    const finalLabel = relationNormalization.label;
    updateRelationAudit(relationAudit, relationNormalization);
    const status: MidCTAStatus = validation.valid ? (wasRaw ? "RAW_LABEL" : "OK") : "INVALID_HREF";

    beforeButtons.push({
      id: cta.id,
      label: cta.label,
      href: cta.href,
      resolvedLabel,
      resolvedHref,
      finalLabel,
      relationship: relationNormalization.relationship,
      alternativeLabelBanned: relationNormalization.alternativeLabelBanned,
      status,
      invalidReason: validation.reason,
    });

    if (!validation.valid) {
      dropped.push({ id: cta.id, label: cta.label, href: resolvedHref ?? cta.href, reason: validation.reason ?? "invalid" });
      return undefined;
    }

    afterButtons.push({
      id: cta.id,
      label: cta.label,
      href: cta.href,
      resolvedLabel: finalLabel,
      resolvedHref,
      finalLabel,
      relationship: relationNormalization.relationship,
      alternativeLabelBanned: relationNormalization.alternativeLabelBanned,
      status: wasRaw ? "RAW_LABEL" : "OK",
    });

    return {
      ...cta,
      href: resolvedHref,
      label: finalLabel,
    } satisfies CTAPlanEntry;
  });

  let sanitized = validated.filter(Boolean) as CTAPlanEntry[];

  if (!sanitized.length) {
    sanitized = safeFallbackCTAs.map((cta) => {
      const relationNormalization = normalizeCtaRelation({
        href: cta.href,
        label: cta.label,
        defaultVariant: cta.variant,
      });
      updateRelationAudit(relationAudit, relationNormalization);
      return { ...cta, label: relationNormalization.label };
    });
  }

  const dedupedResult = dedupeButtons(sanitized, { normalizeHref: normalizeHrefForDedupe });
  const deduped = dedupedResult.buttons.map((cta, index) => normalizePlanEntry(cta, slug, index));
  const capped = deduped.slice(0, limit);

  const resolvedCTAs = resolveCTAList(capped, "secondary", {
    component: "Section_TreatmentMidCTA",
    page: section?.id,
  });

  const truthAlignedCTAs = enforceCtaLabelTruth(resolvedCTAs);

  const sanitizedButtons = truthAlignedCTAs.map((cta) => ({
    id: cta.id,
    label: cta.label,
    href: cta.href,
    resolvedLabel: cta.label,
    resolvedHref: cta.href,
    status: "OK" as const,
  }));

  const beforeSummary = summarizeButtons(beforeButtons);
  const afterSummary = summarizeButtons(sanitizedButtons);

  return {
    resolvedCTAs: truthAlignedCTAs,
    audit: {
      before: { buttons: beforeButtons, ...beforeSummary },
      after: { buttons: sanitizedButtons, ...afterSummary },
      dropped,
      deduped: { buttonsRemoved: dedupedResult.dropped.length },
      usedFallbackDefaults: validated.filter(Boolean).length === 0,
      relation: relationAudit,
    },
  };
}

