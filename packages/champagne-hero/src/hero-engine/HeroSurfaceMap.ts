import { ensureHeroAssetPath, resolveHeroAsset } from "../HeroAssetRegistry";
import type {
  HeroSurfaceConfig,
  HeroSurfaceLayer,
  HeroSurfaceLayerDefinition,
  HeroSurfaceLayerRef,
  HeroSurfaceLayerResolved,
  HeroSurfaceTokenConfig,
  ResolvedHeroSurfaceConfig,
} from "./HeroConfig";

export interface HeroSurfaceDefinitionMap {
  waveMasks?: Record<string, HeroSurfaceLayerDefinition>;
  waveBackgrounds?: Record<string, { desktop?: HeroSurfaceLayerDefinition; mobile?: HeroSurfaceLayerDefinition }>;
  gradients?: Record<string, string>;
  overlays?: Record<string, HeroSurfaceLayerDefinition>;
  particles?: Record<string, HeroSurfaceLayerDefinition>;
  grain?: Record<string, HeroSurfaceLayerDefinition>;
  motion?: Record<string, HeroSurfaceLayerDefinition>;
  video?: Record<string, HeroSurfaceLayerDefinition>;
}

function normalizeLayer(entry: unknown): HeroSurfaceLayerDefinition | undefined {
  if (!entry) return undefined;
  if (typeof entry === "string") return { asset: entry };
  if (typeof entry !== "object") return undefined;
  const record = entry as Record<string, unknown>;
  const asset = typeof record.asset === "string" ? record.asset : undefined;
  const blendMode = typeof record.blendMode === "string" ? record.blendMode : undefined;
  const className = typeof record.className === "string" ? record.className : undefined;
  const opacity = typeof record.opacity === "number" ? record.opacity : undefined;
  const prmSafe = typeof record.prmSafe === "boolean" ? record.prmSafe : undefined;

  if (!asset && !blendMode && !className && opacity === undefined && prmSafe === undefined) return undefined;

  return { asset, blendMode, className, opacity, prmSafe };
}

function normalizeRecord(entry: unknown): Record<string, HeroSurfaceLayerDefinition> {
  if (!entry || typeof entry !== "object") return {};
  return Object.entries(entry as Record<string, unknown>)
    .map(([key, value]) => [key, normalizeLayer(value)] as const)
    .filter(([, value]) => Boolean(value))
    .reduce<Record<string, HeroSurfaceLayerDefinition>>((acc, [key, value]) => {
      acc[key] = value as HeroSurfaceLayerDefinition;
      return acc;
    }, {});
}

function normalizeGradients(entry: unknown): Record<string, string> {
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
      return Object.entries(entry as Record<string, unknown>).reduce<
        Record<string, { desktop?: HeroSurfaceLayerDefinition; mobile?: HeroSurfaceLayerDefinition }>
      >(
        (acc, [key, value]) => {
          if (!value || typeof value !== "object") return acc;
          const desktop = (value as Record<string, unknown>).desktop;
          const mobile = (value as Record<string, unknown>).mobile;
          acc[key] = {
            desktop: normalizeLayer(desktop),
            mobile: normalizeLayer(mobile),
          };
          return acc;
        },
        {},
      );
    })(),
    gradients: normalizeGradients((manifest as Record<string, unknown>).gradients),
    overlays: normalizeRecord((manifest as Record<string, unknown>).overlays),
    particles: normalizeRecord((manifest as Record<string, unknown>).particles),
    grain: normalizeRecord((manifest as Record<string, unknown>).grain),
    motion: normalizeRecord((manifest as Record<string, unknown>).motion),
    video: normalizeRecord((manifest as Record<string, unknown>).video),
  };
}

function resolveLayerRef(
  ref: HeroSurfaceLayerRef | undefined,
  map: Record<string, HeroSurfaceLayerDefinition>,
): HeroSurfaceLayer | undefined {
  if (!ref) return undefined;

  if (typeof ref === "string") {
    const mapped = map[ref];
    if (mapped) {
      const assetKey = typeof mapped.asset === "string" ? mapped.asset : ref;
      return { ...mapped, id: assetKey };
    }
    return { id: ref, asset: ref };
  }

  const normalized = normalizeLayer(ref);
  const assetKey = typeof normalized?.asset === "string" ? normalized.asset : undefined;
  if (assetKey && map[assetKey]) {
    return { ...map[assetKey], ...normalized, id: assetKey };
  }

  return normalized
    ? { ...normalized, id: assetKey ?? (typeof normalized.asset === "string" ? normalized.asset : undefined) }
    : undefined;
}

function definitionToLayer(definition?: HeroSurfaceLayerDefinition, token?: string): HeroSurfaceLayer | undefined {
  if (!definition) return undefined;
  return {
    ...definition,
    id: typeof definition.asset === "string" ? definition.asset : token,
  };
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
      desktop: resolveLayerRef(surfaceTokens.waveMask?.desktop, surfaceMap.waveMasks ?? {}),
      mobile: resolveLayerRef(surfaceTokens.waveMask?.mobile ?? surfaceTokens.waveMask?.desktop, surfaceMap.waveMasks ?? {}),
    },
    background: (() => {
      const backgroundToken = surfaceTokens.background?.desktop ?? surfaceTokens.background?.mobile;
      const backgroundDefinition =
        typeof backgroundToken === "string" ? surfaceMap.waveBackgrounds?.[backgroundToken] : undefined;
      const fallbackBackground = surfaceMap.waveBackgrounds?.primary;
      const desktopRef = surfaceTokens.background?.desktop;
      const mobileRef = surfaceTokens.background?.mobile;
      return {
        desktop:
          definitionToLayer(backgroundDefinition?.desktop, backgroundToken as string)
            ?? (typeof desktopRef === "string"
              ? definitionToLayer(surfaceMap.waveBackgrounds?.[desktopRef]?.desktop, desktopRef)
              : definitionToLayer(normalizeLayer(desktopRef)))
            ?? (typeof mobileRef === "string"
              ? definitionToLayer(surfaceMap.waveBackgrounds?.[mobileRef]?.desktop, mobileRef)
              : undefined)
            ?? definitionToLayer(fallbackBackground?.desktop),
        mobile:
          definitionToLayer(backgroundDefinition?.mobile, backgroundToken as string)
            ?? (typeof mobileRef === "string"
              ? definitionToLayer(surfaceMap.waveBackgrounds?.[mobileRef]?.mobile, mobileRef)
              : definitionToLayer(normalizeLayer(mobileRef)))
            ?? definitionToLayer(backgroundDefinition?.desktop, backgroundToken as string)
            ?? definitionToLayer(fallbackBackground?.mobile)
            ?? definitionToLayer(fallbackBackground?.desktop),
      };
    })(),
    gradient: surfaceTokens.gradient ? surfaceMap.gradients?.[surfaceTokens.gradient] ?? surfaceTokens.gradient : undefined,
    overlays: {
      dots: resolveLayerRef(surfaceTokens.overlays?.dots, surfaceMap.overlays ?? {}),
      field: resolveLayerRef(surfaceTokens.overlays?.field, surfaceMap.overlays ?? {}),
    },
    particles: resolveLayerRef(surfaceTokens.particles, surfaceMap.particles ?? {}),
    grain: {
      desktop: surfaceTokens.grain?.desktop
        ? resolveLayerRef(surfaceTokens.grain.desktop, surfaceMap.grain ?? {})
        : surfaceMap.grain?.desktop,
      mobile: surfaceTokens.grain?.mobile
        ? resolveLayerRef(surfaceTokens.grain.mobile, surfaceMap.grain ?? {})
        : surfaceMap.grain?.mobile ?? surfaceMap.grain?.desktop,
    },
    motion: surfaceTokens.motion
      ?.map((entry) => resolveLayerRef(entry, surfaceMap.motion ?? {}))
      .filter(Boolean) as HeroSurfaceLayer[] | undefined,
    video: resolveLayerRef(surfaceTokens.video, surfaceMap.video ?? {}),
  };
}

function resolveLayer(layer?: HeroSurfaceLayer): HeroSurfaceLayerResolved | undefined {
  if (!layer?.asset && !layer?.id) return layer as HeroSurfaceLayerResolved | undefined;
  const assetRef = typeof layer.asset === "string" ? layer.asset : layer.id;
  const assetEntry = typeof layer.asset === "object" && "path" in layer.asset ? layer.asset : resolveHeroAsset(assetRef);
  const path = assetEntry?.path ?? (typeof layer.asset === "object" && "path" in layer.asset ? layer.asset.path : layer.path);
  return assetEntry
    ? ({
        ...layer,
        id: typeof layer.asset === "string" ? layer.asset : layer.id,
        asset: assetEntry,
        path,
      } as HeroSurfaceLayerResolved)
    : (layer as HeroSurfaceLayerResolved);
}

export function resolveHeroSurfaceAssets(surfaceConfig: HeroSurfaceConfig): ResolvedHeroSurfaceConfig {
  return {
    waveMask: {
      desktop: resolveLayer(surfaceConfig.waveMask?.desktop),
      mobile: resolveLayer(surfaceConfig.waveMask?.mobile ?? surfaceConfig.waveMask?.desktop),
    },
    background: {
      desktop: resolveLayer(surfaceConfig.background?.desktop),
      mobile: resolveLayer(surfaceConfig.background?.mobile ?? surfaceConfig.background?.desktop),
    },
    gradient: surfaceConfig.gradient,
    overlays: {
      dots: resolveLayer(surfaceConfig.overlays?.dots),
      field: resolveLayer(surfaceConfig.overlays?.field),
    },
    particles: resolveLayer(surfaceConfig.particles),
    grain: {
      desktop: resolveLayer(surfaceConfig.grain?.desktop),
      mobile: resolveLayer(surfaceConfig.grain?.mobile ?? surfaceConfig.grain?.desktop),
    },
    motion: (surfaceConfig.motion ?? [])
      .map((entry) => resolveLayer(entry))
      .filter(Boolean) as ResolvedHeroSurfaceConfig["motion"],
    video: resolveLayer(surfaceConfig.video),
  };
}

function ensureLayerPath(layer?: HeroSurfaceLayer): HeroSurfaceLayer | undefined {
  if (!layer) return undefined;
  const path = ensureHeroAssetPath(typeof layer.asset === "string" ? layer.asset : layer.id);
  return path ? { ...layer, path } : layer;
}

export function ensureSurfacePaths(surfaceConfig: HeroSurfaceConfig): HeroSurfaceConfig {
  return {
    ...surfaceConfig,
    waveMask: {
      desktop: ensureLayerPath(surfaceConfig.waveMask?.desktop),
      mobile: ensureLayerPath(surfaceConfig.waveMask?.mobile ?? surfaceConfig.waveMask?.desktop),
    },
    background: {
      desktop: ensureLayerPath(surfaceConfig.background?.desktop),
      mobile: ensureLayerPath(surfaceConfig.background?.mobile ?? surfaceConfig.background?.desktop),
    },
    gradient: surfaceConfig.gradient,
    overlays: {
      dots: ensureLayerPath(surfaceConfig.overlays?.dots),
      field: ensureLayerPath(surfaceConfig.overlays?.field),
    },
    particles: ensureLayerPath(surfaceConfig.particles),
    grain: {
      desktop: ensureLayerPath(surfaceConfig.grain?.desktop),
      mobile: ensureLayerPath(surfaceConfig.grain?.mobile ?? surfaceConfig.grain?.desktop),
    },
    motion: surfaceConfig.motion?.map((entry) => ensureLayerPath(entry)).filter(Boolean) as HeroSurfaceLayer[] | undefined,
    video: ensureLayerPath(surfaceConfig.video),
  };
}
