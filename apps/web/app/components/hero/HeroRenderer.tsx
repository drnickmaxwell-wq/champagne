import type { CSSProperties, Ref } from "react";
import { BaseChampagneSurface, ensureHeroAssetPath, getHeroRuntime, type HeroMode, type HeroTimeOfDay } from "@champagne/hero";

function normalizeGradientCss(input?: string): string {
  if (!input || !input.trim()) return "var(--smh-gradient)";
  const trimmed = input.trim();
  const lowered = trimmed.toLowerCase();

  if (
    trimmed.startsWith("var(") ||
    lowered.includes("linear-gradient(") ||
    lowered.includes("radial-gradient(") ||
    lowered.includes("conic-gradient(")
  ) {
    return trimmed;
  }

  return "var(--smh-gradient)";
}

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

  const { content, surfaces, layout, motion, filmGrain: filmGrainSettings } = runtime;
  const videoDenylist = ["dental-hero-4k.mp4"];
  const isDeniedVideo = (path?: string) => path && videoDenylist.some((item) => path.includes(item));
  const opacityBoost = Math.max(debugOpacityBoost, 0.01);
  const diagnosticOpacityBoost = diagnosticBoost ? 2.5 : 1;
  const gradient = normalizeGradientCss(surfaces.gradient);
  const motionEntries = surfaces.motion ?? [];
  const prmEnabled = prm ?? runtime.flags.prm;
  const videoEntry = surfaces.video;
  const heroVideoActive = Boolean(!prmEnabled && videoEntry?.path && !isDeniedVideo(videoEntry.path));
  const filteredMotionEntries = motionEntries.filter((entry) => {
    if (isDeniedVideo(entry.path)) return false;
    if (heroVideoActive && entry.id?.toLowerCase().includes("fallback")) return false;
    return true;
  });
  const motionCausticsActive = filteredMotionEntries.some((entry) =>
    entry.className?.includes("hero-surface--caustics"),
  );
  const motionShimmerActive = filteredMotionEntries.some((entry) =>
    entry.className?.includes("hero-surface--glass-shimmer"),
  );
  const motionGoldDustActive = filteredMotionEntries.some((entry) =>
    entry.className?.includes("hero-surface--gold-dust"),
  );
  const activeMotionIds = new Set(
    filteredMotionEntries.map((entry) => entry.id).filter((id): id is string => Boolean(id)),
  );
  const shouldShowGrain = Boolean(
    filmGrain !== false && filmGrainSettings.enabled && (surfaces.grain?.desktop || surfaces.grain?.mobile),
  );
  const shouldShowParticles = Boolean(
    particles !== false && (motion.particles?.density ?? 0) > 0 && surfaces.particles?.path,
  );
  const applyBoost = (value?: number) => Math.min(1, (value ?? 1) * opacityBoost);
  const applyDiagnosticBoost = (value?: number) => {
    const boosted = applyBoost(value);
    return diagnosticBoost ? Math.min(1, boosted * diagnosticOpacityBoost) : boosted;
  };
  const clampOpacity = (value?: number) => Math.max(0, Math.min(1, value ?? 1));
  const causticsOpacity = applyBoost(
    motionEntries.find((entry) => entry.id === "overlay.caustics")?.opacity ?? surfaces.overlays?.field?.opacity,
  );
  const waveBackdropOpacity = clampOpacity(surfaces.background?.desktop?.opacity);
  const waveBackdropBlend = surfaces.background?.desktop?.blendMode as CSSProperties["mixBlendMode"];
  const surfaceStack = (surfaces.surfaceStack ?? []).filter((layer) => {
    const token = layer.token ?? layer.id;
    if (layer.suppressed) return false;
    if (token === "mask.waveHeader" || layer.className?.includes("hero-surface--wave-mask")) return false;
    if (token && activeMotionIds.has(token)) return false;
    if (motionCausticsActive && layer.className?.includes("hero-surface--caustics")) return false;
    if (motionShimmerActive && layer.className?.includes("hero-surface--glass-shimmer")) return false;
    if (motionGoldDustActive && layer.className?.includes("hero-surface--gold-dust")) return false;
    if (token === "overlay.particles" && !shouldShowParticles) return false;
    if (token === "overlay.filmGrain" && !shouldShowGrain) return false;
    return true;
  });
  const grainOpacity = applyDiagnosticBoost(
    (filmGrainSettings.opacity ?? 0.28) * (surfaces.grain?.desktop?.opacity ?? 1),
  );
  const particleOpacity = applyDiagnosticBoost(
    (motion.particles?.density ?? 1) * (surfaces.particles?.opacity ?? 1),
  );
  const staticLayerOpacity = (value?: number) => applyDiagnosticBoost(value);
  const resolveMotionOpacity = (_entryId: string | undefined, value?: number) =>
    clampOpacity(value ?? motion.shimmerIntensity ?? 1);
  const diagnosticOutlineStyle: CSSProperties | undefined = diagnosticBoost
    ? { outline: "1px solid var(--champagne-keyline-gold, var(--accentGold_soft))", outlineOffset: "-1px" }
    : undefined;

  const surfaceVars: CSSProperties = {
    ["--hero-gradient" as string]: gradient,
    ["--hero-wave-mask-desktop" as string]: surfaces.waveMask?.desktop?.path
      ? `url("${surfaces.waveMask.desktop.path}")`
      : surfaces.waveMask?.desktop?.asset?.id
        ? `url("${ensureHeroAssetPath(surfaces.waveMask.desktop.asset.id)}")`
        : undefined,
    ["--hero-wave-mask-mobile" as string]: surfaces.waveMask?.mobile?.path
      ? `url("${surfaces.waveMask.mobile.path}")`
      : surfaces.waveMask?.mobile?.asset?.id
        ? `url("${ensureHeroAssetPath(surfaces.waveMask.mobile.asset.id)}")`
        : undefined,
    ["--hero-wave-background-desktop" as string]: surfaces.background?.desktop?.path
      ? `url("${surfaces.background.desktop.path}")`
      : surfaces.background?.desktop?.asset?.id
        ? `url("${ensureHeroAssetPath(surfaces.background.desktop.asset.id)}")`
        : surfaces.background?.desktop?.id
          ? `url("${ensureHeroAssetPath(surfaces.background.desktop.id)}")`
          : undefined,
    ["--hero-wave-background-mobile" as string]: surfaces.background?.mobile?.path
      ? `url("${surfaces.background.mobile.path}")`
      : surfaces.background?.mobile?.asset?.id
        ? `url("${ensureHeroAssetPath(surfaces.background.mobile.asset.id)}")`
        : surfaces.background?.mobile?.id
          ? `url("${ensureHeroAssetPath(surfaces.background.mobile.id)}")`
          : undefined,
    ["--hero-overlay-field" as string]: surfaces.overlays?.field?.path
      ? `url("${surfaces.overlays.field.path}")`
      : surfaces.overlays?.field?.asset?.id
        ? `url("${ensureHeroAssetPath(surfaces.overlays.field.asset.id)}")`
        : undefined,
    ["--hero-overlay-dots" as string]: surfaces.overlays?.dots?.path
      ? `url("${surfaces.overlays.dots.path}")`
      : surfaces.overlays?.dots?.asset?.id
        ? `url("${ensureHeroAssetPath(surfaces.overlays.dots.asset.id)}")`
        : undefined,
    ["--hero-particles" as string]: shouldShowParticles && surfaces.particles?.path
      ? `url("${surfaces.particles.path}")`
      : shouldShowParticles && surfaces.particles?.asset?.id
        ? `url("${ensureHeroAssetPath(surfaces.particles.asset.id)}")`
        : undefined,
    ["--hero-grain-desktop" as string]: surfaces.grain?.desktop?.path
      ? `url("${surfaces.grain.desktop.path}")`
      : surfaces.grain?.desktop?.asset?.id
        ? `url("${ensureHeroAssetPath(surfaces.grain.desktop.asset.id)}")`
        : undefined,
    ["--hero-grain-mobile" as string]: surfaces.grain?.mobile?.path
      ? `url("${surfaces.grain.mobile.path}")`
      : surfaces.grain?.mobile?.asset?.id
        ? `url("${ensureHeroAssetPath(surfaces.grain.mobile.asset.id)}")`
        : undefined,
    ["--hero-film-grain-opacity" as string]: grainOpacity,
    ["--hero-film-grain-blend" as string]: (surfaces.grain?.desktop?.blendMode as CSSProperties["mixBlendMode"]) ?? undefined,
    ["--hero-particles-opacity" as string]: particleOpacity,
    ["--hero-caustics-overlay" as string]: "url(/assets/champagne/textures/wave-light-overlay.webp)",
    ["--surface-opacity-waveBackdrop" as string]: waveBackdropOpacity,
    ["--surface-blend-waveBackdrop" as string]: waveBackdropBlend,
  };

  if (process.env.NODE_ENV !== "production") {
    const surfaceVarsRecord = surfaceVars as Record<string, unknown>;
    const diagnosticSurfaceVars = {
      waveBackgroundDesktop: surfaceVarsRecord["--hero-wave-background-desktop"],
      waveBackgroundMobile: surfaceVarsRecord["--hero-wave-background-mobile"],
      waveMaskDesktop: surfaceVarsRecord["--hero-wave-mask-desktop"],
      waveMaskMobile: surfaceVarsRecord["--hero-wave-mask-mobile"],
      overlayField: surfaceVarsRecord["--hero-overlay-field"],
      overlayDots: surfaceVarsRecord["--hero-overlay-dots"],
      particles: surfaceVarsRecord["--hero-particles"],
      grainDesktop: surfaceVarsRecord["--hero-grain-desktop"],
      grainMobile: surfaceVarsRecord["--hero-grain-mobile"],
    };

    console.debug("HeroRenderer surface vars", diagnosticSurfaceVars);
  }

  const layerStyles: Record<string, CSSProperties> = {
    "gradient.base": { mixBlendMode: "normal", opacity: 1, zIndex: 1 },
    "field.waveBackdrop": {
      mixBlendMode: waveBackdropBlend ?? "screen",
      opacity: waveBackdropOpacity,
      zIndex: 2,
    },
    "mask.waveHeader": {
      mixBlendMode:
        (surfaces.waveMask?.desktop?.blendMode as CSSProperties["mixBlendMode"]) ?? "soft-light",
      opacity: applyBoost(surfaces.waveMask?.desktop?.opacity),
    },
    "field.waveRings": {
      mixBlendMode: surfaces.overlays?.field?.blendMode as CSSProperties["mixBlendMode"],
      opacity: staticLayerOpacity(surfaces.overlays?.field?.opacity),
      backgroundImage: "var(--hero-overlay-field)",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
      zIndex: 3,
    },
    "field.dotGrid": {
      mixBlendMode: surfaces.overlays?.dots?.blendMode as CSSProperties["mixBlendMode"],
      opacity: staticLayerOpacity(surfaces.overlays?.dots?.opacity),
      backgroundImage: "var(--hero-overlay-dots)",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
      zIndex: 4,
    },
    "overlay.particles": {
      mixBlendMode: "screen",
      opacity: particleOpacity,
      backgroundImage: "var(--hero-particles)",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
      zIndex: 5,
    },
    "overlay.filmGrain": {
      mixBlendMode: (surfaces.grain?.desktop?.blendMode as CSSProperties["mixBlendMode"]) ?? "soft-light",
      opacity: grainOpacity,
      backgroundImage: "var(--hero-grain-desktop)",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
      zIndex: 7,
    },
    "overlay.caustics": { mixBlendMode: "screen", opacity: causticsOpacity },
    "hero.contentFrame": {
      background: "transparent",
      backdropFilter: "none",
      WebkitBackdropFilter: "none",
    },
  };

  const devProofScript =
    process.env.NODE_ENV !== "production" ? (
      <script
        dangerouslySetInnerHTML={{
          __html: `(() => {
            try {
              const hero = document.querySelector('.hero-renderer');
              const motionVideos = hero ? hero.querySelectorAll('video.hero-surface--motion') : [];
              const veilCandidates = hero
                ? Array.from(hero.querySelectorAll(':scope > div[aria-hidden]')).filter((el) => {
                    const style = getComputedStyle(el);
                    const bg = (style.backgroundImage || '').toLowerCase();
                    const blend = style.mixBlendMode || '';
                    const hasVeilGradient = bg.includes('radial-gradient') || bg.includes('linear-gradient');
                    const hasLightVeil = bg.includes('rgba(255, 255, 255') || bg.includes('rgba(255,255,255');
                    const blendNonNormal = blend && blend !== 'normal';
                    return hasVeilGradient && (hasLightVeil || blendNonNormal);
                  })
                : [];
              const heroStyle = hero ? getComputedStyle(hero) : null;
              const payload = {
                heroCount: document.querySelectorAll('.hero-renderer').length,
                motionCount: motionVideos.length,
                veilCount: veilCandidates.length,
                heroComputed: heroStyle
                  ? {
                      backdropFilter: heroStyle.backdropFilter,
                      filter: heroStyle.filter,
                      backgroundImage: heroStyle.backgroundImage,
                      backgroundColor: heroStyle.backgroundColor,
                    }
                  : null,
              };
              console.log('CHAMPAGNE_HERO_PROOF_JSON=' + JSON.stringify(payload));
            } catch (error) {
              console.error('CHAMPAGNE_HERO_PROOF_JSON_ERROR', error);
            }
          })();`,
        }}
      />
    ) : null;

  return (
    <BaseChampagneSurface
      variant="inkGlass"
      style={{
        minHeight: "72vh",
        display: "grid",
        alignItems: layout.contentAlign === "center" ? "center" : "stretch",
        overflow: "hidden",
        background: "transparent",
        ["--hero-gradient" as string]: gradient,
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
      }}
      className="hero-renderer hero-optical-isolation"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .hero-renderer {
              position: relative;
              color: var(--text-high);
              backdrop-filter: none !important;
              -webkit-backdrop-filter: none !important;
            }
            .hero-renderer.hero-optical-isolation > div[aria-hidden]:nth-of-type(1),
            .hero-renderer.hero-optical-isolation > div[aria-hidden]:nth-of-type(2) {
              background: none !important;
              opacity: 0 !important;
              mix-blend-mode: normal !important;
              backdrop-filter: none !important;
              -webkit-backdrop-filter: none !important;
            }
            .hero-renderer .hero-surface-stack {
              position: absolute;
              inset: 0;
            }
            .hero-renderer .hero-layer,
            .hero-renderer .hero-surface-layer {
              position: absolute;
              inset: 0;
            }
            .hero-renderer .hero-surface-layer.hero-surface--wave-backdrop {
              background-image: var(--hero-wave-background-desktop);
              background-size: cover;
              background-position: center;
              mix-blend-mode: var(--surface-blend-waveBackdrop, screen);
              opacity: var(--surface-opacity-waveBackdrop, 0.35);
            }
            .hero-renderer [data-surface-id="gradient.base"],
            .hero-renderer .hero-surface-layer.hero-surface--gradient-field {
              mix-blend-mode: normal;
              opacity: 1;
            }
            .hero-renderer [data-surface-id="field.waveBackdrop"] {
              mask-image: none;
              -webkit-mask-image: none;
            }
            .hero-renderer [data-surface-id="field.waveRings"],
            .hero-renderer [data-surface-id="field.dotGrid"] {
              mask-image: var(--hero-wave-mask-desktop);
              -webkit-mask-image: var(--hero-wave-mask-desktop);
              mask-repeat: no-repeat;
              -webkit-mask-repeat: no-repeat;
              mask-size: cover;
              -webkit-mask-size: cover;
              mask-position: center;
              -webkit-mask-position: center;
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
            .hero-renderer .hero-content {
              position: relative;
              z-index: 10;
              display: grid;
              gap: 1rem;
              max-width: ${layout.maxWidth ? `${layout.maxWidth}px` : "960px"};
              padding: ${layout.padding ?? "clamp(2rem, 4vw, 3.5rem)"};
              transform: translateY(${layout.verticalOffset ?? "0px"});
            }
            @media (max-width: 640px) {
              .hero-renderer .hero-surface-layer.hero-surface--wave-backdrop {
                background-image: var(--hero-wave-background-mobile);
                mask-image: none;
                -webkit-mask-image: none;
              }
              .hero-renderer [data-surface-id="field.waveRings"],
              .hero-renderer [data-surface-id="field.dotGrid"] {
                mask-image: var(--hero-wave-mask-mobile);
                -webkit-mask-image: var(--hero-wave-mask-mobile);
              }
              .hero-renderer [data-surface-id="overlay.filmGrain"] {
                background-image: var(--hero-grain-mobile);
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
        ref={surfaceRef}
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
            style={{ ...(layer.token ? layerStyles[layer.token] : undefined), ...diagnosticOutlineStyle }}
          />
        ))}

        {!prmEnabled && videoEntry?.path && !isDeniedVideo(videoEntry.path) && (
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
              mixBlendMode: (videoEntry.blendMode as CSSProperties["mixBlendMode"]) ?? "normal",
              opacity: resolveMotionOpacity("motion.heroVideo", videoEntry.opacity),
              zIndex: 6,
            }}
          >
            <source src={videoEntry.path} />
          </video>
        )}

        {!prmEnabled &&
          filteredMotionEntries.map((entry) => (
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
              mixBlendMode: (entry.blendMode as CSSProperties["mixBlendMode"]) ?? "screen",
              opacity: resolveMotionOpacity(entry.id, entry.opacity),
              zIndex: 6,
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
      {devProofScript}
    </BaseChampagneSurface>
  );
}
