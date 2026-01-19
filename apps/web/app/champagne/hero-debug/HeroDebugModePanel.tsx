"use client";

import { useEffect, useMemo, useState } from "react";

type DebugMode = "matcher" | "home";
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
const OVERRIDES_STORAGE_KEY = "champagne.hero.debug.overrides";

const surfaceOverrideControls: SurfaceOverrideControl[] = [
  { id: "field.waveRings", label: "Field · Wave Rings", max: 0.35, step: 0.01 },
  { id: "field.dotGrid", label: "Field · Dot Grid", max: 0.2, step: 0.01 },
  { id: "mask.waveHeader", label: "Mask · Wave Header", max: 0.6, step: 0.01 },
  { id: "overlay.filmGrain", label: "Overlay · Film Grain", max: 0.25, step: 0.01 },
];

const clampValue = (value: number, max: number) => Math.min(max, Math.max(0, value));

const isDebugMode = (value: string | null): value is DebugMode =>
  value === "matcher" || value === "home";

const readOverrides = (): OverrideMap => {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(OVERRIDES_STORAGE_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as OverrideMap;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
};

const writeOverrides = (overrides: OverrideMap) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
};

const getSurfaceRoot = (mode: DebugMode) =>
  document.querySelector<HTMLElement>(`[data-hero-debug-surface-root="${mode}"]`);

const setRootMode = (mode: DebugMode) => {
  const root = document.querySelector<HTMLElement>("[data-hero-debug-root]");
  if (root) {
    root.dataset.heroDebugMode = mode;
  }
};

const applyOverridesToRoot = (root: HTMLElement | null, overrides: OverrideMap) => {
  if (!root) return;
  const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-surface-id]"));
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

const collectSurfaceTelemetry = (root: HTMLElement | null): Record<string, SurfaceTelemetry> => {
  const telemetry: Record<string, SurfaceTelemetry> = {};
  surfaceOverrideControls.forEach((control) => {
    const element = root?.querySelector<HTMLElement>(`[data-surface-id="${control.id}"]`) ?? null;
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

const installHeroTruthTable = () => {
  if (typeof window === "undefined") return;
  if ((window as typeof window & { __HERO_V2_TRUTH_TABLE?: () => void }).__HERO_V2_TRUTH_TABLE) return;
  (window as typeof window & { __HERO_V2_TRUTH_TABLE?: () => void }).__HERO_V2_TRUTH_TABLE = () => {
    const root = document.querySelector<HTMLElement>('[data-hero-debug-root="true"]');
    const activeMode = root?.dataset.heroDebugMode === "home" ? "home" : "matcher";
    const heroRoot = getSurfaceRoot(activeMode);
    if (!heroRoot) {
      console.warn("Hero debug: no active hero root detected.");
      return;
    }
    const surfaceElements = Array.from(heroRoot.querySelectorAll<HTMLElement>("[data-surface-id]"));
    const rows = surfaceElements.map((element) => {
      const styles = window.getComputedStyle(element);
      return {
        id: element.getAttribute("data-surface-id") ?? "unknown",
        opacity: styles.opacity,
        mixBlendMode: styles.mixBlendMode,
        zIndex: styles.zIndex,
      };
    });
    console.groupCollapsed("HERO_DEBUG_TRUTH_TABLE");
    console.table(rows);
    console.groupEnd();
  };
};

export function HeroDebugModePanel() {
  const [mode, setMode] = useState<DebugMode>("matcher");
  const [overridesAllowed, setOverridesAllowed] = useState(true);
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
    installHeroTruthTable();
    const params = new URLSearchParams(window.location.search);
    const queryMode = params.get("mode");
    const overridesParam = params.get("overrides");
    const overridesOff = overridesParam === "off";
    setOverridesAllowed(!overridesOff);

    let nextMode: DebugMode = "matcher";
    if (isDebugMode(queryMode)) {
      nextMode = queryMode;
    } else {
      const storedMode = window.localStorage.getItem(MODE_STORAGE_KEY);
      if (isDebugMode(storedMode)) {
        nextMode = storedMode;
      }
    }
    setMode(nextMode);
    setRootMode(nextMode);

    if (!overridesOff) {
      const storedOverrides = readOverrides();
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
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    setRootMode(mode);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(MODE_STORAGE_KEY, mode);
    }
  }, [initialized, mode]);

  useEffect(() => {
    if (!initialized) return;
    const matcherRoot = getSurfaceRoot("matcher");
    const homeRoot = getSurfaceRoot("home");
    applyOverridesToRoot(matcherRoot, {});
    applyOverridesToRoot(homeRoot, {});

    if (!overridesAllowed) {
      setTelemetry(collectSurfaceTelemetry(getSurfaceRoot(mode)));
      return;
    }

    applyOverridesToRoot(getSurfaceRoot(mode), activeOverrides);
    writeOverrides(activeOverrides);
    setTelemetry(collectSurfaceTelemetry(getSurfaceRoot(mode)));
  }, [activeOverrides, initialized, mode, overridesAllowed]);

  useEffect(() => {
    if (!initialized) return;
    const root = getSurfaceRoot(mode);
    if (!root) return;
    const observer = new MutationObserver(() => {
      setTelemetry(collectSurfaceTelemetry(root));
    });
    observer.observe(root, {
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
              onChange={() => setMode("matcher")}
            />
            <span>Matcher Mode (Playwright)</span>
          </label>
          <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              type="radio"
              name="hero-debug-mode"
              value="home"
              checked={mode === "home"}
              onChange={() => setMode("home")}
            />
            <span>Homepage Mode (Real Home Hero)</span>
          </label>
        </div>
        <p style={{ margin: 0, color: "var(--text-medium)" }}>
          Query overrides: <strong>?mode=matcher</strong> or <strong>?mode=home</strong>. Add{" "}
          <strong>&amp;overrides=off</strong> for a pristine baseline.
        </p>
      </div>

      <div className="hero-debug-override-panel">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <div>
            <h3 style={{ margin: 0 }}>Surface Override Lab</h3>
            <p style={{ margin: 0, color: "var(--text-medium)" }}>
              Overrides are scoped to the active hero render mode.
              {!overridesAllowed ? " Overrides disabled via ?overrides=off." : ""}
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
              writeOverrides({});
              const root = getSurfaceRoot(mode);
              applyOverridesToRoot(root, {});
              setTelemetry(collectSurfaceTelemetry(root));
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
                  gridTemplateColumns: "minmax(160px, 1fr) minmax(160px, 1fr) auto minmax(180px, 1.5fr) 4.5rem",
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
                  {enabled && overridesAllowed ? value.toFixed(2) : "—"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
