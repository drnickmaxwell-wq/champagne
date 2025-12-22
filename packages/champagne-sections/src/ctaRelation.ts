import { resolveCTAList, type ChampagneCTAConfig, type ChampagneCTARelationship } from "@champagne/cta";
import { getTreatmentPages, resolveTreatmentPathAlias } from "@champagne/manifests/src/helpers";
import { destinationTitleForPath } from "./ctaLabelTruth";

export type CTARelationship = ChampagneCTARelationship;

export interface CTARelationAudit {
  scanned: number;
  rewrites: Record<CTARelationship, number>;
  alternativeLabelBans: number;
}

export interface NormalizedCTARelation {
  relationship: CTARelationship;
  label: string;
  targetLabel?: string;
  rewritten: boolean;
  alternativeLabelBanned: boolean;
  normalizedHref?: string;
}

const staticRouteLabelMap: Record<string, string> = {
  "/contact": "Contact",
  "/treatments": "Treatments",
  "/patient-portal": "Patient portal",
  "/practice-plan": "Practice Plan",
  "/video-consultation": "Video Consultation",
  "/finance": "Finance",
  "/smile-gallery": "Smile Gallery",
  "/team": "Team",
  "/blog": "Blog",
  "/dental-checkups-oral-cancer-screening": "Dental Check-Ups & Oral Cancer Screening",
};

const imagingKeywords = [
  "cbct",
  "3d-scanning",
  "3d-scans",
  "3d-scan",
  "scanning",
  "imaging",
  "cone-beam",
  "planning",
  "assessment",
  "diagnostic",
  "ct-scan",
];

const maintenanceKeywords = [
  "aftercare",
  "after-care",
  "hygiene",
  "maintenance",
  "checkup",
  "check-up",
  "top-up",
  "top-ups",
  "topup",
  "night-guards",
  "occlusal-splints",
  "retainer",
  "retain",
  "clean",
  "home-teeth-whitening",
  "whitening-top-ups",
  "gum-care",
];

function normalizeTreatmentHref(href?: string): { normalizedHref?: string; wasAlias: boolean } {
  if (!href || typeof href !== "string" || !href.startsWith("/treatments/")) {
    return { normalizedHref: href, wasAlias: false };
  }

  const { resolvedPath, wasAlias } = resolveTreatmentPathAlias(href);
  return { normalizedHref: resolvedPath ?? href, wasAlias };
}

export function labelFromHref(href?: string): string | undefined {
  if (!href) return undefined;
  try {
    const parsed = new URL(href, "https://champagne.local");
    const path = parsed.pathname;
    const intent = parsed.searchParams.get("intent");

    if (path.startsWith("/treatments/")) {
      const treatmentTitle = destinationTitleForPath(path);
      return treatmentTitle ?? path.split("/").pop()?.replace(/[-_]/g, " ");
    }

    if (path === "/patient-portal" && intent) {
      switch (intent) {
        case "video":
          return "Video consultation";
        case "finance":
          return "Finance";
        case "upload":
          return "Secure upload";
        case "login":
          return "Patient portal";
        default:
          break;
      }
    }

    const staticLabel = staticRouteLabelMap[path];
    if (staticLabel) return staticLabel;

    return undefined;
  } catch {
    return undefined;
  }
}

function inferRelationshipType({
  href,
  relationshipHint,
  label,
  pagePath,
}: {
  href?: string;
  relationshipHint?: CTARelationship;
  label?: string;
  pagePath?: string;
}): { relationship: CTARelationship; normalizedHref?: string } {
  const { normalizedHref } = normalizeTreatmentHref(href);

  if (relationshipHint) {
    return { relationship: relationshipHint, normalizedHref };
  }

  const path = typeof normalizedHref === "string" ? normalizedHref : typeof href === "string" ? href : "";
  const lowerPath = path.toLowerCase();
  const lowerLabel = label?.toLowerCase();

  if (path === "/contact") {
    return { relationship: "book", normalizedHref: path };
  }

  if (pagePath?.includes("implant") && path === "/treatments/cbct-3d-scanning") {
    return { relationship: "prerequisite", normalizedHref: path };
  }

  if (imagingKeywords.some((keyword) => lowerPath.includes(keyword))) {
    return { relationship: "prerequisite", normalizedHref };
  }

  if (maintenanceKeywords.some((keyword) => lowerPath.includes(keyword) || (lowerLabel ?? "").includes(keyword))) {
    return { relationship: "maintenance", normalizedHref };
  }

  if (lowerLabel?.includes("alternative")) {
    return { relationship: "alternative", normalizedHref };
  }

  if (lowerLabel?.includes("related")) {
    return { relationship: "related", normalizedHref };
  }

  return { relationship: "next_step", normalizedHref };
}

function templateLabel(relationship: CTARelationship, targetLabel?: string, fallbackLabel?: string) {
  const subject = targetLabel ?? fallbackLabel ?? "related care";
  switch (relationship) {
    case "prerequisite":
      return `Planning & assessment: ${subject}`;
    case "maintenance":
      return `Maintenance & protection: ${subject}`;
    case "alternative":
      return subject.toLowerCase().includes("alternative") ? subject : `Consider alternatives: ${subject}`;
    case "related":
      return subject.toLowerCase().includes("related") ? subject : `Related: ${subject}`;
    case "book":
      return subject.toLowerCase().startsWith("book") ? subject : `Book ${subject.toLowerCase() === "contact" ? "a consultation" : subject}`;
    default:
      return fallbackLabel ?? subject;
  }
}

function detectAlternativeBan(label?: string) {
  if (!label) return false;
  return /consider alternatives?/i.test(label);
}

export function normalizeCtaRelation({
  href,
  label,
  relationshipHint,
  defaultVariant,
  pagePath,
}: {
  href?: string;
  label?: string;
  relationshipHint?: CTARelationship;
  defaultVariant?: ChampagneCTAConfig["variant"];
  pagePath?: string;
}): NormalizedCTARelation {
  const { relationship, normalizedHref } = inferRelationshipType({ href, relationshipHint, label, pagePath });
  const targetLabel = labelFromHref(normalizedHref ?? href);
  const baseLabel = label ?? targetLabel ?? (defaultVariant === "primary" ? "Book now" : "Learn more");
  const alternativeLabelBanned = detectAlternativeBan(label) && relationship !== "alternative";

  let nextLabel = label ?? baseLabel;
  let rewritten = false;

  if (relationship !== "next_step") {
    const templated = templateLabel(relationship, targetLabel, baseLabel);
    if (templated && templated !== nextLabel) {
      nextLabel = templated;
      rewritten = true;
    }
  }

  if (alternativeLabelBanned) {
    const revised = templateLabel(relationship, targetLabel, baseLabel);
    if (revised && revised !== nextLabel) {
      nextLabel = revised;
    }
    rewritten = true;
  }

  return {
    relationship,
    label: nextLabel,
    targetLabel,
    rewritten,
    alternativeLabelBanned,
    normalizedHref,
  };
}

export function createRelationAudit(): CTARelationAudit {
  return {
    scanned: 0,
    rewrites: {
      prerequisite: 0,
      next_step: 0,
      alternative: 0,
      maintenance: 0,
      related: 0,
      book: 0,
    },
    alternativeLabelBans: 0,
  };
}

export function updateRelationAudit(audit: CTARelationAudit, result: NormalizedCTARelation) {
  audit.scanned += 1;
  if (result.rewritten) {
    audit.rewrites[result.relationship] += 1;
  }
  if (result.alternativeLabelBanned) {
    audit.alternativeLabelBans += 1;
  }
}

export function resolveWithRelationLabels(
  ctas: ChampagneCTAConfig[],
  options: { defaultVariant: ChampagneCTAConfig["variant"]; component: string; page?: string },
): { ctas: ChampagneCTAConfig[]; audit: CTARelationAudit } {
  const audit = createRelationAudit();
  const normalized = ctas.map((cta) => {
    const relation = normalizeCtaRelation({
      href: cta.href,
      label: cta.label,
      defaultVariant: cta.variant,
      pagePath: options.page,
    });
    updateRelationAudit(audit, relation);
    return { ...cta, label: relation.label, relationship: relation.relationship } satisfies ChampagneCTAConfig;
  });

  const resolved = resolveCTAList(normalized, options.defaultVariant, {
    component: options.component,
    page: options.page,
  });

  return { ctas: resolved, audit };
}

export interface CTAContractAudit {
  scanned: number;
  dropped: { label?: string; href?: string; reason: string }[];
  selfLinks: { label?: string; href?: string }[];
  invalidTargets: { label?: string; href?: string; reason: string }[];
  labelMismatches: { href?: string; expected?: string; received?: string }[];
  alternativeMismatches: { href?: string; label?: string; relationship: CTARelationship }[];
  duplicates: number;
}

const treatmentPaths = new Set(getTreatmentPages().map((page) => page.path));
const allowedStaticRoutes = new Set([
  "/contact",
  "/treatments",
  "/patient-portal",
  "/practice-plan",
  "/video-consultation",
  "/finance",
  "/smile-gallery",
  "/team",
  "/blog",
  "/dental-checkups-oral-cancer-screening",
]);
const allowedPortalIntents = new Set(["login", "upload", "finance", "video"]);

function normalizeHrefPath(href?: string) {
  if (!href) return undefined;
  try {
    const parsed = new URL(href, "https://champagne.local");
    const path = parsed.pathname;
    const search = parsed.search ?? "";
    return `${path}${search}`;
  } catch {
    return href;
  }
}

function validateHrefForContract(href: string): { valid: boolean; reason?: string } {
  if (!href.startsWith("/")) {
    return { valid: false, reason: "href must start with /" };
  }

  if (href.startsWith("/book")) {
    return { valid: false, reason: "booking routes are disallowed" };
  }

  let parsed: URL;
  try {
    parsed = new URL(href, "https://champagne.local");
  } catch {
    return { valid: false, reason: "unparseable href" };
  }

  const path = parsed.pathname;
  const normalized = parsed.search ? `${path}${parsed.search}` : path;

  if (path === "/patient-portal") {
    const intent = parsed.searchParams.get("intent");
    if (!intent || allowedPortalIntents.has(intent)) {
      return { valid: true };
    }
    return { valid: false, reason: "portal intent not allowed" };
  }

  if (allowedStaticRoutes.has(path) || allowedStaticRoutes.has(normalized)) {
    return { valid: true };
  }

  if (!path.startsWith("/treatments/")) {
    return { valid: false, reason: "not a registered route" };
  }

  const { resolvedPath } = resolveTreatmentPathAlias(path);
  if (treatmentPaths.has(resolvedPath)) {
    return { valid: true };
  }

  return { valid: false, reason: "missing treatment registry match" };
}

function normalizeLabelForDedupe(label?: string) {
  return label?.toLowerCase().trim();
}

export function enforceCTAContract(
  ctas: ChampagneCTAConfig[],
  options: { pagePath?: string; seenDestinations?: Set<string> } = {},
): { ctas: ChampagneCTAConfig[]; audit: CTAContractAudit } {
  const audit: CTAContractAudit = {
    scanned: 0,
    dropped: [],
    selfLinks: [],
    invalidTargets: [],
    labelMismatches: [],
    alternativeMismatches: [],
    duplicates: 0,
  };

  const seen = options.seenDestinations ?? new Set<string>();
  const sanitized: ChampagneCTAConfig[] = [];

  ctas.forEach((cta) => {
    audit.scanned += 1;
    const normalizedHref = normalizeHrefPath(cta.href);
    const validation = normalizedHref ? validateHrefForContract(normalizedHref) : { valid: false, reason: "missing href" };

    if (options.pagePath && normalizedHref === options.pagePath) {
      audit.selfLinks.push({ label: cta.label, href: normalizedHref });
      audit.dropped.push({ label: cta.label, href: normalizedHref, reason: "self-link" });
      return;
    }

    if (!validation.valid || !normalizedHref) {
      audit.invalidTargets.push({ label: cta.label, href: normalizedHref ?? cta.href, reason: validation.reason ?? "invalid" });
      audit.dropped.push({ label: cta.label, href: normalizedHref ?? cta.href, reason: validation.reason ?? "invalid" });
      return;
    }

    const dedupeKey = `${normalizedHref}::${normalizeLabelForDedupe(cta.label) ?? ""}`;
    if (seen.has(dedupeKey)) {
      audit.duplicates += 1;
      return;
    }

    const relation = normalizeCtaRelation({
      href: normalizedHref,
      label: cta.label,
      relationshipHint: cta.relationship,
      defaultVariant: cta.variant,
      pagePath: options.pagePath,
    });
    const targetTitle = destinationTitleForPath(normalizedHref);
    const canonicalLabel = targetTitle
      ? relation.relationship === "next_step"
        ? targetTitle
        : templateLabel(relation.relationship, targetTitle, relation.label)
      : relation.label;

    if (relation.relationship !== "alternative" && /alternatives?/i.test(cta.label ?? "")) {
      audit.alternativeMismatches.push({
        href: normalizedHref,
        label: cta.label,
        relationship: relation.relationship,
      });
    }

    const resolvedCTA: ChampagneCTAConfig = {
      ...cta,
      href: normalizedHref,
      label: canonicalLabel ?? relation.label ?? cta.label,
      relationship: relation.relationship,
    };

    sanitized.push(resolvedCTA);
    seen.add(dedupeKey);
  });

  return { ctas: sanitized, audit };
}
