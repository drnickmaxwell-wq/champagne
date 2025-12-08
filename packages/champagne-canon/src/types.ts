export interface ChampagneStackGuardRules {
  noGoldInWeather?: boolean;
  gradientAngleMustBe135?: boolean;
  gradientRequiredOnChampagneScenes?: boolean;
  contentMustRemainSharp?: boolean;
  fxCannotUnderMaterial?: boolean;
  grainCannotAboveContent?: boolean;
  ritualLayerTimeoutMs?: number;
  enforceWCAGContrast?: boolean;
  respectPrefersReducedMotion?: boolean;
}

export interface ChampagneStackGuardViolations {
  onViolation?: "error" | "warn";
  logChannel?: string;
  failBuildOnSevere?: boolean;
}

export interface ChampagneStackGuard {
  version: string;
  order: string[];
  rules: ChampagneStackGuardRules;
  violations?: ChampagneStackGuardViolations;
}

export interface ChampagneStackGuardConfig {
  stackGuard: ChampagneStackGuard;
}

export interface Champagne3dAssetMetadata {
  workflowStage?: string;
  modality?: string;
  anonymisationLevel?: string;
  demoOnly?: boolean;
  exportPriority?: string;
  supportsAnnotation?: boolean;
  supportsCallouts?: boolean;
  supportsSliceNavigation?: boolean;
  supportsPhotoImport?: boolean;
  [key: string]: unknown;
}

export interface Champagne3dAsset {
  id: string;
  type: string;
  family?: string;
  file: string;
  lod?: string;
  viewerModes?: string[];
  exportTargets?: string[];
  materialTokens?: string[];
  lightingPreset?: string;
  cameraPreset?: string;
  tags?: string[];
  metadata?: Champagne3dAssetMetadata;
}

export interface Champagne3dTreatmentConfig {
  treatmentSlug: string;
  tenantId?: string;
  assets: Champagne3dAsset[];
}

export interface Champagne3dAssetsManifest {
  treatment3dConfigs: Champagne3dTreatmentConfig[];
}

export interface Champagne3dViewerInteractionConfig {
  allowOrbit?: boolean;
  allowZoom?: boolean;
  allowPan?: boolean;
}

export interface Champagne3dViewerMode {
  id: string;
  description?: string;
  defaultRotationSpeed?: string;
  supportsInteraction?: boolean;
  interaction?: Champagne3dViewerInteractionConfig;
  prmFallback?: string;
  explosionPreset?: string;
  comparisonStyle?: string[];
  [key: string]: unknown;
}

export interface Champagne3dViewerModesManifest {
  viewerModes: Champagne3dViewerMode[];
}

export interface Champagne3dLightingBrandLayering {
  supportsGradientOverlay?: boolean;
  gradientToken?: string;
  glassToken?: string;
  [key: string]: unknown;
}

export interface Champagne3dLightingPreset {
  id: string;
  label?: string;
  description?: string;
  tone?: string;
  intendedUses?: string[];
  brandLayering?: Champagne3dLightingBrandLayering;
  [key: string]: unknown;
}

export interface Champagne3dLightingPresetsManifest {
  lightingPresets: Champagne3dLightingPreset[];
}

export interface ChampagneExperience {
  hero?: {
    sceneId?: string;
    variantId?: string;
    surfaceToken?: string;
  };
  [key: string]: unknown;
}
