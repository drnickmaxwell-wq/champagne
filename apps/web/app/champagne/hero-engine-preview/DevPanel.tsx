"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const variantOptions = [
  { label: "Sacred hero (current)", value: "" },
  { label: "Veneers", value: "veneers_calm_precision" },
  { label: "Implants", value: "implants_tech_precision" },
  { label: "Whitening", value: "whitening_bright_pop" },
  { label: "Ortho", value: "ortho_progression" },
];

interface DevPanelProps {
  variantId?: string;
  prm?: boolean;
}

export function DevPanel({ variantId, prm }: DevPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value?: string | null) => {
      const params = new URLSearchParams(searchParams?.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      const query = params.toString();
      const next = query ? `${pathname}?${query}` : pathname;
      router.replace(next, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return (
    <div
      style={{
        position: "absolute",
        top: "1.25rem",
        right: "1.25rem",
        display: "grid",
        gap: "0.75rem",
        padding: "1rem",
        borderRadius: "var(--radius-lg)",
        background: "var(--surface-ink-soft, rgba(6,7,12,0.65))",
        border: "1px solid var(--champagne-keyline-gold, rgba(255, 215, 137, 0.4))",
        boxShadow: "0 14px 40px rgba(0,0,0,0.35)",
        minWidth: "240px",
        color: "var(--text-high)",
        zIndex: 4,
      }}
    >
      <div style={{ display: "grid", gap: "0.5rem" }}>
        <label style={{ fontWeight: 600 }}>Variant</label>
        <select
          value={variantId ?? ""}
          onChange={(event) => updateParam("variant", event.target.value || null)}
          style={{
            padding: "0.65rem 0.75rem",
            borderRadius: "var(--radius-md)",
            background: "var(--surface-ink-soft, rgba(6,7,12,0.85))",
            color: "var(--text-high)",
            border: "1px solid var(--champagne-keyline-gold, rgba(255, 215, 137, 0.35))",
          }}
        >
          {variantOptions.map((variant) => (
            <option key={variant.value || "base"} value={variant.value}>
              {variant.label}
            </option>
          ))}
        </select>
      </div>

      <label style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
        <input
          type="checkbox"
          checked={Boolean(prm)}
          onChange={(event) => updateParam("prm", event.target.checked ? "1" : null)}
        />
        <span>Reduced motion (simulated)</span>
      </label>
    </div>
  );
}
