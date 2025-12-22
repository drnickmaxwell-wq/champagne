import type { CSSProperties } from "react";
import "@champagne/tokens";
import { ChampagneCTAGroup } from "@champagne/cta";
import type { ChampagneCTAConfig } from "@champagne/cta";
import { BaseChampagneSurface } from "@champagne/hero";
import type { SectionRegistryEntry } from "./SectionRegistry";
import { resolveTreatmentClosingCTAPlan } from "./treatmentClosingCtaPlan";

// Expected manifest shape:
// {
//   id: "composite_closing_cta",
//   type: "treatment_closing_cta",
//   title: string,
//   strapline?: string,
//   ctas?: [{ label: string, href?: string, preset?: string }]
// }

export interface SectionTreatmentClosingCTAProps {
  section?: SectionRegistryEntry;
  ctas?: ChampagneCTAConfig[];
  pageSlug?: string;
  usedMidCtaHrefs?: string[];
  absorbedMidCtas?: ChampagneCTAConfig[];
}

const wrapperStyle: CSSProperties = {
  display: "grid",
  gap: "0.75rem",
  alignItems: "center",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
};

export function Section_TreatmentClosingCTA({
  section,
  ctas,
  pageSlug,
  usedMidCtaHrefs,
  absorbedMidCtas,
}: SectionTreatmentClosingCTAProps = {}) {
  const title = section?.title ?? "Ready for a seamless smile refresh?";
  const strapline = section?.strapline
    ?? "Book a consultation or preview your smile with AI-guided mock-ups.";
  const { buttons } = resolveTreatmentClosingCTAPlan({
    section,
    ctas,
    pageSlug,
    usedHrefs: usedMidCtaHrefs,
    absorbedMidCtas,
  });

  return (
    <BaseChampagneSurface
      variant="inkGlass"
      style={{
        padding: "clamp(1.35rem, 3vw, 2.5rem)",
        border: "1px solid var(--champagne-keyline-gold, rgba(255, 215, 137, 0.24))",
        background:
          "radial-gradient(circle at 16% 10%, color-mix(in srgb, var(--smh-white, #ffffff) 16%, transparent), transparent 35%),"
          +
          "linear-gradient(135deg, color-mix(in srgb, var(--champagne-ink, #0b0f17) 82%, transparent), color-mix(in srgb, var(--bg-ink-soft, #0c0f16) 72%, transparent))",
      }}
    >
      <div style={wrapperStyle}>
        <div style={{ display: "grid", gap: "0.5rem" }}>
          <h3 style={{ fontSize: "clamp(1.25rem, 2.2vw, 1.65rem)", fontWeight: 700, lineHeight: 1.35 }}>{title}</h3>
          <p style={{ margin: 0, color: "var(--text-medium, rgba(235,235,235,0.82))", lineHeight: 1.6 }}>{strapline}</p>
        </div>
        <ChampagneCTAGroup ctas={buttons} label="Closing CTA" direction="row" defaultVariant="primary" />
      </div>
    </BaseChampagneSurface>
  );
}
