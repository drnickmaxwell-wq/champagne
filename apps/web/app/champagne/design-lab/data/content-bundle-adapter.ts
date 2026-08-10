export type AtelierPageKey = "home" | "implants" | "bonding";
import { HOME_CONTENT_BUNDLE_V1 } from "./home-content-bundle";
import implantBundle from "./authority/CHAMPAGNE_IMPLANTS_CONTENT_BUNDLE_V1_1.json";
export type MaterialRole = "persian" | "porcelain" | "luminous";
export type ContentCapability = "proof" | "media" | "threeD";

export type AtelierContentSection = {
  id: string;
  label: string;
  job: string;
  title: string;
  copy: string;
  tone: MaterialRole;
  locked?: boolean;
  capabilityGate?: ContentCapability;
  mediaSlot?: string;
  modelSlot?: string;
  conciergeTopic: string;
  searchIntent: string;
  contentState: "LAB_SEED_COPY" | "CONTENT_BUNDLE_V1_FACT_BLOCKED" | "GOVERNED_CONTENT_CLINICAL_AND_FACT_BLOCKED";
  shortCopy?: string;
  extendedCopy?: string;
  pathways?: { label: string; description: string; href: string }[];
  steps?: { label: string; copy: string }[];
  faqs?: { question: string; answer: string }[];
  ctas?: { label: string; href: string; type: string }[];
  contentMediaSlotIds?: string[];
  reviewState?: string;
  answerObjectIds?: string[];
  sourceGroupIds?: string[];
  claimIds?: string[];
  approvalRequirements?: string[];
  capabilityOffBehavior?: string;
  componentCards?: { label: string; copy: string; answerObjectId: string }[];
  transcript?: string;
  governance?: {
    bundleId: string;
    bundleContentHash: string;
    sourceFileHash: string;
    sectionContentHash: string;
    publicationMaturity: "BLOCKED";
    clinicalMaturity: string;
    factMaturity: string;
  };
};

export type AtelierContentPage = {
  pageId: AtelierPageKey;
  route: "/" | "/treatments/implants" | "/treatments/composite-bonding";
  name: string;
  primaryQuestion: string;
  bundleStatus: "AWAITING_CHAMPAGNE_CONTENT_BUNDLE_V1" | "FACT_BLOCKED" | "CLINICAL_AND_FACT_BLOCKED";
  contentVersion: "CONTENT_SEARCH_ORIENTATION_V1" | "1.0.0-draft.1";
  sections: AtelierContentSection[];
};

type ImplantBundleSection = (typeof implantBundle.sections)[number] & {
  enabled: true;
  eyebrow: string;
  heading: string;
  visibleCopy: { standard: string; short?: string; transcript?: string };
  conciergeProjection: { topicId: string };
};
const IMPLANT_TONES: Record<string, MaterialRole> = {
  "implants.hero": "persian",
  "implants.direct-answer": "porcelain",
  "implants.components-3d": "luminous",
  "implants.assessment-factors": "porcelain",
  "implants.planning": "persian",
  "implants.stages": "porcelain",
  "implants.options-comparison": "persian",
  "implants.benefits-risks": "porcelain",
  "implants.cost": "porcelain",
  "implants.clinician": "persian",
  "implants.aftercare": "persian",
  "implants.faq-sources": "persian",
  "implants.next-step": "porcelain",
};

const implantSection = (source: ImplantBundleSection): AtelierContentSection => ({
  id: source.sectionId,
  label: source.eyebrow,
  job: source.job,
  title: source.heading,
  copy: source.visibleCopy.standard,
  shortCopy: "short" in source.visibleCopy ? source.visibleCopy.short : undefined,
  tone: IMPLANT_TONES[source.sectionId] ?? "porcelain",
  locked: false,
  capabilityGate: undefined,
  mediaSlot: source.sectionId === "implants.components-3d" ? "IMPLANT_COMPONENTS_STATIC_V1" : source.mediaPurpose ? `MEDIA.${source.sectionId.toUpperCase().replaceAll(".", ".")}` : undefined,
  modelSlot: source.sectionId === "implants.components-3d" ? "CD3D-IMPLANT-EDU-V1" : undefined,
  conciergeTopic: source.conciergeProjection.topicId,
  searchIntent: source.searchIntent.join(" · "),
  contentState: "GOVERNED_CONTENT_CLINICAL_AND_FACT_BLOCKED",
  ctas: "ctas" in source ? source.ctas : undefined,
  faqs: "faqs" in source ? source.faqs : undefined,
  componentCards: "componentCards" in source && Array.isArray(source.componentCards) ? source.componentCards.map(({ label, copy, answerObjectId }) => ({ label, copy, answerObjectId })) : undefined,
  transcript: "transcript" in source.visibleCopy ? source.visibleCopy.transcript : undefined,
  answerObjectIds: source.answerObjectIds,
  sourceGroupIds: source.sourceGroupIds,
  claimIds: source.claimIds,
  reviewState: source.claimState,
  approvalRequirements: source.approvalRequirements,
  capabilityOffBehavior: source.capabilityOffBehavior,
  contentMediaSlotIds: implantBundle.mediaSlots.filter((slot) => slot.sectionId === source.sectionId).map((slot) => slot.mediaSlotId),
  governance: {
    bundleId: implantBundle.bundleId,
    bundleContentHash: implantBundle.provenance.contentHash,
    sourceFileHash: "sha256:45d25648a97b5da1719026756d36ec8e8dcde0c9fba03aad470e75777eb8f33e",
    sectionContentHash: source.contentHash,
    publicationMaturity: "BLOCKED",
    clinicalMaturity: source.claimState,
    factMaturity: implantBundle.status,
  },
});

export const IMPLANT_GOVERNED_SECTIONS = implantBundle.sections.filter((source) => source.enabled).map((source) => implantSection(source as ImplantBundleSection));

export const LAB_CAPABILITIES: Record<ContentCapability, boolean> = {
  proof: false,
  media: false,
  threeD: false,
};

const section = (
  id: string,
  label: string,
  job: string,
  title: string,
  copy: string,
  tone: MaterialRole,
  extra: Partial<AtelierContentSection> = {},
): AtelierContentSection => ({
  id,
  label,
  job,
  title,
  copy,
  tone,
  conciergeTopic: id,
  searchIntent: job,
  contentState: "LAB_SEED_COPY",
  ...extra,
});

export const ATELIER_CONTENT_PAGES: Record<AtelierPageKey, AtelierContentPage> = {
  home: {
    pageId: "home",
    route: "/",
    name: "Homepage",
    primaryQuestion: "Is this the right practice for me?",
    bundleStatus: "FACT_BLOCKED",
    contentVersion: "1.0.0-draft.1",
    sections: HOME_CONTENT_BUNDLE_V1,
    /* Legacy seeds remain below as inert source history during R4.4 extraction.
    sections: [
      section("home.hero.v2", "Hero V2", "Orient and invite", "Hero V2", "Protected canonical opening.", "persian", { locked: true }),
      section("home.practice.answer", "The practice, clearly", "Answer what kind of practice this is", "Dentistry considered around you.", "A concise practice answer will arrive from the approved content bundle.", "porcelain"),
      section("home.patient.pathways", "Patient pathways", "Route by patient need", "Begin with what matters to you.", "Need-led routes replace a treatment catalogue and will point only to live canonical pages.", "porcelain"),
      section("home.complex-care", "Complex care", "Explain coordinated care", "When care needs a wider view.", "A calm explanation of coordinated planning without promises or invented suitability.", "persian"),
      section("home.care-process", "How care unfolds", "Reduce uncertainty", "Understand. Assess. Choose together.", "A clear care journey from understanding through review, using only approved actions.", "porcelain"),
      section("home.founder-authority", "Founder authority", "Establish accountable expertise", "A Founder’s standard, made personal.", "Verified role, qualifications and care focus will project from the governed content bundle.", "persian", { mediaSlot: "FOUNDER_ENVIRONMENTAL_V1" }),
      section("home.team-continuity", "Team continuity", "Show continuity of care", "Familiar faces. Joined-up care.", "The current team model remains separate from Founder authority and awaits roster truth.", "porcelain", { mediaSlot: "TEAM_GROUP_V1" }),
      section("home.technology-purpose", "Technology with purpose", "Explain technology through patient value", "Technology that makes choices clearer.", "Verified capabilities will be shown through their purpose, never as novelty theatre.", "luminous", { mediaSlot: "DIGITAL_PLANNING_V1" }),
      section("home.heritage-story", "St Mary’s House", "Establish place and continuity", "Modern dentistry in a place with a story.", "The heritage chapter is static-first and awaits sourced building and practice facts.", "persian", { mediaSlot: "PRACTICE_EXTERIOR_V1" }),
      section("home.proof", "Evidence and patient voice", "Show governed proof", "Real evidence, when it is ready.", "This chapter remains hidden until consented cases or reviews are provenance-complete.", "porcelain", { capabilityGate: "proof" }),
      section("home.visit", "Visit St Mary’s House", "Make the local next step practical", "A distinctive practice in Shoreham-by-Sea.", "A concise projection of verified location, hours and access truth will link to Contact.", "porcelain", { mediaSlot: "PRACTICE_EXTERIOR_V1" }),
      section("home.focused-faq", "Focused questions", "Answer practice-selection questions", "A few useful answers before you visit.", "Only questions owned by Home will appear here; treatment questions remain with their pages.", "porcelain"),
      section("home.closing-invitation", "Closing invitation", "Offer a proportionate next action", "Exceptional care. Enduring confidence.", "A calm, capability-aware invitation and architectural closing study.", "persian"),
    ], */
  },
  implants: {
    pageId: "implants",
    route: "/treatments/implants",
    name: "Dental Implants",
    primaryQuestion: "What are implants, and might they be an option?",
    bundleStatus: "CLINICAL_AND_FACT_BLOCKED",
    contentVersion: "1.0.0-draft.1",
    sections: IMPLANT_GOVERNED_SECTIONS,
  },
  bonding: {
    pageId: "bonding",
    route: "/treatments/composite-bonding",
    name: "Composite Bonding",
    primaryQuestion: "What can composite bonding change, and what are its limits?",
    bundleStatus: "AWAITING_CHAMPAGNE_CONTENT_BUNDLE_V1",
    contentVersion: "CONTENT_SEARCH_ORIENTATION_V1",
    sections: [
      section("bonding.hero", "Bonding Hero V2", "Establish the decision", "Composite bonding", "Protected treatment opening.", "persian", { locked: true }),
      section("bonding.direct-answer", "A direct answer", "Define composite bonding", "What is composite bonding?", "A concise definition will arrive with the clinically approved content bundle.", "porcelain"),
      section("bonding.scope-limits", "Scope and limits", "Say what it may and may not address", "What bonding may—and may not—change.", "This section protects against self-diagnosis and overpromising.", "persian"),
      section("bonding.assessment-planning", "Assessment and planning", "Explain examination and planning", "Planning around health, function and goals.", "Digital planning appears only when it is genuinely used and verified.", "porcelain", { mediaSlot: "DIGITAL_PLANNING_V1" }),
      section("bonding.comparison", "Compare alternatives", "Compare reasonable alternatives", "Bonding is one possible path.", "Whitening, contouring, orthodontics, veneers, restorations and no treatment are compared neutrally.", "porcelain"),
      section("bonding.process", "The process", "Explain the pathway", "Designed, refined and reviewed with you.", "The process remains general until visit count and technique claims are approved.", "luminous", { mediaSlot: "BONDING_POLISH_V1" }),
      section("bonding.materials-techniques", "Materials and technique", "Explain relevant material and technique choices", "A material shaped for a specific purpose.", "Layering or injection moulding appears only where offered and relevant.", "persian"),
      section("bonding.risks-maintenance", "Risks and maintenance", "Explain trade-offs", "Designed to be looked after.", "Chipping, staining, wear, repair and replacement require careful clinical wording.", "porcelain"),
      section("bonding.longevity", "Longevity truth", "Answer durability responsibly", "What affects how bonding lasts?", "No unsupported year range, guarantee or ‘reversible’ shorthand.", "porcelain"),
      section("bonding.cost", "Cost truth", "Explain fee logic", "What shapes the fee?", "Only verified fee logic; no finance and no value persuasion.", "persian"),
      section("bonding.authority-cases", "Expertise and cases", "Establish expertise and governed proof", "Experience first. Cases only when approved.", "Verified clinician authority remains visible while unapproved cases remain suppressed.", "porcelain", { mediaSlot: "FOUNDER_ENVIRONMENTAL_V1" }),
      section("bonding.faq-sources", "Questions and sources", "Own focused questions and evidence", "Clear questions. Reviewed answers.", "FAQ, source and schema projections must remain in exact parity.", "porcelain"),
      section("bonding.next-step", "A calm next step", "Offer a proportionate action", "Explore the right next conversation.", "A request or contact action only, without a suitability promise.", "persian"),
    ],
  },
};

export const visibleAtelierSections = (page: AtelierContentPage) =>
  page.sections.filter((item) => !item.capabilityGate || LAB_CAPABILITIES[item.capabilityGate]);

export const contentBundleAdapter = (bundle: AtelierContentPage) => ({
  schemaVersion: "CHAMPAGNE_CONTENT_BUNDLE_V1_ADAPTER_V1",
  authority: bundle.pageId === "home" ? "CHAMPAGNE_HOME_CONTENT_BUNDLE_V1" : "CHAMPAGNE_CONTENT_SEARCH_ORIENTATION_REPORT_V1",
  pageId: bundle.pageId,
  route: bundle.route,
  contentVersion: bundle.contentVersion,
  bundleStatus: bundle.bundleStatus,
  sections: bundle.sections,
});
