import { ensureHeroAssetPath, resolveHeroAsset } from "../HeroAssetRegistry";
import type {
  HeroSurfaceConfig,
  HeroSurfaceTokenConfig,
  ResolvedHeroSurfaceConfig,
} from "./HeroConfig";

export interface HeroSurfaceDefinitionMap {
  waveMasks?: Record<string, string>;
  waveBackgrounds?: Record<string, { desktop?: string; mobile?: string }>;
  overlays?: Record<string, string>;
  particles?: Record<string, string>;
  grain?: Record<string, string>;
  motion?: Record<string, string>;
  video?: Record<string, string>;
}

function normalizeRecord(entry: unknown): Record<string, string> {
  if (!entry || typeof entry !== "object") return {};
  return Object.entries(entry as Record<string, unknown>)
    .filter(([, value]) => typeof value === "string")
    .reduce<Record<string, string>>((acc, [key, value]) => {
      acc[key] = value as string;
      return acc;
    }, {});
}

export function buildSurfaceDefinitionMap(manifest: unknown): HeroSurfaceDefinitionMap {
  if (!manifest || typeof manifest !== "object") return {};
  return {
    waveMasks: normalizeRecord((manifest as Record<string, unknown>).waveMasks),
    waveBackgrounds: (() => {
      const entry = (manifest as Record<string, unknown>).waveBackgrounds;
      if (!entry || typeof entry !== "object") return {};
      return Object.entries(entry as Record<string, unknown>).reduce<Record<string, { desktop?: string; mobile?: string }>>(
        (acc, [key, value]) => {
          if (!value || typeof value !== "object") return acc;
          const desktop = (value as Record<string, unknown>).desktop;
          const mobile = (value as Record<string, unknown>).mobile;
          acc[key] = {
            desktop: typeof desktop === "string" ? desktop : undefined,
            mobile: typeof mobile === "string" ? mobile : undefined,
          };
          return acc;
        },
        {},
      );
    })(),
    overlays: normalizeRecord((manifest as Record<string, unknown>).overlays),
    particles: normalizeRecord((manifest as Record<string, unknown>).particles),
    grain: normalizeRecord((manifest as Record<string, unknown>).grain),
    motion: normalizeRecord((manifest as Record<string, unknown>).motion),
    video: normalizeRecord((manifest as Record<string, unknown>).video),
  };
}

function resolveToken(token: string | undefined, map: Record<string, string>): string | undefined {
  if (!token) return undefined;
  return map[token] ?? token;
}

function mergeSurfaceTokens(
  target: HeroSurfaceTokenConfig,
  source?: HeroSurfaceTokenConfig,
): HeroSurfaceTokenConfig {
  if (!source) return target;
  return {
    waveMask: {
      ...target.waveMask,
      ...source.waveMask,
    },
    background: {
      ...target.background,
      ...source.background,
    },
    overlays: {
      ...target.overlays,
      ...source.overlays,
    },
    particles: source.particles ?? target.particles,
    grain: {
      ...target.grain,
      ...source.grain,
    },
    motion: source.motion ?? target.motion,
    video: source.video ?? target.video,
  };
}

export function combineSurfaceTokens(
  ...configs: (HeroSurfaceTokenConfig | undefined)[]
): HeroSurfaceTokenConfig {
  return configs.reduce<HeroSurfaceTokenConfig>((acc, entry) => mergeSurfaceTokens(acc, entry), {});
}

export function mapSurfaceTokensToAssets(
  surfaceTokens: HeroSurfaceTokenConfig,
  surfaceMap: HeroSurfaceDefinitionMap,
): HeroSurfaceConfig {
  return {
    waveMask: {
      desktop: resolveToken(surfaceTokens.waveMask?.desktop, surfaceMap.waveMasks ?? {}),
      mobile: resolveToken(surfaceTokens.waveMask?.mobile ?? surfaceTokens.waveMask?.desktop, surfaceMap.waveMasks ?? {}),
    },
    background: (() => {
      const backgroundToken = surfaceTokens.background?.desktop ?? surfaceTokens.background?.mobile;
      const backgroundDefinition = backgroundToken ? surfaceMap.waveBackgrounds?.[backgroundToken] : undefined;
      const fallbackBackground = surfaceMap.waveBackgrounds?.primary;
      return {
        desktop: backgroundDefinition?.desktop
          ?? surfaceMap.waveBackgrounds?.[surfaceTokens.background?.desktop ?? ""]?.desktop
          ?? fallbackBackground?.desktop,
        mobile: backgroundDefinition?.mobile
          ?? surfaceMap.waveBackgrounds?.[surfaceTokens.background?.mobile ?? ""]?.mobile
          ?? backgroundDefinition?.desktop
          ?? fallbackBackground?.mobile
          ?? fallbackBackground?.desktop,
      };
    })(),
    overlays: {
      dots: resolveToken(surfaceTokens.overlays?.dots, surfaceMap.overlays ?? {}),
      field: resolveToken(surfaceTokens.overlays?.field, surfaceMap.overlays ?? {}),
    },
    particles: resolveToken(surfaceTokens.particles, surfaceMap.particles ?? {}),
    grain: {
      desktop: surfaceTokens.grain?.desktop
        ? surfaceMap.grain?.[surfaceTokens.grain.desktop] ?? surfaceTokens.grain.desktop
        : surfaceMap.grain?.desktop,
      mobile: surfaceTokens.grain?.mobile
        ? surfaceMap.grain?.[surfaceTokens.grain.mobile] ?? surfaceTokens.grain.mobile
        : surfaceMap.grain?.mobile ?? surfaceMap.grain?.desktop,
    },
    motion: surfaceTokens.motion?.map((entry) => resolveToken(entry, surfaceMap.motion ?? {})).filter(Boolean) as string[] | undefined,
    video: resolveToken(surfaceTokens.video, surfaceMap.video ?? {}),
  };
}

export function resolveHeroSurfaceAssets(surfaceConfig: HeroSurfaceConfig): ResolvedHeroSurfaceConfig {
  return {
    waveMask: {
      desktop: resolveHeroAsset(surfaceConfig.waveMask?.desktop),
      mobile: resolveHeroAsset(surfaceConfig.waveMask?.mobile ?? surfaceConfig.waveMask?.desktop),
    },
    background: {
      desktop: resolveHeroAsset(surfaceConfig.background?.desktop),
      mobile: resolveHeroAsset(surfaceConfig.background?.mobile ?? surfaceConfig.background?.desktop),
    },
    overlays: {
      dots: resolveHeroAsset(surfaceConfig.overlays?.dots),
      field: resolveHeroAsset(surfaceConfig.overlays?.field),
    },
    particles: resolveHeroAsset(surfaceConfig.particles),
    grain: {
      desktop: resolveHeroAsset(surfaceConfig.grain?.desktop),
      mobile: resolveHeroAsset(surfaceConfig.grain?.mobile ?? surfaceConfig.grain?.desktop),
    },
    motion: (surfaceConfig.motion ?? [])
      .map((entry) => resolveHeroAsset(entry))
      .filter(Boolean) as ResolvedHeroSurfaceConfig["motion"],
    video: resolveHeroAsset(surfaceConfig.video),
  };
}

export function ensureSurfacePaths(surfaceConfig: HeroSurfaceConfig): HeroSurfaceConfig {
  return {
    ...surfaceConfig,
    waveMask: {
      desktop: ensureHeroAssetPath(surfaceConfig.waveMask?.desktop),
      mobile: ensureHeroAssetPath(surfaceConfig.waveMask?.mobile ?? surfaceConfig.waveMask?.desktop),
    },
    background: {
      desktop: ensureHeroAssetPath(surfaceConfig.background?.desktop),
      mobile: ensureHeroAssetPath(surfaceConfig.background?.mobile ?? surfaceConfig.background?.desktop),
    },
    overlays: {
      dots: ensureHeroAssetPath(surfaceConfig.overlays?.dots),
      field: ensureHeroAssetPath(surfaceConfig.overlays?.field),
    },
    particles: ensureHeroAssetPath(surfaceConfig.particles),
    grain: {
      desktop: ensureHeroAssetPath(surfaceConfig.grain?.desktop),
      mobile: ensureHeroAssetPath(surfaceConfig.grain?.mobile ?? surfaceConfig.grain?.desktop),
    },
    motion: surfaceConfig.motion?.map((entry) => ensureHeroAssetPath(entry)).filter(Boolean) as string[] | undefined,
    video: ensureHeroAssetPath(surfaceConfig.video),
  };
}
