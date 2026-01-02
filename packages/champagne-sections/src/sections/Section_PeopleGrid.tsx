import "@champagne/tokens";
import { BaseChampagneSurface } from "@champagne/hero";
import type { SectionRegistryEntry } from "../SectionRegistry";
import type { CSSProperties } from "react";

type PeopleGridItem = {
  name: string;
  role?: string;
  summary?: string;
  imageSrc?: string;
  imageAlt?: string;
};

function derivePeople(section?: SectionRegistryEntry): PeopleGridItem[] {
  const definition = (section?.definition as { items?: unknown[] } | undefined);
  const rawItems = Array.isArray(definition?.items) ? definition?.items : undefined;

  const mapped = (rawItems ?? [])
    .map((item, index) => {
      if (!item || typeof item !== "object") return undefined;

      const typedItem = item as Record<string, unknown>;
      const name = (typedItem.name as string | undefined) ?? `Team member ${index + 1}`;
      const role = typedItem.role as string | undefined;
      const summary = (typedItem.summary as string | undefined) ?? (typedItem.copy as string | undefined);
      const imageSrc = (typedItem.imageSrc as string | undefined)
        ?? (typedItem.image as { src?: string } | undefined)?.src
        ?? (typedItem.portrait as { src?: string } | undefined)?.src;
      const imageAlt = (typedItem.imageAlt as string | undefined)
        ?? (typedItem.image as { alt?: string } | undefined)?.alt
        ?? (typedItem.portrait as { alt?: string } | undefined)?.alt;

      return { name, role, summary, imageSrc, imageAlt } satisfies PeopleGridItem;
    })
    .filter(Boolean) as PeopleGridItem[];

  if (mapped.length > 0) return mapped;

  return [
    {
      name: "Clinical coordinator",
      role: "Care liaison",
      summary: "Supports patients throughout their visits and keeps communication clear between clinicians and reception.",
    },
    {
      name: "Nursing lead",
      role: "Senior dental nurse",
      summary: "Keeps treatment rooms prepared, maintains standards, and helps patients feel steady during appointments.",
    },
    {
      name: "Front desk",
      role: "Reception team",
      summary: "Welcomes patients, manages schedules, and ensures follow-up steps are well understood.",
    },
  ];
}

export function Section_PeopleGrid({ section }: { section?: SectionRegistryEntry }) {
  const eyebrow = section?.eyebrow ?? (section?.definition as { label?: string } | undefined)?.label;
  const title = section?.title
    ?? (section?.definition as { title?: string } | undefined)?.title
    ?? "Practice team";
  const copy = section?.body
    ?? (section?.definition as { copy?: string } | undefined)?.copy
    ?? (section?.definition as { body?: string } | undefined)?.body;

  const people = derivePeople(section);
  const surfaceStyle: CSSProperties = {
    padding: "clamp(1.25rem, 3vw, 2.35rem)",
    border: "1px solid var(--champagne-keyline-gold)",
    background: "var(--surface-ink-soft, var(--bg-ink-soft))",
  };
  const headerStyle: CSSProperties = {
    display: "grid",
    gap: "0.5rem",
    alignItems: "start",
  };
  const gridStyle: CSSProperties = {
    display: "grid",
    gap: "clamp(0.9rem, 2vw, 1.35rem)",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  };
  const cardStyle: CSSProperties = {
    display: "grid",
    gap: "0.75rem",
    borderRadius: "var(--radius-md)",
    border: "1px solid var(--border-strong)",
    background: "var(--surface-glass)",
    boxShadow: "var(--shadow-elevated)",
    padding: "1rem",
  };
  const imageFrameStyle: CSSProperties = {
    borderRadius: "var(--radius-md)",
    overflow: "hidden",
    border: "1px solid var(--border-strong)",
    background: "var(--surface-glass-soft, var(--surface-glass))",
  };
  const placeholderStyle: CSSProperties = {
    height: "12rem",
    width: "100%",
    background: "var(--surface-glass)",
  };

  return (
    <BaseChampagneSurface
      variant="glass"
      style={surfaceStyle}
    >
      <div style={headerStyle}>
        {eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[color:var(--text-medium)]">
            {eyebrow}
          </span>
        )}
        {title && <h3 className="text-xl font-bold leading-tight">{title}</h3>}
        {copy && <p className="text-[color:var(--text-medium)] leading-relaxed">{copy}</p>}
      </div>

      <div style={gridStyle}>
        {people.map((person, index) => {
          const altText = person.imageAlt?.trim() || `${person.name} portrait`;

          return (
            <div
              key={`${person.name}-${index}`}
              style={cardStyle}
            >
              <div style={imageFrameStyle}>
                {person.imageSrc ? (
                  <img
                    src={person.imageSrc}
                    alt={altText}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div style={placeholderStyle} aria-hidden />
                )}
              </div>

              <div className="grid gap-1">
                <div className="text-lg font-semibold leading-snug">{person.name}</div>
                {person.role && <div className="text-sm text-[color:var(--text-medium)]">{person.role}</div>}
                {person.summary && <p className="text-sm leading-relaxed text-[color:var(--text-medium)]">{person.summary}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </BaseChampagneSurface>
  );
}

export default Section_PeopleGrid;
