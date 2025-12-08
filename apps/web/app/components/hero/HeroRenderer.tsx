import type { CSSProperties } from "react";
import { BaseChampagneSurface, getHeroRuntime, type HeroMode, type HeroTimeOfDay } from "@champagne/hero";

export interface HeroRendererProps {
  mode?: HeroMode;
  treatmentSlug?: string;
  prm?: boolean;
  timeOfDay?: HeroTimeOfDay;
  particles?: boolean;
  filmGrain?: boolean;
}

function HeroFallback() {
  return (
    <BaseChampagneSurface
      variant="inkGlass"
      style={{
        background: "var(--smh-gradient)",
        minHeight: "48vh",
        display: "grid",
        alignItems: "center",
        padding: "clamp(2rem, 5vw, 3.5rem)",
      }}
    >
      <div style={{ display: "grid", gap: "0.75rem", maxWidth: "960px" }}>
        <span style={{ letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-medium)" }}>
          Champagne Dentistry
        </span>
        <h1 style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)", lineHeight: 1.1 }}>
          A calm, cinematic hero is loading.
        </h1>
        <p style={{ color: "var(--text-medium)", maxWidth: "720px", lineHeight: 1.6 }}>
          Sacred hero assets are unavailable. Showing a safe gradient surface until the manifest is ready.
        </p>
      </div>
    </BaseChampagneSurface>
  );
}

export async function HeroRenderer({ mode = "home", treatmentSlug, prm, timeOfDay, particles, filmGrain }: HeroRendererProps) {
  let runtime: Awaited<ReturnType<typeof getHeroRuntime>> | null = null;
  // TODO: Wire treatmentSlug directly from the treatment page router when that context is available.

  try {
    runtime = await getHeroRuntime({ mode, treatmentSlug, prm, timeOfDay, particles, filmGrain });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Hero runtime failed", error);
    }
  }

  if (!runtime) return <HeroFallback />;

  const { content, surfaces, layout, motion, filmGrain: filmGrainSettings } = runtime;
  const gradient = surfaces.gradient ?? "var(--smh-gradient)";
  const motionEntries = surfaces.motion ?? [];
  const videoEntry = surfaces.video;
  const shouldShowGrain = Boolean(filmGrainSettings.enabled && (surfaces.grain?.desktop || surfaces.grain?.mobile));
  const shouldShowParticles = Boolean((motion.particles?.density ?? 0) > 0 && surfaces.particles?.path);
  const surfaceVars: CSSProperties = {
    ["--hero-gradient" as string]: gradient,
    ["--hero-wave-background-desktop" as string]: surfaces.background?.desktop?.path
      ? `url(${surfaces.background.desktop.path})`
      : undefined,
    ["--hero-wave-background-mobile" as string]: surfaces.background?.mobile?.path
      ? `url(${surfaces.background.mobile.path})`
      : undefined,
    ["--hero-wave-mask-desktop" as string]: surfaces.waveMask?.desktop?.path
      ? `url(${surfaces.waveMask.desktop.path})`
      : undefined,
    ["--hero-wave-mask-mobile" as string]: surfaces.waveMask?.mobile?.path
      ? `url(${surfaces.waveMask.mobile.path})`
      : undefined,
  };

  const overlayDefaults: CSSProperties = {
    mixBlendMode: "screen",
    opacity: 0.7,
  };

  const resolveBlendMode = (value?: string) => value as CSSProperties["mixBlendMode"] | undefined;

  const grainOpacity = (filmGrainSettings.opacity ?? 0.28) * (surfaces.grain?.desktop?.opacity ?? 1);
  const particleOpacity = (motion.particles?.density ?? 1) * (surfaces.particles?.opacity ?? 1) * 0.35;

  return (
    <BaseChampagneSurface
      variant="inkGlass"
      style={{
        minHeight: "60vh",
        display: "grid",
        alignItems: layout.contentAlign === "center" ? "center" : "stretch",
        overflow: "hidden",
        background: "var(--hero-gradient)",
        ...surfaceVars,
      }}
      className="hero-renderer"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .hero-renderer {
              position: relative;
              background: var(--hero-gradient, var(--smh-gradient));
              color: var(--text-high);
            }
            .hero-renderer .hero-layer {
              position: absolute;
              inset: 0;
              z-index: 0;
            }
            .hero-renderer .hero-layer.wave {
              background-image: var(--hero-wave-background-desktop);
              background-size: cover;
              background-repeat: no-repeat;
              mask-image: var(--hero-wave-mask-desktop);
              -webkit-mask-image: var(--hero-wave-mask-desktop);
              mask-size: cover;
              -webkit-mask-size: cover;
              background-position: center;
              opacity: 0.92;
              pointer-events: none;
            }
            .hero-renderer .hero-layer.overlay {
              background-repeat: no-repeat;
              background-size: cover;
              background-position: center;
              pointer-events: none;
            }
            .hero-renderer .hero-layer.particles {
              background-repeat: no-repeat;
              background-size: cover;
              background-position: center;
              pointer-events: none;
            }
            .hero-renderer .hero-layer.grain {
              background-repeat: repeat;
              background-size: cover;
              pointer-events: none;
            }
            .hero-renderer .hero-layer.motion {
              object-fit: cover;
              width: 100%;
              height: 100%;
              pointer-events: none;
            }
            .hero-renderer .hero-content {
              position: relative;
              z-index: 2;
              display: grid;
              gap: 1rem;
              max-width: ${layout.maxWidth ? `${layout.maxWidth}px` : "960px"};
              padding: ${layout.padding ?? "clamp(2rem, 4vw, 3.5rem)"};
              transform: translateY(${layout.verticalOffset ?? "0px"});
            }
            @media (max-width: 640px) {
              .hero-renderer {
                background: var(--hero-gradient, var(--smh-gradient));
              }
              .hero-renderer .hero-layer.wave {
                mask-image: var(--hero-wave-mask-mobile, var(--hero-wave-mask-desktop));
                -webkit-mask-image: var(--hero-wave-mask-mobile, var(--hero-wave-mask-desktop));
                background-image: var(--hero-wave-background-mobile, var(--hero-wave-background-desktop));
              }
            }
            @media (prefers-reduced-motion: reduce) {
              .hero-renderer .hero-layer.motion { display: none; }
              .hero-renderer .hero-layer.particles { opacity: 0.12; }
            }
          `,
        }}
      />

      <div
        aria-hidden
        className="hero-layer wave"
      />

      {surfaces.overlays?.field?.path && (
        <div
          aria-hidden
          className="hero-layer overlay field"
          style={{
            ...overlayDefaults,
            backgroundImage: `url(${surfaces.overlays.field.path})`,
            mixBlendMode: resolveBlendMode(surfaces.overlays.field.blendMode) ?? overlayDefaults.mixBlendMode,
            opacity: surfaces.overlays.field.opacity ?? overlayDefaults.opacity,
          }}
        />
      )}
      {surfaces.overlays?.dots?.path && (
        <div
          aria-hidden
          className="hero-layer overlay dots"
          style={{
            ...overlayDefaults,
            backgroundImage: `url(${surfaces.overlays.dots.path})`,
            mixBlendMode: resolveBlendMode(surfaces.overlays.dots.blendMode) ?? overlayDefaults.mixBlendMode,
            opacity: surfaces.overlays.dots.opacity ?? 0.6,
          }}
        />
      )}
      {shouldShowParticles && surfaces.particles?.path && (
        <div
          aria-hidden
          className="hero-layer particles"
          style={{
            backgroundImage: `url(${surfaces.particles.path})`,
            mixBlendMode: resolveBlendMode(surfaces.particles.blendMode) ?? "screen",
            opacity: particleOpacity,
          }}
        />
      )}

      {videoEntry?.path && (
        <video
          className="hero-layer motion"
          autoPlay
          playsInline
          loop
          muted
          preload="metadata"
          poster={surfaces.background?.desktop?.path}
          style={{
            mixBlendMode: resolveBlendMode(videoEntry.blendMode) ?? "screen",
            opacity: videoEntry.opacity ?? (motion.shimmerIntensity ?? 1) * 0.85,
          }}
        >
          <source src={videoEntry.path} />
        </video>
      )}

      {motionEntries.map((entry) => (
        <video
          key={entry.id}
          className={`hero-layer motion${entry.className ? ` ${entry.className}` : ""}`}
          autoPlay
          playsInline
          loop
          muted
          preload="metadata"
          style={{
            mixBlendMode: resolveBlendMode(entry.blendMode) ?? "screen",
            opacity: entry.opacity ?? (motion.shimmerIntensity ?? 1) * 0.85,
          }}
        >
          <source src={entry.path} />
        </video>
      ))}

      {shouldShowGrain && (
        <div
          aria-hidden
          className="hero-layer grain"
          style={{
            backgroundImage: surfaces.grain?.mobile?.path
              ? `url(${surfaces.grain.mobile.path})`
              : surfaces.grain?.desktop?.path
                ? `url(${surfaces.grain.desktop.path})`
                : undefined,
            mixBlendMode: resolveBlendMode(surfaces.grain?.desktop?.blendMode) ?? "soft-light",
            opacity: grainOpacity,
          }}
        />
      )}

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
        {content.headline && (
          <h1 style={{ fontSize: "clamp(2.2rem, 3.2vw, 3rem)", lineHeight: 1.05 }}>
            {content.headline}
          </h1>
        )}
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
