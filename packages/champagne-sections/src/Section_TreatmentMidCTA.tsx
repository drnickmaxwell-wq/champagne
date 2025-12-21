import type { CSSProperties } from "react";
import "@champagne/tokens";
import { ChampagneCTAGroup } from "@champagne/cta";
import { BaseChampagneSurface } from "@champagne/hero";
import type { SectionRegistryEntry } from "./SectionRegistry";
import { resolveTreatmentMidCTAPlan } from "./treatmentMidCtaPlan";

export interface SectionTreatmentMidCTAProps {
  section?: SectionRegistryEntry;
  pageSlug?: string;
}

const wrapperStyle: CSSProperties = {
  display: "grid",
  gap: "0.75rem",
  alignItems: "center",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
};

export function Section_TreatmentMidCTA({ section, pageSlug }: SectionTreatmentMidCTAProps) {
  const { resolvedCTAs } = resolveTreatmentMidCTAPlan(section, pageSlug);

  const title = section?.title ?? "Explore related care";
  const strapline = section?.strapline ?? "See nearby treatments and plan your next step.";

  return (
    <BaseChampagneSurface
      variant="glass"
      style={{
        padding: "clamp(1.15rem, 2.5vw, 2rem)",
        border: "1px solid var(--champagne-keyline-gold)",
      }}
    >
      <div style={wrapperStyle}>
        <div style={{ display: "grid", gap: "0.4rem" }}>
          <h3 style={{ fontSize: "clamp(1.1rem, 2vw, 1.45rem)", fontWeight: 700, lineHeight: 1.35 }}>{title}</h3>
          <p style={{ margin: 0, color: "var(--text-medium)", lineHeight: 1.6 }}>{strapline}</p>
        </div>
        <ChampagneCTAGroup ctas={resolvedCTAs} label="Mid-page CTAs" direction="row" defaultVariant="secondary" />
      </div>
    </BaseChampagneSurface>
  );
}
