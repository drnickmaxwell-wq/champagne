import type { ChampagnePageSection } from "@champagne/manifests";
import { getSectionStackForPage, getSectionStyle } from "@champagne/manifests";

export interface SectionRegistryEntry {
  id: string;
  type?: string;
  kind?: "text" | "media" | "features";
  title?: string;
  body?: string;
  eyebrow?: string;
  items?: string[];
  mediaHint?: string;
  definition?: ChampagnePageSection | string;
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

function deriveKind(type?: string): SectionRegistryEntry["kind"] {
  if (!type) return "text";
  if (["text", "copy", "copy-block", "story", "faq", "accordion"].includes(type)) return "text";
  if (["media", "gallery", "carousel", "map", "slider", "lab"].includes(type)) return "media";
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
  const items = Array.isArray(definition.items)
    ? definition.items.map(String)
    : kind === "features"
      ? [
          "Comfort-first planning and diagnostics",
          "Technology-backed visual previews",
          "Clear next steps and aftercare",
        ]
      : undefined;

  return {
    id: sectionId,
    type: rawType,
    kind,
    title,
    body,
    eyebrow,
    items,
    mediaHint: (definition.mediaHint as string | undefined) ?? sentenceCase(style?.surface),
    definition: {
      ...definition,
      id: sectionId,
      type: rawType,
      title,
      copy: body,
      label: eyebrow,
      items,
    },
  } satisfies SectionRegistryEntry;
}

export function getSectionStack(pageSlug: string): SectionRegistryEntry[] {
  const rawSections = getSectionStackForPage(pageSlug) ?? [];

  return rawSections.map((section, index) => normalizeDefinition(section, pageSlug, index));
}
