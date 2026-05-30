export const PAGE_SURFACE_SCHEMA_VERSION = "PAGE_SURFACE_V1" as const;

export const PAGE_SURFACE_SUPPORTED_PAGE_FAMILIES = [
  "treatment",
  "concern",
  "comparison",
  "cost",
  "guide",
  "local",
  "trust_review",
  "clinician",
  "technology",
] as const;

export const PAGE_SURFACE_SUPPORTED_SECTION_KINDS = [
  "direct_answer",
  "clinical_reassurance",
  "comparison_table",
  "cost_fee_logic",
  "fee_grid",
  "faq",
  "related_treatments",
  "cta",
  "clinician_expertise",
  "local_shoreham_context",
  "evidence_review_metadata",
  "safety_limitations",
  "alternatives",
  "process",
  "aftercare",
  "review_status",
] as const;

export type PageSurfaceSchemaVersion = typeof PAGE_SURFACE_SCHEMA_VERSION;
export type PageSurfaceFamily = (typeof PAGE_SURFACE_SUPPORTED_PAGE_FAMILIES)[number];
export type PageSurfaceSectionKind = (typeof PAGE_SURFACE_SUPPORTED_SECTION_KINDS)[number];

export type PageSurfaceClinicalReviewStatus =
  | "framework_only"
  | "draft"
  | "ready_for_clinical_review"
  | "clinically_reviewed";

export interface PageSurfaceEntity {
  name: string;
  type?: string;
  route?: string;
  evidenceRequired?: boolean;
}

export interface PageSurfaceDirectAnswer {
  heading: string;
  answer: string;
  caveats?: string[];
}

export interface PageSurfaceSection {
  id: string;
  kind: PageSurfaceSectionKind;
  required: boolean;
  balanced?: boolean;
  evidenceRequired?: boolean;
  launchCritical?: boolean;
}

export interface PageSurfaceFaq {
  question: string;
  answer: string;
  evidenceRequired?: boolean;
}

export interface PageSurfaceSchemaRequirement {
  type: "WebPage" | "FAQPage" | "BreadcrumbList" | "Article" | "ProfilePage" | "Person" | "Review" | string;
  required: boolean;
  guardRequired?: boolean;
}

export interface PageSurfaceInternalLink {
  label: string;
  href: string;
  relationship?: "related" | "alternative" | "supporting" | "next_step" | "canonical_owner" | string;
}

export interface PageSurfaceCta {
  label: string;
  href: string;
  intent?: "consultation" | "contact" | "triage" | "download" | string;
}

export interface PageSurfaceClinicianExpertise {
  required: boolean;
  reviewerName?: string;
  reviewerRole?: string;
  evidenceRequired: boolean;
}

export interface PageSurfaceEvidenceReviewMetadata {
  evidenceSummaryRequired: boolean;
  fabricatedReviewsForbidden: boolean;
  unsupportedEvidenceForbidden: boolean;
  reviewSourceRequired?: boolean;
  lastReviewed?: string;
  nextReviewDue?: string;
}

export interface PageSurfaceLaunchBlocker {
  code: string;
  severity: "info" | "warning" | "critical";
  message: string;
}

export interface PageSurfaceV1 {
  schemaVersion: PageSurfaceSchemaVersion;
  pageFamily: PageSurfaceFamily;
  canonicalRoute: string;
  routeOwner: string;
  primaryEntity: PageSurfaceEntity;
  secondaryEntities: PageSurfaceEntity[];
  targetQueries: string[];
  targetIntent: string;
  localMarket: {
    primary: "Shoreham-by-Sea" | string;
    secondary?: string[];
    doorwayRisk?: "blocked" | "requires_evidence" | "not_applicable";
  };
  directAnswer: PageSurfaceDirectAnswer;
  sections: PageSurfaceSection[];
  faqs: PageSurfaceFaq[];
  schemaRequirements: PageSurfaceSchemaRequirement[];
  internalLinks: PageSurfaceInternalLink[];
  cta: PageSurfaceCta;
  clinicianExpertise: PageSurfaceClinicianExpertise;
  evidenceReviewMetadata: PageSurfaceEvidenceReviewMetadata;
  clinicalReviewStatus: PageSurfaceClinicalReviewStatus;
  forbiddenClaims: string[];
  launchBlockers: PageSurfaceLaunchBlocker[];
}
