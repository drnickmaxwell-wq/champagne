"use client";

import { useEffect, useMemo, useState } from "react";
import { HeroDebugClientPanel } from "./HeroDebugClientPanel";

type OverrideEntry = { opacity: number };
type OverrideMap = Record<string, OverrideEntry>;

type SurfaceOverrideControl = {
  id: string;
  label: string;
  max: number;
  step: number;
};

const HERO_DEBUG_OVERRIDE_KEY = "champagne.hero.debug.overrides";
const HERO_DEBUG_OVERRIDE_EVENT = "champagne-hero-debug-overrides";

const surfaceOverrideControls: SurfaceOverrideControl[] = [
  { id: "field.waveRings", label: "Field · Wave Rings", max: 0.35, step: 0.01 },
  { id: "field.dotGrid", label: "Field · Dot Grid", max: 0.2, step: 0.01 },
  { id: "mask.waveHeader", label: "Mask · Wave Header", max: 0.6, step: 0.01 },
  { id: "overlay.filmGrain", label: "Overlay · Film Grain", max: 0.25, step: 0.01 },
];

const clampValue = (value: number, max: number) => Math.min(max, Math.max(0, value));

const readStoredOverrides = () => {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(HERO_DEBUG_OVERRIDE_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as OverrideMap;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
};

const writeStoredOverrides = (overrides: OverrideMap) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HERO_DEBUG_OVERRIDE_KEY, JSON.stringify(overrides));
  window.dispatchEvent(new Event(HERO_DEBUG_OVERRIDE_EVENT));
};

const logSurfaceDiagnostics = (surfaceIds: string[]) => {
  if (typeof window === "undefined") return;
  const rows = surfaceIds.map((surfaceId) => {
    const element = document.querySelector<HTMLElement>(`[data-surface-id="${surfaceId}"]`);
    if (!element) {
      return {
        surfaceId,
        inlineOpacity: "missing",
        computedOpacity: "missing",
        blendMode: "missing",
      };
    }
    const computed = window.getComputedStyle(element);
    return {
      surfaceId,
      inlineOpacity: element.style.opacity || "(none)",
      computedOpacity: computed.opacity || "(none)",
      blendMode: computed.mixBlendMode || "(none)",
    };
  });
  console.table(rows);
};

function HeroDebugOverridePanel() {
  const initialValues = useMemo(
    () =>
      surfaceOverrideControls.reduce<Record<string, number>>((acc, control) => {
        acc[control.id] = control.max;
        return acc;
      }, {}),
    [],
  );
  const [overrideValues, setOverrideValues] = useState<Record<string, number>>(initialValues);
  const [enabledOverrides, setEnabledOverrides] = useState<Record<string, boolean>>({});
  const [loadedOverrides, setLoadedOverrides] = useState(false);

  useEffect(() => {
    const stored = readStoredOverrides();
    setOverrideValues((prev) => {
      const next = { ...prev };
      surfaceOverrideControls.forEach((control) => {
        const storedValue = stored[control.id]?.opacity;
        if (typeof storedValue === "number" && Number.isFinite(storedValue)) {
          next[control.id] = clampValue(storedValue, control.max);
        }
      });
      return next;
    });
    setEnabledOverrides(() =>
      surfaceOverrideControls.reduce<Record<string, boolean>>((acc, control) => {
        acc[control.id] = typeof stored[control.id]?.opacity === "number";
        return acc;
      }, {}),
    );
    setLoadedOverrides(true);
  }, []);

  useEffect(() => {
    if (!loadedOverrides) return;
    const overrides = Object.fromEntries(
      surfaceOverrideControls
        .filter((control) => enabledOverrides[control.id])
        .map((control) => [control.id, { opacity: overrideValues[control.id] }]),
    ) as OverrideMap;
    writeStoredOverrides(overrides);
  }, [enabledOverrides, loadedOverrides, overrideValues]);

  return (
    <div className="hero-debug-override-panel">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <div>
          <h3 style={{ margin: 0 }}>Surface Override Lab</h3>
          <p style={{ margin: 0, color: "var(--text-medium)" }}>LocalStorage debug overrides for Sacred hero surfaces.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEnabledOverrides((prev) => {
              const next = { ...prev };
              surfaceOverrideControls.forEach((control) => {
                next[control.id] = false;
              });
              return next;
            });
            writeStoredOverrides({});
          }}
          style={{
            padding: "0.45rem 0.9rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--champagne-keyline-gold, var(--surface-ink-soft))",
            background: "var(--surface-ink-soft)",
            color: "var(--text-high)",
            fontWeight: 600,
          }}
        >
          Clear overrides
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gap: "0.75rem",
        }}
      >
        {surfaceOverrideControls.map((control) => {
          const value = overrideValues[control.id] ?? control.max;
          const enabled = enabledOverrides[control.id];
          return (
            <div
              key={control.id}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(160px, 1fr) auto minmax(180px, 1.5fr) 4.5rem",
                gap: "0.75rem",
                alignItems: "center",
              }}
            >
              <strong>{control.label}</strong>
              <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={Boolean(enabled)}
                  onChange={(event) => {
                    const checked = event.target.checked;
                    setEnabledOverrides((prev) => ({
                      ...prev,
                      [control.id]: checked,
                    }));
                  }}
                />
                <span>Override</span>
              </label>
              <input
                type="range"
                min={0}
                max={control.max}
                step={control.step}
                value={value}
                disabled={!enabled}
                onChange={(event) => {
                  const nextValue = clampValue(Number(event.target.value), control.max);
                  setOverrideValues((prev) => ({
                    ...prev,
                    [control.id]: nextValue,
                  }));
                  logSurfaceDiagnostics(surfaceOverrideControls.map((item) => item.id));
                }}
              />
              <span style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", color: "var(--text-medium)" }}>
                {value.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
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
        {JSON.stringify(
          Object.fromEntries(
            surfaceOverrideControls
              .filter((control) => enabledOverrides[control.id])
              .map((control) => [control.id, { opacity: overrideValues[control.id] }]),
          ),
          null,
          2,
        )}
      </pre>
    </div>
  );
}

export default function HeroDebugPage() {
  return (
    <div
      className="hero-debug-page"
      style={{
        display: "grid",
        gap: "1.5rem",
        padding: "clamp(1.5rem, 4vw, 2.5rem)",
        background: "var(--bg-ink)",
        color: "var(--text-high)",
        minHeight: "100vh",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .hero-debug-page { min-height: 100vh; }
            .hero-debug-panel { border-radius: var(--radius-lg); border: 1px solid var(--champagne-keyline-gold, var(--surface-ink-soft)); background: color-mix(in srgb, var(--bg-ink) 70%, transparent); padding: 1rem 1.25rem; overflow: auto; display: grid; gap: 0.75rem; }
            .hero-debug-override-panel { border-radius: var(--radius-lg); border: 1px solid var(--champagne-keyline-gold, var(--surface-ink-soft)); background: color-mix(in srgb, var(--bg-ink) 78%, transparent); padding: 1rem 1.25rem; display: grid; gap: 0.75rem; }
            .hero-debug-panel h3 { margin: 0; font-size: 1rem; }
            .hero-debug-panel table { width: 100%; border-collapse: collapse; font-size: 0.95rem; }
            .hero-debug-panel th, .hero-debug-panel td { text-align: left; padding: 0.35rem 0.5rem; border-bottom: 1px solid color-mix(in srgb, var(--champagne-keyline-gold, var(--surface-ink-soft)) 50%, transparent); }
            .hero-debug-panel th { letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-medium); font-size: 0.8rem; }
            .hero-debug-hero-shell { position: relative; min-height: 72vh; border-radius: var(--radius-xl); overflow: hidden; border: 1px solid var(--champagne-keyline-gold, var(--surface-ink-soft)); background: color-mix(in srgb, var(--bg-ink) 80%, transparent); }
          `,
        }}
      />

      <header style={{ display: "grid", gap: "0.35rem" }}>
        <p style={{ letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-medium)" }}>Sacred hero debug</p>
        <h1 style={{ fontSize: "clamp(1.9rem, 2.5vw, 2.4rem)" }}>Runtime surface observatory</h1>
        <p style={{ color: "var(--text-medium)", maxWidth: "880px", lineHeight: 1.55 }}>
          Toggle static layers, PRM, and time-of-day to confirm the Sacred home hero resolves masks, overlays, grain, and particles correctly.
        </p>
      </header>

      <HeroDebugOverridePanel />

      <div className="hero-debug-hero-shell">
        <HeroDebugClientPanel />
      </div>
    </div>
  );
}
