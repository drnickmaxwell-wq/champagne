import type { CSSProperties } from "react";
import { BaseChampagneSurface, getHeroRuntime, type HeroMode, type HeroTimeOfDay } from "@champagne/hero";

export interface HeroRendererProps {
  mode?: HeroMode;
  treatmentSlug?: string;
  prm?: boolean;
  timeOfDay?: HeroTimeOfDay;
  particles?: boolean;
  filmGrain?: boolean;
  debugOpacityBoost?: number;
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

export async function HeroRenderer({
  mode = "home",
  treatmentSlug,
  prm,
  timeOfDay,
  particles,
  filmGrain,
  debugOpacityBoost = 1,
}: HeroRendererProps) {
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
  const opacityBoost = Math.max(debugOpacityBoost, 0.01);
  const gradient = surfaces.gradient ?? "var(--smh-gradient)";
  const motionEntries = surfaces.motion ?? [];
  const videoEntry = surfaces.video;
  const shouldShowGrain = Boolean(filmGrainSettings.enabled && (surfaces.grain?.desktop || surfaces.grain?.mobile));
  const shouldShowParticles = Boolean((motion.particles?.density ?? 0) > 0 && surfaces.particles?.path);
  const applyBoost = (value?: number) => Math.min(1, (value ?? 1) * opacityBoost);
  const causticsOpacity = applyBoost(
    motionEntries.find((entry) => entry.id === "overlay.caustics")?.opacity ?? surfaces.overlays?.field?.opacity ?? 0.35,
  );
  const waveBackdropOpacity = applyBoost(surfaces.background?.desktop?.opacity ?? 0.55);
  const waveBackdropBlend = surfaces.background?.desktop?.blendMode as CSSProperties["mixBlendMode"];
  const surfaceStack = (surfaces.surfaceStack ?? []).filter((layer) => {
    const token = layer.token ?? layer.id;
    if (layer.suppressed) return false;
    if (token === "overlay.particles" && !shouldShowParticles) return false;
    if (token === "overlay.filmGrain" && !shouldShowGrain) return false;
    return true;
  });
  const prmEnabled = runtime.flags.prm;
  const grainOpacity = applyBoost((filmGrainSettings.opacity ?? 0.28) * (surfaces.grain?.desktop?.opacity ?? 1));
  const particleOpacity = applyBoost((motion.particles?.density ?? 1) * (surfaces.particles?.opacity ?? 1) * 0.35);

  const surfaceVars: CSSProperties = {
    ["--hero-gradient" as string]: gradient,
    ["--hero-wave-mask-desktop" as string]: surfaces.waveMask?.desktop?.path
      ? `url(${surfaces.waveMask.desktop.path})`
      : undefined,
    ["--hero-wave-mask-mobile" as string]: surfaces.waveMask?.mobile?.path
      ? `url(${surfaces.waveMask.mobile.path})`
      : undefined,
    ["--hero-wave-background-desktop" as string]: surfaces.background?.desktop?.path
      ? `url(${surfaces.background.desktop.path})`
      : undefined,
    ["--hero-wave-background-mobile" as string]: surfaces.background?.mobile?.path
      ? `url(${surfaces.background.mobile.path})`
      : undefined,
    ["--hero-overlay-field" as string]: surfaces.overlays?.field?.path
      ? `url(${surfaces.overlays.field.path})`
      : undefined,
    ["--hero-overlay-dots" as string]: surfaces.overlays?.dots?.path
      ? `url(${surfaces.overlays.dots.path})`
      : undefined,
    ["--hero-particles" as string]: shouldShowParticles && surfaces.particles?.path
      ? `url(${surfaces.particles.path})`
      : undefined,
    ["--hero-grain-desktop" as string]: surfaces.grain?.desktop?.path
      ? `url(${surfaces.grain.desktop.path})`
      : undefined,
    ["--hero-grain-mobile" as string]: surfaces.grain?.mobile?.path
      ? `url(${surfaces.grain.mobile.path})`
      : undefined,
    ["--hero-film-grain-opacity" as string]: grainOpacity,
    ["--hero-film-grain-blend" as string]: (surfaces.grain?.desktop?.blendMode as CSSProperties["mixBlendMode"]) ?? undefined,
    ["--hero-particles-opacity" as string]: particleOpacity,
    ["--hero-caustics-overlay" as string]: "url(/assets/champagne/textures/wave-light-overlay.webp)",
    ["--surface-opacity-waveBackdrop" as string]: waveBackdropOpacity,
    ["--surface-blend-waveBackdrop" as string]: waveBackdropBlend,
  };

  const layerStyles: Record<string, CSSProperties> = {
    "gradient.base": {},
    "field.waveBackdrop": {
      mixBlendMode: waveBackdropBlend ?? "screen",
      opacity: waveBackdropOpacity,
    },
    "mask.waveHeader": {
      mixBlendMode: surfaces.waveMask?.desktop?.blendMode as CSSProperties["mixBlendMode"],
      opacity: applyBoost(surfaces.waveMask?.desktop?.opacity),
    },
    "field.waveRings": {
      mixBlendMode: surfaces.overlays?.field?.blendMode as CSSProperties["mixBlendMode"],
      opacity: applyBoost(surfaces.overlays?.field?.opacity),
    },
    "field.dotGrid": {
      mixBlendMode: surfaces.overlays?.dots?.blendMode as CSSProperties["mixBlendMode"],
      opacity: applyBoost(surfaces.overlays?.dots?.opacity),
    },
    "overlay.particles": {
      mixBlendMode: (surfaces.particles?.blendMode as CSSProperties["mixBlendMode"]) ?? "screen",
      opacity: particleOpacity,
    },
    "overlay.filmGrain": {
      mixBlendMode: (surfaces.grain?.desktop?.blendMode as CSSProperties["mixBlendMode"]) ?? "soft-light",
      opacity: grainOpacity,
    },
    "overlay.caustics": { mixBlendMode: "screen", opacity: causticsOpacity },
    "hero.contentFrame": {
      background: "var(--champagne-glass-bg, var(--surface-glass))",
      backdropFilter: "blur(18px)",
      WebkitBackdropFilter: "blur(18px)",
    },
  };

  return (
    <BaseChampagneSurface
      variant="inkGlass"
      style={{
        minHeight: "72vh",
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
            .hero-renderer .hero-surface-layer.hero-surface--wave-backdrop {
              background-image: var(--hero-wave-background-desktop);
              background-size: cover;
              background-position: center;
              mix-blend-mode: var(--surface-blend-waveBackdrop, screen);
              opacity: var(--surface-opacity-waveBackdrop, 0.55);
              z-index: var(--surface-zindex-waveBackdrop, 2);
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
              .hero-renderer .hero-surface-layer.hero-surface--wave-backdrop {
                background-image: var(--hero-wave-background-mobile);
              }
              .hero-renderer .hero-content {
                padding: ${layout.padding ?? "clamp(2rem, 4vw, 3.5rem)"};
              }
              .hero-renderer {
                min-height: 68vh;
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
        style={surfaceVars}
      >
        {surfaceStack.map((layer) => (
          <div
            key={layer.id}
            data-surface-id={layer.id}
            data-surface-role={layer.role}
            data-prm-safe={layer.prmSafe ? "true" : undefined}
            className={layer.className ?? "hero-surface-layer"}
            style={layer.token ? layerStyles[layer.token] : undefined}
          />
        ))}

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
