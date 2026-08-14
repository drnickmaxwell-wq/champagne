import type { AtelierContentSection } from "./content-bundle-adapter";
import { mediaLensFor } from "./media-slot-adapter";

export type BrandTerritoryId = "persian-architectural" | "contemporary-editorial" | "warm-heritage" | "luminous-digital";
export type AccentId = "turquoise" | "magenta" | "gilded-gold" | "restrained";
export type TypeId = "editorial" | "architectural" | "humanist";
export type RhythmId = "gallery" | "editorial" | "cinematic";

export type BrandDecision = {
  territory: BrandTerritoryId;
  accent: AccentId;
  typography: TypeId;
  rhythm: RhythmId;
  note: string;
  status: "FOUNDER_WORKING_DIRECTION";
};

export const BRAND_TERRITORIES = [
  { id: "persian-architectural", name: "Persian Architectural", character: "Assured, cultivated and spatial", description: "Deep Persian rooms, porcelain relief and gold used like architectural jewellery.", signals: ["Velvet depth", "Measured symmetry", "Gilded restraint"] },
  { id: "contemporary-editorial", name: "Contemporary Editorial", character: "Intelligent, composed and modern", description: "Generous white space, decisive typography and imagery treated like a beautifully edited journal.", signals: ["Porcelain field", "Strong type", "Quiet asymmetry"] },
  { id: "warm-heritage", name: "Warm Heritage", character: "Human, established and welcoming", description: "St Mary’s House gives the digital experience warmth without becoming nostalgic or themed.", signals: ["Warm porcelain", "Tactile detail", "Human scale"] },
  { id: "luminous-digital", name: "Luminous Digital", character: "Precise, optimistic and quietly advanced", description: "Light, layered interfaces make planning and education feel clear rather than technical.", signals: ["Soft luminosity", "Clear interaction", "Clinical calm"] },
] as const;

export const ACCENTS = [
  { id: "turquoise", name: "Educational turquoise", job: "Guidance, explanation and calm progress" },
  { id: "magenta", name: "Founder magenta", job: "Current focus and deliberate selection" },
  { id: "gilded-gold", name: "Gilded brand gold", job: "Ceremony, heritage and rare emphasis" },
  { id: "restrained", name: "Almost monochrome", job: "Let material and typography lead" },
] as const;

export const TYPOGRAPHY_DIRECTIONS = [
  { id: "editorial", name: "Editorial contrast", display: "High-contrast serif", body: "Quiet contemporary sans", feeling: "Cultivated and legible" },
  { id: "architectural", name: "Architectural poise", display: "Measured classical serif", body: "Precise neutral sans", feeling: "Established and assured" },
  { id: "humanist", name: "Human warmth", display: "Soft expressive serif", body: "Open humanist sans", feeling: "Personal and welcoming" },
] as const;

export const RHYTHM_DIRECTIONS = [
  { id: "gallery", name: "Gallery calm", description: "Long breaths, singular moments and deliberate pauses." },
  { id: "editorial", name: "Editorial cadence", description: "Alternating density, scale and alignment create forward movement." },
  { id: "cinematic", name: "Cinematic reveal", description: "Immersive chapters with media-led transitions where contracts allow." },
] as const;

export const INITIAL_BRAND_DECISION: BrandDecision = {
  territory: "persian-architectural",
  accent: "turquoise",
  typography: "editorial",
  rhythm: "gallery",
  note: "",
  status: "FOUNDER_WORKING_DIRECTION",
};

export const CONVERGENCE_LANES = [
  { id: "content", name: "Content / Search", state: "HOME_BUNDLE_CONNECTED", next: "Founder fact and publication review", owns: "Meaning, copy and canonical question ownership" },
  { id: "media", name: "Media", state: "40_SECTION_REGISTRY_CONNECTED", next: "Genuine practice assets", owns: "Asset truth, provenance, crops and responsive treatment" },
  { id: "threeD", name: "3D Education", state: "FROZEN_SYNTHETIC_FIXTURE", next: "Final GLB", owns: "Interactive implant education and static fallback parity" },
  { id: "concierge", name: "Concierge", state: "VISUAL_KIT_CONNECTED", next: "Founder visual convergence decision", owns: "Architectural Host visuals and governed interactions" },
] as const;

export const mediaLensForSection = (section: AtelierContentSection) => mediaLensFor(section);

export const EXPERIENCE_STUDIOS = [
  { id: "media", name: "Media Studio", state: "Registry connected", description: "Choose, compare and compose purposeful media without pretending assets already exist." },
  { id: "threeD", name: "3D Experience Studio", state: "Synthetic fixture ready", description: "Shape museum-grade education with a truthful static fallback." },
  { id: "concierge", name: "Concierge Experience Room", state: "Visual kit connected", description: "Compare and intentionally mix the Architectural Host territories." },
  { id: "search", name: "Search Lens", state: "Orientation connected", description: "See page ownership and intent without turning the Founder UI into an SEO console." },
  { id: "preview", name: "Experience Preview", state: "Reserved", description: "Later rehearse page, media, 3D and Concierge as one human journey." },
] as const;
