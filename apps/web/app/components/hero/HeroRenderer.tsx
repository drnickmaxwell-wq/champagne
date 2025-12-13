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
  debugOpacityBoost?: number;
  diagnosticBoost?: boolean;
  surfaceRef?: Ref<HTMLDivElement>;
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

  const { content, surfaces, layout, motion, filmGrain: filmGrainSettings, flags } = runtime;

  const prmEnabled = prm ?? flags.prm;

  // --- Core switches (manifest-driven, but overrideable) ---
  const opacityBoost = Math.max(debugOpacityBoost, 0.01);
  const applyBoost = (v?: number) => Math.min(1, (v ?? 1) * opacityBoost);

  const diagnosticOutlineStyle: CSSProperties | undefined = diagnosticBoost
    ? { outline: "1px solid var(--champagne-keyline-gold, var(--accentGold_soft))", outlineOffset: "-1px" }
    : undefined;

  const gradient = surfaces.gradient ?? "var(--smh-gradient)";

  const waveBgDesktop =
    surfaces.background?.desktop?.path
      ? `url("${surfaces.background.desktop.path}")`
      : surfaces.background?.desktop?.asset?.id
        ? `url("${ensureHeroAssetPath(surfaces.background.desktop.asset.id)}")`
        : surfaces.background?.desktop?.id
          ? `url("${ensureHeroAssetPath(surfaces.background.desktop.id)}")`
          : undefined;

  const waveBgMobile =
    surfaces.background?.mobile?.path
      ? `url("${surfaces.background.mobile.path}")`
      : surfaces.background?.mobile?.asset?.id
        ? `url("${ensureHeroAssetPath(surfaces.background.mobile.asset.id)}")`
        : surfaces.background?.mobile?.id
          ? `url("${ensureHeroAssetPath(surfaces.background.mobile.id)}")`
          : undefined;

  const waveMaskDesktop =
    surfaces.waveMask?.desktop?.path
      ? `url("${surfaces.waveMask.desktop.path}")`
      : surfaces.waveMask?.desktop?.asset?.id
        ? `url("${ensureHeroAssetPath(surfaces.waveMask.desktop.asset.id)}")`
        : undefined;

  const waveMaskMobile =
    surfaces.waveMask?.mobile?.path
      ? `url("${surfaces.waveMask.mobile.path}")`
      : surfaces.waveMask?.mobile?.asset?.id
        ? `url("${ensureHeroAssetPath(surfaces.waveMask.mobile.asset.id)}")`
        : undefined;

  const overlayField =
    surfaces.overlays?.field?.path
      ? `url("${surfaces.overlays.field.path}")`
      : surfaces.overlays?.field?.asset?.id
        ? `url("${ensureHeroAssetPath(surfaces.overlays.field.asset.id)}")`
        : undefined;

  const overlayDots =
    surfaces.overlays?.dots?.path
      ? `url("${surfaces.overlays.dots.path}")`
      : surfaces.overlays?.dots?.asset?.id
        ? `url("${ensureHeroAssetPath(surfaces.overlays.dots.asset.id)}")`
        : undefined;

  const grainDesktop =
    surfaces.grain?.desktop?.path
      ? `url("${surfaces.grain.desktop.path}")`
      : surfaces.grain?.desktop?.asset?.id
        ? `url("${ensureHeroAssetPath(surfaces.grain.desktop.asset.id)}")`
        : undefined;

  const grainMobile =
    surfaces.grain?.mobile?.path
      ? `url("${surfaces.grain.mobile.path}")`
      : surfaces.grain?.mobile?.asset?.id
        ? `url("${ensureHeroAssetPath(surfaces.grain.mobile.asset.id)}")`
        : undefined;

  const particlesImg =
    surfaces.particles?.path
      ? `url("${surfaces.particles.path}")`
      : surfaces.particles?.asset?.id
        ? `url("${ensureHeroAssetPath(surfaces.particles.asset.id)}")`
        : undefined;

  const shouldShowGrain = Boolean(
    filmGrain !== false && filmGrainSettings.enabled && (grainDesktop || grainMobile),
  );
  const shouldShowParticles = Boolean(particles !== false && particlesImg);

  const grainOpacity = applyBoost((filmGrainSettings.opacity ?? 0.28) * (surfaces.grain?.desktop?.opacity ?? 1));
  const particleOpacity = applyBoost((surfaces.particles?.opacity ?? 1) * 0.35);

  // IMPORTANT: the mask must apply to backdrop + rings + dots (this was a big parity break)
  const sharedMaskDesktop: CSSProperties = waveMaskDesktop
    ? {
        maskImage: "var(--hero-wave-mask-desktop)",
        WebkitMaskImage: "var(--hero-wave-mask-desktop)",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskSize: "cover",
        WebkitMaskSize: "cover",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }
    : {};

  const sharedMaskMobileCSS = `
    @media (max-width: 640px) {
      .hero-renderer .hero-layer--masked {
        mask-image: var(--hero-wave-mask-mobile);
        -webkit-mask-image: var(--hero-wave-mask-mobile);
      }
      .hero-renderer .hero-layer--grain {
        background-image: var(--hero-grain-mobile);
      }
      .hero-renderer .hero-layer--wave {
        background-image: var(--hero-wave-background-mobile);
      }
    }
  `;

  // Surface stack coming from manifest (ordering is sacred)
  const surfaceStack = (surfaces.surfaceStack ?? []).filter((layer) => {
    if (layer.suppressed) return false;
    const token = layer.token ?? layer.id;
    if (token === "overlay.particles" && !shouldShowParticles) return false;
    if (token === "overlay.filmGrain" && !shouldShowGrain) return false;
    return true;
  });

  // Video/motion: render when PRM is off
  const videoEntry = surfaces.video;
  const motionEntries = surfaces.motion ?? [];

  // Token → style bindings (minimal, but correct)
  const layerStyles: Record<string, CSSProperties> = {
    "gradient.base": {
      background: "var(--hero-gradient)",
      opacity: 1,
    },

    "field.waveBackdrop": {
      backgroundImage: "var(--hero-wave-background-desktop)",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
      mixBlendMode: (surfaces.background?.desktop?.blendMode as CSSProperties["mixBlendMode"]) ?? "screen",
      opacity: applyBoost(surfaces.background?.desktop?.opacity ?? 0.55),
      ...sharedMaskDesktop,
    },

    // keep as a lightweight “header accent” instead of inert
    "mask.waveHeader": {
      backgroundImage: "var(--hero-wave-background-desktop)",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
      mixBlendMode: (surfaces.waveMask?.desktop?.blendMode as CSSProperties["mixBlendMode"]) ?? "screen",
      opacity: applyBoost(surfaces.waveMask?.desktop?.opacity ?? 0.25),
      ...sharedMaskDesktop,
    },

    "field.waveRings": {
      backgroundImage: "var(--hero-overlay-field)",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
      mixBlendMode: surfaces.overlays?.field?.blendMode as CSSProperties["mixBlendMode"],
      opacity: applyBoost(surfaces.overlays?.field?.opacity ?? 0.35),
      ...sharedMaskDesktop,
    },

    "field.dotGrid": {
      backgroundImage: "var(--hero-overlay-dots)",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
      mixBlendMode: surfaces.overlays?.dots?.blendMode as CSSProperties["mixBlendMode"],
      opacity: applyBoost(surfaces.overlays?.dots?.opacity ?? 0.25),
      ...sharedMaskDesktop,
    },

    "overlay.particles": {
      backgroundImage: "var(--hero-particles)",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
      mixBlendMode: (surfaces.particles?.blendMode as CSSProperties["mixBlendMode"]) ?? "screen",
      opacity: particleOpacity,
    },

    "overlay.filmGrain": {
      backgroundImage: "var(--hero-grain-desktop)",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
      mixBlendMode: (surfaces.grain?.desktop?.blendMode as CSSProperties["mixBlendMode"]) ?? "soft-light",
      opacity: grainOpacity,
    },

    "overlay.caustics": {
      backgroundImage: "url(/assets/champagne/textures/wave-light-overlay.webp)",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
      mixBlendMode: "screen",
      opacity: applyBoost(0.35),
    },

    "hero.contentFrame": {
      background: "var(--champagne-glass-bg, var(--surface-glass))",
      backdropFilter: "blur(18px)",
      WebkitBackdropFilter: "blur(18px)",
    },
  };

  const surfaceVars: CSSProperties = {
    ["--hero-gradient" as string]: gradient,
    ["--hero-wave-background-desktop" as string]: waveBgDesktop,
    ["--hero-wave-background-mobile" as string]: waveBgMobile,
    ["--hero-wave-mask-desktop" as string]: waveMaskDesktop,
    ["--hero-wave-mask-mobile" as string]: waveMaskMobile,
    ["--hero-overlay-field" as string]: overlayField,
    ["--hero-overlay-dots" as string]: overlayDots,
    ["--hero-grain-desktop" as string]: grainDesktop,
    ["--hero-grain-mobile" as string]: grainMobile,
    ["--hero-particles" as string]: particlesImg,
  };

  return (
    <BaseChampagneSurface
      variant="inkGlass"
      className="hero-renderer"
      style={{
        minHeight: "72vh",
        display: "grid",
        alignItems: layout.contentAlign === "center" ? "center" : "stretch",
        overflow: "hidden",
        // gradient MUST be behind everything always
        background: "var(--hero-gradient, var(--smh-gradient))",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .hero-renderer { position: relative; color: var(--text-high); }
            .hero-renderer .hero-surface-stack { position: absolute; inset: 0; z-index: 0; }
            .hero-renderer .hero-surface-layer { position: absolute; inset: 0; pointer-events: none; }

            .hero-renderer .hero-layer--masked { }
            .hero-renderer .hero-layer--wave { }
            .hero-renderer .hero-layer--grain { }

            .hero-renderer .hero-content {
              position: relative;
              z-index: 2;
              display: grid;
              gap: 1rem;
              max-width: ${layout.maxWidth ? `${layout.maxWidth}px` : "960px"};
              padding: ${layout.padding ?? "clamp(2rem, 4vw, 3.5rem)"};
              transform: translateY(${layout.verticalOffset ?? "0px"});
            }

            ${sharedMaskMobileCSS}

            @media (prefers-reduced-motion: reduce) {
              .hero-renderer .hero-surface--motion { display: none; }
              .hero-renderer [data-surface-id="overlay.particles"] { opacity: 0.12; }
            }
          `,
        }}
      />

      <div
        aria-hidden
        className="hero-surface-stack"
        ref={surfaceRef}
        data-prm={prmEnabled ? "true" : "false"}
        style={surfaceVars}
      >
        {surfaceStack.map((layer) => {
          const token = layer.token ?? layer.id;

          // enforce useful classes for mask + grain + wave
          const extraClass =
            token === "field.waveBackdrop" || token === "field.waveRings" || token === "field.dotGrid" || token === "mask.waveHeader"
              ? " hero-layer--masked"
              : "";
          const waveClass = token === "field.waveBackdrop" || token === "mask.waveHeader" ? " hero-layer--wave" : "";
          const grainClass = token === "overlay.filmGrain" ? " hero-layer--grain" : "";

          const baseClass = layer.className ?? "hero-surface-layer";
          const className = `${baseClass}${extraClass}${waveClass}${grainClass}`;

          return (
            <div
              key={layer.id}
              data-surface-id={layer.id}
              data-surface-role={layer.role}
              data-prm-safe={layer.prmSafe ? "true" : undefined}
              className={className}
              style={{
                ...(token ? layerStyles[token] : undefined),
                ...diagnosticOutlineStyle,
              }}
            />
          );
        })}

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
              objectFit: "cover",
              width: "100%",
              height: "100%",
              mixBlendMode: videoEntry.blendMode as CSSProperties["mixBlendMode"],
              opacity: videoEntry.opacity ?? (motion.shimmerIntensity ?? 1) * 0.85,
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
                objectFit: "cover",
                width: "100%",
                height: "100%",
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
          <h1 style={{ fontSize: "clamp(2.2rem, 3.2vw, 3rem)", lineHeight: 1.05 }}>{content.headline}</h1>
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
