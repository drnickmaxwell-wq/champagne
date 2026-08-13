import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { currentDecisionMap, validateDataset } from "../../app/champagne/atelier-recovery/data/preferences/preference-model.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(scriptDir, "../..");
const routeRoot = path.join(webRoot, "app/champagne/atelier-recovery");
const datasetPath = path.join(routeRoot, "data/preferences/founder-visual-preferences.v1.json");
const registryPath = path.join(routeRoot, "data/archive/v27-registry.json");
const inventoryPath = path.join(routeRoot, "data/archive/ATELIER_A0_PRESERVED_ARCHIVE_INVENTORY_V1.json");
const corpusDir = path.join(routeRoot, "data/corpus");
const reconstructionDir = path.join(routeRoot, "data/reconstruction");

const [datasetText, registryText, inventoryText] = await Promise.all([
  readFile(datasetPath, "utf8"),
  readFile(registryPath, "utf8"),
  readFile(inventoryPath, "utf8"),
]);
const dataset = JSON.parse(datasetText);
const registry = JSON.parse(registryText);
const inventory = JSON.parse(inventoryText);
validateDataset(dataset, registry.items.map((item) => item.id), dataset.sourceManifest.sha256);

const current = [...currentDecisionMap(dataset).values()];
const byId = new Map(current.map((decision) => [decision.cvaId, decision]));
const registryById = new Map(registry.items.map((item) => [item.id, item]));
const signalCounts = Object.fromEntries(["LOVE", "LIKE", "MAYBE", "NOT_ME", "UNRATED"].map((signal) => [signal, 0]));
for (const decision of current) signalCounts[decision.wholeItemSignal] += 1;

const flagKeys = [
  "keepConcept", "needsRefinement", "needsUpgrade", "wrongColours", "wrongTypography",
  "wrongImagery", "wrongGeometry", "wrongComposition", "wrongInteraction",
];
const flagCounts = Object.fromEntries(flagKeys.map((key) => [key, current.filter((decision) => decision.flags[key]).length]));

const traitFrequency = {};
for (const decision of current) {
  for (const trait of decision.traits) {
    const key = `${trait.dimension}::${trait.signal}`;
    traitFrequency[key] = (traitFrequency[key] ?? 0) + 1;
  }
}

const NOTE_THEMES = {
  positive: {
    "brand identity / recognisably Champagne": /(?:my brand|brand feel|champagne|just my brand)/i,
    "wave, flow or layered transition": /(?:wave|flow|layer|transition)/i,
    "diagram, 3D or explanatory visual": /(?:diagram|3d|model|interactive|planning)/i,
    "authentic St Mary's House heritage": /(?:st\.?\s*mary|actual practice|my building|practice building)/i,
    "luxury / classic-modern character": /(?:luxur|classic|modern|elegant)/i,
    "strong colour participation": /(?:bright|more colo|more colou|brand colo|brand colou|colours are perfect|colors are perfect)/i,
    "clarity, reassurance or understandable information": /(?:clear|clarity|reassur|understand|confidence|inform)/i,
  },
  negative: {
    "boring, flat or insufficient energy": /(?:boring|flat|plain|dull)/i,
    "washed-out, wrong or off-brand colour": /(?:washed|pastel|wrong (?:blue|colo)|colou?r.*wrong|brand colou?rs? being lost|not the persian)/i,
    "CTA or button treatment unresolved": /(?:(?:cta|button).*(?:better|not sure|unsure|wrong)|(?:not sure|unsure).*(?:cta|button))/i,
    "needs stronger Champagne branding": /(?:more my brand|branded more|brand out the window|needs my actual brand)/i,
    "blocky, repetitive or generic composition": /(?:block|generic|repet|samey)/i,
    "imagery or clinical-content mismatch": /(?:do not do|don't do|dont do|do not have|wrong imagery|milling)/i,
  },
};

const noteTraitFrequencies = Object.fromEntries(Object.entries(NOTE_THEMES).map(([polarity, themes]) => [
  polarity,
  Object.fromEntries(Object.entries(themes).map(([label, expression]) => [label, current.filter((decision) => expression.test(decision.notes)).length])),
]));

const hashGroups = new Map();
for (const item of inventory.items) {
  if (!hashGroups.has(item.sha256)) hashGroups.set(item.sha256, []);
  hashGroups.get(item.sha256).push(item.cvaId);
}
const exactDuplicates = [...hashGroups.values()].filter((ids) => ids.length > 1);
const boardGroups = new Map();
for (const item of registry.items) {
  const board = item.provenance.parentBoard;
  if (!boardGroups.has(board)) boardGroups.set(board, []);
  boardGroups.get(board).push(item.id);
}
const nearDuplicateGroups = [...boardGroups.entries()]
  .filter(([, ids]) => ids.length > 1)
  .map(([parentBoard, ids]) => ({ parentBoard, count: ids.length, ids }))
  .sort((a, b) => b.count - a.count || a.parentBoard.localeCompare(b.parentBoard));

function roleFor(item) {
  if (item.id.startsWith("CVA-CTA-")) return "CTA_COMPONENTS";
  if (item.id.startsWith("CVA-FOOTER-")) return "FOOTER_COMPONENTS";
  if (item.id.startsWith("CVA-BAND-")) return "TRANSITION_WAVE_BANDS";
  if (item.id.startsWith("CVA-CARD-")) return "INFORMATION_CARDS_EDITORIAL_PANELS";
  if (item.id.startsWith("CVA-DECISION-") || /comparison|decision-support|options/i.test(`${item.family} ${item.purpose ?? ""}`)) return "COMPARISON_OPTIONS_COMPONENTS";
  if (item.id.startsWith("CVA-PAGE-") || item.id.startsWith("CVA-SEQUENCE-")) return "PAGE_SEQUENCE_COMPLEX_LAYOUT_REFERENCES";
  if (/mobile/i.test(`${item.title} ${item.purpose ?? ""}`)) return "MOBILE_SPECIFIC_REFERENCES";
  if (/reassur|trust|confidence|credential|proof/i.test(`${item.title} ${item.purpose ?? ""}`)) return "REASSURANCE_TRUST_STRIPS";
  if (item.id.startsWith("CVA-SECTION-") || item.id.startsWith("CVA-SURFACE-") || item.id.startsWith("CVA-HERITAGE-")) return "SECTION_CHAPTER_COMPOSITIONS";
  return "OTHER_RECOVERED_REFERENCES";
}

const clusterOrder = [
  "SECTION_CHAPTER_COMPOSITIONS", "CTA_COMPONENTS", "COMPARISON_OPTIONS_COMPONENTS",
  "REASSURANCE_TRUST_STRIPS", "INFORMATION_CARDS_EDITORIAL_PANELS", "TRANSITION_WAVE_BANDS",
  "FOOTER_COMPONENTS", "PAGE_SEQUENCE_COMPLEX_LAYOUT_REFERENCES", "MOBILE_SPECIFIC_REFERENCES",
  "OTHER_RECOVERED_REFERENCES",
];

const clusters = clusterOrder.map((role) => {
  const items = registry.items.filter((item) => roleFor(item) === role).map((item) => ({
    cvaId: item.id,
    title: item.title,
    signal: byId.get(item.id)?.wholeItemSignal ?? "UNRATED",
    notes: byId.get(item.id)?.notes ?? "",
    flags: byId.get(item.id)?.flags ?? {},
    family: item.family,
    parentBoard: item.provenance.parentBoard,
  }));
  const counts = Object.fromEntries(["LOVE", "LIKE", "MAYBE", "NOT_ME", "UNRATED"].map((signal) => [signal, items.filter((item) => item.signal === signal).length]));
  const strongestLove = items.filter((item) => item.signal === "LOVE").sort((a, b) => Number(Boolean(b.notes)) - Number(Boolean(a.notes))).slice(0, 8).map((item) => item.cvaId);
  const strongestLike = items.filter((item) => item.signal === "LIKE").sort((a, b) => Number(Boolean(b.notes)) - Number(Boolean(a.notes))).slice(0, 5).map((item) => item.cvaId);
  const families = [...new Set(items.map((item) => item.family))];
  return {
    semanticRole: role,
    counts: { total: items.length, ...counts },
    strongestLove,
    strongestLikeWorthReconstruction: strongestLike,
    commonPositiveTraits: role === "CTA_COMPONENTS"
      ? ["selective colour participation", "clear action hierarchy", "small geometric signature"]
      : role === "TRANSITION_WAVE_BANDS" || role === "FOOTER_COMPONENTS"
        ? ["wave-led continuity", "Porcelain/Persian relationship", "brand colour luminosity"]
        : ["editorial hierarchy", "Persian/Porcelain contrast", "rich information made calm"],
    commonNegativeTraits: role === "CTA_COMPONENTS"
      ? ["architectural framing can dominate", "generic button fallbacks", "weak mobile reduction"]
      : ["blockiness", "washed-out brand colour", "literal media may require separate rights or 3D work"],
    underlyingGrammar: families.length < items.length ? `YES — ${families.length} named families cover ${items.length} references` : "LIMITED",
    reconstructionSufficiency: items.length >= 2 && counts.LOVE + counts.LIKE >= 2 ? "SUFFICIENT_FOR_BOUNDED_A2" : "GAP_OR_LINEAGE_ONLY",
    genuineGap: role === "MOBILE_SPECIFIC_REFERENCES"
      ? "No sufficiently independent mobile-only visual reference; responsive behaviour must be proven from adaptive reconstructions."
      : role === "CTA_COMPONENTS" && counts.MAYBE > counts.LOVE + counts.LIKE
        ? "Founder evidence is broad but confidence is weak; CTA grammar needs careful reconstruction review."
        : null,
    items,
  };
});

const selections = [
  ["A2-DECISION-CLARITY-01", "CVA-SECTION-B029-E05", "DecisionClaritySection", "comparison / decision support", "LOVE", "High-information structure with strong colour participation; reconstructable without specialist media."],
  ["A2-CLINICIAN-INSIGHT-01", "CVA-SECTION-B025-E01", "ClinicianInsightSection", "major clinician chapter", "LOVE", "Proves asymmetric Porcelain/Persian chapter composition and verified-content slots."],
  ["A2-SPECTRUM-CLOSING-BAND-01", "CVA-BAND-B020-E03", "SpectrumConsultationBand", "reassurance / closing band", "LOVE", "Small but distinctive full-width brand-energy bridge."],
  ["A2-PORCELAIN-DESCENT-FOOTER-01", "CVA-FOOTER-F03-E02", "PorcelainDescentFooter", "footer", "LOVE", "Proves layered wave descent, navigation density and mobile regrouping."],
  ["A2-ARCHITECTURAL-CTA-01", "CVA-CTA-B004-E01", "ArchitecturalCta", "CTA grammar", "MAYBE", "Chosen deliberately from the weak CTA cluster to test whether the frame grammar can be retained without architecture dominating."],
  ["A2-CLINICIAN-CREDENTIAL-CARD-01", "CVA-CARD-B025-E01A", "ClinicianCredentialCard", "information / credential card", "LOVE", "Reusable proof structure with real portrait/content slots."],
  ["A2-PORCELAIN-CONSTELLATION-STRIP-01", "CVA-SURFACE-B038-E02", "PorcelainConstellationStrip", "reassurance / trust strip", "LOVE", "Founder-approved Porcelain grammar with dots, gold current and trust rail."],
  ["A2-QUESTION-FIRST-PANEL-01", "CVA-DECISION-B031-E02A", "QuestionFirstPanel", "question-first decision panel", "LIKE", "Compact, insertion-ready decision support that broadens semantic coverage."],
].map(([componentId, sourceCvaId, exportName, semanticRole, founderSignal, rationale]) => ({
  componentId, sourceCvaId, exportName, semanticRole, founderSignal, rationale,
}));

const blockedStrongReferences = [
  {
    cvaId: "CVA-SECTION-B029-E03",
    founderSignal: byId.get("CVA-SECTION-B029-E03")?.wholeItemSignal,
    classification: "ESPECIALLY_STRONG_LINEAGE_NOT_LITERAL_A2_RECONSTRUCTION",
    reason: "Founder favourite depends on realistic clinical 3D/CBCT media and planning controls. The surrounding grammar is reusable, but truthful media requires a separately authorised media/3D tranche.",
  },
  {
    cvaId: "CVA-SECTION-B032-E01",
    founderSignal: byId.get("CVA-SECTION-B032-E01")?.wholeItemSignal,
    classification: "STRONG_LINEAGE_NOT_LITERAL_A2_RECONSTRUCTION",
    reason: "Exploded implant anatomy is specialist clinical media; a CSS or generic SVG substitute would be a false success.",
  },
  {
    cvaId: "CVA-SEQUENCE-B010-E01",
    founderSignal: byId.get("CVA-SEQUENCE-B010-E01")?.wholeItemSignal,
    classification: "LINEAGE_AND_TRANSITION_AUTHORITY_ONLY",
    reason: "Contains Sacred Hero V2 lineage. A2 may learn from the post-Hero transition but must not reconstruct or mutate the Hero.",
  },
];

const componentContracts = {
  "A2-DECISION-CLARITY-01": {
    contentSlots: ["heading", "intro", "benefits[]", "limitations[]", "alternatives[]", "questions[]", "summary", "actionLabel"],
    surfaces: ["Persian field", "gold summary edge", "turquoise and magenta semantic markers"],
    typography: "Playfair display heading; Inter labels and body; responsive editorial scale",
    spacingDensity: "dense desktop decision rail; readable stacked mobile chapters",
    waveLayerOverlap: "quiet dotted current only; no decorative container stack",
    mediaSlotGeometry: null,
    knownLimits: ["Source blue is corrected to the canonical Persian token environment; this is a deliberate Founder-note response."],
  },
  "A2-CLINICIAN-INSIGHT-01": {
    contentSlots: ["heading", "body", "relatedLabel", "relatedHref", "portrait", "credentials[]"],
    surfaces: ["Porcelain editorial field", "Persian credential field", "gold verification rail"],
    typography: "Playfair editorial heading; Inter evidence labels",
    spacingDensity: "asymmetric 38/62 split; single-column mobile order retains story before proof",
    waveLayerOverlap: "fine contour current on Persian field",
    mediaSlotGeometry: "portrait slot 4:5 with accessible labelled fallback",
    knownLimits: ["No genuine clinician portrait is bundled in A2; the slot is truthful and awaits approved practice media."],
  },
  "A2-SPECTRUM-CLOSING-BAND-01": {
    contentSlots: ["heading", "actionLabel", "href"], surfaces: ["luminous brand spectrum on Porcelain"],
    typography: "Playfair centred heading; Inter action", spacingDensity: "shallow full-width band; taller touch-safe mobile",
    waveLayerOverlap: "layered spectrum currents cross behind content", mediaSlotGeometry: null,
    knownLimits: ["Spectrum is token-composed and intentionally excludes off-palette rainbow colours."],
  },
  "A2-PORCELAIN-DESCENT-FOOTER-01": {
    contentSlots: ["practiceName", "tagline", "navigationGroups[]", "closingAction", "legalLinks[]"],
    surfaces: ["Porcelain navigation ledge", "Persian deep footer", "magenta/turquoise/gold wave seam"],
    typography: "Playfair practice identity; Inter navigation and legal text", spacingDensity: "multi-column desktop; disclosure-free stacked mobile groups",
    waveLayerOverlap: "three-layer descending seam", mediaSlotGeometry: null,
    knownLimits: ["No building illustration is reconstructed; this source is selected for footer anatomy and wave descent, not heritage artwork."],
  },
  "A2-ARCHITECTURAL-CTA-01": {
    contentSlots: ["label", "href", "variant", "compact"], surfaces: ["Porcelain or Persian host surfaces"],
    typography: "Playfair action label with restrained Inter-independent geometry", spacingDensity: "three desktop states and compact mobile icon mode",
    waveLayerOverlap: "none", mediaSlotGeometry: null,
    knownLimits: ["Founder signal is MAYBE. Geometry remains experimental and specifically avoids arch/portal dominance."],
  },
  "A2-CLINICIAN-CREDENTIAL-CARD-01": {
    contentSlots: ["portrait", "name", "role", "credentials[]"], surfaces: ["Persian card", "gold proof rail"],
    typography: "Playfair identity; Inter verified evidence", spacingDensity: "balanced two-column card; stacked mobile",
    waveLayerOverlap: "fine contour corner", mediaSlotGeometry: "portrait slot 4:5",
    knownLimits: ["Awaits a rights-cleared portrait; A2 demonstrates the real slot and credential anatomy only."],
  },
  "A2-PORCELAIN-CONSTELLATION-STRIP-01": {
    contentSlots: ["heading", "body", "proofItems[]"], surfaces: ["Porcelain field", "magenta dot constellation", "gold current"],
    typography: "Playfair statement; Inter proof labels", spacingDensity: "open editorial strip; proof rail stacks on mobile",
    waveLayerOverlap: "dotted field rises from lower edge", mediaSlotGeometry: null,
    knownLimits: [],
  },
  "A2-QUESTION-FIRST-PANEL-01": {
    contentSlots: ["question", "actionLabel", "href"], surfaces: ["Persian panel", "turquoise question marker"],
    typography: "Inter question and action", spacingDensity: "compact insertion-ready panel; full-width mobile action",
    waveLayerOverlap: "none", mediaSlotGeometry: null,
    knownLimits: ["Source is LIKE rather than LOVE; retained as a useful, low-risk semantic primitive."],
  },
};

const index = {
  schema: "ATELIER_A2_RECONSTRUCTED_COMPONENT_INDEX_V1",
  version: 1,
  maturity: "EXPERIMENTAL_RECONSTRUCTION",
  productionBinding: false,
  sourceCorpus: "CHAMPAGNE_FOUNDER_VISUAL_CORPUS_V1",
  supportedViewports: [1440, 1024, 768, 390],
  components: selections.map((selection) => ({
    ...selection,
    sourceAsset: `/assets/champagne/design-lab/v27/${selection.sourceCvaId}.png`,
    status: "IMPLEMENTED_AWAITING_FOUNDER_REVIEW",
    accessibility: ["semantic landmarks/headings", "keyboard-visible focus", "minimum touch target", "meaning does not depend on colour alone", "responsive reading order"],
    responsiveBehaviour: {
      1440: "full editorial composition",
      1024: "rebalanced columns without content loss",
      768: "compact grid or intentional stack",
      390: "single-column, touch-safe, no horizontal overflow",
    },
    ...componentContracts[selection.componentId],
  })),
};

const corpus = {
  schema: "CHAMPAGNE_FOUNDER_VISUAL_CORPUS_V1",
  version: 1,
  status: "CANONICAL_COMPLETED_FOUNDER_REVIEW_CORPUS",
  productionBinding: false,
  frozenDatasetRevision: dataset.datasetRevision,
  sourceDatasetSha256: createHash("sha256").update(datasetText).digest("hex"),
  sourceManifest: dataset.sourceManifest,
  counts: {
    totalArchiveItems: registry.items.length,
    totalReviewedItems: current.length,
    totalHistoricalRecords: dataset.decisions.length,
    supersededRecords: dataset.decisions.filter((decision) => decision.status === "SUPERSEDED").length,
    ...signalCounts,
    remainingUnrated: signalCounts.UNRATED,
  },
  flagCounts,
  explicitTraitFrequencies: traitFrequency,
  noteThemeFrequencies: noteTraitFrequencies,
  duplicateAnalysis: {
    exactDuplicateGroups: exactDuplicates,
    nearDuplicateMethod: "Shared source parentBoard; these are sibling/near-duplicate candidates, not claimed pixel duplicates.",
    nearDuplicateGroups,
  },
  especiallyStrongReferences: ["CVA-SECTION-B029-E03", "CVA-SECTION-B029-E02", "CVA-MEDIA-B032-E01", "CVA-MEDIA-B022-E01", "CVA-SEQUENCE-B010-E01", "CVA-HERITAGE-B040-E01"],
  directReconstructionReferences: selections.map((selection) => selection.sourceCvaId),
  lineageMoodReferences: blockedStrongReferences,
  weakReferenceRule: "MAYBE and NOT_ME remain evidence; they do not become direct reconstruction authority without a bounded learning rationale.",
  founderDataset: dataset,
};

const matrix = {
  schema: "ATELIER_RECONSTRUCTION_CANDIDATE_MATRIX_V1",
  version: 1,
  productionBinding: false,
  sourceCorpus: "CHAMPAGNE_FOUNDER_VISUAL_CORPUS_V1",
  selectionCriteria: ["Founder confidence", "later page usefulness", "semantic diversity", "truthful feasibility", "responsive feasibility", "future composition value", "Champagne DNA evidence", "avoidance of generic fallback"],
  clusters,
  selectedA2Kernel: selections,
  strongReferencesNotForced: blockedStrongReferences,
};

const summary = `# Champagne Founder Visual Corpus Summary V1

Status: **CANONICAL COMPLETED_FOUNDER REVIEW CORPUS**

Source dataset revision: **${dataset.datasetRevision}**

Source dataset SHA-256: \`${corpus.sourceDatasetSha256}\`

Production binding: **false**

## Closure counts

| Measure | Count |
|---|---:|
| Archive items | ${registry.items.length} |
| Reviewed/current items | ${current.length} |
| LOVE | ${signalCounts.LOVE} |
| LIKE | ${signalCounts.LIKE} |
| MAYBE | ${signalCounts.MAYBE} |
| NOT_ME | ${signalCounts.NOT_ME} |
| Remaining unrated | ${signalCounts.UNRATED} |
| Historical records | ${dataset.decisions.length} |
| Superseded records | ${corpus.counts.supersededRecords} |

## Refinement flags

${Object.entries(flagCounts).map(([key, value]) => `- ${key}: **${value}**`).join("\n")}

These counts preserve the Founder’s explicit flags exactly. Note-theme analysis below is separate and never rewrites a flag.

## Trait frequencies

Explicit structured trait records are deliberately sparse: ${Object.entries(traitFrequency).map(([key, value]) => `${key} (${value})`).join(", ") || "none"}.

Derived positive note themes: ${Object.entries(noteTraitFrequencies.positive).map(([key, value]) => `${key} (${value})`).join("; ")}.

Derived negative note themes: ${Object.entries(noteTraitFrequencies.negative).map(([key, value]) => `${key} (${value})`).join("; ")}.

The derived frequencies are transparent keyword classification of verbatim current notes, not invented Founder judgements.

## Duplicate and lineage findings

- One exact asset-hash duplicate group: ${exactDuplicates.map((ids) => ids.join(" / ")).join(", ")}.
- ${nearDuplicateGroups.length} shared-parent-board sibling groups are recorded as near-duplicate families. They are not claimed to be pixel duplicates.
- CTA evidence is the weakest large cluster: 106 items, ${signalCountsFor("CTA").LOVE} LOVE, ${signalCountsFor("CTA").LIKE} LIKE, ${signalCountsFor("CTA").MAYBE} MAYBE and ${signalCountsFor("CTA").NOT_ME} NOT_ME.
- Raw CVA-SECTION evidence is the strongest large source-type group: 92 items, ${signalCountsFor("SECTION").LOVE} LOVE. The semantic SECTION_CHAPTER_COMPOSITIONS cluster in the candidate matrix also includes non-SECTION chapter references and reports its own exact signal mix.
- The Founder-favourite \`CVA-SECTION-B029-E03\` is retained as especially strong lineage. Its realistic 3D/CBCT media is not faked in A2.
- \`CVA-SEQUENCE-B010-E01\` remains transition authority only because it contains Sacred Hero V2 lineage.

## Selected A2 reconstruction kernel

${selections.map((selection, indexValue) => `${indexValue + 1}. **${selection.componentId}** ← \`${selection.sourceCvaId}\` (${selection.founderSignal}) — ${selection.rationale}`).join("\n")}

The kernel contains two major editorial/decision compositions, one CTA grammar, one closing band, one footer, one credential card, one Porcelain trust strip and one compact question-first decision panel. It tests the PNG-to-component bridge without designing a page.

## Reconstruction boundary

All A2 components are \`EXPERIMENTAL_RECONSTRUCTION\`. Founder review is required before any can become \`FOUNDER_APPROVED\`. No component is production-bound, and no full page composition is authorised by this corpus closure.
`;

function signalCountsFor(prefix) {
  const rows = current.filter((decision) => decision.cvaId.startsWith(`CVA-${prefix}-`));
  return Object.fromEntries(["LOVE", "LIKE", "MAYBE", "NOT_ME"].map((signal) => [signal, rows.filter((row) => row.wholeItemSignal === signal).length]));
}

const outputs = [
  [path.join(corpusDir, "CHAMPAGNE_FOUNDER_VISUAL_CORPUS_V1.json"), `${JSON.stringify(corpus, null, 2)}\n`],
  [path.join(corpusDir, "CHAMPAGNE_FOUNDER_VISUAL_CORPUS_SUMMARY_V1.md"), summary],
  [path.join(reconstructionDir, "ATELIER_RECONSTRUCTION_CANDIDATE_MATRIX_V1.json"), `${JSON.stringify(matrix, null, 2)}\n`],
  [path.join(reconstructionDir, "ATELIER_A2_RECONSTRUCTED_COMPONENT_INDEX_V1.json"), `${JSON.stringify(index, null, 2)}\n`],
];
if (process.argv.includes("--check")) {
  for (const [outputPath, expected] of outputs) {
    const actual = await readFile(outputPath, "utf8");
    if (actual !== expected) throw new Error(`Generated A2 corpus artifact is stale: ${path.relative(webRoot, outputPath)}`);
  }
} else {
  await Promise.all([mkdir(corpusDir, { recursive: true }), mkdir(reconstructionDir, { recursive: true })]);
  await Promise.all(outputs.map(([outputPath, content]) => writeFile(outputPath, content)));
}

console.log(JSON.stringify({ counts: corpus.counts, flagCounts, selected: selections.length, exactDuplicateGroups: exactDuplicates.length, nearDuplicateGroups: nearDuplicateGroups.length }, null, 2));
