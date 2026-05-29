export const TREATMENT_ANSWER_SURFACE_REQUIRED_SECTION_IDS = [
  "direct_answer",
  "what_this_treatment_is",
  "who_it_is_for",
  "who_it_may_not_be_suitable_for",
  "benefits",
  "risks_and_limitations",
  "alternatives",
  "process",
  "timeline",
  "aftercare",
  "cost_fee_logic",
  "local_shoreham_context",
  "clinician_expertise",
  "technology_used",
  "faq",
  "related_treatments_internal_links",
  "last_reviewed_clinical_review",
  "cta",
] as const;

export type TreatmentAnswerSurfaceSectionId =
  (typeof TREATMENT_ANSWER_SURFACE_REQUIRED_SECTION_IDS)[number];

export type TreatmentAnswerSurfaceStatus = "example_seed" | "draft" | "ready_for_clinical_review" | "clinically_reviewed";

export interface TreatmentAnswerSurfaceLink {
  label: string;
  href: string;
  relationship?: "alternative" | "related" | "next_step" | "prerequisite" | "maintenance" | string;
}

export interface TreatmentAnswerSurfaceFaq {
  question: string;
  answer: string;
}

export interface TreatmentAnswerSurfaceSection {
  id: TreatmentAnswerSurfaceSectionId | string;
  heading: string;
  body?: string;
  items?: string[];
  faqs?: TreatmentAnswerSurfaceFaq[];
  links?: TreatmentAnswerSurfaceLink[];
  ctas?: TreatmentAnswerSurfaceLink[];
  review?: {
    lastReviewed?: string;
    clinicalReviewer?: string;
    nextReviewDue?: string;
  };
}

export interface TreatmentAnswerSurface {
  version: string;
  status: TreatmentAnswerSurfaceStatus | string;
  frameworkOnly?: boolean;
  exampleSeed?: boolean;
  primaryGeography: string;
  secondaryGeographies?: string[];
  sections: TreatmentAnswerSurfaceSection[];
}

export interface TreatmentAnswerSurfaceValidationResult {
  valid: boolean;
  frameworkPresent: boolean;
  presentSectionIds: string[];
  missingSectionIds: string[];
  duplicateSectionIds: string[];
  unknownSectionIds: string[];
  emptySectionIds: string[];
  secondaryGeographyMentions: Record<string, number>;
  secondaryGeographyStuffing: boolean;
  errors: string[];
  warnings: string[];
}

const REQUIRED_SECTION_SET = new Set<string>(TREATMENT_ANSWER_SURFACE_REQUIRED_SECTION_IDS);
const DEFAULT_SECONDARY_GEOGRAPHIES = ["Brighton", "Worthing", "Lancing", "Southwick"];

function textFromValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(textFromValue).join(" ");
  if (value && typeof value === "object") return Object.values(value).map(textFromValue).join(" ");
  return "";
}

function countNeedle(haystack: string, needle: string): number {
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return (haystack.match(new RegExp(`\\b${escaped}\\b`, "gi")) ?? []).length;
}

export function validateTreatmentAnswerSurface(
  answerSurface: TreatmentAnswerSurface | null | undefined,
): TreatmentAnswerSurfaceValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!answerSurface || typeof answerSurface !== "object") {
    return {
      valid: false,
      frameworkPresent: false,
      presentSectionIds: [],
      missingSectionIds: [...TREATMENT_ANSWER_SURFACE_REQUIRED_SECTION_IDS],
      duplicateSectionIds: [],
      unknownSectionIds: [],
      emptySectionIds: [],
      secondaryGeographyMentions: {},
      secondaryGeographyStuffing: false,
      errors: ["answerSurface is missing"],
      warnings,
    };
  }

  if (answerSurface.version !== "TREATMENT_ANSWER_SURFACE_V1") {
    errors.push("answerSurface.version must be TREATMENT_ANSWER_SURFACE_V1");
  }
  if (answerSurface.primaryGeography !== "Shoreham-by-Sea") {
    errors.push("answerSurface.primaryGeography must remain Shoreham-by-Sea");
  }

  const sections = Array.isArray(answerSurface.sections) ? answerSurface.sections : [];
  if (sections.length === 0) errors.push("answerSurface.sections must be a non-empty array");

  const seen = new Set<string>();
  const duplicateSectionIds = new Set<string>();
  const unknownSectionIds = new Set<string>();
  const emptySectionIds = new Set<string>();

  for (const section of sections) {
    const sectionId = section?.id;
    if (!sectionId || !REQUIRED_SECTION_SET.has(sectionId)) {
      unknownSectionIds.add(String(sectionId ?? "(missing)"));
      continue;
    }
    if (seen.has(sectionId)) duplicateSectionIds.add(sectionId);
    seen.add(sectionId);
    const hasBody = typeof section.body === "string" && section.body.trim().length > 0;
    const hasItems = Array.isArray(section.items) && section.items.some((item) => item.trim().length > 0);
    const hasFaqs = Array.isArray(section.faqs) && section.faqs.length > 0;
    const hasLinks = Array.isArray(section.links) && section.links.length > 0;
    const hasCtas = Array.isArray(section.ctas) && section.ctas.length > 0;
    const hasReview = Boolean(section.review?.lastReviewed || section.review?.clinicalReviewer || section.review?.nextReviewDue);
    if (!section.heading || !(hasBody || hasItems || hasFaqs || hasLinks || hasCtas || hasReview)) {
      emptySectionIds.add(sectionId);
    }
  }

  const presentSectionIds = TREATMENT_ANSWER_SURFACE_REQUIRED_SECTION_IDS.filter((sectionId) => seen.has(sectionId));
  const missingSectionIds = TREATMENT_ANSWER_SURFACE_REQUIRED_SECTION_IDS.filter((sectionId) => !seen.has(sectionId));
  const secondaryGeographies = answerSurface.secondaryGeographies?.length
    ? answerSurface.secondaryGeographies
    : DEFAULT_SECONDARY_GEOGRAPHIES;
  const allText = textFromValue(answerSurface.sections);
  const secondaryGeographyMentions = Object.fromEntries(
    secondaryGeographies.map((geography) => [geography, countNeedle(allText, geography)]),
  );
  const totalSecondaryMentions = Object.values(secondaryGeographyMentions).reduce((total, count) => total + count, 0);
  const secondaryGeographyStuffing = totalSecondaryMentions > 4 || Object.values(secondaryGeographyMentions).some((count) => count > 2);

  if (missingSectionIds.length > 0) errors.push(`Missing answerSurface sections: ${missingSectionIds.join(", ")}`);
  if (duplicateSectionIds.size > 0) errors.push(`Duplicate answerSurface sections: ${[...duplicateSectionIds].join(", ")}`);
  if (unknownSectionIds.size > 0) errors.push(`Unknown answerSurface sections: ${[...unknownSectionIds].join(", ")}`);
  if (emptySectionIds.size > 0) errors.push(`Empty answerSurface sections: ${[...emptySectionIds].join(", ")}`);
  if (secondaryGeographyStuffing) warnings.push("Secondary geography mentions exceed answer-surface stuffing threshold");

  return {
    valid: errors.length === 0,
    frameworkPresent: true,
    presentSectionIds,
    missingSectionIds,
    duplicateSectionIds: [...duplicateSectionIds],
    unknownSectionIds: [...unknownSectionIds],
    emptySectionIds: [...emptySectionIds],
    secondaryGeographyMentions,
    secondaryGeographyStuffing,
    errors,
    warnings,
  };
}
