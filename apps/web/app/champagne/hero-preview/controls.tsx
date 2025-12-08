"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface ControlPanelProps {
  theme: "light" | "dark";
  particles: boolean;
  filmGrain: boolean;
  prm: boolean;
}

export function HeroPreviewControls({ theme, particles, filmGrain, prm }: ControlPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = useMemo(() => {
    const next = new URLSearchParams(searchParams?.toString() ?? "");
    return next;
  }, [searchParams]);

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value === null) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    router.replace(`${pathname}?${next.toString()}`);
  };

  return (
    <div
      style={{
        display: "grid",
        gap: "0.75rem",
        padding: "1rem",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--champagne-keyline-gold)",
        background: "var(--surface-ink-soft)",
        color: "var(--text-high)",
        minWidth: "260px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: "var(--text-medium)", fontSize: "0.95rem" }}>Theme</span>
        <div style={{ display: "flex", gap: "0.35rem" }}>
          <button
            type="button"
            onClick={() => updateParam("theme", "dark")}
            style={{
              padding: "0.45rem 0.75rem",
              borderRadius: "var(--radius-md)",
              border: theme === "dark" ? "1px solid var(--champagne-keyline-gold)" : "1px solid transparent",
              background: theme === "dark" ? "var(--surface-ink-strong)" : "var(--surface-ink-soft)",
              color: "var(--text-high)",
            }}
          >
            Dark
          </button>
          <button
            type="button"
            onClick={() => updateParam("theme", "light")}
            style={{
              padding: "0.45rem 0.75rem",
              borderRadius: "var(--radius-md)",
              border: theme === "light" ? "1px solid var(--champagne-keyline-gold)" : "1px solid transparent",
              background: theme === "light" ? "var(--surface-ink-strong)" : "var(--surface-ink-soft)",
              color: "var(--text-high)",
            }}
          >
            Light
          </button>
        </div>
      </div>

      <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
        <span style={{ color: "var(--text-medium)", fontSize: "0.95rem" }}>Particles</span>
        <input
          type="checkbox"
          checked={particles}
          onChange={(event) => updateParam("particles", event.target.checked ? "true" : "false")}
        />
      </label>

      <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
        <span style={{ color: "var(--text-medium)", fontSize: "0.95rem" }}>Film grain</span>
        <input
          type="checkbox"
          checked={filmGrain}
          onChange={(event) => updateParam("filmGrain", event.target.checked ? "true" : "false")}
        />
      </label>

      <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
        <span style={{ color: "var(--text-medium)", fontSize: "0.95rem" }}>Reduced motion</span>
        <input
          type="checkbox"
          checked={prm}
          onChange={(event) => updateParam("prm", event.target.checked ? "true" : "false")}
        />
      </label>
    </div>
  );
}
