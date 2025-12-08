import type { ChampagneCTAConfig, CTAReference, CTAStylePreset } from "./types";

const ctaRegistry: Record<string, ChampagneCTAConfig> = {
  "book-consultation": {
    id: "book-consultation",
    label: "Book a consultation",
    href: "/contact",
    preset: "primary",
    description: "Default booking CTA for clinical flows.",
  },
  "view-treatments": {
    id: "view-treatments",
    label: "Explore treatments",
    href: "/treatments",
    preset: "secondary",
    description: "Navigates to the treatments hub.",
  },
  "view-smile-gallery": {
    id: "view-smile-gallery",
    label: "View smile gallery",
    href: "/smile-gallery",
    preset: "luxury-gold",
  },
  "call-office": {
    id: "call-office",
    label: "Call the office",
    href: "tel:+14157727409",
    preset: "ghost",
  },
};

function startCase(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\s+/g, " ");
}

export function registerCTA(entry: ChampagneCTAConfig) {
  ctaRegistry[entry.id] = entry;
}

export function getCTAFromRegistry(id: string): ChampagneCTAConfig | undefined {
  return ctaRegistry[id];
}

function resolveFromRegistry(reference: CTAReference): ChampagneCTAConfig | undefined {
  if (typeof reference === "string") return ctaRegistry[reference];
  if (reference.id) return ctaRegistry[reference.id];
  return undefined;
}

export function resolveCTA(
  reference: CTAReference,
  index = 0,
  defaultPreset: CTAStylePreset = "ghost",
): ChampagneCTAConfig {
  const fromRegistry = resolveFromRegistry(reference);
  const fallbackLabel = typeof reference === "string" ? startCase(reference) || "Call to action" : "Call to action";
  const fallbackHref = typeof reference === "string" && reference.startsWith("/") ? reference : "#";

  if (typeof reference === "string") {
    return fromRegistry ?? {
      id: reference || `cta-${index + 1}`,
      label: fallbackLabel,
      href: fallbackHref,
      preset: defaultPreset,
    };
  }

  return {
    id: reference.id ?? fromRegistry?.id ?? `cta-${index + 1}`,
    label: reference.label ?? fromRegistry?.label ?? fallbackLabel,
    href: reference.href ?? fromRegistry?.href ?? fallbackHref,
    preset: (reference.preset as CTAStylePreset | undefined) ?? fromRegistry?.preset ?? defaultPreset,
    description: reference.description ?? fromRegistry?.description,
  };
}

export function resolveCTAList(
  references: CTAReference[] = [],
  defaultPreset: CTAStylePreset = "ghost",
): ChampagneCTAConfig[] {
  return references
    .map((reference, index) => resolveCTA(reference, index, defaultPreset))
    .filter((cta) => Boolean(cta.label && cta.href));
}

export type { CTAStylePreset } from "./types";
export type { ChampagneCTAConfig, CTAReference } from "./types";
