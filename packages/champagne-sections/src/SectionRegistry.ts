import type { ChampagneCTARelationship } from "@champagne/cta";
import type { ChampagnePageSection } from "@champagne/manifests/src/core";
import { getSectionStackForPage } from "@champagne/manifests/src/core";
import { getSectionStyle } from "@champagne/manifests/src/helpers";

export interface SectionRegistryEntry {
  id: string;
  type?: string;
  kind?:
    | "text"
    | "media"
    | "features"
    | "routing_cards"
    | "treatment_overview_rich"
    | "treatment_media_feature"
    | "treatment_tools_trio"
    | "clinician_insight"
    | "patient_stories_rail"
    | "people_grid"
    | "treatment_mid_cta"
    | "treatment_faq_block"
    | "treatment_closing_cta"
    | "reviews";
  title?: string;
  body?: string;
  eyebrow?: string;
  items?: string[];
  mediaHint?: string;
  bullets?: string[];
  tools?: { title: string; description?: string }[];
  stories?: { title?: string; summary?: string; name?: string; role?: string }[];
  faqs?: { question: string; answer: string }[];
  quote?: string;
  attribution?: string;
  role?: string;
  strapline?: string;
  ctas?: {
    id?: string;
    label?: string;
    href?: string;
    preset?: string;
    variant?: string;
    relationship?: ChampagneCTARelationship;
  }[];
  reviews?: { quote: string; name?: string; rating?: number; source?: string }[];
  rating?: number;
  reviewCount?: string;
  definition?: ChampagnePageSection | string;
}

const validRelationships = new Set<ChampagneCTARelationship>([
  "next_step",
  "prerequisite",
  "maintenance",
  "alternative",
  "related",
  "book",
]);

function normalizeRelationship(value?: string): ChampagneCTARelationship | undefined {
  if (!value) return undefined;
  const normalized = value as ChampagneCTARelationship;
  return validRelationships.has(normalized) ? normalized : undefined;
}

function sentenceCase(input?: string) {
  if (!input) return "";
  return input
    .replace(/[-_]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const specializedKinds: Record<string, SectionRegistryEntry["kind"]> = {
  treatment_overview_rich: "treatment_overview_rich",
  treatment_media_feature: "treatment_media_feature",
  treatment_tools_trio: "treatment_tools_trio",
  clinician_insight: "clinician_insight",
  patient_stories_rail: "patient_stories_rail",
  people_grid: "people_grid",
  treatment_mid_cta: "treatment_mid_cta",
  treatment_faq_block: "treatment_faq_block",
  faq: "treatment_faq_block",
  treatment_closing_cta: "treatment_closing_cta",
  cta: "treatment_closing_cta",
  google_reviews: "reviews",
  routing_cards: "routing_cards",
};

function deriveKind(type?: string): SectionRegistryEntry["kind"] {
  if (!type) return "text";
  if (specializedKinds[type]) return specializedKinds[type];
  if (["text", "copy", "copy-block", "story", "faq", "accordion"].includes(type)) return "text";
  if (["media", "gallery", "carousel", "map", "slider", "lab"].includes(type)) return "media";
  if (["reviews", "testimonials"].includes(type)) return "reviews";
  if (["routing_cards", "navigation_grid"].includes(type)) return "routing_cards";
  if (["feature-grid", "steps", "features", "feature-list", "pricing"].includes(type)) return "features";
  return "text";
}

function normalizeDefinition(section: ChampagnePageSection | string, pageSlug: string, index: number) {
  const isString = typeof section === "string";
  const sectionId = isString ? (section as string) : section.id ?? `${pageSlug}-section-${index}`;
  const style = getSectionStyle(sectionId);
  const rawType = isString ? style?.type : section.type ?? style?.type;
  const kind = deriveKind(rawType);
  const fallbackTitle = sentenceCase(sectionId || `Section ${index + 1}`);
  const definition = isString ? {} : (section as ChampagnePageSection);
  const title = (definition.title as string | undefined)
    ?? (definition.label as string | undefined)
    ?? fallbackTitle;
  const body = (definition.copy as string | undefined)
    ?? (definition.body as string | undefined)
    ?? `Learn more about ${fallbackTitle.toLowerCase()} in this treatment overview.`;
  const eyebrow = (definition.label as string | undefined)
    ?? (definition.eyebrow as string | undefined)
    ?? (kind === "features" ? "What to know" : "Treatment detail");
  const rawItems = Array.isArray(definition.items) ? definition.items : undefined;
  const itemObjects = rawItems?.filter((item) => item && typeof item === "object") as
    | Record<string, unknown>[]
    | undefined;
  const routingItems = kind === "routing_cards" ? rawItems : undefined;
  const tools = itemObjects?.length
    ? itemObjects.map((item, itemIndex) => ({
        title:
          (item.title as string | undefined)
          ?? (item.label as string | undefined)
          ?? (item.name as string | undefined)
          ?? `Feature ${itemIndex + 1}`,
        description:
          (item.description as string | undefined)
          ?? (item.copy as string | undefined)
          ?? (item.body as string | undefined),
      }))
    : undefined;
  const items = rawItems && !itemObjects?.length
    ? rawItems.map(String)
    : kind === "features" && !tools
      ? [
          "Comfort-first planning and diagnostics",
          "Technology-backed visual previews",
          "Clear next steps and aftercare",
        ]
      : undefined;
  const bullets = Array.isArray((definition as Record<string, unknown>).bullets)
    ? ((definition as Record<string, unknown>).bullets as unknown[]).map(String)
    : undefined;
  const faqs = Array.isArray((definition as Record<string, unknown>).faqs)
    ? ((definition as Record<string, unknown>).faqs as Record<string, unknown>[]).map((faq, faqIndex) => ({
        question:
          (faq.question as string | undefined)
          ?? (faq.q as string | undefined)
          ?? `Question ${faqIndex + 1}`,
        answer:
          (faq.answer as string | undefined)
          ?? (faq.a as string | undefined)
          ?? "Detailed guidance arrives here soon.",
      }))
    : undefined;
  const stories = Array.isArray((definition as Record<string, unknown>).stories)
    ? ((definition as Record<string, unknown>).stories as Record<string, unknown>[]).map((story) => ({
        title: (story.title as string | undefined) ?? (story.headline as string | undefined),
        summary:
          (story.summary as string | undefined)
          ?? (story.copy as string | undefined)
          ?? (story.body as string | undefined)
          ?? "This patient story will be authored with more detail.",
        name: (story.name as string | undefined) ?? (story.author as string | undefined),
        role: (story.role as string | undefined) ?? (story.context as string | undefined),
      }))
    : undefined;
  const ctas = Array.isArray((definition as Record<string, unknown>).ctas)
    ? ((definition as Record<string, unknown>).ctas as Record<string, unknown>[]).map((cta, ctaIndex) => ({
        id: (cta.id as string | undefined) ?? `${sectionId}-cta-${ctaIndex + 1}`,
        label: (cta.label as string | undefined) ?? (cta.title as string | undefined) ?? "Continue",
        href: (cta.href as string | undefined) ?? (cta.link as string | undefined),
        variant: (cta.variant as string | undefined) ?? (cta.preset as string | undefined) ?? (cta.tone as string | undefined),
        preset: (cta.preset as string | undefined) ?? (cta.tone as string | undefined),
        relationship: normalizeRelationship(cta.relationship as string | undefined),
      }))
    : undefined;

  const reviews = Array.isArray((definition as Record<string, unknown>).reviews)
    ? ((definition as Record<string, unknown>).reviews as Record<string, unknown>[]).map((review, reviewIndex) => ({
        quote:
          (review.quote as string | undefined)
          ?? (review.copy as string | undefined)
          ?? (review.body as string | undefined)
          ?? `Review snippet ${reviewIndex + 1}`,
        name: (review.name as string | undefined) ?? (review.attribution as string | undefined),
        rating: typeof review.rating === "number" ? (review.rating as number) : undefined,
        source: (review.source as string | undefined) ?? (review.label as string | undefined),
      }))
    : undefined;

  return {
    id: sectionId,
    type: rawType,
    kind,
    title,
    body,
    eyebrow,
    items: routingItems ?? items,
    tools,
    bullets,
    faqs,
    stories,
    reviews,
    rating:
      typeof (definition as Record<string, unknown>).rating === "number"
        ? ((definition as Record<string, unknown>).rating as number)
        : undefined,
    reviewCount: (definition as Record<string, unknown>).reviewCount as string | undefined,
    quote: (definition.quote as string | undefined) ?? (definition.body as string | undefined),
    strapline: (definition.strapline as string | undefined) ?? (definition.subtitle as string | undefined),
    attribution: (definition.attribution as string | undefined) ?? (definition.clinician as string | undefined),
    role: (definition.role as string | undefined) ?? (definition.context as string | undefined),
    ctas,
    mediaHint: (definition.mediaHint as string | undefined) ?? sentenceCase(style?.surface),
    definition: {
      ...definition,
      id: sectionId,
      type: rawType,
      title,
      copy: body,
      label: eyebrow,
      items: routingItems ?? items,
      tools,
      bullets,
      faqs,
      stories,
      ctas,
      reviews,
      rating:
        typeof (definition as Record<string, unknown>).rating === "number"
          ? ((definition as Record<string, unknown>).rating as number)
          : undefined,
      reviewCount: (definition as Record<string, unknown>).reviewCount as string | undefined,
    },
  } satisfies SectionRegistryEntry;
}

export function getSectionStack(pageSlug: string): SectionRegistryEntry[] {
  const rawSections = getSectionStackForPage(pageSlug) ?? [];

  return rawSections.map((section, index) => normalizeDefinition(section, pageSlug, index));
}
