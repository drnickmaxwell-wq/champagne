import "@champagne/tokens";
import type { ChampagneCTAConfig, ChampagneCTAVariant } from "./types";

export interface ChampagneCTAButtonProps {
  cta: ChampagneCTAConfig;
  align?: "start" | "center" | "end";
}

const baseButtonClasses =
  "inline-flex items-center justify-center gap-2 rounded-md border px-4 py-3 font-semibold leading-none no-underline " +
  "transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 tracking-tight";

const alignClasses: Record<NonNullable<ChampagneCTAButtonProps["align"]>, string> = {
  start: "self-start",
  center: "self-center",
  end: "self-end",
};

const variantClasses: Record<ChampagneCTAVariant, string> = {
  primary:
    "glass-soft champagne-gradient text-[var(--bg-ink)] border-transparent shadow-md " +
    "hover:opacity-95 focus-visible:outline-[color-mix(in_srgb,var(--brand-soft-gold)_60%,transparent)]",
  secondary:
    "glass-card text-[var(--text-high)] border-[color-mix(in_srgb,var(--champagne-keyline-gold)_55%,transparent)] " +
    "hover:bg-[color-mix(in_srgb,var(--surface-glass)_70%,transparent)] " +
    "focus-visible:outline-[color-mix(in_srgb,var(--brand-soft-gold)_45%,transparent)]",
  ghost:
    "bg-transparent text-[var(--text-medium)] border-[color-mix(in_srgb,var(--champagne-keyline-gold)_40%,transparent)] " +
    "hover:border-[color-mix(in_srgb,var(--champagne-keyline-gold)_60%,transparent)] " +
    "focus-visible:outline-[color-mix(in_srgb,var(--brand-soft-gold)_40%,transparent)]",
};

export function ChampagneCTAButton({ cta, align = "start" }: ChampagneCTAButtonProps) {
  const variant: ChampagneCTAVariant = cta.variant ?? "ghost";
  return (
    <a
      href={cta.href}
      data-variant={variant}
      className={`${baseButtonClasses} ${variantClasses[variant]} ${alignClasses[align]}`}
    >
      <span>{cta.label}</span>
    </a>
  );
}
