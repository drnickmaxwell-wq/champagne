export const DATASET_SCHEMA = "ATELIER_FOUNDER_VISUAL_PREFERENCE_DATASET_V1";
export const DATASET_VERSION = 1;
export const SIGNALS = ["LOVE", "LIKE", "MAYBE", "NOT_ME", "UNRATED"];
export const TRAIT_SIGNALS = ["POSITIVE", "NEGATIVE", "MIXED", "UNRESOLVED"];
export const TRAIT_DIMENSIONS = [
  "colour", "surface", "composition", "geometry", "typography", "spacing/density",
  "image treatment", "wave", "luminosity", "dark/light balance", "human warmth",
  "interaction", "motion", "mobile composition",
];
export const FLAG_KEYS = [
  "keepConcept", "needsRefinement", "needsUpgrade", "wrongColours", "wrongTypography",
  "wrongImagery", "wrongGeometry", "wrongComposition", "wrongInteraction",
];

export const EMPTY_FLAGS = Object.freeze(Object.fromEntries(FLAG_KEYS.map((key) => [key, false])));

function fail(message) {
  throw new Error(`INVALID_FOUNDER_PREFERENCE_DATASET: ${message}`);
}

function exactKeys(value, allowed, label) {
  for (const key of Object.keys(value)) if (!allowed.includes(key)) fail(`unknown ${label} field ${key}`);
}

export function currentDecisions(dataset) {
  return dataset.decisions.filter((decision) => decision.status === "CURRENT");
}

export function currentDecisionMap(dataset) {
  return new Map(currentDecisions(dataset).map((decision) => [decision.cvaId, decision]));
}

export function validateDataset(input, archiveIds, expectedManifestSha) {
  if (!input || typeof input !== "object" || Array.isArray(input)) fail("root must be an object");
  exactKeys(input, ["schema", "version", "datasetRevision", "authority", "productionBinding", "sourceManifest", "persistence", "session", "decisions"], "root");
  if (input.schema !== DATASET_SCHEMA || input.version !== DATASET_VERSION) fail("stale or unknown schema version");
  if (input.authority !== "FOUNDER_EXPLICIT_DECISIONS_ONLY") fail("authority mismatch");
  if (input.productionBinding !== false) fail("productionBinding must be false");
  if (!input.sourceManifest || typeof input.sourceManifest !== "object") fail("source manifest missing");
  exactKeys(input.sourceManifest, ["id", "sha256", "itemCount"], "source manifest");
  if (typeof input.sourceManifest.id !== "string" || !/^[a-f0-9]{64}$/.test(input.sourceManifest.sha256) || input.sourceManifest.sha256 !== expectedManifestSha || input.sourceManifest.itemCount !== 331) fail("source manifest identity mismatch");
  if (!input.persistence || typeof input.persistence !== "object") fail("persistence contract missing");
  exactKeys(input.persistence, ["mode", "browserLocalStorageIsAuthoritative", "appendOnlyDecisionHistory"], "persistence");
  if (input.persistence.mode !== "WORKTREE_FILE" || input.persistence.browserLocalStorageIsAuthoritative !== false || input.persistence.appendOnlyDecisionHistory !== true) fail("persistence contract mismatch");
  if (!input.session || typeof input.session !== "object") fail("session missing");
  exactKeys(input.session, ["lastCvaId", "updatedAt"], "session");
  if (input.session.lastCvaId !== null && !archiveIds.includes(input.session.lastCvaId)) fail("unknown session CVA ID");
  if (Number.isNaN(Date.parse(input.session.updatedAt))) fail("invalid session timestamp");
  if (!Number.isInteger(input.datasetRevision) || input.datasetRevision < 1) fail("datasetRevision must be a positive integer");
  if (!Array.isArray(input.decisions)) fail("decisions must be an array");
  const known = new Set(archiveIds);
  const decisionIds = new Set();
  const current = new Set();
  for (const decision of input.decisions) {
    if (!decision || typeof decision !== "object") fail("decision must be an object");
    exactKeys(decision, ["decisionId", "cvaId", "status", "wholeItemSignal", "notes", "traits", "flags", "source", "timestamp", "version", "supersedes"], "decision");
    if (!known.has(decision.cvaId)) fail(`unknown CVA ID ${String(decision.cvaId)}`);
    if (decisionIds.has(decision.decisionId)) fail(`duplicate decision ID ${decision.decisionId}`);
    decisionIds.add(decision.decisionId);
    if (!SIGNALS.includes(decision.wholeItemSignal)) fail(`invalid signal for ${decision.cvaId}`);
    if (!Number.isInteger(decision.version) || decision.version < 1) fail(`invalid version for ${decision.cvaId}`);
    if (!["CURRENT", "SUPERSEDED"].includes(decision.status)) fail(`invalid status for ${decision.cvaId}`);
    if (decision.status === "CURRENT") {
      if (current.has(decision.cvaId)) fail(`duplicate current decision for ${decision.cvaId}`);
      current.add(decision.cvaId);
    }
    if (typeof decision.notes !== "string") fail(`notes must be text for ${decision.cvaId}`);
    if (!Array.isArray(decision.traits)) fail(`traits must be an array for ${decision.cvaId}`);
    const traitDimensions = new Set();
    for (const trait of decision.traits) {
      exactKeys(trait, ["dimension", "signal", "note"], "trait");
      if (!TRAIT_DIMENSIONS.includes(trait.dimension) || !TRAIT_SIGNALS.includes(trait.signal)) fail(`invalid trait for ${decision.cvaId}`);
      if (traitDimensions.has(trait.dimension)) fail(`duplicate trait ${trait.dimension} for ${decision.cvaId}`);
      traitDimensions.add(trait.dimension);
      if (trait.note !== undefined && typeof trait.note !== "string") fail(`trait note must be text for ${decision.cvaId}`);
    }
    if (!decision.flags || typeof decision.flags !== "object") fail(`flags missing for ${decision.cvaId}`);
    exactKeys(decision.flags, FLAG_KEYS, "flags");
    for (const key of FLAG_KEYS) if (typeof decision.flags[key] !== "boolean") fail(`invalid flag ${key} for ${decision.cvaId}`);
    if (!decision.source || typeof decision.source !== "object") fail(`source missing for ${decision.cvaId}`);
    exactKeys(decision.source, ["kind", "identifier", "provenance", "exactMapping", "originalTraitDimensions"], "source");
    if (!["EXACT_IMPORT", "FOUNDER_REVIEW", "SUPERSESSION"].includes(decision.source?.kind)) fail(`invalid source for ${decision.cvaId}`);
    if (!decision.source.identifier || !decision.source.provenance || decision.source.exactMapping !== true) fail(`invalid source identity for ${decision.cvaId}`);
    if (!Array.isArray(decision.source.originalTraitDimensions) || decision.source.originalTraitDimensions.some((dimension) => !TRAIT_DIMENSIONS.includes(dimension))) fail(`invalid original trait dimensions for ${decision.cvaId}`);
    if (Number.isNaN(Date.parse(decision.timestamp))) fail(`invalid timestamp for ${decision.cvaId}`);
  }
  return structuredClone(input);
}

function stableId(cvaId, version, timestamp) {
  return `${cvaId}::v${version}::${timestamp.replace(/[^0-9TZ]/g, "")}`;
}

export function applyReview(dataset, cvaId, patch, timestamp = new Date().toISOString()) {
  const next = structuredClone(dataset);
  const current = next.decisions.find((decision) => decision.cvaId === cvaId && decision.status === "CURRENT");
  if (current) current.status = "SUPERSEDED";
  const version = current ? current.version + 1 : 1;
  const decision = {
    decisionId: stableId(cvaId, version, timestamp), cvaId, status: "CURRENT",
    wholeItemSignal: patch.wholeItemSignal ?? current?.wholeItemSignal ?? "UNRATED",
    notes: patch.notes ?? current?.notes ?? "",
    traits: patch.traits ?? structuredClone(current?.traits ?? []),
    flags: patch.flags ?? structuredClone(current?.flags ?? EMPTY_FLAGS),
    source: {
      kind: patch.sourceKind ?? "FOUNDER_REVIEW",
      identifier: patch.identifier ?? `A1_FOUNDER_REVIEW_${cvaId}_V${version}`,
      provenance: patch.provenance ?? "Founder review system A1",
      exactMapping: true,
      originalTraitDimensions: current?.source?.originalTraitDimensions ?? [],
    },
    timestamp, version, supersedes: current?.decisionId ?? null,
  };
  next.decisions.push(decision);
  next.datasetRevision += 1;
  next.session = { lastCvaId: cvaId, updatedAt: timestamp };
  return next;
}

export function undoLast(dataset, timestamp = new Date().toISOString()) {
  const current = currentDecisions(dataset).filter((decision) => decision.source.kind !== "EXACT_IMPORT").sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0];
  if (!current) return dataset;
  const predecessor = current.supersedes ? dataset.decisions.find((decision) => decision.decisionId === current.supersedes) : null;
  return applyReview(dataset, current.cvaId, {
    wholeItemSignal: predecessor?.wholeItemSignal ?? "UNRATED",
    notes: predecessor?.notes ?? "",
    traits: structuredClone(predecessor?.traits ?? []),
    flags: structuredClone(predecessor?.flags ?? EMPTY_FLAGS),
    sourceKind: "SUPERSESSION",
    identifier: `A1_UNDO_${current.decisionId}`,
    provenance: `Undo of ${current.decisionId}`,
  }, timestamp);
}

export function deriveProgress(dataset, archive) {
  const map = currentDecisionMap(dataset);
  const counts = { LOVE: 0, LIKE: 0, MAYBE: 0, NOT_ME: 0, UNRATED: 0, needsRefinement: 0, needsUpgrade: 0 };
  const categories = {};
  for (const item of archive) {
    const decision = map.get(item.id);
    const signal = decision?.wholeItemSignal ?? "UNRATED";
    counts[signal] += 1;
    if (decision?.flags.needsRefinement) counts.needsRefinement += 1;
    if (decision?.flags.needsUpgrade) counts.needsUpgrade += 1;
    categories[item.labRoom] ??= { total: 0, decided: 0 };
    categories[item.labRoom].total += 1;
    if (signal !== "UNRATED") categories[item.labRoom].decided += 1;
  }
  return { counts, decided: 331 - counts.UNRATED, remaining: counts.UNRATED, categories };
}

export function deriveIndex(dataset, archive) {
  const map = currentDecisionMap(dataset);
  return archive.map((item) => {
    const decision = map.get(item.id);
    return {
      cvaId: item.id,
      wholeItemSignal: decision?.wholeItemSignal ?? "UNRATED",
      positiveTraits: decision?.traits.filter((trait) => trait.signal === "POSITIVE").map((trait) => trait.dimension) ?? [],
      negativeTraits: decision?.traits.filter((trait) => trait.signal === "NEGATIVE").map((trait) => trait.dimension) ?? [],
      flags: decision?.flags ?? EMPTY_FLAGS,
      notePresent: Boolean(decision?.notes),
      source: decision?.source ?? null,
      currentDecisionVersion: decision?.version ?? 0,
      provenance: { parentBoard: item.parentBoard, family: item.family, category: item.labRoom },
    };
  });
}

export function deterministicExport(dataset) {
  return `${JSON.stringify(dataset, null, 2)}\n`;
}
