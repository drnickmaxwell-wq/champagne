import {
  load3dAssets,
  load3dLightingPresets,
  load3dViewerModes,
} from "@champagne/canon";
import type {
  Champagne3dAsset,
  Champagne3dLightingPreset,
  Champagne3dTreatmentConfig,
  Champagne3dViewerMode,
} from "@champagne/canon";

const assetsManifest = load3dAssets();
const viewerModesManifest = load3dViewerModes();
const lightingPresetsManifest = load3dLightingPresets();

export const getTreatment3dConfig = (
  treatmentSlug: string,
  tenantId?: string,
): Champagne3dTreatmentConfig | undefined =>
  assetsManifest.treatment3dConfigs.find(
    (entry) =>
      entry.treatmentSlug === treatmentSlug &&
      (tenantId ? entry.tenantId === tenantId : true),
  );

export const getAssetsForTreatment = (
  treatmentSlug: string,
  options: { tenantId?: string } = {},
): Champagne3dAsset[] =>
  getTreatment3dConfig(treatmentSlug, options.tenantId)?.assets ?? [];

export const getViewerMode = (
  viewerModeId: string,
  options: { respectPrm?: boolean } = {},
): Champagne3dViewerMode | undefined => {
  const mode = viewerModesManifest.viewerModes.find(({ id }) => id === viewerModeId);

  if (options.respectPrm && mode?.prmFallback && mode.prmFallback !== mode.id) {
    return viewerModesManifest.viewerModes.find(({ id }) => id === mode.prmFallback) ?? mode;
  }

  return mode;
};

export const getLightingPreset = (lightingPresetId: string): Champagne3dLightingPreset | undefined =>
  lightingPresetsManifest.lightingPresets.find(({ id }) => id === lightingPresetId);

export const listViewerModes = (): Champagne3dViewerMode[] => viewerModesManifest.viewerModes;

export const listLightingPresets = (): Champagne3dLightingPreset[] =>
  lightingPresetsManifest.lightingPresets;

export const listTreatmentConfigs = (): Champagne3dTreatmentConfig[] =>
  assetsManifest.treatment3dConfigs;
