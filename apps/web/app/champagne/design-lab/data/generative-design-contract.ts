export type GenerationDomain = "webpage" | "concierge";
export type GenerationMode = "COMPLETELY_NEW" | "MORE_LIKE_THIS" | "CHANGE_ONE_THING" | "REMIX" | "REFERENCE_LED" | "SURPRISE_ME" | "NONE_OF_THESE";
export type ProposalDecision = "love" | "keep" | "maybe" | "reject";
export type ProposalAffinity = "DNA_ALIGNED" | "EXPLORATORY_OUTLIER";

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
  mode: GenerationMode;
  title: string;
  rationale: string;
  affinity: ProposalAffinity;
  family: "aperture" | "folio" | "luminous" | "monolith";
  references: string[];
  responsiveIntent: string;
  accessibilityIntent: string;
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

export function generateProposalSet(input: { sequence: number; domain: GenerationDomain; scope: string; semanticOwner: string; mode: GenerationMode; parentId?: string | null; references?: string[] }): DesignProposal[] {
  const setId = `r49-${input.domain}-${input.sequence}`;
  return families.map((family, index) => ({
    ...family,
    id: `${setId}-${String(index + 1).padStart(2, "0")}`,
    setId,
    parentId: input.parentId ?? null,
    domain: input.domain,
    scope: input.scope,
    semanticOwner: input.semanticOwner,
    mode: input.mode,
    references: input.references ?? [],
    responsiveIntent: "Independent compositions at 1440, 1024, 768 and 390 CSS pixels.",
    accessibilityIntent: "Keyboard operable, visible focus, reduced-motion safe, readable contrast and semantic labels.",
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
  founderDesignDNA: { schema: "champagne.atelier.founder-design-dna.v1"; status: "LAB_WORKING_MODEL"; positiveSignals: string[]; openQuestions: string[]; explicitInputOnly: true; productionBinding: false };
  weosHandoff: { schema: "champagne.weos.design-generation-handoff.proposal.v1"; status: "FUTURE_CONTRACT_ONLY"; liveRuntime: false };
  generationDisclosure: "DETERMINISTIC_CODE_NATIVE_PROPOSALS_NOT_AI";
  productionBinding: false;
};
