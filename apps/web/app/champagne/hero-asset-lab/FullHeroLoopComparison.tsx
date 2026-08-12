"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  HeroContentV2,
  HeroV2Frame,
  type HeroV2Model,
} from "../../components/hero/v2/HeroRendererV2";
import { HeroContentFade, HeroSurfaceStackV2 } from "../../components/hero/v2/HeroV2Client";
import styles from "./page.module.css";

const correctedMotionPaths = new Map([
  ["sacred.motion.waveCaustics", "/assets/champagne/motion/wave-caustics-seamless.webm"],
  ["sacred.motion.goldDust", "/assets/champagne/motion/gold-dust-drift-seamless.webm"],
]);

type ComparisonVersion = "original" | "corrected";

type LoopCounts = Record<ComparisonVersion, { wave: number; gold: number }>;

const emptyLoopCounts = (): LoopCounts => ({
  original: { wave: 0, gold: 0 },
  corrected: { wave: 0, gold: 0 },
});

function HeroComposition({ model, version }: { model: HeroV2Model; version: ComparisonVersion }) {
  const motionCount = model.surfaceStack.motionLayers.length;

  return (
    <div className={styles.heroViewport} data-full-hero-version={version}>
      <HeroV2Frame
        layout={model.layout}
        gradient={model.gradient}
        rootStyle={model.surfaceStack.surfaceVars}
        heroId={model.surfaceStack.heroId}
        variantId={model.surfaceStack.variantId}
        particlesPath={model.surfaceStack.particlesPath}
        particlesOpacity={model.surfaceStack.particlesOpacity}
        motionCount={motionCount}
        prm={model.surfaceStack.prmEnabled}
      >
        <div style={{ position: "absolute", inset: 0 }}>
          <HeroSurfaceStackV2 {...model.surfaceStack} />
        </div>
        <HeroContentFade>
          <HeroContentV2 content={model.content} layout={model.layout} />
        </HeroContentFade>
      </HeroV2Frame>
    </div>
  );
}

export function FullHeroLoopComparison({ model }: { model: HeroV2Model }) {
  const comparisonRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(true);
  const [loopCounts, setLoopCounts] = useState<LoopCounts>(emptyLoopCounts);
  const correctedModel = useMemo<HeroV2Model>(
    () => ({
      ...model,
      surfaceStack: {
        ...model.surfaceStack,
        motionLayers: model.surfaceStack.motionLayers.map((layer) => ({
          ...layer,
          path: correctedMotionPaths.get(layer.id) ?? layer.path,
        })),
      },
    }),
    [model],
  );

  useEffect(() => {
    const root = comparisonRef.current;
    if (!root) return;

    const videos = Array.from(root.querySelectorAll<HTMLVideoElement>("video"));
    const cleanups: Array<() => void> = [];

    (["original", "corrected"] as const).forEach((version) => {
      const versionRoot = root.querySelector<HTMLElement>(`[data-full-hero-version="${version}"]`);
      if (!versionRoot) return;

      ([
        ["wave", "sacred.motion.waveCaustics"],
        ["gold", "sacred.motion.goldDust"],
      ] as const).forEach(([kind, surfaceId]) => {
        const video = versionRoot.querySelector<HTMLVideoElement>(`video[data-surface-id="${surfaceId}"]`);
        if (!video) return;
        let previousTime = 0;
        const countLoop = () => {
          if (video.currentTime + 0.25 < previousTime) {
            setLoopCounts((current) => ({
              ...current,
              [version]: { ...current[version], [kind]: current[version][kind] + 1 },
            }));
          }
          previousTime = video.currentTime;
        };
        video.addEventListener("timeupdate", countLoop);
        cleanups.push(() => video.removeEventListener("timeupdate", countLoop));
      });
    });

    videos.forEach((video) => {
      video.currentTime = 0;
      void video.play().catch(() => undefined);
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  const restartTogether = () => {
    const videos = comparisonRef.current?.querySelectorAll<HTMLVideoElement>("video") ?? [];
    videos.forEach((video) => {
      video.currentTime = 0;
      void video.play().catch(() => undefined);
    });
    setLoopCounts(emptyLoopCounts());
    setPlaying(true);
  };

  const togglePlayback = () => {
    const videos = comparisonRef.current?.querySelectorAll<HTMLVideoElement>("video") ?? [];
    if (playing) {
      videos.forEach((video) => video.pause());
      setPlaying(false);
      return;
    }
    videos.forEach((video) => void video.play().catch(() => undefined));
    setPlaying(true);
  };

  return (
    <section className={styles.fullHeroSection} aria-labelledby="full-hero-loop-title" ref={comparisonRef}>
      <div className={styles.sectionIntro}>
        <p className={styles.eyebrow}>Full Sacred Hero proof</p>
        <h2 id="full-hero-loop-title">Current Hero versus seamless-loop Hero</h2>
        <p>
          These are the same complete Sacred Hero: identical geometry, copy, lighting, surfaces and motion intensity. Only the
          corrected Hero swaps the turquoise wave and gold-particle video paths. Restart them together and watch at least three
          boundaries.
        </p>
        <div className={styles.controls}>
          <button type="button" onClick={restartTogether} data-full-hero-restart>
            Restart both Heroes
          </button>
          <button type="button" onClick={togglePlayback} data-full-hero-toggle>
            {playing ? "Pause both Heroes" : "Play both Heroes"}
          </button>
        </div>
      </div>

      <div className={styles.heroComparisonGrid}>
        {([
          ["original", model],
          ["corrected", correctedModel],
        ] as const).map(([version, versionModel]) => (
          <article className={styles.heroComparisonCard} key={version}>
            <div className={styles.heroLabelRow}>
              <div>
                <p className={styles.heroVersion}>{version === "original" ? "Current original" : "Corrected seamless"}</p>
                <p className={styles.heroDifference}>
                  {version === "original" ? "Canonical motion assets" : "Only wave + gold paths replaced"}
                </p>
              </div>
              <div className={styles.heroCounters} aria-label={`${version} Hero loop counters`}>
                <span>
                  Wave <output data-full-loop-count={`${version}-wave`}>{loopCounts[version].wave}</output>
                </span>
                <span>
                  Gold <output data-full-loop-count={`${version}-gold`}>{loopCounts[version].gold}</output>
                </span>
              </div>
            </div>
            <HeroComposition model={versionModel} version={version} />
          </article>
        ))}
      </div>
    </section>
  );
}
