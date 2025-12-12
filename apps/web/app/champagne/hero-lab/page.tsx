import { HeroRenderer } from "../../_components/HeroRenderer/HeroRenderer";
import type { HeroMode, HeroTimeOfDay } from "@champagne/hero";

const TREATMENT_SLUGS: { label: string; slug: string }[] = [
  { label: "Teeth whitening", slug: "teeth-whitening" },
  { label: "Dental implants", slug: "dental-implants" },
  { label: "Spark aligners", slug: "spark-aligners" },
  { label: "Porcelain veneers", slug: "porcelain-veneers" },
  { label: "Digital technology", slug: "dental-technology" },
];

function normalizeBoolean(value: string | string[] | undefined, defaultValue: boolean): boolean {
  if (Array.isArray(value)) return value.includes("true") ? true : value.includes("false") ? false : defaultValue;
  if (typeof value === "string") return value === "true";
  return defaultValue;
}

function normalizeMode(value: string | string[] | undefined): HeroMode {
  return value === "treatment" ? "treatment" : "home";
}

function normalizeTimeOfDay(value: string | string[] | undefined): HeroTimeOfDay | undefined {
  if (value === "day" || value === "evening" || value === "night") return value;
  return undefined;
}

export default async function HeroLabPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = (await searchParams) ?? {};
  const mode = normalizeMode(resolvedParams.mode);
  const timeOfDay = normalizeTimeOfDay(resolvedParams.timeOfDay);
  const treatmentSlug = typeof resolvedParams.treatmentSlug === "string" ? resolvedParams.treatmentSlug : undefined;
  const prm = normalizeBoolean(resolvedParams.prm, false);
  const particles = normalizeBoolean(resolvedParams.particles, true);
  const filmGrain = normalizeBoolean(resolvedParams.filmGrain, true);
  const theme = resolvedParams.theme === "light" ? "light" : "dark";

  return (
    <div
      style={{
        display: "grid",
        gap: "1.5rem",
        padding: "clamp(1.5rem, 4vw, 2.5rem)",
        background: "var(--bg-ink)",
        color: "var(--text-high)",
      }}
      data-theme={theme}
    >
      <header style={{ display: "grid", gap: "0.35rem" }}>
        <p style={{ letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-medium)" }}>Internal preview</p>
        <h1 style={{ fontSize: "clamp(1.6rem, 2.4vw, 2.2rem)", fontWeight: 700 }}>Hero Lab</h1>
        <p style={{ color: "var(--text-medium)", maxWidth: "760px", lineHeight: 1.5 }}>
          Inspect sacred hero variants, motion safety, and manifests. Use this surface to sanity check treatment slugs before
          shipping.
        </p>
      </header>

      <form
        style={{
          display: "grid",
          gap: "1rem",
          padding: "1rem",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--champagne-keyline-gold)",
          background: "var(--surface-ink-soft)",
        }}
      >
        <div style={{ display: "grid", gap: "0.35rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <label style={{ display: "grid", gap: "0.35rem" }}>
            <span style={{ color: "var(--text-medium)", fontSize: "0.95rem" }}>Mode</span>
            <select name="mode" defaultValue={mode} style={{ padding: "0.75rem", borderRadius: "var(--radius-md)" }}>
              <option value="home">Home</option>
              <option value="treatment">Treatment</option>
            </select>
          </label>

          <label style={{ display: "grid", gap: "0.35rem" }}>
            <span style={{ color: "var(--text-medium)", fontSize: "0.95rem" }}>Treatment slug</span>
            <select
              name="treatmentSlug"
              defaultValue={treatmentSlug ?? ""}
              disabled={mode !== "treatment"}
              style={{ padding: "0.75rem", borderRadius: "var(--radius-md)" }}
            >
              <option value="">(none)</option>
              {TREATMENT_SLUGS.map((entry) => (
                <option key={entry.slug} value={entry.slug}>
                  {entry.label}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "grid", gap: "0.35rem" }}>
            <span style={{ color: "var(--text-medium)", fontSize: "0.95rem" }}>Time of day</span>
            <select name="timeOfDay" defaultValue={timeOfDay ?? ""} style={{ padding: "0.75rem", borderRadius: "var(--radius-md)" }}>
              <option value="">Auto</option>
              <option value="day">Day</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </select>
          </label>

          <label style={{ display: "grid", gap: "0.35rem" }}>
            <span style={{ color: "var(--text-medium)", fontSize: "0.95rem" }}>Theme</span>
            <select name="theme" defaultValue={theme} style={{ padding: "0.75rem", borderRadius: "var(--radius-md)" }}>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </label>
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input type="hidden" name="prm" value="false" />
            <input type="checkbox" name="prm" value="true" defaultChecked={prm} />
            <span>Simulate reduced motion</span>
          </label>
          <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input type="hidden" name="particles" value="false" />
            <input type="checkbox" name="particles" value="true" defaultChecked={particles} />
            <span>Particles</span>
          </label>
          <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input type="hidden" name="filmGrain" value="false" />
            <input type="checkbox" name="filmGrain" value="true" defaultChecked={filmGrain} />
            <span>Film grain</span>
          </label>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button type="submit" style={{ padding: "0.75rem 1.1rem", borderRadius: "var(--radius-md)" }}>
            Refresh preview
          </button>
          <span style={{ color: "var(--text-medium)", fontSize: "0.95rem" }}>
            Params update via query string for easy sharing.
          </span>
        </div>
      </form>

      <div style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--champagne-keyline-gold)" }}>
        <HeroRenderer
          mode={mode}
          treatmentSlug={mode === "treatment" ? treatmentSlug : undefined}
          prm={prm}
          timeOfDay={timeOfDay}
          particles={particles}
          filmGrain={filmGrain}
        />
      </div>
    </div>
  );
}
