export const RECONSTRUCTION_DISPOSITIONS: string[];
export const RECONSTRUCTION_VIEWPORTS: number[];
export const FIDELITY_FLAG_KEYS: string[];
export const EMPTY_FIDELITY_FLAGS: Record<string, boolean>;
export function currentReconstructionReviewMap(dataset: unknown): Map<string, any>;
export function validateReconstructionReviewDataset(input: unknown, componentIndex: unknown): any;
export function applyReconstructionReview(dataset: unknown, componentIndex: unknown, componentId: string, patch: Record<string, unknown>, timestamp?: string): any;
export function deriveReconstructionReviewProgress(dataset: unknown, componentIndex: unknown): { counts: Record<string, number>; complete: number; remaining: number; total: number };
export function deterministicReconstructionReviewExport(dataset: unknown): string;
