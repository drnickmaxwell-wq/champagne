import type { CSSProperties } from "react";
import "@champagne/tokens";
import { BaseChampagneSurface } from "@champagne/hero";
import type { SectionRegistryEntry } from "./SectionRegistry";

// Expected manifest shape:
// {
//   id: "composite_faq",
//   type: "treatment_faq_block",
//   faqs: [{ question: string, answer: string }]
// }

export interface SectionFAQProps {
  section?: SectionRegistryEntry;
}

const listStyle: CSSProperties = {
  display: "grid",
  gap: "0.75rem",
};

export function Section_FAQ({ section }: SectionFAQProps = {}) {
  const eyebrow = section?.eyebrow ?? "FAQ";
  const title = section?.title ?? "Composite bonding questions, answered.";
  const faqs = section?.faqs ?? [
    {
      question: "How long does composite bonding last?",
      answer: "With careful polishing and routine maintenance, bonding can last several years before a refresh is needed.",
    },
    {
      question: "Is the appointment painful?",
      answer: "Most cases are non-invasive and completed without injections; sensitivity is minimal for the majority of patients.",
    },
    {
      question: "Will the colour match my teeth?",
      answer: "Shade guides and layered resins are matched to your smile so the finish blends into the natural enamel.",
    },
  ];

  return (
    <BaseChampagneSurface
      variant="glass"
      style={{
        padding: "clamp(1.25rem, 3vw, 2.35rem)",
        border: "1px solid var(--border-subtle)",
        background: "var(--surface-1)",
        boxShadow: "var(--shadow-soft)",
      }}
    >
      <div style={{ display: "grid", gap: "0.5rem" }}>
        {eyebrow && (
          <span style={{ fontSize: "0.85rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-medium)" }}>
            {eyebrow}
          </span>
        )}
        <h3 style={{ fontSize: "clamp(1.15rem, 2vw, 1.55rem)", fontWeight: 700 }}>{title}</h3>
      </div>
      <div style={listStyle}>
        {faqs.map((faq, index) => (
          <details
            key={`${faq.question}-${index}`}
            open={index === 0}
            style={{
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
              background: "var(--surface-2)",
              padding: "0.9rem 1rem",
            }}
          >
            <summary style={{ cursor: "pointer", fontWeight: 700, lineHeight: 1.5, color: "var(--text-high)" }}>
              {faq.question}
            </summary>
            <p style={{ marginTop: "0.5rem", lineHeight: 1.6, color: "var(--text-medium)" }}>{faq.answer}</p>
          </details>
        ))}
      </div>
    </BaseChampagneSurface>
  );
}
