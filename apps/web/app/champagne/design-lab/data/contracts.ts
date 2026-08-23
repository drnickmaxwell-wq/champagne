export const PRODUCTION_BINDING = false as const;

export type CapabilityKey =
  | "cases"
  | "reviews"
  | "finance"
  | "film"
  | "threeD"
  | "media"
  | "access";

export type ConciergeAction =
  | `focus:${string}`
  | `comparison:${string}`
  | `evidence:${string}`
  | `media:${string}`
  | `3d:${string}`
  | `return:${string}`
  | "human:contact";

export type SemanticSection = {
  id: string;
  title: string;
  material: "porcelain" | "persian" | "luminous";
  evidenceIds: string[];
  mediaId?: string;
  modelId?: "CD3D-IMPLANT-EDU-V1";
  gate?: CapabilityKey;
  actions: ConciergeAction[];
  fallback: string;
};

export type ExemplarFlow = {
  id: string;
  slug: string;
  family: "home" | "implants" | "bonding";
  variant: "A" | "B";
  route: "/" | "/treatments/implants" | "/treatments/composite-bonding";
  headerId: string;
  footerIds: string[];
  sections: SemanticSection[];
  productionBinding: false;
};

export const DEFAULT_CAPABILITIES: Record<CapabilityKey, boolean> = {
  cases: false,
  reviews: false,
  finance: false,
  film: false,
  threeD: false,
  media: false,
  access: false,
};

export const NEW_CONCEPTS = [
  "CDC-HOME-TEAM-CONTINUITY-PERSIAN-V1",
  "CDC-IMPLANT-COST-TRUTH-V1",
  "CDC-BOND-TECHNIQUE-LAYERING-V1",
  "CDC-BOND-LONGEVITY-TRUTH-V1",
  "CDC-BOND-COST-TRUTH-V1",
] as const;
