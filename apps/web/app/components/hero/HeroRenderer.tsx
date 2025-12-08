import type { CSSProperties } from "react";
import { BaseChampagneSurface, getHeroRuntime, type HeroTimeOfDay } from "@champagne/hero";

export interface HeroRendererProps {
  treatmentSlug?: string;
  prm?: boolean;
  timeOfDay?: HeroTimeOfDay;
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

export async function HeroRenderer({ treatmentSlug, prm, timeOfDay }: HeroRendererProps) {
  let runtime: Awaited<ReturnType<typeof getHeroRuntime>> | null = null;

  try {
    runtime = await getHeroRuntime({ treatmentSlug, prm, timeOfDay });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Hero runtime failed", error);
    }
  }

  if (!runtime) return <HeroFallback />;

  const { content, surfaces } = runtime;
  const surfaceVars: CSSProperties = {
    ["--hero-bg-desktop" as string]: surfaces.background?.desktop?.path
      ? `var(--smh-gradient), url(${surfaces.background.desktop.path})`
      : "var(--smh-gradient)",
    ["--hero-bg-mobile" as string]: surfaces.background?.mobile?.path
      ? `var(--smh-gradient), url(${surfaces.background.mobile.path})`
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
  };

  const motionEntries = surfaces.motion ?? [];
  const videoEntry = surfaces.video;

  return (
    <BaseChampagneSurface
      variant="inkGlass"
      style={{
        minHeight: "60vh",
        display: "grid",
        alignItems: "center",
        overflow: "hidden",
        ...surfaceVars,
      }}
      className="hero-renderer"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .hero-renderer {
              position: relative;
              background-image: var(--hero-bg-desktop, var(--smh-gradient));
              background-size: cover;
              background-position: center;
              color: var(--text-high);
            }
            .hero-renderer .hero-layer {
              position: absolute;
              inset: 0;
              z-index: 0;
            }
            .hero-renderer .hero-layer.wave {
              mask-image: var(--hero-wave-mask-desktop);
              -webkit-mask-image: var(--hero-wave-mask-desktop);
              mask-size: cover;
              -webkit-mask-size: cover;
              background: currentColor;
              opacity: 0.82;
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
            .hero-renderer .hero-layer.particles {
              background-image: var(--hero-particles), var(--hero-grain-desktop);
              background-repeat: no-repeat, repeat;
              background-size: cover, cover;
              mix-blend-mode: soft-light;
              opacity: 0.35;
              pointer-events: none;
            }
            .hero-renderer .hero-layer.motion {
              object-fit: cover;
              width: 100%;
              height: 100%;
              mix-blend-mode: screen;
              opacity: 0.85;
              pointer-events: none;
            }
            .hero-renderer .hero-content {
              position: relative;
              z-index: 2;
              display: grid;
              gap: 1rem;
              max-width: 960px;
              padding: clamp(2rem, 4vw, 3.5rem);
            }
            @media (max-width: 640px) {
              .hero-renderer {
                background-image: var(--hero-bg-mobile, var(--hero-bg-desktop));
              }
              .hero-renderer .hero-layer.wave {
                mask-image: var(--hero-wave-mask-mobile, var(--hero-wave-mask-desktop));
                -webkit-mask-image: var(--hero-wave-mask-mobile, var(--hero-wave-mask-desktop));
              }
              .hero-renderer .hero-layer.particles {
                background-image: var(--hero-particles), var(--hero-grain-mobile, var(--hero-grain-desktop));
              }
            }
            @media (prefers-reduced-motion: reduce) {
              .hero-renderer .hero-layer.motion { display: none; }
              .hero-renderer .hero-layer.particles { opacity: 0.12; }
            }
          `,
        }}
      />

      <div aria-hidden className="hero-layer wave" />
      {surfaces.overlays?.field?.path && <div aria-hidden className="hero-layer overlay field" />}
      {surfaces.overlays?.dots?.path && <div aria-hidden className="hero-layer overlay dots" />}
      {(surfaces.particles?.path || surfaces.grain?.desktop?.path) && <div aria-hidden className="hero-layer particles" />}

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

      <div className="hero-content">
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
