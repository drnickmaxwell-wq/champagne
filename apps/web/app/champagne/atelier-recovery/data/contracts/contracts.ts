export const RECOVERY_VIEWPORTS = [1440, 1024, 768, 390] as const;
export const PRODUCTION_BINDING = false as const;
export const LEGACY_GENERIC_FALLBACK = false as const;
export const MISSING_COMPONENT_RESULT = "BRAND_COMPONENT_GAP" as const;

export type FounderSignal = "LOVE" | "LIKE" | "MAYBE" | "NOT_ME" | "UNRATED";
export type TraitDimension =
  | "colour"
  | "surface"
  | "composition"
  | "geometry"
  | "typography"
  | "spacing/density"
  | "image treatment"
  | "wave"
  | "luminosity"
  | "dark/light balance"
  | "human warmth"
  | "interaction"
  | "motion"
  | "mobile composition";

export type ComponentMaturity = "EXPERIMENTAL" | "FOUNDER_APPROVED" | "GOLDEN";
export type CandidateOperation =
  | "MORE_LIKE_THIS"
  | "LESS_LIKE_THIS"
  | "CHANGE_ONE_THING"
  | "REMIX"
  | "CREATE_NEW_CHAMPAGNE_COMPONENT";

export type RecoveryCapabilityState = {
  archiveCount: 331;
  exactImportedPreferenceCandidates: 38;
  reconstructedComponentCount: 0;
  reviewSystem: "COMING_NEXT_A1";
  componentReconstruction: "NOT_STARTED_A2";
  pageComposition: "NOT_AUTHORISED_A0";
  legacyFamilyAuthority: false;
  productionBinding: false;
};

export const A0_CAPABILITY_STATE: RecoveryCapabilityState = Object.freeze({
  archiveCount: 331,
  exactImportedPreferenceCandidates: 38,
  reconstructedComponentCount: 0,
  reviewSystem: "COMING_NEXT_A1",
  componentReconstruction: "NOT_STARTED_A2",
  pageComposition: "NOT_AUTHORISED_A0",
  legacyFamilyAuthority: false,
  productionBinding: PRODUCTION_BINDING,
});

export function resolveComponentOrGap(componentId: string | null) {
  if (!componentId) return MISSING_COMPONENT_RESULT;
  return { componentId, productionBinding: PRODUCTION_BINDING } as const;
}
