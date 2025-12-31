require("ts-node/register/transpile-only");
require("tsconfig-paths/register");
require.extensions[".css"] = () => undefined;

const { getTreatmentPages } = require("../packages/champagne-manifests/src/helpers");
const { getSectionStack } = require("../packages/champagne-sections/src/SectionRegistry");
const { normalizeSectionsForMidCTA } = require("../packages/champagne-sections/src/ctaPlacement");
const { arbitrateCtaSurfaces } = require("../packages/champagne-sections/src/ctaSurfaceArbitrator");
const { resolveTreatmentMidCTAPlan } = require("../packages/champagne-sections/src/treatmentMidCtaPlan");
const { resolveTreatmentClosingCTAPlan } = require("../packages/champagne-sections/src/treatmentClosingCtaPlan");

function isClosing(section) {
  const kind = section.kind ?? section.type;
  const definition = section.definition ?? {};
  const componentId = definition.componentId ?? section.componentId ?? "";
  const definitionType = definition.type;

  return kind === "treatment_closing_cta" || kind === "cta" || componentId === "treatment.cta" || definitionType === "treatment_closing_cta";
}

function enforceSingleClosingCTA(sections) {
  const closingIndices = sections
    .map((section, index) => ({ section, index }))
    .filter(({ section }) => isClosing(section))
    .map(({ index }) => index);

  const keepIndex = closingIndices.length > 0 ? closingIndices[closingIndices.length - 1] : -1;
  const suppressed = new Set(closingIndices.filter((index) => index !== keepIndex));

  return { ordered: sections.filter((_, index) => !suppressed.has(index)), suppressed };
}

function summarizePage(slug) {
  const stack = getSectionStack(slug);
  const { ordered: singleClosing } = enforceSingleClosingCTA(stack);
  const { ordered: normalized } = normalizeSectionsForMidCTA(singleClosing);
  const arbitration = arbitrateCtaSurfaces({ sections: normalized, pageSlug: slug });

  const midIndices = normalized
    .map((section, index) => ({ section, index }))
    .filter(({ section }) => section.kind === "treatment_mid_cta")
    .map(({ index }) => index);
  const renderedMidIndices = midIndices.filter((index) => !arbitration.absorbedMidSectionIndices.has(index));

  const closingIndices = normalized
    .map((section, index) => ({ section, index }))
    .filter(({ section }) => isClosing(section))
    .map(({ index }) => index);
  const renderedClosingIndices = closingIndices.filter((index) => !arbitration.suppressedClosingIndices.has(index));

  const midSection = renderedMidIndices.length > 0 ? normalized[renderedMidIndices[0]] : undefined;
  const midPlan = midSection ? resolveTreatmentMidCTAPlan(midSection, slug) : undefined;
  const closingSection = renderedClosingIndices.length > 0 ? normalized[renderedClosingIndices[renderedClosingIndices.length - 1]] : undefined;
  const closingPlan = closingSection
    ? resolveTreatmentClosingCTAPlan({
        section: closingSection,
        pageSlug: slug,
        usedHrefs: arbitration.renderedMidCtaHrefs,
        absorbedMidCtas: arbitration.absorbedMidCtas,
      })
    : undefined;

  return {
    slug,
    midCount: renderedMidIndices.length,
    closingCount: renderedClosingIndices.length,
    midIndex: renderedMidIndices[0] ?? -1,
    closingIndex: renderedClosingIndices[0] ?? -1,
    midLabels: midPlan?.resolvedCTAs.map((cta) => cta.label) ?? [],
    closingLabels: closingPlan?.buttons.map((cta) => cta.label) ?? [],
  };
}

const treatments = getTreatmentPages();
const results = treatments.map((page) => summarizePage(page.path));

const exactlyOneMid = results.filter((entry) => entry.midCount === 1).length;
const exactlyOneClosing = results.filter((entry) => entry.closingCount === 1).length;
const violations = results.filter((entry) => entry.midCount !== 1 || entry.closingCount !== 1);

console.log(
  JSON.stringify(
    {
      totals: {
        pages: results.length,
        midExactlyOne: exactlyOneMid,
        closingExactlyOne: exactlyOneClosing,
        violations: violations.map(({ slug, midCount, closingCount }) => ({ slug, midCount, closingCount })),
      },
      results: results.filter((entry) => [
        "/treatments/dental-fillings",
        "/treatments/implants-single-tooth",
        "/treatments/periodontal-gum-care",
      ].includes(entry.slug)),
    },
    null,
    2,
  ),
);
