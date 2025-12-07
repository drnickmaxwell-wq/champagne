import manifest from "../data/champagne_machine_manifest_full.json";

export type ChampagneManifestStatus = "unavailable" | "stub" | "ready";

export interface ChampagnePageSection {
  id?: string;
  type?: string;
  label?: string;
  [key: string]: unknown;
}

export interface ChampagnePageManifest {
  path?: string;
  hero?: string | Record<string, unknown>;
  sections?: ChampagnePageSection[];
  surface?: string;
  [key: string]: unknown;
}

export interface ChampagneMachineManifest {
  id: string;
  note?: string;
  status: ChampagneManifestStatus | string;
  version: string;
  pages?: Record<string, ChampagnePageManifest>;
  treatments?: Record<string, ChampagnePageManifest>;
  [key: string]: unknown;
}

export interface ChampagneManifestRegistry {
  core: ChampagneMachineManifest;
  public?: unknown;
  styles?: unknown;
  manusImport?: unknown;
}

export const champagneMachineManifest: ChampagneMachineManifest = manifest;

export const champagneManifestStatus: ChampagneManifestStatus =
  manifest.status === "ready"
    ? "ready"
    : manifest.status === "stub"
      ? "stub"
      : "unavailable";

export const champagneManifestsReady = champagneManifestStatus === "ready";

export const champagneManifests: ChampagneManifestRegistry = {
  core: champagneMachineManifest,
};
