import type { CSSProperties } from "react";
import "@champagne/tokens";
import { BaseChampagneSurface } from "@champagne/hero";
import type { SectionRegistryEntry } from "./SectionRegistry";

// Expected manifest shape:
// {
//   id: "composite_patient_stories",
//   type: "patient_stories_rail",
//   stories: [{ title?: string, summary: string, name?: string, role?: string }]
// }

export interface SectionPatientStoriesRailProps {
  section?: SectionRegistryEntry;
}

const railStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "clamp(0.85rem, 2vw, 1.35rem)",
};

export function Section_PatientStoriesRail({ section }: SectionPatientStoriesRailProps = {}) {
  const eyebrow = section?.eyebrow ?? "Patient stories";
  const title = section?.title ?? "Real composite bonding journeys.";
  const stories = section?.stories ?? [
    { summary: "Closed a small gap and softened a chipped edge in one appointment.", name: "A. Morgan" },
    { summary: "Blended composite across two incisors for a balanced smile line.", name: "Sam R." },
    { summary: "Rebuilt a worn corner with minimal prep and immediate results.", name: "Priya L." },
  ];

  return (
    <BaseChampagneSurface
      variant="glass"
      style={{
        padding: "clamp(1.25rem, 3vw, 2.35rem)",
        border: "1px solid var(--champagne-keyline-gold, rgba(255, 215, 137, 0.18))",
        background:
          "linear-gradient(135deg, color-mix(in srgb, var(--bg-ink, #06070c) 86%, transparent), color-mix(in srgb, var(--bg-ink-soft, #0c0f16) 78%, transparent)), radial-gradient(circle at 18% 16%, color-mix(in srgb, var(--smh-white, #ffffff) 12%, transparent), transparent 34%)",
      }}
    >
      <div style={{ display: "grid", gap: "0.55rem" }}>
        {eyebrow && (
          <span style={{ fontSize: "0.85rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-medium)" }}>
            {eyebrow}
          </span>
        )}
        <h3 style={{ fontSize: "clamp(1.15rem, 2vw, 1.55rem)", fontWeight: 700 }}>{title}</h3>
      </div>
      <div style={railStyle}>
        {stories.map((story, index) => (
          <div
            key={`${story.name ?? story.title ?? index}-${index}`}
            style={{
              borderRadius: "var(--radius-md)",
              padding: "1rem",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "color-mix(in srgb, var(--surface-glass, rgba(255,255,255,0.05)) 80%, transparent)",
              boxShadow: "0 16px 36px rgba(0,0,0,0.24)",
              display: "grid",
              gap: "0.4rem",
            }}
          >
            {story.title && <div style={{ fontWeight: 700 }}>{story.title}</div>}
            <p style={{ margin: 0, lineHeight: 1.6, color: "var(--text-medium)" }}>{story.summary}</p>
            <div style={{ color: "var(--text-medium)", fontSize: "0.95rem" }}>
              {story.name && <strong>{story.name}</strong>}
              {story.role && <span style={{ marginLeft: "0.35rem" }}>{story.role}</span>}
            </div>
          </div>
        ))}
      </div>
    </BaseChampagneSurface>
  );
}
