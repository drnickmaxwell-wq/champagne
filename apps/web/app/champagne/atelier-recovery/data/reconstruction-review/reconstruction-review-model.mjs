export const RECONSTRUCTION_REVIEW_SCHEMA = "ATELIER_FOUNDER_RECONSTRUCTION_REVIEW_DATASET_V1";
export const RECONSTRUCTION_REVIEW_VERSION = 1;
export const RECONSTRUCTION_DISPOSITIONS = ["APPROVE", "REFINE", "FAIL"];
export const RECONSTRUCTION_VIEWPORTS = [1440, 1024, 768, 390];
export const FIDELITY_FLAG_KEYS = [
  "lostColour", "lostSurfaceMaterialCharacter", "lostComposition", "lostGeometry",
  "lostTypography", "lostSpacingDensity", "lostImageryTreatment", "lostWaveLayering",
  "lostLuminosity", "tooGeneric", "tooDark", "tooWashedOut", "interactionIssue", "responsiveIssue",
];
export const EMPTY_FIDELITY_FLAGS = Object.freeze(Object.fromEntries(FIDELITY_FLAG_KEYS.map((key) => [key, false])));

function fail(message) {
  throw new Error(`INVALID_FOUNDER_RECONSTRUCTION_REVIEW_DATASET: ${message}`);
}

function exactKeys(value, allowed, label) {
  for (const key of Object.keys(value)) if (!allowed.includes(key)) fail(`unknown ${label} field ${key}`);
}

export function currentReconstructionReviews(dataset) {
  return dataset.reviews.filter((review) => review.status === "CURRENT");
}

export function currentReconstructionReviewMap(dataset) {
  return new Map(currentReconstructionReviews(dataset).map((review) => [review.componentId, review]));
}

export function validateReconstructionReviewDataset(input, componentIndex) {
  if (!input || typeof input !== "object" || Array.isArray(input)) fail("root must be an object");
  exactKeys(input, ["schema", "version", "datasetRevision", "authority", "productionBinding", "sourceKernel", "persistence", "session", "reviews"], "root");
  if (input.schema !== RECONSTRUCTION_REVIEW_SCHEMA || input.version !== RECONSTRUCTION_REVIEW_VERSION) fail("stale or unknown schema version");
  if (input.authority !== "FOUNDER_RECONSTRUCTION_FIDELITY_DECISIONS_ONLY") fail("authority mismatch");
  if (input.productionBinding !== false) fail("productionBinding must be false");
  if (!Number.isInteger(input.datasetRevision) || input.datasetRevision < 1) fail("datasetRevision must be positive");
  if (!input.sourceKernel || typeof input.sourceKernel !== "object") fail("source kernel missing");
  exactKeys(input.sourceKernel, ["id", "pr", "head", "tree", "componentCount", "componentIndexSchema"], "source kernel");
  if (input.sourceKernel.id !== "A2_RECONSTRUCTION_KERNEL_V1"
    || input.sourceKernel.pr !== 873
    || input.sourceKernel.head !== "4e923e69aa41f43d0ce7b6496ef812d7ebbc944c"
    || input.sourceKernel.tree !== "b65f7e79acd76217df25569e8cedcafc18598d72"
    || input.sourceKernel.componentCount !== 8
    || input.sourceKernel.componentIndexSchema !== componentIndex.schema) fail("source kernel identity mismatch");
  if (!input.persistence || typeof input.persistence !== "object") fail("persistence contract missing");
  exactKeys(input.persistence, ["mode", "browserLocalStorageIsAuthoritative", "appendOnlyReviewHistory", "sourcePreferenceCorpusMutable"], "persistence");
  if (input.persistence.mode !== "WORKTREE_FILE"
    || input.persistence.browserLocalStorageIsAuthoritative !== false
    || input.persistence.appendOnlyReviewHistory !== true
    || input.persistence.sourcePreferenceCorpusMutable !== false) fail("persistence contract mismatch");
  if (!input.session || typeof input.session !== "object") fail("session missing");
  exactKeys(input.session, ["lastComponentId", "updatedAt"], "session");
  const components = new Map(componentIndex.components.map((component) => [component.componentId, component]));
  if (input.session.lastComponentId !== null && !components.has(input.session.lastComponentId)) fail("unknown session component ID");
  if (Number.isNaN(Date.parse(input.session.updatedAt))) fail("invalid session timestamp");
  if (!Array.isArray(input.reviews)) fail("reviews must be an array");
  const ids = new Set();
  const current = new Set();
  for (const review of input.reviews) {
    if (!review || typeof review !== "object" || Array.isArray(review)) fail("review must be an object");
    exactKeys(review, ["reviewId", "componentId", "componentVersion", "sourceCvaId", "sourceFounderRating", "status", "disposition", "fidelityFlags", "founderNote", "reviewedResponsiveViewports", "timestamp", "version", "supersedes"], "review");
    const component = components.get(review.componentId);
    if (!component) fail(`unknown component ${String(review.componentId)}`);
    if (review.componentVersion !== 1 || review.sourceCvaId !== component.sourceCvaId || review.sourceFounderRating !== component.founderSignal) fail(`immutable lineage mismatch for ${review.componentId}`);
    if (ids.has(review.reviewId)) fail(`duplicate review ID ${review.reviewId}`);
    ids.add(review.reviewId);
    if (!["CURRENT", "SUPERSEDED"].includes(review.status)) fail(`invalid status for ${review.componentId}`);
    if (review.status === "CURRENT") {
      if (current.has(review.componentId)) fail(`duplicate current review for ${review.componentId}`);
      current.add(review.componentId);
    }
    if (!RECONSTRUCTION_DISPOSITIONS.includes(review.disposition)) fail(`invalid disposition for ${review.componentId}`);
    if (!review.fidelityFlags || typeof review.fidelityFlags !== "object") fail(`fidelity flags missing for ${review.componentId}`);
    exactKeys(review.fidelityFlags, FIDELITY_FLAG_KEYS, "fidelity flags");
    for (const key of FIDELITY_FLAG_KEYS) if (typeof review.fidelityFlags[key] !== "boolean") fail(`invalid flag ${key} for ${review.componentId}`);
    if (typeof review.founderNote !== "string") fail(`Founder note must be text for ${review.componentId}`);
    if (!Array.isArray(review.reviewedResponsiveViewports)
      || new Set(review.reviewedResponsiveViewports).size !== review.reviewedResponsiveViewports.length
      || review.reviewedResponsiveViewports.some((viewport) => !RECONSTRUCTION_VIEWPORTS.includes(viewport))) fail(`invalid reviewed viewports for ${review.componentId}`);
    if (!Number.isInteger(review.version) || review.version < 1) fail(`invalid version for ${review.componentId}`);
    if (Number.isNaN(Date.parse(review.timestamp))) fail(`invalid timestamp for ${review.componentId}`);
    if (review.supersedes !== null && typeof review.supersedes !== "string") fail(`invalid supersedes value for ${review.componentId}`);
  }
  for (const component of componentIndex.components) {
    const history = input.reviews.filter((review) => review.componentId === component.componentId).sort((a, b) => a.version - b.version);
    for (let index = 0; index < history.length; index += 1) {
      const review = history[index]; const predecessor = history[index - 1];
      if (review.version !== index + 1) fail(`non-contiguous history for ${component.componentId}`);
      if ((predecessor?.reviewId ?? null) !== review.supersedes) fail(`broken supersession link for ${component.componentId} v${review.version}`);
      if (index < history.length - 1 && review.status !== "SUPERSEDED") fail(`historical review must be superseded for ${component.componentId}`);
      if (index === history.length - 1 && review.status !== "CURRENT") fail(`latest review must be current for ${component.componentId}`);
    }
  }
  return structuredClone(input);
}

function stableId(componentId, version, timestamp) {
  return `${componentId}::v${version}::${timestamp.replace(/[^0-9TZ]/g, "")}`;
}

export function applyReconstructionReview(dataset, componentIndex, componentId, patch, timestamp = new Date().toISOString()) {
  const component = componentIndex.components.find((candidate) => candidate.componentId === componentId);
  if (!component) fail(`unknown component ${String(componentId)}`);
  const next = structuredClone(dataset);
  const previous = next.reviews.find((review) => review.componentId === componentId && review.status === "CURRENT");
  if (previous) previous.status = "SUPERSEDED";
  const version = previous ? previous.version + 1 : 1;
  const review = {
    reviewId: stableId(componentId, version, timestamp),
    componentId,
    componentVersion: 1,
    sourceCvaId: component.sourceCvaId,
    sourceFounderRating: component.founderSignal,
    status: "CURRENT",
    disposition: patch.disposition ?? previous?.disposition,
    fidelityFlags: structuredClone(patch.fidelityFlags ?? previous?.fidelityFlags ?? EMPTY_FIDELITY_FLAGS),
    founderNote: patch.founderNote ?? previous?.founderNote ?? "",
    reviewedResponsiveViewports: [...new Set(patch.reviewedResponsiveViewports ?? previous?.reviewedResponsiveViewports ?? [])].sort((a, b) => b - a),
    timestamp,
    version,
    supersedes: previous?.reviewId ?? null,
  };
  if (!RECONSTRUCTION_DISPOSITIONS.includes(review.disposition)) fail(`disposition required for ${componentId}`);
  next.reviews.push(review);
  next.datasetRevision += 1;
  next.session = { lastComponentId: componentId, updatedAt: timestamp };
  return validateReconstructionReviewDataset(next, componentIndex);
}

export function deriveReconstructionReviewProgress(dataset, componentIndex) {
  const map = currentReconstructionReviewMap(dataset);
  const counts = { APPROVE: 0, REFINE: 0, FAIL: 0, UNREVIEWED: 0 };
  for (const component of componentIndex.components) {
    const disposition = map.get(component.componentId)?.disposition ?? "UNREVIEWED";
    counts[disposition] += 1;
  }
  return { counts, complete: componentIndex.components.length - counts.UNREVIEWED, remaining: counts.UNREVIEWED, total: componentIndex.components.length };
}

export function deterministicReconstructionReviewExport(dataset) {
  return `${JSON.stringify(dataset, null, 2)}\n`;
}
