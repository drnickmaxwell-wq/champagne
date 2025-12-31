import machineManifest from "@champagne/manifests/data/champagne_machine_manifest_full.json";
import { resolveTreatmentPathAlias } from "@champagne/manifests/src/helpers";

const forbiddenRelationWords = ["alternative", "alternatives", "instead", "compare", "options"];

type SemanticIntent = "planning" | "maintenance" | "alternative" | "next_step";

const semanticRouteMap: Record<string, SemanticIntent> = {
  "/treatments/cbct-3d-scanning": "planning",
  "/treatments/digital-smile-design": "planning",
  "/treatments/implants-consultation": "planning",
  "/treatments/implant-consultation": "planning",
  "/treatments/3d-digital-dentistry": "planning",
  "/treatments/night-guards-occlusal-splints": "maintenance",
  "/treatments/mouthguards-and-retainers": "maintenance",
  "/treatments/dental-retainers": "maintenance",
  "/treatments/periodontal-gum-care": "maintenance",
  "/treatments/preventative-and-general-dentistry": "maintenance",
  "/treatments/whitening-top-ups": "maintenance",
  "/treatments/home-teeth-whitening": "maintenance",
  "/treatments/implants-aftercare": "maintenance",
  "/treatments/implant-aftercare": "maintenance",
  "/treatments/implants": "alternative",
  "/treatments/implants-single-tooth": "alternative",
  "/treatments/implants-multiple-teeth": "alternative",
  "/treatments/dental-bridges": "alternative",
  "/treatments/dentures": "alternative",
};

const planningKeywords = ["cbct", "scan", "planning", "assessment", "diagnostic"];
const maintenanceKeywords = ["aftercare", "hygiene", "maintenance", "retainer", "splint", "gum", "top-up"];

function slugToTitle(slug?: string) {
  if (!slug) return undefined;
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeHrefPath(href?: string) {
  if (!href) return undefined;
  try {
    const parsed = new URL(href, "https://champagne.local");
    return parsed.pathname + (parsed.search ?? "");
  } catch {
    return href;
  }
}

function slugToSemanticTitle(slug?: string) {
  const baseTitle = slugToTitle(slug);
  if (!baseTitle) return undefined;
  return baseTitle.replace(/\bCbct\b/i, "CBCT").replace(/\b3d\b/i, "3D");
}

function normalizeSemanticIntent(path?: string, label?: string): SemanticIntent {
  if (!path || !path.startsWith("/treatments/")) return "next_step";
  if (semanticRouteMap[path]) return semanticRouteMap[path];

  const lowerPath = path.toLowerCase();
  const lowerLabel = (label ?? "").toLowerCase();

  if (planningKeywords.some((keyword) => lowerPath.includes(keyword))) return "planning";
  if (maintenanceKeywords.some((keyword) => lowerPath.includes(keyword) || lowerLabel.includes(keyword))) return "maintenance";
  if (forbiddenRelationWords.some((keyword) => new RegExp(`\\b${keyword}\\b`, "i").test(label ?? ""))) return "alternative";

  return "next_step";
}

function buildSemanticLabel(intent: SemanticIntent, destinationTitle?: string, fallback?: string) {
  const target = destinationTitle ?? fallback ?? "related care";

  switch (intent) {
    case "planning":
      return target.toLowerCase().startsWith("planning & assessment")
        ? target
        : `Planning & assessment: ${target}`;
    case "maintenance":
      return target.toLowerCase().startsWith("maintenance & protection")
        ? target
        : `Maintenance & protection: ${target}`;
    case "alternative":
      return /^consider alternatives?/i.test(target) ? target : `Consider alternatives like ${target}`;
    default:
      return destinationTitle ?? fallback ?? target;
  }
}

function buildTreatmentTitleMap() {
  const map = new Map<string, string>();
  const pages = (machineManifest as { pages?: Record<string, { path?: string; label?: string; title?: string }> }).pages ?? {};

  Object.values(pages).forEach((page) => {
    if (!page?.path || !page.path.startsWith("/treatments/")) return;
    const title = page.label ?? page.title;
    if (title) {
      map.set(page.path, title);
    }
  });

  const treatments = (machineManifest as { treatments?: Record<string, { path?: string; label?: string; title?: string }> })
    .treatments;
  if (treatments) {
    Object.values(treatments).forEach((entry) => {
      if (!entry?.path || !entry.path.startsWith("/treatments/")) return;
      const title = entry.label ?? entry.title;
      if (title) {
        map.set(entry.path, title);
      }
    });
  }

  return map;
}

const treatmentTitleMap = buildTreatmentTitleMap();

export function destinationTitleForPath(path?: string): string | undefined {
  if (!path) return undefined;
  const normalizedHref = normalizeHrefPath(path);
  if (!normalizedHref?.startsWith("/treatments/")) return undefined;

  const { resolvedPath } = resolveTreatmentPathAlias(normalizedHref);
  const manifestPath = resolvedPath ?? normalizedHref;
  const manifestTitle = treatmentTitleMap.get(manifestPath);
  if (manifestTitle) return manifestTitle;

  const slug = manifestPath.split("/").filter(Boolean).pop();
  return slugToTitle(slug);
}

function normalizeText(value?: string) {
  return value?.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function containsForbiddenRelationWord(label?: string) {
  if (!label) return false;
  return forbiddenRelationWords.some((word) => new RegExp(`\\b${word}\\b`, "i").test(label));
}

export type LabelTruthRewrite = { before?: string; after: string; href?: string };

export interface CtaLabelTruthAudit {
  scanned: number;
  rewritten: number;
  rewrites: LabelTruthRewrite[];
  ambiguous: { label?: string; href?: string }[];
}

const audit: CtaLabelTruthAudit = { scanned: 0, rewritten: 0, rewrites: [], ambiguous: [] };

export function resetCtaLabelTruthAudit() {
  audit.scanned = 0;
  audit.rewritten = 0;
  audit.rewrites = [];
  audit.ambiguous = [];
}

export function getCtaLabelTruthAudit(): CtaLabelTruthAudit {
  return {
    scanned: audit.scanned,
    rewritten: audit.rewritten,
    rewrites: [...audit.rewrites],
    ambiguous: [...audit.ambiguous],
  };
}

export function enforceCtaLabelTruth<CTA extends { label: string; href: string; variant?: string }>(
  ctas: CTA[],
): CTA[] {
  return ctas.map((cta) => {
    audit.scanned += 1;
    const normalizedHref = normalizeHrefPath(cta.href);
    const destinationTitle = destinationTitleForPath(normalizedHref ?? cta.href);
    const slugTitle = normalizedHref?.startsWith("/treatments/")
      ? slugToSemanticTitle(normalizedHref.split("/").filter(Boolean).pop())
      : undefined;
    const semanticIntent = normalizeSemanticIntent(normalizedHref, cta.label);

    if (!destinationTitle && normalizedHref?.startsWith("/treatments/")) {
      audit.ambiguous.push({ label: cta.label, href: cta.href });
    }

    if (!normalizedHref?.startsWith("/treatments/")) return cta;

    const normalizedLabel = normalizeText(cta.label);
    const normalizedDestination = normalizeText(destinationTitle);
    const hasForbiddenWord = containsForbiddenRelationWord(cta.label);
    const fallbackTitle = destinationTitle ?? slugTitle ?? cta.label;
    const semanticLabel = buildSemanticLabel(semanticIntent, destinationTitle, fallbackTitle);

    const nextLabel =
      semanticIntent === "next_step" && !hasForbiddenWord && normalizedLabel === normalizedDestination
        ? cta.label
        : semanticLabel;

    if (nextLabel !== cta.label) {
      audit.rewritten += 1;
      audit.rewrites.push({ before: cta.label, after: nextLabel, href: normalizedHref ?? cta.href });
      return { ...cta, label: nextLabel } satisfies CTA;
    }

    return cta;
  });
}
