import assetsManifest from "../canon/3d/champagne-3d-assets.json" assert { type: "json" };
import viewerModesManifest from "../canon/3d/champagne-3d-viewer-modes.json" assert { type: "json" };
import lightingPresetsManifest from "../canon/3d/champagne-3d-lighting-presets.json" assert { type: "json" };
import stackGuardManifest from "../canon/system/champagne-stack-guard.json" assert { type: "json" };

import type {
  Champagne3dAssetsManifest,
  Champagne3dLightingPresetsManifest,
  Champagne3dViewerModesManifest,
  ChampagneStackGuardConfig,
} from "./types";

export const load3dAssets = (): Champagne3dAssetsManifest => assetsManifest;

export const load3dViewerModes = (): Champagne3dViewerModesManifest => viewerModesManifest;

export const load3dLightingPresets = (): Champagne3dLightingPresetsManifest => lightingPresetsManifest;

export const loadStackGuard = (): ChampagneStackGuardConfig =>
  stackGuardManifest as ChampagneStackGuardConfig;
