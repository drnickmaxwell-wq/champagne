import fs from "node:fs";

const manifest = JSON.parse(fs.readFileSync("packages/champagne-manifests/data/champagne_machine_manifest_full.json", "utf8"));
const requiredSectionIds = [
  "direct_answer",
  "what_this_treatment_is",
  "who_it_is_for",
  "who_it_may_not_be_suitable_for",
  "benefits",
  "risks_and_limitations",
  "alternatives",
  "process",
  "timeline",
  "aftercare",
  "cost_fee_logic",
  "local_shoreham_context",
  "clinician_expertise",
  "technology_used",
  "faq",
  "related_treatments_internal_links",
  "last_reviewed_clinical_review",
  "cta",
];
const secondaryGeographies = ["Brighton", "Worthing", "Lancing", "Southwick"];

const flattenText = (value) => {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(flattenText).join(" ");
  if (value && typeof value === "object") return Object.values(value).map(flattenText).join(" ");
  return "";
};

const countNeedle = (haystack, needle) => {
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return (haystack.match(new RegExp(`\\b${escaped}\\b`, "gi")) ?? []).length;
};

const validate = (answerSurface) => {
  const sectionIds = Array.isArray(answerSurface?.sections)
    ? answerSurface.sections.map((section) => section?.id).filter(Boolean)
    : [];
  const missingSectionIds = requiredSectionIds.filter((id) => !sectionIds.includes(id));
  const allText = flattenText(answerSurface?.sections ?? []);
  const secondaryGeographyMentions = Object.fromEntries(
    secondaryGeographies.map((geography) => [geography, countNeedle(allText, geography)]),
  );
  const totalSecondaryMentions = Object.values(secondaryGeographyMentions).reduce((total, count) => total + count, 0);
  const secondaryGeographyStuffing = totalSecondaryMentions > 4 || Object.values(secondaryGeographyMentions).some((count) => count > 2);
  return {
    missingSectionIds,
    secondaryGeographyMentions,
    secondaryGeographyStuffing,
    valid: Boolean(answerSurface) && answerSurface.version === "TREATMENT_ANSWER_SURFACE_V1" && answerSurface.primaryGeography === "Shoreham-by-Sea" && missingSectionIds.length === 0,
  };
};

const treatmentPages = Object.entries(manifest.pages ?? {})
  .filter(([, page]) => page?.path?.startsWith("/treatments/"));
const entries = treatmentPages.map(([pageId, page]) => ({ pageId, route: page.path, validation: validate(page.answerSurface) }));
const present = entries.filter((entry) => entry.validation.valid);
const stuffing = entries.filter((entry) => entry.validation.secondaryGeographyStuffing);

if (present.length === 0) {
  console.error("❌ No treatment answerSurface framework examples were found.");
  process.exit(1);
}

if (stuffing.length > 0) {
  console.error("❌ Secondary geography stuffing detected in treatment answerSurface data.");
  console.error(JSON.stringify(stuffing.map((entry) => ({ route: entry.route, mentions: entry.validation.secondaryGeographyMentions })), null, 2));
  process.exit(1);
}

console.log(`✅ Treatment answer-surface guard passed. complete=${present.length} treatmentRoutes=${entries.length}`);
