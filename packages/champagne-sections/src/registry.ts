import dynamic from "next/dynamic";
import type { SectionComponentMap } from "./types";

/**
 * Component Registry
 * -------------------
 * All Champagne Sections must be registered here.
 * PageBuilder → resolves section.type → component
 */

export const SectionRegistry: SectionComponentMap = {
  "feature-list": dynamic(() =>
    import("./Section_FeatureList").then((module) => module.Section_FeatureList),
  ),
  "media-block": dynamic(() => import("./Section_MediaBlock").then((module) => module.Section_MediaBlock)),
  "clinician-insight": dynamic(() =>
    import("./Section_ClinicianInsight").then((module) => module.Section_ClinicianInsight),
  ),
  "patient-stories": dynamic(() =>
    import("./Section_PatientStoriesRail").then((module) => module.Section_PatientStoriesRail),
  ),
  faq: dynamic(() => import("./Section_FAQ").then((module) => module.Section_FAQ)),
  "closing-cta": dynamic(() =>
    import("./Section_TreatmentClosingCTA").then((module) => module.Section_TreatmentClosingCTA),
  ),
  "tools-trio": dynamic(() =>
    import("./Section_TreatmentToolsTrio").then((module) => module.Section_TreatmentToolsTrio),
  ),
  "overview-rich": dynamic(() =>
    import("./Section_TreatmentOverviewRich").then((module) => module.Section_TreatmentOverviewRich),
  ),
  "treatment-media-feature": dynamic(() =>
    import("./Section_TreatmentMediaFeature").then((module) => module.Section_TreatmentMediaFeature),
  ),
  "routing-cards": dynamic(() =>
    import("./Section_TreatmentRoutingCards").then((module) => module.Section_TreatmentRoutingCards),
  ),
};

/**
 * Primary lookup
 */
export function resolveSectionComponent(type: string) {
  return SectionRegistry[type];
}
