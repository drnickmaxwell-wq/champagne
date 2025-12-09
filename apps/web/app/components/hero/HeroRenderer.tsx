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
  const surfaceStack = (surfaces.surfaceStack ?? []).filter((layer) => {
    if (layer.id === "fx.particles" && !shouldShowParticles) return false;
    if (layer.id === "fx.filmGrain" && !shouldShowGrain) return false;
    return true;
  });
  const prmEnabled = runtime.flags.prm;
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
        background: "var(--hero-gradient, var(--smh-gradient))",
        ["--hero-gradient" as string]: gradient,
      }}
      className="hero-renderer"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .hero-renderer {
              position: relative;
              color: var(--text-high);
            }
            .hero-renderer .hero-surface-stack {
              position: absolute;
              inset: 0;
              z-index: 0;
            }
            .hero-renderer .hero-layer,
            .hero-renderer .hero-surface-layer {
              position: absolute;
              inset: 0;
              z-index: 0;
            }
            .hero-renderer .hero-layer.motion,
            .hero-renderer .hero-surface-layer.hero-surface--motion {
              object-fit: cover;
              width: 100%;
              height: 100%;
              pointer-events: none;
            }
            .hero-surface-layer {
              pointer-events: none;
            }
            .hero-surface-layer.hero-surface--film-grain {
              opacity: ${grainOpacity};
            }
            .hero-surface-layer.hero-surface--particles {
              opacity: ${particleOpacity};
            }
            .hero-renderer [data-surface-role="fx"] {
              mix-blend-mode: screen;
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
              .hero-renderer .hero-content {
                padding: ${layout.padding ?? "clamp(2rem, 4vw, 3.5rem)"};
              }
            }
            @media (prefers-reduced-motion: reduce) {
              .hero-renderer .hero-layer.motion,
              .hero-renderer .hero-surface--motion { display: none; }
              .hero-surface-layer.hero-surface--particles { opacity: 0.12; }
            }
          `,
        }}
      />

      <div
        aria-hidden
        className="hero-surface-stack"
        data-prm={prmEnabled ? "true" : "false"}
      >
        {surfaceStack.map((layer) => (
          <div
            key={layer.id}
            data-surface-id={layer.id}
            data-surface-role={layer.role}
            data-prm-safe={layer.prmSafe ? "true" : undefined}
            className={layer.className ?? "hero-surface-layer"}
          />
        ))}

        {shouldShowParticles && surfaces.particles?.path && (
          <div
            aria-hidden
            data-surface-id="fx.particles"
            className="hero-surface-layer hero-surface--particles"
            style={{
              mixBlendMode: (surfaces.particles.blendMode as CSSProperties["mixBlendMode"]) ?? "screen",
            }}
          />
        )}

        {videoEntry?.path && (
          <video
            className="hero-surface-layer hero-surface--motion"
            autoPlay
            playsInline
            loop
            muted
            preload="metadata"
            poster={surfaces.background?.desktop?.path}
            data-surface-id="motion.heroVideo"
            style={{
              mixBlendMode: videoEntry.blendMode as CSSProperties["mixBlendMode"],
              opacity: videoEntry.opacity ?? (motion.shimmerIntensity ?? 1) * 0.85,
            }}
          >
            <source src={videoEntry.path} />
          </video>
        )}

        {motionEntries.map((entry) => (
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
              opacity: entry.opacity ?? (motion.shimmerIntensity ?? 1) * 0.85,
            }}
          >
            <source src={entry.path} />
          </video>
        ))}

        {shouldShowGrain && (
          <div
            aria-hidden
            data-surface-id="fx.filmGrain"
            className="hero-surface-layer hero-surface--film-grain"
            style={{
              mixBlendMode: (surfaces.grain?.desktop?.blendMode as CSSProperties["mixBlendMode"]) ?? "soft-light",
            }}
          />
        )}
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
