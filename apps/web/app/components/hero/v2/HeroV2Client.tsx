"use client";

import { memo, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { CSSProperties, Ref } from "react";
import { BloomDriver } from "./BloomDriver";
import type { HeroSurfaceStackModel } from "./HeroRendererV2";

const surfaceStackCompositeStyle: CSSProperties = {
  contain: "paint",
  transform: "translateZ(0)",
  willChange: "transform",
  backfaceVisibility: "hidden",
};

const surfaceLayerCompositeStyle: CSSProperties = {
  transform: "translateZ(0)",
  backfaceVisibility: "hidden",
};

type HeroSurfaceStackV2Props = HeroSurfaceStackModel & {
  surfaceRef?: Ref<HTMLDivElement>;
};

function HeroSurfaceStackV2Base({
  surfaceVars,
  prmEnabled,
  layers,
  motionLayers,
  heroVideo,
  sacredBloom,
  surfaceRef,
}: HeroSurfaceStackV2Props) {
  const instanceId = useRef(`v2-stack-${Math.random().toString(36).slice(2, 10)}`);
  const stackStyle = useMemo(() => ({ ...surfaceVars, ...surfaceStackCompositeStyle }), [surfaceVars]);
  const normalizedLayers = useMemo(
    () =>
      layers.map((layer) => ({
        ...layer,
        style: { ...surfaceLayerCompositeStyle, ...layer.style },
      })),
    [layers],
  );
  const normalizedMotionLayers = useMemo(
    () =>
      motionLayers.map((layer) => ({
        ...layer,
        style: { ...surfaceLayerCompositeStyle, ...layer.style },
      })),
    [motionLayers],
  );

  return (
    <>
      <BloomDriver />
      <div
        aria-hidden
        className="hero-surface-stack"
        ref={surfaceRef}
        data-prm={prmEnabled ? "true" : "false"}
        data-v2-composite-stabilized="true"
        data-v2-contain="paint"
        data-v2-willchange="transform"
        data-v2-persistent-stack="true"
        data-v2-stack-instance={instanceId.current}
        style={stackStyle}
      >
        {normalizedLayers.map((layer) => (
          <div
            key={layer.id}
            data-surface-id={layer.id}
            data-surface-role={layer.role}
            data-prm-safe={layer.prmSafe ? "true" : undefined}
            data-contrast-glue={layer.contrastFilter ? "phase3c" : undefined}
            data-contrast-filter={layer.contrastFilter}
            data-glue-source={layer.glueMeta?.source}
            data-glue-size={layer.glueMeta?.backgroundSize}
            data-glue-repeat={layer.glueMeta?.backgroundRepeat}
            data-glue-position={layer.glueMeta?.backgroundPosition}
            data-glue-image-rendering={layer.glueMeta?.imageRendering}
            className={layer.className}
            style={layer.style}
          />
        ))}

        {!prmEnabled && heroVideo?.path && (
          <video
            className="hero-surface-layer hero-surface--motion"
            autoPlay
            playsInline
            loop
            muted
            preload="metadata"
            poster={heroVideo.poster}
            data-surface-id="motion.heroVideo"
            style={{ ...surfaceLayerCompositeStyle, ...heroVideo.style }}
          >
            <source src={heroVideo.path} />
          </video>
        )}

        {!prmEnabled &&
          normalizedMotionLayers.map((entry) => (
            <video
              key={entry.id}
              className={`hero-surface-layer hero-surface--motion${entry.className ? ` ${entry.className}` : ""}`}
              autoPlay
              playsInline
              loop
              muted
              preload="metadata"
              data-surface-id={entry.id}
              style={entry.style}
            >
              <source src={entry.path} />
            </video>
          ))}

        <div
          data-surface-id="overlay.sacredBloom"
          data-surface-role="fx"
          data-bloom="true"
          data-bloom-driven="true"
          data-bloom-debug={sacredBloom.bloomDebug ? "true" : "false"}
          data-bloom-base-opacity={sacredBloom.baseOpacity}
          data-bloom-shape={sacredBloom.shape}
          data-bloom-mask={sacredBloom.mask}
          data-contrast-glue={sacredBloom.contrastFilter ? "phase3c" : undefined}
          data-contrast-filter={sacredBloom.contrastFilter}
          data-glue-source={sacredBloom.glueMeta?.source}
          data-glue-size={sacredBloom.glueMeta?.backgroundSize}
          data-glue-repeat={sacredBloom.glueMeta?.backgroundRepeat}
          data-glue-position={sacredBloom.glueMeta?.backgroundPosition}
          data-glue-image-rendering={sacredBloom.glueMeta?.imageRendering}
          className="hero-surface-layer hero-surface--lighting"
          aria-hidden="true"
          style={{ ...surfaceLayerCompositeStyle, ...sacredBloom.style }}
        />
      </div>
    </>
  );
}

export const HeroSurfaceStackV2 = memo(HeroSurfaceStackV2Base);

type HeroContentFadeProps = {
  children: ReactNode;
};

export function HeroContentFade({ children }: HeroContentFadeProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(media.matches);
    updatePreference();
    media.addEventListener?.("change", updatePreference);
    return () => media.removeEventListener?.("change", updatePreference);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    setIsVisible(false);
    const id = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(id);
  }, [pathname, prefersReducedMotion]);

  const style = useMemo<CSSProperties>(
    () => ({
      opacity: prefersReducedMotion ? 1 : isVisible ? 1 : 0,
      transition: prefersReducedMotion ? "none" : "opacity 220ms ease",
      willChange: "opacity",
    }),
    [isVisible, prefersReducedMotion],
  );

  return (
    <div style={style} data-v2-content-fade="true">
      {children}
    </div>
  );
}
