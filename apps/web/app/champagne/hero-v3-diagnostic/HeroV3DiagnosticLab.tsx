"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { HeroRendererV2 } from "../../components/hero/v2/HeroRendererV2";
import styles from "./heroV3Diagnostic.module.css";

const STATIC_IDS = [
  "gradient.base",
  "field.waveBackdrop",
  "mask.waveHeader",
  "field.waveRings",
  "field.dotGrid",
  "overlay.particles",
  "overlay.filmGrain",
  "overlay.lighting",
  "overlay.sacredBloom",
  "hero.contentFrame",
] as const;

const MOTION_IDS = [
  "sacred.motion.waveCaustics",
  "sacred.motion.glassShimmer",
  "sacred.motion.particleDrift",
  "sacred.motion.goldDust",
] as const;

type StaticId = (typeof STATIC_IDS)[number];
type MotionId = (typeof MOTION_IDS)[number];
type SurfaceId = StaticId | MotionId;
type ViewportMode = "desktop" | "tablet" | "mobile";

type Preset = {
  id: string;
  label: string;
  visible: readonly SurfaceId[];
  reducedMotion?: boolean;
};

const PRESETS: Preset[] = [
  ...STATIC_IDS.map((id) => ({ id: `only:${id}`, label: `Only — ${id}`, visible: [id] })),
  { id: "cumulative:gradient-wave", label: "Cumulative 1 — gradient + wave", visible: STATIC_IDS.slice(0, 2) },
  { id: "cumulative:mask-rings", label: "Cumulative 2 — add mask + rings", visible: STATIC_IDS.slice(0, 4) },
  { id: "cumulative:dots", label: "Cumulative 3 — add dots", visible: STATIC_IDS.slice(0, 5) },
  { id: "cumulative:particles-grain", label: "Cumulative 4 — add particles + grain", visible: STATIC_IDS.slice(0, 7) },
  { id: "static:complete", label: "Complete V2 static", visible: STATIC_IDS },
  ...MOTION_IDS.map((id) => ({ id: `motion:${id}`, label: `Motion only — ${id}`, visible: ["gradient.base", id] as SurfaceId[] })),
  { id: "motion:complete", label: "Complete V2 motion", visible: [...STATIC_IDS, ...MOTION_IDS] },
  { id: "reduced:complete", label: "Reduced-motion V2", visible: STATIC_IDS, reducedMotion: true },
];

type SurfaceTelemetry = {
  id: string;
  tag: string;
  opacity: string;
  blend: string;
  zIndex: string;
  backgroundPosition: string;
  backgroundSize: string;
  mask: string;
  animationName: string;
  animationDuration: string;
  animationDelay: string;
  animationIterationCount: string;
  animationPlayState: string;
  nodeIdentity: string;
  media: null | {
    src: string;
    duration: number | null;
    currentTime: number;
    distanceToBoundary: number | null;
    playbackRate: number;
    readyState: number;
    paused: boolean;
  };
};

type LoopEvent = {
  at: string;
  id: string;
  kind: "time-regression" | "ended" | "emptied" | "loadstart" | "node-replaced";
  previousTime?: number;
  currentTime?: number;
};

const pct = (value: number) => `${Math.max(0, Math.min(100, value))}%`;

export function HeroV3DiagnosticLab() {
  const [presetId, setPresetId] = useState("motion:complete");
  const [selectedId, setSelectedId] = useState<SurfaceId>("sacred.motion.waveCaustics");
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(100);
  const [blend, setBlend] = useState("source");
  const [positionX, setPositionX] = useState(50);
  const [positionY, setPositionY] = useState(50);
  const [crop, setCrop] = useState(100);
  const [phase, setPhase] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [telemetry, setTelemetry] = useState<SurfaceTelemetry[]>([]);
  const [events, setEvents] = useState<LoopEvent[]>([]);
  const [sampleCount, setSampleCount] = useState(0);
  const surfaceRoot = useRef<HTMLDivElement | null>(null);
  const nodeIds = useRef(new WeakMap<Element, string>());
  const nodeSequence = useRef(0);
  const previousTimes = useRef(new Map<string, number>());
  const previousNodes = useRef(new Map<string, Element>());

  const preset = useMemo(() => PRESETS.find((entry) => entry.id === presetId) ?? PRESETS[0], [presetId]);
  const visibleSet = useMemo(() => new Set<string>(preset.visible), [preset.visible]);

  const identityFor = useCallback((node: Element) => {
    const existing = nodeIds.current.get(node);
    if (existing) return existing;
    nodeSequence.current += 1;
    const identity = `node-${nodeSequence.current}`;
    nodeIds.current.set(node, identity);
    return identity;
  }, []);

  const capture = useCallback(() => {
    const root = surfaceRoot.current;
    if (!root) return;
    const now = new Date().toISOString();
    const nextEvents: LoopEvent[] = [];
    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-surface-id]"));
    const next = nodes.map<SurfaceTelemetry>((node) => {
      const id = node.dataset.surfaceId ?? "unknown";
      const computed = window.getComputedStyle(node);
      const priorNode = previousNodes.current.get(id);
      if (priorNode && priorNode !== node) nextEvents.push({ at: now, id, kind: "node-replaced" });
      previousNodes.current.set(id, node);

      const video = node instanceof HTMLVideoElement ? node : null;
      let media: SurfaceTelemetry["media"] = null;
      if (video) {
        const duration = Number.isFinite(video.duration) ? video.duration : null;
        const priorTime = previousTimes.current.get(id);
        if (priorTime !== undefined && video.currentTime + 0.12 < priorTime) {
          nextEvents.push({ at: now, id, kind: "time-regression", previousTime: priorTime, currentTime: video.currentTime });
        }
        previousTimes.current.set(id, video.currentTime);
        media = {
          src: video.currentSrc || video.querySelector("source")?.getAttribute("src") || "",
          duration,
          currentTime: video.currentTime,
          distanceToBoundary: duration === null ? null : Math.max(0, duration - video.currentTime),
          playbackRate: video.playbackRate,
          readyState: video.readyState,
          paused: video.paused,
        };
      }

      return {
        id,
        tag: node.tagName.toLowerCase(),
        opacity: computed.opacity,
        blend: computed.mixBlendMode,
        zIndex: computed.zIndex,
        backgroundPosition: computed.backgroundPosition,
        backgroundSize: computed.backgroundSize,
        mask: computed.maskImage !== "none" ? computed.maskImage : computed.webkitMaskImage,
        animationName: computed.animationName,
        animationDuration: computed.animationDuration,
        animationDelay: computed.animationDelay,
        animationIterationCount: computed.animationIterationCount,
        animationPlayState: computed.animationPlayState,
        nodeIdentity: identityFor(node),
        media,
      };
    });
    setTelemetry(next);
    setSampleCount((count) => count + 1);
    if (nextEvents.length) setEvents((current) => [...nextEvents, ...current].slice(0, 100));
  }, [identityFor]);

  useEffect(() => {
    const root = surfaceRoot.current;
    if (!root) return;
    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-surface-id]"));
    nodes.forEach((node) => {
      const id = node.dataset.surfaceId ?? "";
      if (!node.dataset.h3Captured) {
        const source = window.getComputedStyle(node);
        node.dataset.h3Captured = "true";
        node.dataset.h3SourceOpacity = source.opacity;
        node.dataset.h3SourceBlend = source.mixBlendMode;
        node.dataset.h3SourcePosition = source.backgroundPosition;
        node.dataset.h3SourceSize = source.backgroundSize;
        node.dataset.h3SourceAnimationDelay = source.animationDelay;
        node.dataset.h3SourcePlaybackRate = node instanceof HTMLVideoElement ? String(node.playbackRate) : "";
      }
      const isSelected = id === selectedId;
      const shouldShow = visibleSet.has(id) && (!isSelected || visible);
      node.style.setProperty("opacity", shouldShow ? (isSelected ? String(opacity / 100) : node.dataset.h3SourceOpacity || "1") : "0", "important");
      if (isSelected) {
        if (blend === "source") node.style.setProperty("mix-blend-mode", node.dataset.h3SourceBlend || "normal", "important");
        else node.style.setProperty("mix-blend-mode", blend, "important");
        node.style.setProperty("background-position", `${pct(positionX)} ${pct(positionY)}`, "important");
        node.style.setProperty("background-size", `${crop}%`, "important");
        node.style.setProperty("transform-origin", `${pct(positionX)} ${pct(positionY)}`, "important");
        node.style.setProperty("animation-delay", `${-phase}s`, "important");
        if (node instanceof HTMLVideoElement) {
          node.playbackRate = playbackRate;
          if (Number.isFinite(node.duration) && phase <= node.duration) node.currentTime = phase;
        }
      } else {
        node.style.setProperty("mix-blend-mode", node.dataset.h3SourceBlend || "normal", "important");
        node.style.setProperty("background-position", node.dataset.h3SourcePosition || "0% 0%", "important");
        node.style.setProperty("background-size", node.dataset.h3SourceSize || "auto", "important");
        node.style.setProperty("transform-origin", "center", "important");
        node.style.setProperty("animation-delay", node.dataset.h3SourceAnimationDelay || "0s", "important");
        if (node instanceof HTMLVideoElement) node.playbackRate = Number(node.dataset.h3SourcePlaybackRate || "1");
      }
    });
    const frame = window.requestAnimationFrame(capture);
    return () => window.cancelAnimationFrame(frame);
  }, [blend, capture, crop, opacity, phase, playbackRate, positionX, positionY, selectedId, visible, visibleSet]);

  useEffect(() => {
    const root = surfaceRoot.current;
    if (!root) return;
    const eventNames = ["ended", "emptied", "loadstart"] as const;
    const listeners: Array<{ node: HTMLVideoElement; name: (typeof eventNames)[number]; handler: EventListener }> = [];
    root.querySelectorAll<HTMLVideoElement>("video[data-surface-id]").forEach((node) => {
      eventNames.forEach((name) => {
        const handler = () => setEvents((current) => [{ at: new Date().toISOString(), id: node.dataset.surfaceId ?? "unknown", kind: name }, ...current].slice(0, 100));
        node.addEventListener(name, handler);
        listeners.push({ node, name, handler });
      });
    });
    const timer = window.setInterval(capture, 200);
    capture();
    return () => {
      window.clearInterval(timer);
      listeners.forEach(({ node, name, handler }) => node.removeEventListener(name, handler));
    };
  }, [capture, preset.reducedMotion]);

  const resetControls = () => {
    setVisible(true);
    setOpacity(100);
    setBlend("source");
    setPositionX(50);
    setPositionY(50);
    setCrop(100);
    setPhase(0);
    setPlaybackRate(1);
  };

  const exportEvidence = () => {
    const payload = {
      schemaVersion: "HERO_V3_H3_1_LIVE_EVIDENCE_V1",
      generatedAt: new Date().toISOString(),
      preset: preset.id,
      viewport,
      sampleCount,
      controls: { selectedId, visible, opacity: opacity / 100, blend, positionX, positionY, crop, phase, playbackRate },
      telemetry,
      loopEvents: events,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `hero-v3-h3-1-${preset.id.replaceAll(":", "-")}.json`;
    link.click();
    URL.revokeObjectURL(href);
  };

  const frameStyle = { "--h3-frame-width": viewport === "desktop" ? "1440px" : viewport === "tablet" ? "900px" : "390px" } as CSSProperties;

  return (
    <main className={styles.page} data-h3-lab="true">
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>H3.1 · isolated · productionBinding=false</p>
          <h1>Hero V2 layer and motion observatory</h1>
          <p>Real V2 renderer, laboratory-only overrides and measured loop evidence. This route does not repair or bind production behaviour.</p>
        </div>
        <div className={styles.status}>
          <span>Samples <strong>{sampleCount}</strong></span>
          <span>Loop/remount events <strong>{events.length}</strong></span>
        </div>
      </header>

      <section className={styles.controls} aria-label="Diagnostic controls">
        <label>Evidence preset<select value={presetId} onChange={(event) => { setPresetId(event.target.value); resetControls(); }}>{PRESETS.map((entry) => <option key={entry.id} value={entry.id}>{entry.label}</option>)}</select></label>
        <label>Viewport frame<select value={viewport} onChange={(event) => setViewport(event.target.value as ViewportMode)}><option value="desktop">Desktop · 1440</option><option value="tablet">Tablet · 900</option><option value="mobile">Mobile · 390</option></select></label>
        <label>Selected surface<select value={selectedId} onChange={(event) => { setSelectedId(event.target.value as SurfaceId); resetControls(); }}>{[...STATIC_IDS, ...MOTION_IDS].map((id) => <option key={id}>{id}</option>)}</select></label>
        <label className={styles.checkbox}><input type="checkbox" checked={visible} onChange={(event) => setVisible(event.target.checked)} /> Visible</label>
        <label>Opacity <output>{opacity}%</output><input type="range" min="0" max="100" value={opacity} onChange={(event) => setOpacity(Number(event.target.value))} /></label>
        <label>Blend<select value={blend} onChange={(event) => setBlend(event.target.value)}><option value="source">Renderer source</option><option value="normal">Normal</option><option value="screen">Screen</option><option value="overlay">Overlay</option><option value="soft-light">Soft light</option><option value="multiply">Multiply</option></select></label>
        <label>Focal X <output>{positionX}%</output><input type="range" min="0" max="100" value={positionX} onChange={(event) => setPositionX(Number(event.target.value))} /></label>
        <label>Focal Y <output>{positionY}%</output><input type="range" min="0" max="100" value={positionY} onChange={(event) => setPositionY(Number(event.target.value))} /></label>
        <label>Crop <output>{crop}%</output><input type="range" min="50" max="240" value={crop} onChange={(event) => setCrop(Number(event.target.value))} /></label>
        <label>Phase <output>{phase.toFixed(1)}s</output><input type="range" min="0" max="42" step="0.1" value={phase} onChange={(event) => setPhase(Number(event.target.value))} /></label>
        <label>Playback <output>{playbackRate.toFixed(2)}×</output><input type="range" min="0.25" max="2" step="0.05" value={playbackRate} onChange={(event) => setPlaybackRate(Number(event.target.value))} /></label>
        <div className={styles.actions}><button type="button" onClick={resetControls}>Reset selected overrides</button><button type="button" onClick={() => setEvents([])}>Clear events</button><button type="button" onClick={exportEvidence}>Export evidence JSON</button></div>
      </section>

      <section className={styles.stageShell} style={frameStyle} aria-label="Real V2 render">
        <div className={styles.viewportLabel}>{viewport} evidence frame · use true browser viewports for media-query captures</div>
        <div className={styles.stage}>
          <HeroRendererV2 prm={preset.reducedMotion} particles filmGrain diagnosticBoost={false} surfaceRef={surfaceRoot} pageSlugOrPath="/" />
        </div>
      </section>

      <section className={styles.readouts}>
        <div className={styles.panel}>
          <h2>Current layer timing and paint</h2>
          <div className={styles.tableWrap}><table><thead><tr><th>Surface</th><th>Node</th><th>Opacity</th><th>Blend / z</th><th>Animation</th><th>Media time / duration</th><th>Boundary</th></tr></thead><tbody>{telemetry.map((entry) => <tr key={entry.id}><td><code>{entry.id}</code></td><td>{entry.nodeIdentity}<br />{entry.tag}</td><td>{entry.opacity}</td><td>{entry.blend} / {entry.zIndex}</td><td>{entry.animationName}<br />{entry.animationDuration} · delay {entry.animationDelay}</td><td>{entry.media ? `${entry.media.currentTime.toFixed(2)} / ${entry.media.duration?.toFixed(2) ?? "?"}s` : "static"}</td><td>{entry.media?.distanceToBoundary?.toFixed(2) ?? "—"}</td></tr>)}</tbody></table></div>
        </div>
        <div className={styles.panel}>
          <h2>Measured loop and node events</h2>
          {events.length === 0 ? <p>No time regression, media lifecycle or node replacement observed in this sampling window.</p> : <ol className={styles.eventList}>{events.map((event, index) => <li key={`${event.at}-${event.id}-${index}`}><time>{event.at}</time> <code>{event.id}</code> — {event.kind}{event.previousTime !== undefined ? ` ${event.previousTime.toFixed(2)}s → ${event.currentTime?.toFixed(2)}s` : ""}</li>)}</ol>}
        </div>
      </section>
    </main>
  );
}
