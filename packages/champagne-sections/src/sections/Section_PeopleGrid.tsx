import "@champagne/tokens";
import { BaseChampagneSurface } from "@champagne/hero";
import type { SectionRegistryEntry } from "../SectionRegistry";

type PeopleGridItem = {
  name: string;
  role?: string;
  summary?: string;
  imageSrc?: string;
  imageAlt?: string;
};

function derivePeople(section?: SectionRegistryEntry): PeopleGridItem[] {
  const definition = (section?.definition as { items?: unknown[] } | undefined);
  const fallbackItems = Array.isArray(section?.items) ? section?.items : undefined;
  const rawItems = Array.isArray(definition?.items) ? definition?.items : fallbackItems;

  const mapped = (rawItems ?? [])
    .map((item) => {
      if (!item || typeof item !== "object") return undefined;

      const typedItem = item as Record<string, unknown>;
      const name = (typedItem.name as string | undefined)?.trim();
      if (!name) return undefined;

      const role = (typedItem.role as string | undefined)?.trim();
      const summary = (typedItem.summary as string | undefined)
        ?? (typedItem.copy as string | undefined)
        ?? (typedItem.body as string | undefined);
      const rawImageSrc = (typedItem.imageSrc as string | undefined)
        ?? (typedItem.image as { src?: string } | undefined)?.src
        ?? (typedItem.portrait as { src?: string } | undefined)?.src;
      const imageSrc = rawImageSrc && rawImageSrc.toLowerCase() !== "placeholder"
        ? rawImageSrc
        : undefined;
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

  return (
    <BaseChampagneSurface
      variant="glass"
      style={{ backgroundImage: "none" }}
      className="grid gap-6 rounded-[var(--radius-lg)] border border-[color:var(--champagne-keyline-gold)] bg-[color:var(--surface-glass-soft,var(--surface-glass))] p-5 shadow-[var(--shadow-soft)] md:p-8 [--champagne-sheen-alpha:0.3] [--glass-opacity:0.35]"
    >
      <div className="grid items-start gap-2">
        {eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[color:var(--text-medium)]">
            {eyebrow}
          </span>
        )}
        {title && <h3 className="text-xl font-bold leading-tight">{title}</h3>}
        {copy && <p className="text-[color:var(--text-medium)] leading-relaxed">{copy}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((person, index) => {
          const altText = person.imageAlt?.trim() || `${person.name} portrait`;

          return (
            <div
              key={`${person.name}-${index}`}
              className="grid gap-3 rounded-[var(--radius-md)] border border-[color:var(--champagne-keyline-gold)] bg-[color:var(--surface-ink-soft,var(--surface-glass))] p-4 shadow-[var(--shadow-soft)]"
            >
              <div className="aspect-[4/5] w-full max-h-48 overflow-hidden rounded-[var(--radius-md)] border border-[color:var(--champagne-keyline-gold)] bg-[color:var(--surface-glass-soft,var(--surface-glass))]">
                {person.imageSrc ? (
                  <img
                    src={person.imageSrc}
                    alt={altText}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-[color:var(--surface-ink-soft,var(--surface-glass-soft,var(--surface-glass)))]" aria-hidden />
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
