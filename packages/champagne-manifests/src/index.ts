import manifest from "../data/champagne_machine_manifest_full.json";

export type ChampagneManifestStatus = "unavailable" | "stub" | "ready";

export interface ChampagneMachineManifest {
  id: string;
  note: string;
  status: ChampagneManifestStatus | string;
  version: string;
}

export const champagneMachineManifest: ChampagneMachineManifest = manifest;

export const champagneManifestStatus: ChampagneManifestStatus =
  manifest.status === "ready"
    ? "ready"
    : manifest.status === "stub"
      ? "stub"
      : "unavailable";

export const champagneManifestsReady = champagneManifestStatus === "ready";
