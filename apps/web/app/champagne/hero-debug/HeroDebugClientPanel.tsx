"use client";

import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import type { CSSProperties } from "react";
import { HeroRenderer } from "../../components/hero/HeroRenderer";
import type { HeroTimeOfDay } from "@champagne/hero";
import styles from "./heroDebugIsolate.module.css";

const trackedCssVars = [
  "--hero-wave-mask-desktop",
  "--hero-wave-mask-mobile",
  "--hero-overlay-field",
  "--hero-overlay-dots",
  "--hero-grain-desktop",
  "--hero-grain-mobile",
  "--hero-particles",
  "--hero-wave-background-desktop",
  "--hero-wave-background-mobile",
];

type TimeOfDayOption = "auto" | HeroTimeOfDay;

type CssVarMap = Record<string, string>;

type LayerKey = "waves" | "dotGrid" | "particles" | "filmGrain" | "motion" | "scrim";

const layerConfigs: { key: LayerKey; label: string; opacityParam: string; muteParam: string }[] = [
  { key: "waves", label: "Waves", opacityParam: "heroOpacityWaves", muteParam: "heroMuteWaves" },
  { key: "dotGrid", label: "Dot grid", opacityParam: "heroOpacityDotGrid", muteParam: "heroMuteDotGrid" },
  { key: "particles", label: "Particles", opacityParam: "heroOpacityParticles", muteParam: "heroMuteParticles" },
  { key: "filmGrain", label: "Film grain", opacityParam: "heroOpacityFilmGrain", muteParam: "heroMuteFilmGrain" },
  { key: "motion", label: "Motion overlays", opacityParam: "heroOpacityMotion", muteParam: "heroMuteMotion" },
  { key: "scrim", label: "Scrim / lighting", opacityParam: "heroOpacityScrim", muteParam: "heroMuteScrim" },
];

const clampPercent = (value: number) => Math.min(100, Math.max(0, value));

const parseOpacityParam = (params: URLSearchParams | null, key: string) => {
  const raw = params?.get(key);
  if (!raw) return 100;
  const parsed = Number.parseFloat(raw);
  if (!Number.isFinite(parsed)) return 100;
  const normalized = parsed <= 1 ? parsed * 100 : parsed;
  return clampPercent(normalized);
};

const parseSoloParam = (params: URLSearchParams | null) => {
  const raw = params?.get("heroSolo");
  if (!raw) return null;
  const match = layerConfigs.find((layer) => layer.key === raw);
  return match ? match.key : null;
};

export function HeroDebugClientPanel() {
  const debugParams = useMemo(() => {
    if (typeof window === "undefined") return null;

    return new URLSearchParams(window.location.search);
  }, []);

  const muteAllVeil = useMemo(() => debugParams?.get("heroMuteAllVeil") === "1", [debugParams]);

  const [diagnosticBoost, setDiagnosticBoost] = useState(true);
  const [mockPrm, setMockPrm] = useState(false);
  const [particles, setParticles] = useState(true);
  const [filmGrain, setFilmGrain] = useState(true);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDayOption>("auto");
  const [soloLayer, setSoloLayer] = useState<LayerKey | null>(() => parseSoloParam(debugParams));
  const [layerMutes, setLayerMutes] = useState<Record<LayerKey, boolean>>(() => ({
    waves: muteAllVeil || debugParams?.get("heroMuteWaves") === "1",
    dotGrid: muteAllVeil || debugParams?.get("heroMuteDotGrid") === "1",
    particles: muteAllVeil || debugParams?.get("heroMuteParticles") === "1",
    filmGrain: muteAllVeil || debugParams?.get("heroMuteFilmGrain") === "1",
    motion: muteAllVeil || debugParams?.get("heroMuteMotion") === "1",
    scrim: muteAllVeil || debugParams?.get("heroMuteScrim") === "1",
  }));
  const [layerOpacities, setLayerOpacities] = useState<Record<LayerKey, number>>(() => ({
    waves: parseOpacityParam(debugParams, "heroOpacityWaves"),
    dotGrid: parseOpacityParam(debugParams, "heroOpacityDotGrid"),
    particles: parseOpacityParam(debugParams, "heroOpacityParticles"),
    filmGrain: parseOpacityParam(debugParams, "heroOpacityFilmGrain"),
    motion: parseOpacityParam(debugParams, "heroOpacityMotion"),
    scrim: parseOpacityParam(debugParams, "heroOpacityScrim"),
  }));

  const heroSurfaceRef = useRef<HTMLDivElement | null>(null);
  const [cssVars, setCssVars] = useState<CssVarMap>({});
  const [surfaceIds, setSurfaceIds] = useState<string[]>([]);

  const resolvedTimeOfDay = useMemo(() => (timeOfDay === "auto" ? undefined : timeOfDay), [timeOfDay]);
  const heroRenderKey = useMemo(
    () =>
      [
        diagnosticBoost ? "boost" : "noboost",
        mockPrm ? "prm" : "motion",
        particles ? "fx" : "nofx",
        filmGrain ? "grain" : "nograin",
        resolvedTimeOfDay ?? "auto",
      ].join("-"),
    [diagnosticBoost, mockPrm, particles, filmGrain, resolvedTimeOfDay],
  );

  useEffect(() => {
    if (!debugParams) return;

    const opacityValues = Object.fromEntries(
      layerConfigs.map((layer) => [layer.key, Number((layerOpacities[layer.key] / 100).toFixed(3))]),
    );
    const summary = {
      solo: soloLayer,
      muteAllVeil,
      mutes: layerMutes,
      opacities: opacityValues,
    };
    console.log("[Hero Layer Lab] settings", summary);
  }, [debugParams, layerMutes, layerOpacities, muteAllVeil, soloLayer]);

  const layerOpacityVars = useMemo(
    () =>
      ({
        ["--heroDebugOpacityWaves" as const]: `${layerOpacities.waves / 100}`,
        ["--heroDebugOpacityDotGrid" as const]: `${layerOpacities.dotGrid / 100}`,
        ["--heroDebugOpacityParticles" as const]: `${layerOpacities.particles / 100}`,
        ["--heroDebugOpacityFilmGrain" as const]: `${layerOpacities.filmGrain / 100}`,
        ["--heroDebugOpacityMotion" as const]: `${layerOpacities.motion / 100}`,
        ["--heroDebugOpacityScrim" as const]: `${layerOpacities.scrim / 100}`,
      }) as CSSProperties,
    [layerOpacities],
  );

  const exportPayload = useMemo(
    () => ({
      solo: soloLayer,
      muteAllVeil,
      mutes: layerMutes,
      opacities: Object.fromEntries(
        layerConfigs.map((layer) => [layer.key, Number((layerOpacities[layer.key] / 100).toFixed(3))]),
      ),
    }),
    [layerMutes, layerOpacities, muteAllVeil, soloLayer],
  );

  useEffect(() => {
    const heroElement = heroSurfaceRef.current;

    if (!heroElement) {
      setCssVars({});
      setSurfaceIds([]);
      return undefined;
    }

    const updateDiagnostics = () => {
      const computed = getComputedStyle(heroElement);
      const nextVars: CssVarMap = {};

      trackedCssVars.forEach((key) => {
        const value = computed.getPropertyValue(key).trim();
        nextVars[key] = value || "(empty)";
      });

      const surfaces = Array.from(heroElement.querySelectorAll<HTMLElement>("[data-surface-id]"))
        .map((node) => node.getAttribute("data-surface-id") ?? "")
        .filter(Boolean);

      setCssVars(nextVars);
      setSurfaceIds(surfaces);
    };

    updateDiagnostics();

    const observer = new MutationObserver(updateDiagnostics);
    observer.observe(heroElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["style", "class", "data-surface-id"],
    });

    return () => observer.disconnect();
  }, [diagnosticBoost, mockPrm, particles, filmGrain, resolvedTimeOfDay]);

  return (
    <div className="hero-debug-panel" style={{ display: "grid", gap: "1rem" }}>
      <div
        style={{
          display: "grid",
          gap: "0.75rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          alignItems: "center",
        }}
      >
        <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <input
            type="checkbox"
            checked={diagnosticBoost}
            onChange={(event) => setDiagnosticBoost(event.target.checked)}
          />
          <span>Diagnostic boost</span>
        </label>

        <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <input type="checkbox" checked={mockPrm} onChange={(event) => setMockPrm(event.target.checked)} />
          <span>Mock PRM</span>
        </label>

        <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <input type="checkbox" checked={particles} onChange={(event) => setParticles(event.target.checked)} />
          <span>Particles</span>
        </label>

        <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <input type="checkbox" checked={filmGrain} onChange={(event) => setFilmGrain(event.target.checked)} />
          <span>Film grain</span>
        </label>

        <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <span>Time of day</span>
          <select value={timeOfDay} onChange={(event) => setTimeOfDay(event.target.value as TimeOfDayOption)}>
            <option value="auto">Auto</option>
            <option value="morning">Morning</option>
            <option value="day">Day</option>
            <option value="evening">Evening</option>
            <option value="night">Night</option>
          </select>
        </label>
      </div>

      <div style={{ position: "relative", borderRadius: "var(--radius-xl)", overflow: "hidden" }}>
        <div
          className={[
            styles.heroDebugIsolate,
            muteAllVeil ? styles.muteAllVeil : "",
            layerMutes.waves ? styles.muteWaves : "",
            layerMutes.dotGrid ? styles.muteDotGrid : "",
            layerMutes.particles ? styles.muteParticles : "",
            layerMutes.filmGrain ? styles.muteFilmGrain : "",
            layerMutes.motion ? styles.muteMotion : "",
            layerMutes.scrim ? styles.muteScrim : "",
            soloLayer ? styles.soloActive : "",
            soloLayer === "waves" ? styles.soloWaves : "",
            soloLayer === "dotGrid" ? styles.soloDotGrid : "",
            soloLayer === "particles" ? styles.soloParticles : "",
            soloLayer === "filmGrain" ? styles.soloFilmGrain : "",
            soloLayer === "motion" ? styles.soloMotion : "",
            soloLayer === "scrim" ? styles.soloScrim : "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={layerOpacityVars}
        >
          <Suspense fallback={<div style={{ padding: "1rem" }}>Loading hero...</div>}>
            <HeroRenderer
              key={heroRenderKey}
              prm={mockPrm}
              particles={particles}
              filmGrain={filmGrain}
              timeOfDay={resolvedTimeOfDay}
              diagnosticBoost={diagnosticBoost}
              surfaceRef={heroSurfaceRef}
            />
          </Suspense>
        </div>
      </div>

      <div style={{ display: "grid", gap: "0.75rem" }}>
        <h3 style={{ margin: 0 }}>Layer Lab</h3>
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {layerConfigs.map((layer) => {
            const opacityValue = layerOpacities[layer.key];
            return (
              <div
                key={layer.key}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(140px, 1fr) repeat(2, auto) minmax(160px, 1fr) 3.5rem",
                  gap: "0.75rem",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: 500 }}>{layer.label}</span>
                <label style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={layerMutes[layer.key]}
                    onChange={(event) =>
                      setLayerMutes((prev) => ({
                        ...prev,
                        [layer.key]: event.target.checked,
                      }))
                    }
                  />
                  <span>Mute</span>
                </label>
                <label style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={soloLayer === layer.key}
                    onChange={(event) => setSoloLayer(event.target.checked ? layer.key : null)}
                  />
                  <span>Solo</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={opacityValue}
                  onChange={(event) =>
                    setLayerOpacities((prev) => ({
                      ...prev,
                      [layer.key]: clampPercent(Number(event.target.value)),
                    }))
                  }
                />
                <span style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                  {(opacityValue / 100).toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
        <textarea
          readOnly
          rows={6}
          value={JSON.stringify(exportPayload, null, 2)}
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--champagne-keyline-gold, var(--surface-ink-soft))",
            background: "var(--surface-ink-soft)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.9rem",
          }}
        />
      </div>

      <div style={{ display: "grid", gap: "0.5rem" }}>
        <h3 style={{ margin: 0 }}>Computed CSS vars</h3>
        <pre
          style={{
            margin: 0,
            padding: "0.75rem 1rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--champagne-keyline-gold, var(--surface-ink-soft))",
            background: "var(--surface-ink-soft)",
            fontFamily: "var(--font-mono)",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {trackedCssVars.map((key) => `${key}: ${cssVars[key] ?? "(empty)"}`).join("\n")}
        </pre>
      </div>

      <div style={{ display: "grid", gap: "0.5rem" }}>
        <h3 style={{ margin: 0 }}>DOM surfaces present</h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          {surfaceIds.length === 0 ? (
            <span style={{ color: "var(--text-medium)" }}>None detected</span>
          ) : (
            surfaceIds.map((id) => (
              <span
                key={id}
                style={{
                  padding: "0.35rem 0.6rem",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--champagne-keyline-gold, var(--surface-ink-soft))",
                  background: "var(--surface-ink-soft)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.9rem",
                }}
              >
                {id}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
