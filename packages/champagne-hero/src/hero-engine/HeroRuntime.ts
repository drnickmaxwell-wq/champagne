import type {
  HeroRuntimeOptions,
  HeroRuntimeResult,
  HeroLayer,
} from "./HeroConfig";
import { sacredHeroBase, sacredHeroSurfaces } from "./HeroManifestAdapter";
import { resolveHeroAsset } from "../HeroAssetRegistry";
import { SURFACE_ROLE_MAP } from "./HeroSurfaceMap";

export function getHeroRuntime(options: HeroRuntimeOptions): HeroRuntimeResult {
  const base = sacredHeroBase;
  const surfaces = sacredHeroSurfaces;

  const prm = Boolean(options.prm);
  const content = base.content;
  const layout = base.defaults.layout;
  const motion = base.defaults.motion;
  const filmGrain = base.defaults.filmGrain ?? { enabled: true, opacity: 0.32 };

  const layers: HeroLayer[] = [];

  // Gradient base
  layers.push({
    id: "gradient.base",
    type: "gradient",
    role: "background",
    opacity: 1,
    blendMode: "normal",
    zIndex: 1,
  });

  // Surface stack from manifest
  for (const entry of surfaces.surfaceStack) {
    const token = entry.token ?? entry
         // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const role = SURFACE_ROLE_MAP[token] ?? "background";

    if (token === "field.waveBackdrop") {
      const cfg = surfaces.waveBackgrounds["field.waveBackdrop"]?.desktop;
    
      const url = resolveHeroAsset(cfg?.asset);
      if (!url) continue;
      layers.push({
        id: token,
        type: "image",
        role: "background",
        url,
        opacity: cfg?.opacity ?? 0.7,
        blendMode: cfg?.blendMode ?? "screen",
        zIndex: 2,
      });
      continue;
    }

    if (token === "field.waveRings") {
      const cfg = surfaces.overlays["field.waveRings"];
      const url = resolveHeroAsset(cfg?.asset);
      if (!url) continue;
      layers.push({
        id: token,
        type: "image",
        role: "wave",
        url,
        opacity: cfg?.opacity ?? 0.6,
        blendMode: cfg?.blendMode ?? "soft-light",
        zIndex: 3,
      });
      continue;
    }

    if (token === "field.dotGrid") {
      const cfg = surfaces.overlays["field.dotGrid"];
      const url = resolveHeroAsset(cfg?.asset);
      if (!url) continue;
      layers.push({
        id: token,
        type: "image",
        role: "dots",
        url,
        opacity: cfg?.opacity ?? 0.6,
        blendMode: cfg?.blendMode ?? "screen",
        zIndex: 4,
      });
      continue;
    }

    if (token === "overlay.particles") {
      const cfg = surfaces.particles["overlay.particlesPrimary"];
      const url = resolveHeroAsset(cfg?.asset);
      if (!url) continue;
      layers.push({
        id: token,
        type: "image",
        role: "particles",
        url,
        opacity: cfg?.opacity ?? 0.45,
        blendMode: cfg?.blendMode ?? "screen",
        zIndex: 8,
      });
      continue;
    }

    if (token === "overlay.filmGrain") {
      const cfg = surfaces.grain["overlay.filmGrain.desktop"];
      const url = resolveHeroAsset(cfg?.asset);
      if (!url) continue;
      layers.push({
        id: token,
        type: "image",
        role: "grain",
        url,
        opacity: filmGrain.enabled ? cfg?.opacity ?? filmGrain.opacity ?? 0.32 : 0,
        blendMode: cfg?.blendMode ?? "soft-light",
        zIndex: 9,
      });
      continue;
    }
  }

  // Motion layers (only if not PRM)
  if (!prm) {
    const causticsCfg = surfaces.motion["overlay.caustics"];
    const causticsUrl = resolveHeroAsset(causticsCfg?.asset);
    if (causticsUrl) {
      layers.push({
        id: "overlay.caustics",
        type: "video",
        role: "fx",
        url: causticsUrl,
        opacity: causticsCfg?.opacity ?? 0.45,
        blendMode: causticsCfg?.blendMode ?? "screen",
        zIndex: 6,
      });
    }

    const shimmerCfg = surfaces.motion["overlay.glassShimmer"];
    const shimmerUrl = resolveHeroAsset(shimmerCfg?.asset);
    if (shimmerUrl) {
      layers.push({
        id: "overlay.glassShimmer",
        type: "video",
        role: "fx",
        url: shimmerUrl,
        opacity: shimmerCfg?.opacity ?? 0.85,
        blendMode: shimmerCfg?.blendMode ?? "screen",
        zIndex: 7,
      });
    }

    const goldCfg = surfaces.motion["overlay.goldDust"];
    const goldUrl = resolveHeroAsset(goldCfg?.asset);
    if (goldUrl) {
      layers.push({
        id: "overlay.goldDust",
        type: "video",
        role: "fx",
        url: goldUrl,
        opacity: goldCfg?.opacity ?? 0.7,
        blendMode: goldCfg?.blendMode ?? "screen",
        zIndex: 7,
      });
    }

    const driftCfg = surfaces.motion["overlay.particlesDrift"];
    const driftUrl = resolveHeroAsset(driftCfg?.asset);
    if (driftUrl) {
      layers.push({
        id: "overlay.particlesDrift",
        type: "video",
        role: "fx",
        url: driftUrl,
        opacity: driftCfg?.opacity ?? 0.6,
        blendMode: driftCfg?.blendMode ?? "screen",
        zIndex: 8,
      });
    }

    const heroVideoCfg = surfaces.video["hero.video"];
    const heroVideoUrl = resolveHeroAsset(heroVideoCfg?.asset);
    if (heroVideoUrl) {
      layers.push({
        id: "hero.video",
        type: "video",
        role: "video",
        url: heroVideoUrl,
        opacity: 0.85,
        blendMode: heroVideoCfg?.blendMode ?? "screen",
        zIndex: 5,
      });
    }
  }

  const result: HeroRuntimeResult = {
    mode: options.mode,
    variant: { id: options.variantId ?? "default", label: "Sacred Home Hero" },
    content,
    layout,
    layers,
    motion,
    filmGrain,
    flags: {
      prm,
    },
  };

  return result;
}
