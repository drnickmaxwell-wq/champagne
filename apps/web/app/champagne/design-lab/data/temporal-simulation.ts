export type AtelierTime = "canonical" | "morning" | "afternoon" | "dusk" | "night";

export const TEMPORAL_SIMULATIONS: Record<AtelierTime, {
  label: string;
  canon: "midday" | "dawn" | "goldenHour" | "inkfall";
  heroRuntime: "day" | "evening" | "night";
  historicalToken: "dawn" | "dusk" | "night";
  scope: "HERO_PREVIEW_ONLY" | "CURRENT_CANONICAL_DEFAULT";
  authority: "SIMULATION_ONLY";
}> = {
  canonical: { label: "CURRENT / CANONICAL DEFAULT", canon: "midday", heroRuntime: "day", historicalToken: "dawn", scope: "CURRENT_CANONICAL_DEFAULT", authority: "SIMULATION_ONLY" },
  morning: { label: "Morning · simulation only", canon: "dawn", heroRuntime: "day", historicalToken: "dawn", scope: "HERO_PREVIEW_ONLY", authority: "SIMULATION_ONLY" },
  afternoon: { label: "Afternoon · simulation only", canon: "midday", heroRuntime: "day", historicalToken: "dawn", scope: "HERO_PREVIEW_ONLY", authority: "SIMULATION_ONLY" },
  dusk: { label: "Dusk · simulation only", canon: "goldenHour", heroRuntime: "evening", historicalToken: "dusk", scope: "HERO_PREVIEW_ONLY", authority: "SIMULATION_ONLY" },
  night: { label: "Night · simulation only", canon: "inkfall", heroRuntime: "night", historicalToken: "night", scope: "HERO_PREVIEW_ONLY", authority: "SIMULATION_ONLY" },
};
