// apps/web/app/components/hero/HeroRenderer.tsx
import type { CSSProperties, Ref } from "react";
import {
  BaseChampagneSurface,
  ensureHeroAssetPath,
  getHeroRuntime,
  type HeroMode,
  type HeroTimeOfDay,
} from "@champagne/hero";

export interface HeroRendererProps {
  mode?: HeroMode;
  treatmentSlug?: string;
  prm?: boolean;
  timeOfDay?: HeroTimeOfDay;
  particles?: boolean;
  filmGrain?: boolean;
  diagnosticBoost?: boolean;
  surfaceRef?: Ref<HTMLDivElement>;
}

export async function HeroRenderer({
  mode = "home",
  treatmentSlug,
  prm,
  timeOfDay,
  particles,
  filmGrain,
  diagnosticBoost = false,
  surfaceRef,
}: HeroRendererProps) {
  const runtime = await getHeroRuntime({
    mode,
    treatmentSlug,
    prm,
    timeOfDay,
    particles,
    filmGrain,
    variantId: mode === "home" ? "default" : undefined,
  });

  const { content, surfaces, layout, motion, filmGrain: grainCfg } = runtime;

  const gradient = surfaces.gradient ?? "var(--smh-gradient)";
  const prmEnabled = prm ?? runtime.flags.prm;

  const surfaceVars: CSSProperties = {
    ["--hero-gradient" as any]: gradient,

    ["--hero-wave-bg-desktop" as any]:
      surfaces.background?.desktop?.asset?.id
        ? `url("${ensureHeroAssetPath(surfaces.background.desktop.asset.id)}")`
        : undefined,

    ["--hero-wave-bg-mobile" as any]:
      surfaces.background?.mobile?.asset?.id
        ? `url("${ensureHeroAssetPath(surfaces.background.mobile.asset.id)}")`
        : undefined,

    ["--hero-wave-mask-desktop" as any]:
      surfaces.waveMask?.desktop?.asset?.id
        ? `url("${ensureHeroAssetPath(surfaces.waveMask.desktop.asset.id)}")`
        : undefined,

    ["--hero-wave-mask-mobile" as any]:
      surfaces.waveMask?.mobile?.asset?.id
        ? `url("${ensureHeroAssetPath(surfaces.waveMask.mobile.asset.id)}")`
        : undefined,

    ["--hero-overlay-rings" as any]:
      surfaces.overlays?.field?.asset?.id
        ? `url("${ensureHeroAssetPath(surfaces.overlays.field.asset.id)}")`
        : undefined,

    ["--hero-overlay-dots" as any]:
      surfaces.overlays?.dots?.asset?.id
        ? `url("${ensureHeroAssetPath(surfaces.overlays.dots.asset.id)}")`
        : undefined,

    ["--hero-grain" as any]:
      grainCfg.enabled && surfaces.grain?.desktop?.asset?.id
        ? `url("${ensureHeroAssetPath(surfaces.grain.desktop.asset.id)}")`
        : undefined,
  };

  return (
    <BaseChampagneSurface
      variant="inkGlass"
      className="hero-renderer"
      style={{
        minHeight: "72vh",
        position: "relative",
        overflow: "hidden",
        background: "var(--hero-gradient)",
        color: "var(--text-high)",
      }}
    >
      <style>{`
        .hero-stack { position:absolute; inset:0; }
        .layer { position:absolute; inset:0; }

        .gradient { background: var(--hero-gradient); }

        .wave-bg {
          background-image: var(--hero-wave-bg-desktop);
          background-size: cover;
          background-position: center;
          opacity: 0.85;
        }

        .rings {
          background-image: var(--hero-overlay-rings);
          background-size: cover;
          background-position: center;
          mask-image: var(--hero-wave-mask-desktop);
          -webkit-mask-image: var(--hero-wave-mask-desktop);
          mask-size: cover;
          mask-repeat: no-repeat;
          opacity: 0.6;
        }

        .dots {
          background-image: var(--hero-overlay-dots);
          background-size: cover;
          background-position: center;
          mask-image: var(--hero-wave-mask-desktop);
          -webkit-mask-image: var(--hero-wave-mask-desktop);
          mask-size: cover;
          mask-repeat: no-repeat;
          opacity: 0.45;
        }

        .grain {
          background-image: var(--hero-grain);
          mix-blend-mode: soft-light;
          opacity: 0.35;
        }

        @media (max-width: 640px) {
          .wave-bg { background-image: var(--hero-wave-bg-mobile); }
          .rings, .dots {
            mask-image: var(--hero-wave-mask-mobile);
            -webkit-mask-image: var(--hero-wave-mask-mobile);
          }
        }
      `}</style>

      <div className="hero-stack" ref={surfaceRef} style={surfaceVars}>
        <div className="layer gradient" />
        <div className="layer wave-bg" />
        <div className="layer rings" />
        <div className="layer dots" />
        {!prmEnabled && grainCfg.enabled && <div className="layer grain" />}
      </div>

      <div
        className="hero-content"
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: layout.maxWidth ?? 960,
          padding: layout.padding ?? "clamp(2rem,4vw,3.5rem)",
        }}
      >
        <h1>{content.headline}</h1>
        <p>{content.subheadline}</p>
      </div>
    </BaseChampagneSurface>
  );
}

