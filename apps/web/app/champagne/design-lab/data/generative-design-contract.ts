export type GenerationDomain = "webpage" | "concierge";
export type GenerationMode = "COMPLETELY_NEW" | "MORE_LIKE_THIS" | "CHANGE_ONE_THING" | "REMIX" | "REFERENCE_LED" | "SURPRISE_ME" | "NONE_OF_THESE";
export type ProposalDecision = "love" | "keep" | "maybe" | "reject";
export type ProposalAffinity = "DNA_ALIGNED" | "EXPLORATORY_OUTLIER";
export type DesignTrait = "composition" | "asymmetry" | "type-hierarchy" | "spacing-rhythm" | "interaction-model" | "media-geometry" | "motion" | "density" | "mobile-composition";
export type ReferenceKind = "screenshot" | "sketch" | "photograph" | "url-note" | "visual-archive-item" | "existing-proposal";
export type GenerationTargetKind = "page" | "section" | "component" | "concierge-surface";

export const GENERATION_SURFACES = {
  webpage: ["whole-page", "semantic-section", "component"],
  concierge: ["invitation", "shell", "answer", "source", "navigation", "3d-handoff", "human-handoff", "mobile", "closing"],
} as const;

export type DesignProposal = {
  id: string;
  setId: string;
  parentId: string | null;
  domain: GenerationDomain;
  scope: string;
  semanticOwner: string;
  targetKind: GenerationTargetKind;
  pageKey: "home" | "implants" | "bonding" | null;
  componentId: string | null;
  mode: GenerationMode;
  title: string;
  rationale: string;
  affinity: ProposalAffinity;
  family: "aperture" | "folio" | "luminous" | "monolith";
  references: string[];
  responsiveIntent: string;
  accessibilityIntent: string;
  inheritedTraits: DesignTrait[];
  changedDimension: DesignTrait | null;
  generationDistance: number;
  renderPayload: { family: DesignProposal["family"]; target: string; version: 1 };
  governance: "DESIGN_CANDIDATE_ALLOWED";
  label: "LAB_GENERATED_PROPOSAL";
  productionBinding: false;
};

const families: Array<Pick<DesignProposal, "title" | "rationale" | "affinity" | "family">> = [
  { title: "Architectural Aperture", rationale: "Measured thresholds and asymmetric fields extend Champagne's architectural calm.", affinity: "DNA_ALIGNED", family: "aperture" },
  { title: "Editorial Folio", rationale: "A disciplined evidence-led reading rhythm gives the content greater editorial authority.", affinity: "DNA_ALIGNED", family: "folio" },
  { title: "Luminous Field", rationale: "Controlled light and precise action geometry explore a more digital expression.", affinity: "EXPLORATORY_OUTLIER", family: "luminous" },
  { title: "Quiet Monolith", rationale: "One strong spatial gesture removes competing chrome and concentrates the decision.", affinity: "EXPLORATORY_OUTLIER", family: "monolith" },
];

const implantPageFamilies: Array<Pick<DesignProposal, "title" | "rationale" | "affinity" | "family">> = [
  { title: "Persian Architectural", rationale: "A deep architectural exhibition with monumental thresholds, restrained gilding and dramatic chapter transitions.", affinity: "DNA_ALIGNED", family: "aperture" },
  { title: "Architectural Editorial Hybrid", rationale: "Persian exhibition chapters and Porcelain reading chapters alternate to pace understanding and make the 3D moment singular.", affinity: "DNA_ALIGNED", family: "luminous" },
  { title: "Porcelain Editorial", rationale: "An exceptional light reading environment with folio margins, scientific clarity and selective dark interruptions.", affinity: "DNA_ALIGNED", family: "folio" },
  { title: "Mineral Gallery Promenade", rationale: "A museum-like vertical promenade uses an anchored chapter spine, offset compositions and one monumental exhibition plinth.", affinity: "EXPLORATORY_OUTLIER", family: "monolith" },
];

export function generateProposalSet(input: { sequence: number; domain: GenerationDomain; scope: string; semanticOwner: string; targetKind: GenerationTargetKind; pageKey?: DesignProposal["pageKey"]; componentId?: string | null; mode: GenerationMode; parentId?: string | null; references?: string[]; inheritedTraits?: DesignTrait[]; changedDimension?: DesignTrait | null; preferredFamily?: DesignProposal["family"] | null }): DesignProposal[] {
  const setId = `r49-${input.domain}-${input.sequence}`;
  const distance = input.mode === "NONE_OF_THESE" ? input.sequence : 0;
  const sourceFamilies = input.domain === "webpage" && input.targetKind === "page" && input.pageKey === "implants" ? implantPageFamilies : families;
  const rotated = distance ? [...sourceFamilies.slice(distance % sourceFamilies.length), ...sourceFamilies.slice(0, distance % sourceFamilies.length)] : sourceFamilies;
  const ordered = input.preferredFamily ? [...rotated.filter((item) => item.family === input.preferredFamily), ...rotated.filter((item) => item.family !== input.preferredFamily)] : rotated;
  return ordered.map((family, index) => ({
    ...family,
    id: `${setId}-${String(index + 1).padStart(2, "0")}`,
    setId,
    parentId: input.parentId ?? null,
    domain: input.domain,
    scope: input.scope,
    semanticOwner: input.semanticOwner,
    targetKind: input.targetKind,
    pageKey: input.pageKey ?? null,
    componentId: input.componentId ?? null,
    mode: input.mode,
    references: input.references ?? [],
    responsiveIntent: "Independent compositions at 1440, 1024, 768 and 390 CSS pixels.",
    accessibilityIntent: "Keyboard operable, visible focus, reduced-motion safe, readable contrast and semantic labels.",
    inheritedTraits: input.inheritedTraits ?? [],
    changedDimension: input.changedDimension ?? null,
    generationDistance: distance,
    renderPayload: { family: family.family, target: input.semanticOwner, version: 1 },
    governance: "DESIGN_CANDIDATE_ALLOWED",
    label: "LAB_GENERATED_PROPOSAL",
    productionBinding: false,
  }));
}

export type FounderDesignStudioState = {
  schema: "champagne.atelier.founder-design-studio.v1";
  proposals: DesignProposal[];
  decisions: Record<string, ProposalDecision>;
  selectedIds: string[];
  lineage: Array<{ proposalId: string; parentId: string | null; setId: string; mode: GenerationMode }>;
  founderDesignDNA: { schema: "champagne.atelier.founder-design-dna.v1"; status: "FOUNDER_WORKING_PREFERENCE_MODEL"; positiveSignals: string[]; ignoredDecisionIds: string[]; openQuestions: string[]; explicitInputOnly: true; productionBinding: false };
  weosHandoff: { schema: "champagne.weos.design-generation-handoff.proposal.v1"; status: "FUTURE_CONTRACT_ONLY"; liveRuntime: false };
  generationDisclosure: "DETERMINISTIC_CODE_NATIVE_PROPOSALS_NOT_AI";
  productionBinding: false;
};

export type FutureDesignWorkerRequest = {
  schema: "champagne.weos.design-worker.request.v1";
  founderIntent: string;
  semanticOwner: string;
  baselineProposalId: string | null;
  generationMode: GenerationMode;
  selectedInheritanceTraits: DesignTrait[];
  founderDesignDNA: FounderDesignStudioState["founderDesignDNA"];
  references: Array<{ kind: ReferenceKind; value: string; authority: "DESIGN_REFERENCE_ONLY" }>;
  governanceEnvelope: { accessibilityRequired: true; semanticAuthorityMutable: false; productionBinding: false };
  deviceTargets: readonly [1440, 1024, 768, 390];
};

export type FutureDesignWorkerResponse = { schema: "champagne.weos.design-worker.response.v1"; candidates: DesignProposal[]; lineage: FounderDesignStudioState["lineage"]; responsiveStatus: "PASS" | "REJECTED"; governanceStatus: "PASS" | "REJECTED"; renderPayloads: DesignProposal["renderPayload"][] };
