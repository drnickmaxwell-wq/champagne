export type WholeItemSignal = "LOVE" | "LIKE" | "MAYBE" | "NOT_ME" | "UNRATED";
export type TraitSignal = "POSITIVE" | "NEGATIVE" | "MIXED" | "UNRESOLVED";

export type PreferenceFlags = {
  keepConcept: boolean;
  needsRefinement: boolean;
  needsUpgrade: boolean;
  wrongColours: boolean;
  wrongTypography: boolean;
  wrongImagery: boolean;
  wrongGeometry: boolean;
  wrongComposition: boolean;
  wrongInteraction: boolean;
};

export type PreferenceDecision = {
  decisionId: string;
  cvaId: string;
  status: string;
  wholeItemSignal: string;
  notes: string;
  traits: Array<{ dimension: string; signal: string; note?: string }>;
  flags: Record<string, boolean>;
  source: { kind: string; identifier: string; provenance: string; exactMapping: boolean; originalTraitDimensions?: string[] };
  timestamp: string;
  version: number;
  supersedes: string | null;
};

export type PreferenceDataset = {
  datasetRevision: number;
  decisions: PreferenceDecision[];
};

export const DATASET_SCHEMA: string;
export const DATASET_VERSION: number;
export const SIGNALS: readonly WholeItemSignal[];
export const TRAIT_SIGNALS: readonly TraitSignal[];
export const TRAIT_DIMENSIONS: readonly string[];
export const FLAG_KEYS: readonly (keyof PreferenceFlags)[];
export const EMPTY_FLAGS: Readonly<PreferenceFlags>;

export function currentDecisions(dataset: PreferenceDataset): PreferenceDecision[];
export function currentDecisionMap(dataset: PreferenceDataset): Map<string, PreferenceDecision>;
export function validateDataset<T>(input: T, archiveIds: string[], expectedManifestSha: string): T & PreferenceDataset;
export function applyReview<T>(dataset: T, cvaId: string, patch: Record<string, unknown>, timestamp?: string): T;
export function undoLast<T>(dataset: T, timestamp?: string): T;
export function deriveProgress(dataset: PreferenceDataset, archive: Array<{ id: string; labRoom: string }>): {
  counts: Record<WholeItemSignal | "needsRefinement" | "needsUpgrade", number>;
  decided: number;
  remaining: number;
  categories: Record<string, { total: number; decided: number }>;
};
export function deriveIndex(dataset: PreferenceDataset, archive: Array<{ id: string; labRoom: string; family: string; parentBoard: string }>): unknown[];
export function deterministicExport(dataset: object): string;
