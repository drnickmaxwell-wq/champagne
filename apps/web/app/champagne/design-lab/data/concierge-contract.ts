export type ConciergeTerritoryId = "architectural-light" | "editorial-host" | "luminous-digital" | "quiet-companion";

export const CONCIERGE_TERRITORIES = [
  { id: "architectural-light", name: "Architectural Light", role: "Page integration", character: "A translucent architectural plane that feels built into St Mary's House.", surface: "light" },
  { id: "editorial-host", name: "Editorial Host", role: "Evidence and sources", character: "A quiet folio for answers, sources and careful comparison.", surface: "editorial" },
  { id: "luminous-digital", name: "Luminous Digital", role: "3D and action moments", character: "A deep Persian spatial stage for precise educational interaction.", surface: "luminous" },
  { id: "quiet-companion", name: "Quiet Companion", role: "Quiet Guidance mode", character: "Low-density guidance that recedes when it is not needed.", surface: "quiet" },
] as const;

export const CONCIERGE_COMPONENT_CHOICES = [
  { id: "launcher", label: "Launcher", contractId: "CX.LAUNCHER.ARCH.01" },
  { id: "panel", label: "Panel", contractId: "CX.PANEL.SPATIAL.01" },
  { id: "source", label: "Source drawer", contractId: "CX.DRAWER.SOURCE.01" },
  { id: "voice", label: "Voice state", contractId: "CX.VOICE.SPECTRAL.01" },
  { id: "cards", label: "Card style", contractId: "CX.CARD.ANSWER.01" },
  { id: "threeD", label: "3D presentation", contractId: "CX.MODEL.IMPLANT.01" },
  { id: "handoff", label: "Human handoff", contractId: "CX.HANDOFF.HUMAN.01" },
  { id: "mobile", label: "Mobile form", contractId: "CX.MOBILE.FULLSCREEN.01" },
  { id: "quiet", label: "Quiet Guidance", contractId: "CX.PANEL.QUIET.01" },
] as const;

export const CONCIERGE_3D_ACTIONS = ["OPEN_MODEL", "ROTATE_TO_FEATURE", "HIGHLIGHT_COMPONENT", "ISOLATE_LAYER", "PLAY_STAGE", "SET_STAGE", "COMPARE_STATE", "SHOW_LABELS", "HIDE_LABELS", "RESET_MODEL", "OPEN_MODEL_SOURCE", "OPEN_TEXT_ALTERNATIVE"] as const;

export const INITIAL_CONCIERGE_MIX = {
  launcher: "architectural-light",
  panel: "architectural-light",
  source: "editorial-host",
  voice: "quiet-companion",
  cards: "editorial-host",
  threeD: "luminous-digital",
  handoff: "architectural-light",
  mobile: "architectural-light",
  quiet: "quiet-companion",
} satisfies Record<(typeof CONCIERGE_COMPONENT_CHOICES)[number]["id"], ConciergeTerritoryId>;
