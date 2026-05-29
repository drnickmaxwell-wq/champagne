import type { CSSProperties } from "react";
import type { TreatmentAnswerSurface, TreatmentAnswerSurfaceSection } from "@champagne/manifests";
import { TREATMENT_ANSWER_SURFACE_REQUIRED_SECTION_IDS } from "@champagne/manifests";
import type { SectionRegistryEntry } from "./SectionRegistry";

interface SectionTreatmentAnswerSurfaceProps {
  section: SectionRegistryEntry;
}

const shellStyle: CSSProperties = {
  display: "grid",
  gap: "clamp(1rem, 2vw, 1.5rem)",
  padding: "clamp(1.25rem, 3vw, 2rem)",
  border: "1px solid var(--border-subtle)",
  background: "var(--surface-0)",
  color: "var(--text-high)",
  boxShadow: "var(--shadow-soft)",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 18rem), 1fr))",
  gap: "clamp(0.8rem, 1.8vw, 1.2rem)",
};

const cardStyle: CSSProperties = {
  display: "grid",
  gap: "0.65rem",
  padding: "1rem",
  border: "1px solid var(--border-subtle)",
  background: "var(--surface-1)",
  color: "var(--text-medium)",
};

const headingStyle: CSSProperties = {
  margin: 0,
  color: "var(--text-high)",
  fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
};

const bodyStyle: CSSProperties = {
  margin: 0,
  color: "var(--text-medium)",
  lineHeight: 1.65,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: "var(--text-low)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: "0.78rem",
};

function isAnswerSurface(value: unknown): value is TreatmentAnswerSurface {
  return Boolean(value && typeof value === "object" && Array.isArray((value as TreatmentAnswerSurface).sections));
}

function extractAnswerSurface(section: SectionRegistryEntry): TreatmentAnswerSurface | undefined {
  const definition = section.definition && typeof section.definition === "object" ? section.definition : undefined;
  const fromDefinition = (definition as { answerSurface?: unknown } | undefined)?.answerSurface;
  if (isAnswerSurface(fromDefinition)) return fromDefinition;
  if (isAnswerSurface(definition)) return definition;
  return undefined;
}

function renderSectionContent(answerSection: TreatmentAnswerSurfaceSection) {
  if (answerSection.faqs?.length) {
    return answerSection.faqs.map((faq) => (
      <p key={faq.question} style={bodyStyle}>
        <strong>{faq.question}</strong> {faq.answer}
      </p>
    ));
  }

  if (answerSection.links?.length) {
    return (
      <ul style={{ margin: 0, paddingInlineStart: "1.1rem" }}>
        {answerSection.links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    );
  }

  if (answerSection.ctas?.length) {
    return (
      <ul style={{ margin: 0, paddingInlineStart: "1.1rem" }}>
        {answerSection.ctas.map((cta) => (
          <li key={`${cta.href}-${cta.label}`}>
            <a href={cta.href}>{cta.label}</a>
          </li>
        ))}
      </ul>
    );
  }

  if (answerSection.items?.length) {
    return (
      <ul style={{ margin: 0, paddingInlineStart: "1.1rem" }}>
        {answerSection.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  if (answerSection.review) {
    return (
      <p style={bodyStyle}>
        Last reviewed: {answerSection.review.lastReviewed ?? "To be confirmed"}. Clinical reviewer: {answerSection.review.clinicalReviewer ?? "To be confirmed"}.
      </p>
    );
  }

  return null;
}

export function Section_TreatmentAnswerSurface({ section }: SectionTreatmentAnswerSurfaceProps) {
  const answerSurface = extractAnswerSurface(section);
  if (!answerSurface) return null;

  const sectionsById = new Map(answerSurface.sections.map((answerSection) => [answerSection.id, answerSection]));
  const orderedSections = TREATMENT_ANSWER_SURFACE_REQUIRED_SECTION_IDS
    .map((sectionId) => sectionsById.get(sectionId))
    .filter((answerSection): answerSection is TreatmentAnswerSurfaceSection => Boolean(answerSection));

  return (
    <section style={shellStyle} aria-labelledby={`${section.id}-heading`} data-answer-surface-status={answerSurface.status}>
      <div style={{ display: "grid", gap: "0.45rem" }}>
        <p style={eyebrowStyle}>Treatment answers</p>
        <h2 id={`${section.id}-heading`} style={{ ...headingStyle, fontSize: "clamp(1.35rem, 2.5vw, 2rem)" }}>
          {section.title ?? "Treatment answer surface"}
        </h2>
        {answerSurface.exampleSeed && (
          <p style={bodyStyle}>Example seed only. Future content rewrites can replace this structured data without changing the route or hero.</p>
        )}
      </div>
      <div style={gridStyle}>
        {orderedSections.map((answerSection) => (
          <article key={answerSection.id} style={cardStyle}>
            <h3 style={headingStyle}>{answerSection.heading}</h3>
            {answerSection.body && <p style={bodyStyle}>{answerSection.body}</p>}
            {renderSectionContent(answerSection)}
          </article>
        ))}
      </div>
    </section>
  );
}
