import { HeroRenderer } from "../../components/hero/HeroRenderer";
import type { HeroTimeOfDay } from "@champagne/hero";
import { HeroPreviewControls } from "./controls";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function normalizeBoolean(value: string | string[] | undefined, defaultValue: boolean): boolean {
  if (Array.isArray(value)) return value.includes("true") ? true : value.includes("false") ? false : defaultValue;
  if (typeof value === "string") return value === "true";
  return defaultValue;
}

function mapThemeToTimeOfDay(theme: string | string[] | undefined): HeroTimeOfDay {
  if (theme === "light") return "day";
  return "night";
}

export default async function HeroPreviewPage({ searchParams }: { searchParams?: SearchParams }) {
  const resolved = (await searchParams) ?? {};
  const themeParam = typeof resolved.theme === "string" ? resolved.theme : "dark";
  const timeOfDay = mapThemeToTimeOfDay(themeParam);
  const particles = normalizeBoolean(resolved.particles, true);
  const filmGrain = normalizeBoolean(resolved.filmGrain, true);
  const prm = normalizeBoolean(resolved.prm, false);

  return (
    <div
      style={{
        display: "grid",
        gap: "1.5rem",
        padding: "clamp(1.5rem, 4vw, 2.5rem)",
        background: "var(--bg-ink)",
        color: "var(--text-high)",
      }}
    >
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <div style={{ display: "grid", gap: "0.35rem" }}>
          <p style={{ letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-medium)" }}>
            Sacred hero preview
          </p>
          <h1 style={{ fontSize: "clamp(1.8rem, 2.6vw, 2.3rem)", fontWeight: 700 }}>Surface parity sandbox</h1>
          <p style={{ color: "var(--text-medium)", maxWidth: "740px", lineHeight: 1.5 }}>
            Toggle key surface layers, motion safety, and light variants to validate the reconstructed Sacred hero before
            shipping.
          </p>
        </div>
        <HeroPreviewControls
          theme={themeParam === "light" ? "light" : "dark"}
          particles={particles}
          filmGrain={filmGrain}
          prm={prm}
        />
      </header>

      <div style={{ borderRadius: "var(--radius-xl)", overflow: "hidden", position: "relative" }}>
        <HeroRenderer timeOfDay={timeOfDay} particles={particles} filmGrain={filmGrain} prm={prm} />
      </div>
    </div>
  );
}
