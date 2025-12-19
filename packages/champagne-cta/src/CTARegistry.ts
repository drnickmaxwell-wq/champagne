import type { ChampagneCTAConfig, ChampagneCTAInput, ChampagneCTAVariant } from "./types";

const portalEntry = (intent: string) => `/patient-portal?intent=${intent}`;
const forbiddenTarget = `/${"book"}`;
let hasLoggedForbiddenTarget = false;

type CTAContext = {
  component?: string;
  page?: string;
  instanceId?: string;
};

const registry: Record<string, ChampagneCTAConfig> = {
  "book-consultation": {
    id: "book-consultation",
    label: "Book a consultation",
    href: "/contact",
    variant: "primary",
  },
  "video-consultation-portal": {
    id: "video-consultation-portal",
    label: "Start a video consultation",
    href: portalEntry("video"),
    variant: "primary",
  },
  "portal-finance": {
    id: "portal-finance",
    label: "Review finance options",
    href: portalEntry("finance"),
    variant: "primary",
  },
  "portal-upload": {
    id: "portal-upload",
    label: "Upload documents securely",
    href: portalEntry("upload"),
    variant: "secondary",
  },
  "portal-login": {
    id: "portal-login",
    label: "Patient portal",
    href: portalEntry("login"),
    variant: "secondary",
  },
  "practice-plan": {
    id: "practice-plan",
    label: "Practice Plan",
    href: "/practice-plan",
    variant: "secondary",
  },
  "ai-smile-preview": {
    id: "ai-smile-preview",
    label: "AI smile preview",
    href: "/treatments/digital-smile-design",
    variant: "secondary",
  },
  "view-treatments": {
    id: "view-treatments",
    label: "Explore treatments",
    href: "/treatments",
    variant: "secondary",
  },
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
  return input.href ?? hrefFromId;
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

export function registerCTA(entry: ChampagneCTAConfig) {
  registry[entry.id] = entry;
}

export function getCTAFromRegistry(id: string): ChampagneCTAConfig | undefined {
  return registry[id];
}

export function resolveCTA(
  reference: ChampagneCTAInput,
  index = 0,
  defaultVariant: ChampagneCTAVariant = "ghost",
  context?: CTAContext,
): ChampagneCTAConfig {
  const fallbackId = deriveId(reference, index);
  const registryMatch = typeof reference === "string"
    ? registry[reference]
    : reference.id
      ? registry[reference.id]
      : undefined;

  const variant = normalizeVariant(
    typeof reference === "object" ? (reference.variant as string | undefined) ?? (reference as { preset?: string }).preset : undefined,
    registryMatch?.variant ?? defaultVariant,
  );

  return {
    id: fallbackId,
    label: registryMatch?.label ?? deriveLabel(reference, fallbackId),
    href: sanitizeHref(registryMatch?.href ?? deriveHref(reference), context),
    variant,
  } satisfies ChampagneCTAConfig;
}

export function resolveCTAList(
  references: ChampagneCTAInput[] = [],
  defaultVariant: ChampagneCTAVariant = "ghost",
  context?: CTAContext,
): ChampagneCTAConfig[] {
  return references
    .map((reference, index) => resolveCTA(reference, index, defaultVariant, context))
    .filter((cta) => Boolean(cta.label && cta.href));
}

export type { ChampagneCTAConfig, ChampagneCTAInput, ChampagneCTAVariant } from "./types";
