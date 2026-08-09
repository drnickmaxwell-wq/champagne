import type { AtelierContentSection } from "./content-bundle-adapter";

export type MediaAvailability = "REAL_ASSET_REQUIRED" | "TEXT_LED" | "SYNTHETIC_FIXTURE" | "OFF";

type MediaSlot = {
  semanticSectionId: string;
  resolvedSlotId: string;
  contentSlotIds: string[];
  required: boolean;
  job: string;
  recommendedType: string;
  availability: MediaAvailability;
  aspectRatio: string;
  responsive: { desktop: string; tablet: string; mobile: string };
  authenticity: string;
  provenance: string;
  searchIntent: string;
  fallback: string;
};

const slot = (semanticSectionId: string, resolvedSlotId: string, contentSlotIds: string[], required: boolean, job: string, recommendedType: string, availability: MediaAvailability, aspectRatio: string, mobile: string, fallback: string): MediaSlot => ({
  semanticSectionId, resolvedSlotId, contentSlotIds, required, job, recommendedType, availability, aspectRatio,
  responsive: { desktop: "Registry-led composition", tablet: "Preserve subject and reading order", mobile },
  authenticity: availability === "REAL_ASSET_REQUIRED" ? "Genuine practice asset required" : availability === "SYNTHETIC_FIXTURE" ? "Clearly labelled educational proxy" : "No factual image required",
  provenance: availability === "REAL_ASSET_REQUIRED" ? "Awaiting rights, consent, source hash and derivative ledger" : "Contract provenance retained",
  searchIntent: job,
  fallback,
});

export const HOME_MEDIA_SLOT_COMPATIBILITY: Record<string, MediaSlot> = {
  "home.hero.v2": slot("home.hero.v2", "home.hero.v2.primary", ["MEDIA.HOME.HERO.V2"], true, "Establish place and calm confidence without changing Hero V2.", "P-HERO", "REAL_ASSET_REQUIRED", "16:9 / 21:9 safe", "Poster-first; crop-safe central subject", "Preserve current Hero V2 media contract"),
  "home.practice.answer": slot("home.practice.answer", "home.practice.answer.identity", ["MEDIA.HOME.PRACTICE.EXTERIOR"], false, "Make the practice tangible and local.", "P-PLACE", "REAL_ASSET_REQUIRED", "4:3", "Full-width after the answer or text-led", "Text-led section"),
  "home.patient.pathways": slot("home.patient.pathways", "home.patient.pathways.editorial", [], false, "Support orientation without becoming a treatment catalogue.", "P-TEXT", "TEXT_LED", "Text-led", "Single-column descriptive links", "Text-led pathway list"),
  "home.complex-care": slot("home.complex-care", "home.complex-care.planning", ["MEDIA.HOME.COMPLEX.PLANNING"], false, "Explain coordinated planning rather than advertise an outcome.", "P-EDU", "REAL_ASSET_REQUIRED", "3:2", "Diagram below copy", "Text-led with optional static diagram"),
  "home.care-process": slot("home.care-process", "home.care-process.sequence", [], false, "Clarify the four-stage care sequence.", "P-PROCESS", "TEXT_LED", "Sequence", "Vertical ordered sequence", "Semantic ordered list"),
  "home.founder-authority": slot("home.founder-authority", "home.founder-authority.portrait", ["MEDIA.HOME.FOUNDER.PORTRAIT"], true, "Connect named clinical leadership to an authentic person and place.", "P-PORTRAIT", "REAL_ASSET_REQUIRED", "4:5", "Portrait above or between text blocks", "Text-led authority with REAL PHOTO REQUIRED label in Lab"),
  "home.team-continuity": slot("home.team-continuity", "home.team-continuity.group", ["MEDIA.HOME.TEAM.GROUP"], false, "Show continuity without freezing a stale roster.", "P-PORTRAIT", "REAL_ASSET_REQUIRED", "3:2", "Text first; group image second", "Text-led continuity chapter"),
  "home.technology-purpose": slot("home.technology-purpose", "home.technology-purpose.workflow", ["MEDIA.HOME.TECH.DIGITAL_PLANNING"], false, "Show technology answering a clinical question, not device theatre.", "P-EDU", "REAL_ASSET_REQUIRED", "16:10", "Static workflow detail", "Text-led with verified caption later"),
  "home.heritage-story": slot("home.heritage-story", "home.heritage-story.architecture", ["MEDIA.HOME.HERITAGE.EXTERIOR"], true, "Make the real St Mary's House a memorable place anchor.", "P-PLACE", "REAL_ASSET_REQUIRED", "3:2 / 16:9", "Static image; no film slot", "Text-led until genuine St Mary's House exterior exists"),
  "home.proof": slot("home.proof", "home.proof.cases", [], false, "Project only consented, provenance-complete evidence.", "P-PROOF", "OFF", "Off", "Omit completely", "OMIT_ENTIRE_SECTION"),
  "home.visit": slot("home.visit", "home.visit.arrival", ["MEDIA.HOME.VISIT.ENTRANCE"], false, "Help recognition and arrival without inventing access detail.", "P-PLACE", "REAL_ASSET_REQUIRED", "4:3", "Compact arrival image after locality", "Text and Contact-page route"),
  "home.focused-faq": slot("home.focused-faq", "home.focused-faq.support", [], false, "Keep answers readable and page-owned.", "P-TEXT", "TEXT_LED", "Text-led", "Native disclosure stack", "Visible SSR-equivalent text"),
  "home.closing-invitation": slot("home.closing-invitation", "home.closing-invitation.architecture", ["MEDIA.HOME.CLOSING.ARCHITECTURAL"], false, "Close with place, atmosphere and proportionate contact.", "P-PLACE", "REAL_ASSET_REQUIRED", "21:9 / 16:9", "Crop-safe architectural field", "Text-led closing; fictional concept remains Lab-only"),
};

export const mediaLensFor = (section: AtelierContentSection) => HOME_MEDIA_SLOT_COMPATIBILITY[section.id] ?? {
  semanticSectionId: section.id,
  resolvedSlotId: section.mediaSlot ?? section.modelSlot ?? `${section.id}.text-led`,
  contentSlotIds: section.contentMediaSlotIds ?? [],
  required: Boolean(section.mediaSlot || section.modelSlot),
  job: section.job,
  recommendedType: section.modelSlot ? "P-EDU" : "P-TEXT",
  availability: section.modelSlot ? "SYNTHETIC_FIXTURE" : "TEXT_LED",
  aspectRatio: section.modelSlot ? "16:10" : "Text-led",
  responsive: { desktop: "Contract-led", tablet: "Contract-led", mobile: "Poster or text-first" },
  authenticity: section.modelSlot ? "Synthetic educational fixture" : "No factual image required",
  provenance: "Semantic contract preserved",
  searchIntent: section.searchIntent,
  fallback: section.modelSlot ? "Static educational transcript" : "Text-led section",
} satisfies MediaSlot;

export const MEDIA_FOUNDER_CONTROLS = ["Use this image", "Try another asset", "Set focal point", "Crop differently", "Image left", "Image right", "Full width", "Use video", "Use 3D instead", "Leave text-led", "Restore recommended"] as const;

export const MEDIA_ROUTE_COMPATIBILITY = {
  "/dental-implants": "/treatments/implants",
  "/composite-bonding": "/treatments/composite-bonding",
} as const;
