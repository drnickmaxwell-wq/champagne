"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export type DebugMode = "matcher" | "home";
type OverrideEntry = { opacity: number };
type OverrideMap = Record<string, OverrideEntry>;

type SurfaceOverrideControl = {
  id: string;
  label: string;
  max: number;
  step: number;
};

type SurfaceTelemetry = {
  computedOpacity: string;
  inlineOpacity: string;
};

const MODE_STORAGE_KEY = "champagne.hero.debug.mode";
const OVERRIDES_STORAGE_BASE_KEY = "champagne.hero.debug.overrides";

const surfaceOverrideControls: SurfaceOverrideControl[] = [
  { id: "field.waveRings", label: "Field · Wave Rings", max: 0.35, step: 0.01 },
  { id: "field.dotGrid", label: "Field · Dot Grid", max: 0.2, step: 0.01 },
  { id: "mask.waveHeader", label: "Mask · Wave Header", max: 0.6, step: 0.01 },
  { id: "overlay.filmGrain", label: "Overlay · Film Grain", max: 0.25, step: 0.01 },
];

const clampValue = (value: number, max: number) => Math.min(max, Math.max(0, value));

const readOverrides = (mode: DebugMode): OverrideMap => {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(`${OVERRIDES_STORAGE_BASE_KEY}.${mode}`);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as OverrideMap;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
};

const writeOverrides = (mode: DebugMode, overrides: OverrideMap) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(`${OVERRIDES_STORAGE_BASE_KEY}.${mode}`, JSON.stringify(overrides));
};

const getViewport = (mode: DebugMode) =>
  document.querySelector<HTMLElement>(`[data-hero-debug-viewport="${mode}"]`);

const setRootMode = (mode: DebugMode) => {
  const root = document.querySelector<HTMLElement>("[data-hero-debug-root]");
  if (root) {
    root.dataset.heroDebugMode = mode;
  }
};

const applyOverridesToViewport = (viewport: HTMLElement | null, overrides: OverrideMap) => {
  if (!viewport) return;
  const nodes = Array.from(viewport.querySelectorAll<HTMLElement>("[data-surface-id]"));
  nodes.forEach((node) => {
    const surfaceId = node.getAttribute("data-surface-id");
    if (!surfaceId) return;
    const overrideOpacity = overrides[surfaceId]?.opacity;
    if (typeof overrideOpacity === "number" && Number.isFinite(overrideOpacity)) {
      if (node.dataset.heroDebugInlineOpacity === undefined) {
        node.dataset.heroDebugInlineOpacity = node.style.opacity || "";
      }
      node.style.opacity = String(overrideOpacity);
      return;
    }
    if (node.dataset.heroDebugInlineOpacity !== undefined) {
      const originalOpacity = node.dataset.heroDebugInlineOpacity;
      if (originalOpacity) {
        node.style.opacity = originalOpacity;
      } else {
        node.style.removeProperty("opacity");
      }
      delete node.dataset.heroDebugInlineOpacity;
    }
  });
};

const collectSurfaceTelemetry = (viewport: HTMLElement | null): Record<string, SurfaceTelemetry> => {
  const telemetry: Record<string, SurfaceTelemetry> = {};
  surfaceOverrideControls.forEach((control) => {
    const element = viewport?.querySelector<HTMLElement>(`[data-surface-id="${control.id}"]`) ?? null;
    if (!element) {
      telemetry[control.id] = {
        computedOpacity: "missing",
        inlineOpacity: "missing",
      };
      return;
    }
    const computed = window.getComputedStyle(element);
    telemetry[control.id] = {
      computedOpacity: computed.opacity || "(none)",
      inlineOpacity: element.style.opacity || "(none)",
    };
  });
  return telemetry;
};

const installHeroDebugDump = () => {
  if (typeof window === "undefined") return;
  const debugWindow = window as typeof window & { __heroDebugDump?: () => void };
  if (debugWindow.__heroDebugDump) return;
  debugWindow.__heroDebugDump = () => {
    const root = document.querySelector<HTMLElement>('[data-hero-debug-root="true"]');
    const activeMode = root?.dataset.heroDebugMode === "home" ? "home" : "matcher";
    const viewport = getViewport(activeMode);
    if (!viewport) {
      console.warn("Hero debug: no active hero root detected.");
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const overridesEnabled = params.get("overrides") === "1";
    const activeOverrides = overridesEnabled ? readOverrides(activeMode) : {};
    const surfaceElements = Array.from(viewport.querySelectorAll<HTMLElement>("[data-surface-id]"));
    const rows = surfaceElements.map((element) => {
      const styles = window.getComputedStyle(element);
      return {
        id: element.getAttribute("data-surface-id") ?? "unknown",
        opacity: styles.opacity,
        blendMode: styles.mixBlendMode,
        zIndex: styles.zIndex,
      };
    });
    console.groupCollapsed("HERO_DEBUG_DUMP");
    console.log("mode", activeMode);
    console.log("overridesEnabled", overridesEnabled);
    console.log("overrides", activeOverrides);
    console.table(rows);
    console.groupEnd();
  };
};

type HeroDebugModePanelProps = {
  mode: DebugMode;
};

export function HeroDebugModePanel({ mode }: HeroDebugModePanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [overridesAllowed, setOverridesAllowed] = useState(false);
  const [overrideValues, setOverrideValues] = useState<Record<string, number>>(() =>
    surfaceOverrideControls.reduce<Record<string, number>>((acc, control) => {
      acc[control.id] = control.max;
      return acc;
    }, {}),
  );
  const [enabledOverrides, setEnabledOverrides] = useState<Record<string, boolean>>({});
  const [telemetry, setTelemetry] = useState<Record<string, SurfaceTelemetry>>({});
  const [initialized, setInitialized] = useState(false);

  const activeOverrides = useMemo(
    () =>
      surfaceOverrideControls.reduce<OverrideMap>((acc, control) => {
        if (enabledOverrides[control.id]) {
          acc[control.id] = { opacity: overrideValues[control.id] };
        }
        return acc;
      }, {}),
    [enabledOverrides, overrideValues],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    installHeroDebugDump();
    const params = new URLSearchParams(window.location.search);
    const overridesParam = params.get("overrides");
    const overridesEnabled = overridesParam === "1";
    setOverridesAllowed(overridesEnabled);

    if (overridesEnabled) {
      const storedOverrides = readOverrides(mode);
      setOverrideValues((prev) => {
        const next = { ...prev };
        surfaceOverrideControls.forEach((control) => {
          const storedValue = storedOverrides[control.id]?.opacity;
          if (typeof storedValue === "number" && Number.isFinite(storedValue)) {
            next[control.id] = clampValue(storedValue, control.max);
          }
        });
        return next;
      });
      setEnabledOverrides(() =>
        surfaceOverrideControls.reduce<Record<string, boolean>>((acc, control) => {
          acc[control.id] = typeof storedOverrides[control.id]?.opacity === "number";
          return acc;
        }, {}),
      );
    } else {
      setEnabledOverrides(
        surfaceOverrideControls.reduce<Record<string, boolean>>((acc, control) => {
          acc[control.id] = false;
          return acc;
        }, {}),
      );
    }

    window.localStorage.setItem(MODE_STORAGE_KEY, mode);
    setRootMode(mode);
    setInitialized(true);
  }, [mode]);

  useEffect(() => {
    if (!initialized) return;
    setRootMode(mode);
  }, [initialized, mode]);

  useEffect(() => {
    if (!initialized) return;
    const viewport = getViewport(mode);
    applyOverridesToViewport(viewport, {});

    if (!overridesAllowed) {
      setTelemetry(collectSurfaceTelemetry(viewport));
      return;
    }

    applyOverridesToViewport(viewport, activeOverrides);
    writeOverrides(mode, activeOverrides);
    setTelemetry(collectSurfaceTelemetry(viewport));
  }, [activeOverrides, initialized, mode, overridesAllowed]);

  useEffect(() => {
    if (!initialized) return;
    const viewport = getViewport(mode);
    if (!viewport) return;
    const observer = new MutationObserver(() => {
      setTelemetry(collectSurfaceTelemetry(viewport));
    });
    observer.observe(viewport, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["style", "data-surface-id", "class"],
    });
    return () => observer.disconnect();
  }, [initialized, mode]);

  return (
    <div className="hero-debug-mode-panel">
      <div className="hero-debug-panel">
        <div className="hero-debug-mode-row">
          <strong>Render Mode</strong>
          <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              type="radio"
              name="hero-debug-mode"
              value="matcher"
              checked={mode === "matcher"}
              onChange={() => {
                const params = new URLSearchParams(searchParams?.toString());
                params.set("mode", "matcher");
                router.replace(`/champagne/hero-debug?${params.toString()}`);
              }}
            />
            <span>Matcher Mode (Playwright)</span>
          </label>
          <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              type="radio"
              name="hero-debug-mode"
              value="home"
              checked={mode === "home"}
              onChange={() => {
                const params = new URLSearchParams(searchParams?.toString());
                params.set("mode", "home");
                router.replace(`/champagne/hero-debug?${params.toString()}`);
              }}
            />
            <span>Homepage Mode (Real Home Hero)</span>
          </label>
        </div>
        <p style={{ margin: 0, color: "var(--text-medium)" }}>
          Query overrides: <strong>?mode=matcher</strong> or <strong>?mode=home</strong>. Add{" "}
          <strong>&amp;overrides=1</strong> to enable overrides.
        </p>
      </div>

      <div className="hero-debug-override-panel">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <div>
            <h3 style={{ margin: 0 }}>Surface Override Lab</h3>
            <p style={{ margin: 0, color: "var(--text-medium)" }}>
              Overrides are scoped to the active hero render mode.
              {!overridesAllowed ? " Overrides disabled until ?overrides=1 is present." : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEnabledOverrides(
                surfaceOverrideControls.reduce<Record<string, boolean>>((acc, control) => {
                  acc[control.id] = false;
                  return acc;
                }, {}),
              );
              writeOverrides(mode, {});
              const viewport = getViewport(mode);
              applyOverridesToViewport(viewport, {});
              setTelemetry(collectSurfaceTelemetry(viewport));
            }}
            disabled={!overridesAllowed}
            style={{
              padding: "0.45rem 0.9rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--champagne-keyline-gold, var(--surface-ink-soft))",
              background: "var(--surface-ink-soft)",
              color: "var(--text-high)",
              fontWeight: 600,
              opacity: overridesAllowed ? 1 : 0.6,
            }}
          >
            Clear overrides
          </button>
        </div>
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {surfaceOverrideControls.map((control) => {
            const value = overrideValues[control.id] ?? control.max;
            const enabled = enabledOverrides[control.id];
            const stats = telemetry[control.id];
            return (
              <div
                key={control.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(160px, 1fr) minmax(140px, 1fr) auto minmax(180px, 1.5fr) 4.5rem",
                  gap: "0.75rem",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "grid", gap: "0.25rem" }}>
                  <strong>{control.label}</strong>
                  <span style={{ color: "var(--text-medium)", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
                    {control.id}
                  </span>
                </div>
                <div style={{ display: "grid", gap: "0.15rem" }}>
                  <span style={{ color: "var(--text-medium)", fontSize: "0.85rem" }}>Computed</span>
                  <span style={{ fontVariantNumeric: "tabular-nums" }}>{stats?.computedOpacity ?? "…"}</span>
                </div>
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
                    disabled={!overridesAllowed}
                  />
                  <span>Override</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={control.max}
                  step={control.step}
                  value={value}
                  disabled={!enabled || !overridesAllowed}
                  onChange={(event) => {
                    const nextValue = clampValue(Number(event.target.value), control.max);
                    setOverrideValues((prev) => ({
                      ...prev,
                      [control.id]: nextValue,
                    }));
                  }}
                />
                <span style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", color: "var(--text-medium)" }}>
                  {value.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
        <textarea
          readOnly
          rows={6}
          value={JSON.stringify(activeOverrides, null, 2)}
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
    </div>
  );
}
