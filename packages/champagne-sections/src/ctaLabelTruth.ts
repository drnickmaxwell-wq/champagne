import machineManifest from "@champagne/manifests/data/champagne_machine_manifest_full.json";
import { resolveTreatmentPathAlias } from "@champagne/manifests/src/helpers";

const forbiddenRelationWords = ["alternative", "alternatives", "instead", "compare", "options"];

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

    if (!destinationTitle || !normalizedHref?.startsWith("/treatments/")) {
      if (!destinationTitle && normalizedHref?.startsWith("/treatments/")) {
        audit.ambiguous.push({ label: cta.label, href: cta.href });
      }
      return cta;
    }

    const normalizedLabel = normalizeText(cta.label);
    const normalizedDestination = normalizeText(destinationTitle);
    const hasForbiddenWord = containsForbiddenRelationWord(cta.label);
    const labelDiffers = normalizedLabel !== normalizedDestination;

    if (labelDiffers || hasForbiddenWord) {
      audit.rewritten += 1;
      audit.rewrites.push({ before: cta.label, after: destinationTitle, href: normalizedHref ?? cta.href });
      return { ...cta, label: destinationTitle } satisfies CTA;
    }

    return cta;
  });
}
