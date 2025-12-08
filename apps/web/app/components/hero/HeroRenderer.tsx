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
  const surfaceVars: CSSProperties = {
    ["--hero-gradient" as string]: surfaces.gradient ?? "var(--smh-gradient)",
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
    ["--hero-overlay-dots" as string]: surfaces.overlays?.dots?.path
      ? `url(${surfaces.overlays.dots.path})`
      : undefined,
    ["--hero-overlay-field" as string]: surfaces.overlays?.field?.path
      ? `url(${surfaces.overlays.field.path})`
      : undefined,
    ["--hero-particles" as string]: surfaces.particles?.path
      ? `url(${surfaces.particles.path})`
      : undefined,
    ["--hero-grain-desktop" as string]: surfaces.grain?.desktop?.path
      ? `url(${surfaces.grain.desktop.path})`
      : undefined,
    ["--hero-grain-mobile" as string]: surfaces.grain?.mobile?.path
      ? `url(${surfaces.grain.mobile.path})`
      : undefined,
    ["--hero-film-grain-opacity" as string]: filmGrainSettings.opacity ?? 0.28,
    ["--hero-particle-opacity" as string]: (motion.particles?.density ?? 1) * 0.35,
    ["--hero-motion-opacity" as string]: (motion.shimmerIntensity ?? 1) * 0.85,
  };

  const motionEntries = surfaces.motion ?? [];
  const videoEntry = surfaces.video;
  const shouldShowGrain = Boolean(filmGrainSettings.enabled && (surfaces.grain?.desktop || surfaces.grain?.mobile));
  const shouldShowParticles = Boolean((motion.particles?.density ?? 0) > 0 && surfaces.particles?.path);

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
            .hero-renderer .hero-layer.field {
              background-image: var(--hero-overlay-field);
              background-size: cover;
              background-repeat: no-repeat;
              background-position: center;
              opacity: 0.75;
              mix-blend-mode: soft-light;
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
              opacity: 0.9;
              pointer-events: none;
            }
            .hero-renderer .hero-layer.overlay {
              mix-blend-mode: screen;
              opacity: 0.65;
              background-repeat: no-repeat;
              background-size: cover;
              pointer-events: none;
            }
            .hero-renderer .hero-layer.overlay.field {
              background-image: var(--hero-overlay-field);
            }
            .hero-renderer .hero-layer.overlay.dots {
              background-image: var(--hero-overlay-dots);
            }
            .hero-renderer .hero-layer.grain {
              background-image: var(--hero-grain-desktop);
              background-repeat: repeat;
              background-size: cover;
              mix-blend-mode: soft-light;
              opacity: var(--hero-film-grain-opacity, 0.28);
              pointer-events: none;
            }
            .hero-renderer .hero-layer.particles {
              background-image: var(--hero-particles);
              background-repeat: no-repeat;
              background-size: cover;
              mix-blend-mode: screen;
              opacity: var(--hero-particle-opacity, 0.32);
              pointer-events: none;
            }
            .hero-renderer .hero-layer.motion {
              object-fit: cover;
              width: 100%;
              height: 100%;
              mix-blend-mode: screen;
              opacity: var(--hero-motion-opacity, 0.85);
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
              .hero-renderer .hero-layer.grain { background-image: var(--hero-grain-mobile, var(--hero-grain-desktop)); }
              .hero-renderer .hero-layer.particles { background-image: var(--hero-particles); }
            }
            @media (prefers-reduced-motion: reduce) {
              .hero-renderer .hero-layer.motion { display: none; }
              .hero-renderer .hero-layer.particles { opacity: 0.12; }
            }
          `,
        }}
      />

      {surfaces.overlays?.field?.path && <div aria-hidden className="hero-layer field" />}
      <div aria-hidden className="hero-layer wave" />
      {surfaces.overlays?.dots?.path && <div aria-hidden className="hero-layer overlay dots" />}
      {shouldShowParticles && <div aria-hidden className="hero-layer particles" />}

      {videoEntry?.path && (
        <video
          className="hero-layer motion"
          autoPlay
          playsInline
          loop
          muted
          preload="metadata"
          poster={surfaces.background?.desktop?.path}
        >
          <source src={videoEntry.path} />
        </video>
      )}

      {motionEntries.map((entry) => (
        <video
          key={entry.id}
          className="hero-layer motion"
          autoPlay
          playsInline
          loop
          muted
          preload="metadata"
        >
          <source src={entry.path} />
        </video>
      ))}

      {shouldShowGrain && <div aria-hidden className="hero-layer grain" />}

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
