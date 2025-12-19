import type { CSSProperties } from "react";
import "@champagne/tokens";
import { ChampagneCTAGroup, resolveCTAList } from "@champagne/cta";
import type { ChampagneCTAConfig, ChampagneCTAInput } from "@champagne/cta";
import { BaseChampagneSurface } from "@champagne/hero";
import type { SectionRegistryEntry } from "./SectionRegistry";

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
}

const wrapperStyle: CSSProperties = {
  display: "grid",
  gap: "0.75rem",
  alignItems: "center",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
};

function mapSectionCTAs(section?: SectionRegistryEntry): ChampagneCTAInput[] {
  const asVariant = (value?: string) => {
    if (value === "primary" || value === "secondary" || value === "ghost") return value;
    return undefined;
  };

  return (
    section?.ctas?.map((cta, index) => ({
      id: cta.id ?? (section?.id ? `${section.id}-cta-${index + 1}` : `cta-${index + 1}`),
      label: cta.label,
      href: cta.href,
      variant: asVariant(cta.variant ?? (cta as { preset?: string }).preset),
    })) ?? []
  );
}

function getFallbackCTAs(section?: SectionRegistryEntry): ChampagneCTAConfig[] {
  const preventativeCheckupIds = new Set([
    "preventative-general-checkups-card",
    "preventative-general-cta",
  ]);

  if (section?.id && preventativeCheckupIds.has(section.id)) {
    return [
      {
        id: "dental-checkups-primary",
        label: "Dental check-ups & oral cancer screening",
        href: "/dental-checkups-oral-cancer-screening",
        variant: "primary",
      },
      { id: "book-consultation", label: "Book a consultation", href: "/contact", variant: "secondary" },
    ];
  }

  return [
    { id: "book-consultation", label: "Book a consultation", href: "/contact", variant: "primary" },
    {
      id: "ai-smile-preview",
      label: "Preview your smile with AI",
      href: "/treatments/digital-smile-design",
      variant: "secondary",
    },
  ];
}

export function Section_TreatmentClosingCTA({ section, ctas }: SectionTreatmentClosingCTAProps = {}) {
  const title = section?.title ?? "Ready for a seamless smile refresh?";
  const strapline = section?.strapline
    ?? "Book a consultation or preview your smile with AI-guided mock-ups.";
  const fallbackCTAs = getFallbackCTAs(section);
  const resolvedCTAs = resolveCTAList(ctas ?? mapSectionCTAs(section) ?? fallbackCTAs, "primary");

  const renderedCTAs = resolvedCTAs.length > 0 ? resolvedCTAs : fallbackCTAs;

  return (
    <BaseChampagneSurface
      variant="inkGlass"
      style={{
        padding: "clamp(1.35rem, 3vw, 2.5rem)",
        border: "1px solid var(--champagne-keyline-gold, rgba(255, 215, 137, 0.24))",
        background:
          "radial-gradient(circle at 16% 10%, color-mix(in srgb, var(--smh-white, #ffffff) 16%, transparent), transparent 35%), linear-gradient(135deg, color-mix(in srgb, var(--champagne-ink, #0b0f17) 82%, transparent), color-mix(in srgb, var(--bg-ink-soft, #0c0f16) 72%, transparent))",
      }}
    >
      <div style={wrapperStyle}>
        <div style={{ display: "grid", gap: "0.5rem" }}>
          <h3 style={{ fontSize: "clamp(1.25rem, 2.2vw, 1.65rem)", fontWeight: 700, lineHeight: 1.35 }}>{title}</h3>
          <p style={{ margin: 0, color: "var(--text-medium, rgba(235,235,235,0.82))", lineHeight: 1.6 }}>{strapline}</p>
        </div>
        <ChampagneCTAGroup ctas={renderedCTAs} label="Closing CTA" direction="row" defaultVariant="primary" />
      </div>
    </BaseChampagneSurface>
  );
}
