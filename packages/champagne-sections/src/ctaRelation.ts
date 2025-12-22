import { resolveCTAList, type ChampagneCTAConfig } from "@champagne/cta";
import { getTreatmentPages, resolveTreatmentPathAlias } from "@champagne/manifests/src/helpers";

export type CTARelationship =
  | "prerequisite"
  | "next_step"
  | "alternative"
  | "maintenance"
  | "reassurance"
  | "escalation";

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

const treatmentPages = getTreatmentPages();
const treatmentPathLookup = new Map(treatmentPages.map((page) => [page.path, page]));

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
      const treatment = treatmentPathLookup.get(path);
      return treatment?.label ?? path.split("/").pop()?.replace(/[-_]/g, " ");
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
}: {
  href?: string;
  relationshipHint?: CTARelationship;
  label?: string;
}): { relationship: CTARelationship; normalizedHref?: string } {
  if (relationshipHint) {
    const { normalizedHref } = normalizeTreatmentHref(href);
    return { relationship: relationshipHint, normalizedHref };
  }

  const { normalizedHref } = normalizeTreatmentHref(href);
  const path = typeof normalizedHref === "string" ? normalizedHref : typeof href === "string" ? href : "";
  const lowerPath = path.toLowerCase();
  const lowerLabel = label?.toLowerCase();

  if (imagingKeywords.some((keyword) => lowerPath.includes(keyword))) {
    return { relationship: "prerequisite", normalizedHref };
  }

  if (maintenanceKeywords.some((keyword) => lowerPath.includes(keyword) || (lowerLabel ?? "").includes(keyword))) {
    return { relationship: "maintenance", normalizedHref };
  }

  if (lowerLabel?.includes("alternative")) {
    return { relationship: "alternative", normalizedHref };
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
      return subject.toLowerCase().includes("alternative") ? subject : `Alternative option: ${subject}`;
    case "reassurance":
      return `Questions about ${subject}?`;
    case "escalation":
      return `Urgent help: ${subject}`;
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
}: {
  href?: string;
  label?: string;
  relationshipHint?: CTARelationship;
  defaultVariant?: ChampagneCTAConfig["variant"];
}): NormalizedCTARelation {
  const { relationship, normalizedHref } = inferRelationshipType({ href, relationshipHint, label });
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
      reassurance: 0,
      escalation: 0,
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
    const relation = normalizeCtaRelation({ href: cta.href, label: cta.label, defaultVariant: cta.variant });
    updateRelationAudit(audit, relation);
    return { ...cta, label: relation.label } satisfies ChampagneCTAConfig;
  });

  const resolved = resolveCTAList(normalized, options.defaultVariant, {
    component: options.component,
    page: options.page,
  });

  return { ctas: resolved, audit };
}
