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

  // behaviour gates
  prm?: boolean;
  timeOfDay?: HeroTimeOfDay;
  particles?: boolean;
  filmGrain?: boolean;

  // debugging (safe defaults, no unused vars)
  debugOpacityBoost?: number;
  diagnosticBoost?: boolean;

  // optional: lets debug pages observe computed vars + DOM
  surfaceRef?: Ref<HTMLDivElement>;
}

function HeroFallback() {
  return (
    <BaseChampagneSurface
      variant="inkGlass"
      style={{
        background: "var(--smh-gradient)",
        minHeight: "72vh",
        display: "grid",
        alignItems: "center",
        padding: "clamp(2rem, 5vw, 3.5rem)",
      }}
    >
      <div style={{ display: "grid", gap: "0.75rem", maxWidth: "960px" }}>
        <span style={{ letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-medium)" }}>
          Champagne Dentistry
        </span>
        <h1 style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)", lineHeight: 1.1 }}>A calm, cinematic hero is loading.</h1>
        <p style={{ color: "var(--text-medium)", maxWidth: "720px", lineHeight: 1.6 }}>
          Sacred hero runtime unavailable. Showing a safe gradient until it resolves.
        </p>
      </div>
    </BaseChampagneSurface>
  );
}

export async function HeroRenderer({
  mode = "home",
  treatmentSlug,
  prm,
  timeOfDay,
  particles,
  filmGrain,
  debugOpacityBoost = 1,
  diagnosticBoost = false,
  surfaceRef,
}: HeroRendererProps) {
  let runtime: Awaited<ReturnType<typeof getHeroRuntime>> | null = null;

  try {
    runtime = await getHeroRuntime({
      mode,
      treatmentSlug,
      prm,
      timeOfDay,
      particles,
      filmGrain,
      variantId: mode === "home" ? "default" : undefined,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("Hero runtime failed", error);
  }

  if (!runtime) return <HeroFallback />;

  const { content, surfaces, layout, motion, filmGrain: filmGrainSettings } = runtime;

  const prmEnabled = prm ?? runtime.flags.prm;
  const opacityBoost = Math.max(debugOpacityBoost, 0.01);
  const diagnosticMultiplier = diagnosticBoost ? 2.5 : 1;

  const apply = (v?: number) => Math.min(1, (v ?? 1) * opacityBoost);
  const applyDiag = (v?: number) => Math.min(1, apply(v) * diagnosticMultiplier);

  const gradient = surfaces.gradient ?? "var(--smh-gradient)";

  const shouldShowGrain =
    filmGrain !== false &&
    filmGrainSettings.enabled &&
    Boolean(surfaces.grain?.desktop?.path || surfaces.grain?.desktop?.asset?.id || surfaces.grain?.mobile?.path || surfaces.grain?.mobile?.asset?.id);

  const shouldShowParticles =
    particles !== false && (motion.particles?.density ?? 0) > 0 && Boolean(surfaces.particles?.path || surfaces.particles?.asset?.id);

  // CSS variable bindings (ALWAYS url(...) or empty)
  const surfaceVars: CSSProperties = {
    ["--hero-gradient" as string]: gradient,

    ["--hero-wave-mask-desktop" as string]:
      surfaces.waveMask?.desktop?.path
        ? `url("${surfaces.waveMask.desktop.path}")`
        : surfaces.waveMask?.desktop?.asset?.id
          ? `url("${ensureHeroAssetPath(surfaces.waveMask.desktop.asset.id)}")`
          : undefined,

    ["--hero-wave-mask-mobile" as string]:
      surfaces.waveMask?.mobile?.path
        ? `url("${surfaces.waveMask.mobile.path}")`
        : surfaces.waveMask?.mobile?.asset?.id
          ? `url("${ensureHeroAssetPath(surfaces.waveMask.mobile.asset.id)}")`
          : undefined,

    ["--hero-wave-background-desktop" as string]:
      surfaces.background?.desktop?.path
        ? `url("${surfaces.background.desktop.path}")`
        : surfaces.background?.desktop?.asset?.id
          ? `url("${ensureHeroAssetPath(surfaces.background.desktop.asset.id)}")`
          : undefined,

    ["--hero-wave-background-mobile" as string]:
      surfaces.background?.mobile?.path
        ? `url("${surfaces.background.mobile.path}")`
        : surfaces.background?.mobile?.asset?.id
          ? `url("${ensureHeroAssetPath(surfaces.background.mobile.asset.id)}")`
          : undefined,

    ["--hero-overlay-field" as string]:
      surfaces.overlays?.field?.path
        ? `url("${surfaces.overlays.field.path}")`
        : surfaces.overlays?.field?.asset?.id
          ? `url("${ensureHeroAssetPath(surfaces.overlays.field.asset.id)}")`
          : undefined,

    ["--hero-overlay-dots" as string]:
      surfaces.overlays?.dots?.path
        ? `url("${surfaces.overlays.dots.path}")`
        : surfaces.overlays?.dots?.asset?.id
          ? `url("${ensureHeroAssetPath(surfaces.overlays.dots.asset.id)}")`
          : undefined,

    ["--hero-particles" as string]:
      shouldShowParticles && surfaces.particles?.path
        ? `url("${surfaces.particles.path}")`
        : shouldShowParticles && surfaces.particles?.asset?.id
          ? `url("${ensureHeroAssetPath(surfaces.particles.asset.id)}")`
          : undefined,

    ["--hero-grain-desktop" as string]:
      surfaces.grain?.desktop?.path
        ? `url("${surfaces.grain.desktop.path}")`
        : surfaces.grain?.desktop?.asset?.id
          ? `url("${ensureHeroAssetPath(surfaces.grain.desktop.asset.id)}")`
          : undefined,

    ["--hero-grain-mobile" as string]:
      surfaces.grain?.mobile?.path
        ? `url("${surfaces.grain.mobile.path}")`
        : surfaces.grain?.mobile?.asset?.id
          ? `url("${ensureHeroAssetPath(surfaces.grain.mobile.asset.id)}")`
          : undefined,

    ["--hero-film-grain-opacity" as string]: applyDiag((filmGrainSettings.opacity ?? 0.28) * (surfaces.grain?.desktop?.opacity ?? 1)),
    ["--hero-film-grain-blend" as string]:
      (surfaces.grain?.desktop?.blendMode as CSSProperties["mixBlendMode"]) ?? undefined,

    ["--hero-particles-opacity" as string]:
      applyDiag((motion.particles?.density ?? 1) * (surfaces.particles?.opacity ?? 1) * 0.35),

    ["--surface-opacity-waveBackdrop" as string]: applyDiag(surfaces.background?.desktop?.opacity ?? 0.55),
    ["--surface-blend-waveBackdrop" as string]:
      (surfaces.background?.desktop?.blendMode as CSSProperties["mixBlendMode"]) ?? "screen",
  };

  const outline: CSSProperties | undefined = diagnosticBoost
    ? { outline: "1px solid var(--champagne-keyline-gold, var(--accentGold_soft))", outlineOffset: "-1px" }
    : undefined;

  // IMPORTANT: style binding keyed by *layer.id* (manifest truth)
  const styleForLayerId = (id: string): CSSProperties | undefined => {
    switch (id) {
      case "gradient.base":
        return { background: "var(--hero-gradient, var(--smh-gradient))" };

      case "field.waveBackdrop":
        return {
          backgroundImage: "var(--hero-wave-background-desktop)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          mixBlendMode: "var(--surface-blend-waveBackdrop, screen)" as CSSProperties["mixBlendMode"],
          opacity: "var(--surface-opacity-waveBackdrop, 0.55)" as unknown as number,

          // desktop mask
          maskImage: "var(--hero-wave-mask-desktop)",
          WebkitMaskImage: "var(--hero-wave-mask-desktop)",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskSize: "cover",
          WebkitMaskSize: "cover",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        };

      case "mask.waveHeader":
        // header mask is typically subtle; keep it non-destructive but available
        return {
          maskImage: "var(--hero-wave-mask-desktop)",
          WebkitMaskImage: "var(--hero-wave-mask-desktop)",
        };

      case "field.waveRings":
        return {
          backgroundImage: "var(--hero-overlay-field)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          mixBlendMode: (surfaces.overlays?.field?.blendMode as CSSProperties["mixBlendMode"]) ?? "screen",
          opacity: applyDiag(surfaces.overlays?.field?.opacity ?? 0.35),
        };

      case "field.dotGrid":
        return {
          backgroundImage: "var(--hero-overlay-dots)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          mixBlendMode: (surfaces.overlays?.dots?.blendMode as CSSProperties["mixBlendMode"]) ?? "screen",
          opacity: applyDiag(surfaces.overlays?.dots?.opacity ?? 0.25),
        };

      case "overlay.particles":
        if (!shouldShowParticles) return { display: "none" };
        return {
          backgroundImage: "var(--hero-particles)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          mixBlendMode: (surfaces.particles?.blendMode as CSSProperties["mixBlendMode"]) ?? "screen",
          opacity: "var(--hero-particles-opacity, 0.18)" as unknown as number,
        };

      case "overlay.filmGrain":
        if (!shouldShowGrain) return { display: "none" };
        return {
          backgroundImage: "var(--hero-grain-desktop)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          mixBlendMode: "var(--hero-film-grain-blend, soft-light)" as CSSProperties["mixBlendMode"],
          opacity: "var(--hero-film-grain-opacity, 0.28)" as unknown as number,
        };

      case "hero.contentFrame":
        return {
          background: "var(--champagne-glass-bg, var(--surface-glass))",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        };

      default:
        return undefined;
    }
  };

  const surfaceStack = (surfaces.surfaceStack ?? []).filter((layer) => {
    if (layer.suppressed) return false;
    if (layer.id === "overlay.particles" && !shouldShowParticles) return false;
    if (layer.id === "overlay.filmGrain" && !shouldShowGrain) return false;
    return true;
  });

  const videoEntry = surfaces.video;
  const motionEntries = surfaces.motion ?? [];

  return (
    <BaseChampagneSurface
      variant="inkGlass"
      className="hero-renderer"
      style={{
        minHeight: "72vh",
        display: "grid",
        alignItems: layout.contentAlign === "center" ? "center" : "stretch",
        overflow: "hidden",
        background: "var(--hero-gradient, var(--smh-gradient))",
        ["--hero-gradient" as string]: gradient,
        position: "relative",
        color: "var(--text-high)",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .hero-renderer .hero-surface-stack { position: absolute; inset: 0; z-index: 0; }
            .hero-renderer .hero-surface-layer { position: absolute; inset: 0; pointer-events: none; }
            .hero-renderer .hero-content { position: relative; z-index: 2; display: grid; gap: 1rem; max-width: ${layout.maxWidth ? `${layout.maxWidth}px` : "960px"}; padding: ${layout.padding ?? "clamp(2rem, 4vw, 3.5rem)"}; transform: translateY(${layout.verticalOffset ?? "0px"}); }
            .hero-renderer .hero-surface--motion { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; pointer-events: none; z-index: 1; }

            @media (max-width: 640px) {
              .hero-renderer [data-surface-id="field.waveBackdrop"] {
                background-image: var(--hero-wave-background-mobile);
                mask-image: var(--hero-wave-mask-mobile);
                -webkit-mask-image: var(--hero-wave-mask-mobile);
              }
              .hero-renderer [data-surface-id="overlay.filmGrain"] { background-image: var(--hero-grain-mobile); }
              .hero-renderer { min-height: 68vh; }
            }

            @media (prefers-reduced-motion: reduce) {
              .hero-renderer .hero-surface--motion { display: none; }
            }
          `,
        }}
      />

      <div aria-hidden className="hero-surface-stack" ref={surfaceRef} data-prm={prmEnabled ? "true" : "false"} style={surfaceVars}>
        {surfaceStack.map((layer) => (
          <div
            key={layer.id}
            data-surface-id={layer.id}
            data-surface-role={layer.role}
            className={layer.className ?? "hero-surface-layer"}
            style={{ ...(styleForLayerId(layer.id) ?? {}), ...(outline ?? {}) }}
          />
        ))}

        {!prmEnabled && videoEntry?.path && (
          <video
            className="hero-surface-layer hero-surface--motion"
            autoPlay
            playsInline
            loop
            muted
            preload="metadata"
            data-surface-id="motion.heroVideo"
            style={{
              mixBlendMode: videoEntry.blendMode as CSSProperties["mixBlendMode"],
              opacity: apply(videoEntry.opacity ?? (motion.shimmerIntensity ?? 1) * 0.85),
            }}
          >
            <source src={videoEntry.path} />
          </video>
        )}

        {!prmEnabled &&
          motionEntries.map((entry) => (
            <video
              key={entry.id}
              className={`hero-surface-layer hero-surface--motion${entry.className ? ` ${entry.className}` : ""}`}
              autoPlay
              playsInline
              loop
              muted
              preload="metadata"
              data-surface-id={entry.id}
              style={{
                mixBlendMode: entry.blendMode as CSSProperties["mixBlendMode"],
                opacity: apply(entry.opacity ?? (motion.shimmerIntensity ?? 1) * 0.85),
              }}
            >
              <source src={entry.path} />
            </video>
          ))}
      </div>

      <div
        className="hero-content"
        style={{
          justifyItems: layout.contentAlign === "center" ? "center" : "start",
          textAlign: layout.contentAlign === "center" ? "center" : "start",
        }}
      >
        {content.eyebrow && (
          <span style={{ letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-medium)" }}>
            {content.eyebrow}
          </span>
        )}
        {content.headline && <h1 style={{ fontSize: "clamp(2.2rem, 3.2vw, 3rem)", lineHeight: 1.05 }}>{content.headline}</h1>}
        {content.subheadline && (
          <p style={{ color: "var(--text-medium)", fontSize: "1.08rem", lineHeight: 1.6, maxWidth: "820px" }}>
            {content.subheadline}
          </p>
        )}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {content.cta && (
            <a
              href={content.cta.href}
              style={{
                padding: "0.9rem 1.6rem",
                borderRadius: "var(--radius-md)",
                background: "var(--surface-gold-soft, rgba(255, 215, 137, 0.16))",
                color: "var(--text-high)",
                border: "1px solid var(--champagne-keyline-gold, rgba(255, 215, 137, 0.45))",
                textDecoration: "none",
                boxShadow: "0 12px 32px rgba(0,0,0,0.3)",
              }}
            >
              {content.cta.label}
            </a>
          )}
          {content.secondaryCta && (
            <a
              href={content.secondaryCta.href}
              style={{
                padding: "0.9rem 1.2rem",
                borderRadius: "var(--radius-md)",
                background: "var(--surface-ink-soft, rgba(6,7,12,0.35))",
                color: "var(--text-high)",
                border: "1px solid var(--champagne-keyline-gold, rgba(255, 215, 137, 0.3))",
                textDecoration: "none",
              }}
            >
              {content.secondaryCta.label}
            </a>
          )}
        </div>
      </div>
    </BaseChampagneSurface>
  );
}
