"use client";

import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { HeroRenderer } from "../../components/hero/HeroRenderer";
import type { HeroTimeOfDay } from "@champagne/hero";

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

export function HeroDebugClientPanel() {
  const [diagnosticBoost, setDiagnosticBoost] = useState(true);
  const [mockPrm, setMockPrm] = useState(false);
  const [particles, setParticles] = useState(true);
  const [filmGrain, setFilmGrain] = useState(true);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDayOption>("auto");

  const heroContainerRef = useRef<HTMLDivElement | null>(null);
  const [cssVars, setCssVars] = useState<CssVarMap>({});
  const [surfaceIds, setSurfaceIds] = useState<string[]>([]);

  const resolvedTimeOfDay = useMemo(() => (timeOfDay === "auto" ? undefined : timeOfDay), [timeOfDay]);

  useEffect(() => {
    const heroElement = heroContainerRef.current?.querySelector<HTMLElement>(".hero-renderer");

    if (!heroElement) {
      setCssVars({});
      setSurfaceIds([]);
      return;
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

    const frame = requestAnimationFrame(updateDiagnostics);

    return () => cancelAnimationFrame(frame);
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

      <div ref={heroContainerRef} style={{ position: "relative", borderRadius: "var(--radius-xl)", overflow: "hidden" }}>
        <Suspense fallback={<div style={{ padding: "1rem" }}>Loading hero...</div>}>
          <HeroRenderer
            prm={mockPrm}
            particles={particles}
            filmGrain={filmGrain}
            timeOfDay={resolvedTimeOfDay}
            diagnosticBoost={diagnosticBoost}
          />
        </Suspense>
      </div>

      <div style={{ display: "grid", gap: "0.5rem" }}>
        <h3 style={{ margin: 0 }}>Computed CSS vars</h3>
        <div
          style={{
            display: "grid",
            gap: "0.25rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}
        >
          {trackedCssVars.map((key) => (
            <div
              key={key}
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--champagne-keyline-gold, var(--surface-ink-soft))",
                background: "var(--surface-ink-soft)",
              }}
            >
              <div style={{ fontSize: "0.8rem", letterSpacing: "0.05em", color: "var(--text-medium)" }}>{key}</div>
              <div style={{ fontFamily: "var(--font-mono)", wordBreak: "break-word" }}>{cssVars[key] ?? "(empty)"}</div>
            </div>
          ))}
        </div>
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
