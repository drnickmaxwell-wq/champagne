import type { CSSProperties } from "react";
import { BaseChampagneSurface, ensureHeroAssetPath, getHeroRuntime, type HeroMode, type HeroTimeOfDay } from "@champagne/hero";

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
    if (process.env.NODE_ENV !== "production") {
      console.error("Hero runtime failed", error);
    }
  }

  if (!runtime) return <HeroFallback />;

  const { content, surfaces, layout } = runtime;
  const gradient = surfaces.gradient ?? "var(--smh-gradient)";
  const motionEntries = surfaces.motion ?? [];
  const videoEntry = surfaces.video;
  const prmEnabled = runtime.flags.prm;
  const applyBoost = (value?: number) => Math.min(1, (value ?? 1) * Math.max(debugOpacityBoost, 0.01));
  const surfaceStack = (surfaces.surfaceStack ?? []).filter((layer) => !layer.suppressed);

  const resolveAssetUrl = (entry?: { path?: string; id?: string; asset?: { id?: string } }) => {
    if (!entry) return undefined;
    if (entry.path) return entry.path;
    if (entry.asset?.id) return ensureHeroAssetPath(entry.asset.id);
    if (entry.id) return ensureHeroAssetPath(entry.id);
    return undefined;
  };

  const layerSources: Record<string, string | undefined> = {
    "gradient.base": gradient,
    "field.waveBackdrop": resolveAssetUrl(surfaces.background?.desktop ?? surfaces.background),
    "mask.waveHeader": undefined,
    "field.waveRings": resolveAssetUrl(surfaces.overlays?.field),
    "field.dotGrid": resolveAssetUrl(surfaces.overlays?.dots),
    "overlay.particles": resolveAssetUrl(surfaces.particles),
    "overlay.filmGrain": resolveAssetUrl(surfaces.grain?.desktop ?? surfaces.grain),
    "overlay.caustics": "/assets/champagne/textures/wave-light-overlay.webp",
  };

  const fallbackPoster =
    resolveAssetUrl(surfaces.video?.poster ?? surfaces.background?.desktop) ??
    resolveAssetUrl(surfaces.background?.mobile);

  const forcedStyleForLayer = (token?: string, override?: CSSProperties): CSSProperties => {
    const source = token ? layerSources[token] : undefined;
    const isGradient = token === "gradient.base";
    const backgroundImage = !isGradient && source ? `url(${source})` : undefined;
    return {
      position: "absolute",
      inset: 0,
      background: isGradient ? gradient : undefined,
      backgroundImage,
      backgroundRepeat: isGradient ? undefined : "no-repeat",
      backgroundSize: isGradient ? undefined : "cover",
      backgroundPosition: isGradient ? undefined : "center",
      opacity: isGradient ? 1 : applyBoost(0.8),
      mixBlendMode: "normal",
      pointerEvents: "none",
      WebkitMaskImage: "none",
      maskImage: "none",
      clipPath: "none",
      filter: "none",
      transform: "none",
      ...override,
    };
  };

  return (
    <BaseChampagneSurface
      variant="inkGlass"
      style={{
        minHeight: "72vh",
        display: "grid",
        alignItems: layout.contentAlign === "center" ? "center" : "stretch",
        overflow: "visible",
        background: gradient,
        position: "relative",
        isolation: "unset",
        contain: "none",
        transform: "none",
        filter: "none",
      }}
      className="hero-renderer"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .hero-renderer {
              position: relative;
              color: var(--text-high);
              overflow: visible;
              isolation: unset;
              contain: none;
              transform: none;
              filter: none;
            }
            .hero-renderer .hero-surface-stack {
              position: absolute;
              inset: 0;
              z-index: 0;
              pointer-events: none;
            }
            .hero-renderer .hero-layer,
            .hero-renderer .hero-surface-layer {
              position: absolute;
              inset: 0;
              z-index: 0;
              background-position: center;
              background-repeat: no-repeat;
              background-size: cover;
              mix-blend-mode: normal;
              -webkit-mask-image: none;
              mask-image: none;
              clip-path: none;
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
              .hero-renderer .hero-content {
                padding: ${layout.padding ?? "clamp(2rem, 4vw, 3.5rem)"};
              }
              .hero-renderer {
                min-height: 68vh;
              }
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
            style={forcedStyleForLayer(layer.token ?? layer.id, { zIndex: layer.zIndex })}
          />
        ))}

        {videoEntry?.path && (
          <div
            className="hero-surface-layer hero-surface--motion"
            data-surface-id="motion.heroVideo"
            style={forcedStyleForLayer("motion.heroVideo", {
              zIndex: videoEntry.zIndex ?? 1,
              backgroundImage: fallbackPoster ? `url(${fallbackPoster})` : undefined,
            })}
          />
        )}

        {motionEntries.map((entry) => (
          <div
            key={entry.id}
            className={`hero-surface-layer hero-surface--motion${entry.className ? ` ${entry.className}` : ""}`}
            data-surface-id={entry.id}
            style={forcedStyleForLayer(entry.id, {
              zIndex: entry.zIndex,
              backgroundImage: fallbackPoster ? `url(${fallbackPoster})` : undefined,
            })}
          />
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
