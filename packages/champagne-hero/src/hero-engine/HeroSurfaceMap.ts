import { ensureHeroAssetPath, resolveHeroAsset } from "../HeroAssetRegistry";
import type {
  HeroSurfaceConfig,
  HeroSurfaceLayer,
  HeroSurfaceLayerDefinition,
  HeroSurfaceLayerRef,
  HeroSurfaceLayerResolved,
  HeroSurfaceTokenConfig,
  ResolvedHeroSurfaceConfig,
  HeroSurfaceStackLayer,
} from "./HeroConfig";

type HeroSurfaceKey = string;

interface HeroSurfaceStackDefinition {
  id?: string;
  role?: "background" | "fx";
  token?: string;
  prmSafe?: boolean;
}

export interface HeroSurfaceDefinitionMap {
  waveMasks?: Record<string, HeroSurfaceLayerDefinition>;
  waveBackgrounds?: Record<string, { desktop?: HeroSurfaceLayerDefinition; mobile?: HeroSurfaceLayerDefinition }>;
  gradients?: Record<string, string>;
  overlays?: Record<string, HeroSurfaceLayerDefinition>;
  particles?: Record<string, HeroSurfaceLayerDefinition>;
  grain?: Record<string, HeroSurfaceLayerDefinition>;
  motion?: Record<string, HeroSurfaceLayerDefinition>;
  video?: Record<string, HeroSurfaceLayerDefinition>;
  surfaceStack?: HeroSurfaceStackDefinition[];
}

const SURFACE_TOKEN_CLASS_MAP: Record<string, string> = {
  "gradient.base": "hero-surface-layer hero-surface--gradient-field",
  "mask.waveHeader": "hero-surface-layer hero-surface--wave-mask",
  "field.waveBackdrop": "hero-surface-layer hero-surface--wave-backdrop",
  "field.waveRings": "hero-surface-layer hero-surface--wave-field",
  "field.dotGrid": "hero-surface-layer hero-surface--dot-field",
  "overlay.filmGrain": "hero-surface-layer hero-surface--film-grain",
  "overlay.particles": "hero-surface-layer hero-surface--particles",
  "overlay.caustics": "hero-surface-layer hero-surface--caustics",
  "overlay.glassShimmer": "hero-surface-layer hero-surface--glass-shimmer",
  "overlay.goldDust": "hero-surface-layer hero-surface--gold-dust",
  "overlay.particlesDrift": "hero-surface-layer hero-surface--particles-drift",
  "overlay.lighting": "hero-surface-layer hero-surface--lighting",
  "hero.contentFrame": "hero-surface-layer hero-surface--content-frame",
};

const LAYER_DEFAULTS: Record<string, Partial<HeroSurfaceLayerDefinition>> = {
  "mask.waveHeader": { blendMode: "soft-light", opacity: 0.92 },
  "field.waveBackdrop": { blendMode: "screen", opacity: 0.55 },
  "field.waveRings": { blendMode: "overlay", opacity: 0.45 },
  "field.dotGrid": { blendMode: "soft-light", opacity: 0.45 },
  "overlay.caustics": { blendMode: "screen" },
  "overlay.glassShimmer": { blendMode: "luminosity", opacity: 0.85 },
  "overlay.goldDust": { blendMode: "screen", opacity: 0.7 },
  "overlay.particlesDrift": { blendMode: "screen" },
  "overlay.particles": { blendMode: "screen" },
  "overlay.filmGrain": { blendMode: "multiply", opacity: 0.25 },
  "overlay.lighting": { blendMode: "soft-light", opacity: 0.82 },
};

const SURFACE_STACK_ORDER: { token: string; role: "background" | "fx"; prmSafe?: boolean; motion?: boolean }[] = [
  { token: "gradient.base", role: "background", prmSafe: true },
  { token: "field.waveBackdrop", role: "background", prmSafe: true },
  { token: "field.waveRings", role: "background", prmSafe: true },
  { token: "mask.waveHeader", role: "background", prmSafe: true },
  { token: "field.dotGrid", role: "background", prmSafe: true },
  { token: "overlay.caustics", role: "fx", prmSafe: false, motion: true },
  { token: "overlay.glassShimmer", role: "fx", prmSafe: false, motion: true },
  { token: "overlay.goldDust", role: "fx", prmSafe: false, motion: true },
  { token: "overlay.particlesDrift", role: "fx", prmSafe: false, motion: true },
  { token: "overlay.particles", role: "fx", prmSafe: true },
  { token: "overlay.filmGrain", role: "fx", prmSafe: true },
  { token: "overlay.lighting", role: "fx", prmSafe: true },
  { token: "hero.contentFrame", role: "background", prmSafe: true },
];

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
  const manifestRecord = manifest as Record<string, unknown>;
  const mergedWaveMasks = {
    ...(manifestRecord.waveMasks as Record<string, unknown>),
    ...(manifestRecord.mask as Record<string, unknown>),
  };
  const mergedGradients = {
    ...(manifestRecord.gradients as Record<string, unknown>),
    ...(manifestRecord.gradient as Record<string, unknown>),
  };
  const mergedOverlays = {
    ...(manifestRecord.overlays as Record<string, unknown>),
    ...(manifestRecord.field ? { field: manifestRecord.field } : {}),
    ...(manifestRecord.dots ? { dots: manifestRecord.dots } : {}),
    ...(manifestRecord.lighting ? { lighting: manifestRecord.lighting } : {}),
  };
  const mergedMotion = {
    ...(manifestRecord.motion as Record<string, unknown>),
    ...(manifestRecord.caustics ? { caustics: manifestRecord.caustics } : {}),
    ...(manifestRecord.shimmer ? { shimmer: manifestRecord.shimmer } : {}),
    ...(manifestRecord.particlesDrift ? { particlesDrift: manifestRecord.particlesDrift } : {}),
  };
  return {
    waveMasks: normalizeRecord(mergedWaveMasks),
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
    gradients: normalizeGradients(mergedGradients),
    overlays: normalizeRecord(mergedOverlays),
    particles: normalizeRecord((manifest as Record<string, unknown>).particles),
    grain: normalizeRecord((manifest as Record<string, unknown>).grain),
    motion: normalizeRecord(mergedMotion),
    video: normalizeRecord((manifest as Record<string, unknown>).video),
    surfaceStack: (() => {
      const stack = (manifest as Record<string, unknown>).surfaceStack;
      if (!Array.isArray(stack)) return [];
      return stack
        .map((entry) => (typeof entry === "object" ? (entry as HeroSurfaceStackDefinition) : undefined))
        .filter(Boolean) as HeroSurfaceStackDefinition[];
    })(),
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

function withLayerDefaults(layer: HeroSurfaceLayer | undefined, token?: string): HeroSurfaceLayer | undefined {
  if (!token) return layer;
  const defaults = LAYER_DEFAULTS[token];
  const className = SURFACE_TOKEN_CLASS_MAP[token];
  if (!defaults && !className) return layer;
  const blendedOpacity = layer?.opacity ?? defaults?.opacity;
  const opacity =
    token === "overlay.filmGrain" && typeof blendedOpacity === "number"
      ? Math.min(blendedOpacity, 0.35)
      : blendedOpacity;
  return {
    ...defaults,
    ...layer,
    id: layer?.id ?? token,
    blendMode: layer?.blendMode ?? defaults?.blendMode,
    opacity,
    className: layer?.className ?? className,
    prmSafe: layer?.prmSafe ?? defaults?.prmSafe,
  } satisfies HeroSurfaceLayer;
}

const MOTION_PRIORITY: Record<string, number> = {
  "overlay.caustics": 1,
  "overlay.glassShimmer": 2,
  "overlay.particlesDrift": 3,
  "overlay.goldDust": 4,
};

function getLayerRefKey(entry?: HeroSurfaceLayerRef): HeroSurfaceKey | undefined {
  if (!entry) return undefined;
  if (typeof entry === "string") return entry;
  const layerId = (entry as HeroSurfaceLayer)?.id;
  if (typeof layerId === "string") return layerId;
  const assetKey = (entry as HeroSurfaceLayerDefinition).asset;
  return typeof assetKey === "string" ? assetKey : undefined;
}

function normalizeMotionTokens(tokens: HeroSurfaceTokenConfig): HeroSurfaceLayerRef[] {
  const stack: HeroSurfaceLayerRef[] = [];
  const seen = new Set<HeroSurfaceKey>();
  const enqueue = (entry?: HeroSurfaceLayerRef) => {
    const key = getLayerRefKey(entry);
    if (entry && key && !seen.has(key)) {
      seen.add(key);
      stack.push(entry);
    }
  };

  enqueue(tokens.caustics);
  enqueue(tokens.shimmer);
  (tokens.motion ?? []).forEach((entry) => enqueue(entry));

    return stack.length
      ? stack.sort((a, b) => {
          const aKey = getLayerRefKey(a);
          const bKey = getLayerRefKey(b);
          const aRank: number = aKey ? MOTION_PRIORITY[aKey] ?? Number.POSITIVE_INFINITY : Number.POSITIVE_INFINITY;
          const bRank: number = bKey ? MOTION_PRIORITY[bKey] ?? Number.POSITIVE_INFINITY : Number.POSITIVE_INFINITY;
          if (aRank === bRank) return 0;
          return aRank - bRank;
        })
      : stack;
}

function mergeSurfaceTokens(
  target: HeroSurfaceTokenConfig,
  source?: HeroSurfaceTokenConfig,
): HeroSurfaceTokenConfig {
  if (!source) return target;
  return {
    mask: {
      ...target.mask,
      ...source.mask,
    },
    waveMask: {
      ...target.waveMask,
      ...source.waveMask,
    },
    background: {
      ...target.background,
      ...source.background,
    },
    gradient: source.gradient ?? target.gradient,
    field: source.field ?? target.field,
    dots: source.dots ?? target.dots,
    overlays: {
      ...target.overlays,
      ...source.overlays,
    },
    caustics: source.caustics ?? target.caustics,
    shimmer: source.shimmer ?? target.shimmer,
    lighting: source.lighting ?? target.lighting,
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
  options?: { prm?: boolean },
): HeroSurfaceConfig {
  const waveMaskToken = surfaceTokens.mask ?? surfaceTokens.waveMask;
  const overlayMap = surfaceMap.overlays ?? {};
  const motionMap = surfaceMap.motion ?? {};
  const motionTokens = normalizeMotionTokens(surfaceTokens);
  return {
    waveMask: {
      desktop: withLayerDefaults(
        resolveLayerRef(waveMaskToken?.desktop ?? surfaceTokens.waveMask?.desktop, surfaceMap.waveMasks ?? {}),
        "mask.waveHeader",
      ),
      mobile: withLayerDefaults(
        resolveLayerRef(
          waveMaskToken?.mobile ?? surfaceTokens.waveMask?.mobile ?? surfaceTokens.waveMask?.desktop,
          surfaceMap.waveMasks ?? {},
        ),
        "mask.waveHeader",
      ),
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
      dots: withLayerDefaults(resolveLayerRef(surfaceTokens.dots ?? surfaceTokens.overlays?.dots, overlayMap), "field.dotGrid"),
      field: withLayerDefaults(
        resolveLayerRef(surfaceTokens.field ?? surfaceTokens.overlays?.field, overlayMap),
        "field.waveRings",
      ),
    },
    particles: withLayerDefaults(resolveLayerRef(surfaceTokens.particles, surfaceMap.particles ?? {}), "overlay.particles"),
    grain: {
      desktop: withLayerDefaults(
        surfaceTokens.grain?.desktop
          ? resolveLayerRef(surfaceTokens.grain.desktop, surfaceMap.grain ?? {})
          : surfaceMap.grain?.desktop,
        "overlay.filmGrain",
      ),
      mobile: withLayerDefaults(
        surfaceTokens.grain?.mobile
          ? resolveLayerRef(surfaceTokens.grain.mobile, surfaceMap.grain ?? {})
          : surfaceMap.grain?.mobile ?? surfaceMap.grain?.desktop,
        "overlay.filmGrain",
      ),
    },
    motion: motionTokens
      .map((entry) => {
        const resolved = resolveLayerRef(entry, motionMap);
        const token = (typeof entry === "string" ? entry : resolved?.id) ?? undefined;
        return withLayerDefaults(resolved, token);
      })
      .filter(Boolean) as HeroSurfaceLayer[] | undefined,
    video: resolveLayerRef(surfaceTokens.video, surfaceMap.video ?? {}),
    surfaceStack: mapSurfaceStack(surfaceMap, surfaceTokens, options),
  };
}

export function mapSurfaceStack(
  surfaceMap: HeroSurfaceDefinitionMap,
  tokens: HeroSurfaceTokenConfig,
  options?: { prm?: boolean },
): HeroSurfaceStackLayer[] {
  const prm = Boolean(options?.prm);
  const includedTokens = new Set<HeroSurfaceKey>();
  const hasMotionToken = (token: string) =>
    (tokens.motion ?? []).some((entry) => {
      if (typeof entry === "string") return entry === token;
      if (typeof entry === "object") {
        const candidate = (entry as HeroSurfaceLayer).id;
        const assetCandidate = (entry as HeroSurfaceLayerDefinition).asset;
        return candidate === token || (typeof assetCandidate === "string" && assetCandidate === token);
      }
      return false;
    });
  if (tokens.gradient || surfaceMap.gradients) includedTokens.add("gradient.base");
  if (tokens.background || surfaceMap.waveBackgrounds) includedTokens.add("field.waveBackdrop");
  if (tokens.mask || tokens.waveMask) includedTokens.add("mask.waveHeader");
  if (tokens.field || tokens.overlays?.field) includedTokens.add("field.waveRings");
  if (tokens.dots || tokens.overlays?.dots) includedTokens.add("field.dotGrid");
  if (tokens.caustics || hasMotionToken("overlay.caustics")) {
    includedTokens.add("overlay.caustics");
  }
  if (tokens.shimmer || hasMotionToken("overlay.glassShimmer")) {
    includedTokens.add("overlay.glassShimmer");
  }
  if (hasMotionToken("overlay.goldDust")) {
    includedTokens.add("overlay.goldDust");
  }
  if (hasMotionToken("overlay.particlesDrift")) {
    includedTokens.add("overlay.particlesDrift");
  }
  if (tokens.particles) includedTokens.add("overlay.particles");
  if (tokens.grain?.desktop || tokens.grain?.mobile || surfaceMap.grain) includedTokens.add("overlay.filmGrain");
  if (tokens.lighting || surfaceMap.overlays?.lighting) includedTokens.add("overlay.lighting");
  includedTokens.add("hero.contentFrame");

  return SURFACE_STACK_ORDER.filter((entry) => includedTokens.has(entry.token)).map((entry) => {
    const suppressed = prm && entry.prmSafe === false;
    return {
      id: entry.token,
      role: entry.role,
      token: entry.token,
      prmSafe: entry.prmSafe,
      motion: entry.motion,
      suppressed,
      className: SURFACE_TOKEN_CLASS_MAP[entry.token] ?? `hero-surface-layer hero-surface--${entry.token}`,
    } satisfies HeroSurfaceStackLayer;
  });
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
    surfaceStack: surfaceConfig.surfaceStack,
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
    surfaceStack: surfaceConfig.surfaceStack,
  };
}
