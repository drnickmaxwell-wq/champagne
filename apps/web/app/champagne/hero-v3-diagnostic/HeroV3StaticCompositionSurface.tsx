/**
 * Historical H3.2R marker only.
 *
 * The sculpted-current study was removed from the active Hero V3 flow by
 * Founder correction. Its visual evidence is archived with the H3.2 report;
 * it is not a Champagne Hero candidate and must not be mounted by runtime code.
 */
export const HERO_V3_RETIRED_STATIC_STUDY = {
  id: "v3-champagne-sculpted-current",
  disposition: "OPTIONAL_VISUAL_STUDY_NOT_HERO_V3",
  active: false,
  productionBinding: false,
  archive: "reports/hero-v3/h3-2/optional-visual-studies/champagne-sculpted-current-concept.webp",
} as const;
