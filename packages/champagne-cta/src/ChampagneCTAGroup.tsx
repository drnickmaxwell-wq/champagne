import type { ChampagneCTAConfig, ChampagneCTAInput, ChampagneCTAVariant } from "./types";
import { ChampagneCTAButton } from "./ChampagneCTAButton";
import { resolveCTAList } from "./CTARegistry";

export interface ChampagneCTAGroupProps {
  ctas?: (ChampagneCTAConfig | ChampagneCTAInput)[];
  align?: "start" | "center" | "end";
  direction?: "row" | "column";
  gap?: string;
  showDebug?: boolean;
  label?: string;
  defaultVariant?: ChampagneCTAVariant;
}

const directionClasses: Record<NonNullable<ChampagneCTAGroupProps["direction"]>, string> = {
  row: "flex-row flex-wrap",
  column: "flex-col",
};

const alignClasses: Record<NonNullable<ChampagneCTAGroupProps["align"]>, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
};

export function ChampagneCTAGroup({
  ctas,
  align = "start",
  direction = "row",
  gap = "0.75rem",
  showDebug = false,
  label,
  defaultVariant = "ghost",
}: ChampagneCTAGroupProps) {
  const resolved = resolveCTAList(ctas ?? [], defaultVariant, { component: "ChampagneCTAGroup" });
  if (resolved.length === 0) return null;

  return (
    <div className="grid gap-2">
      {label && (
        <div className="text-[0.78rem] uppercase tracking-[0.08em] text-[var(--text-medium)]">
          {label}
        </div>
      )}
      <div
        className={`flex ${directionClasses[direction]} ${alignClasses[align]} justify-start`}
        style={{ gap }}
      >
        {resolved.map((cta) => (
          <ChampagneCTAButton key={cta.id} cta={cta} align={align} />
        ))}
      </div>
      {showDebug && (
        <div className="grid gap-1 rounded-md border border-dashed border-[color-mix(in_srgb,var(--champagne-keyline-gold)_45%,transparent)] bg-[color-mix(in_srgb,var(--bg-ink-soft)_35%,transparent)] p-2 text-[0.85rem] text-[var(--text-medium)]">
          <div className="opacity-80">CTA slot debug ({resolved.length})</div>
          <ul className="m-0 list-disc space-y-1 pl-4">
            {resolved.map((cta) => (
              <li key={`${cta.id}-${cta.href}`} className="leading-snug">
                <strong>{cta.label}</strong> → {cta.href} ({cta.variant ?? "ghost"})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
