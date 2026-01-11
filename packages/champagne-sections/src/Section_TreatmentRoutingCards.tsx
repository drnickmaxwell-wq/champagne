import type { CSSProperties } from "react";
import "@champagne/tokens";
import type { SectionRegistryEntry } from "./SectionRegistry";

interface RoutingCard {
  title: string;
  description?: string;
  href: string;
  tag?: string;
}

const containerStyle: CSSProperties = {
  borderRadius: "var(--radius-lg)",
  padding: "clamp(1.35rem, 2.8vw, 2.35rem)",
  border: "1px solid var(--border-subtle)",
  background: "var(--surface-1)",
  boxShadow: "var(--shadow-soft)",
  display: "grid",
  gap: "1rem",
};

const headerStyle: CSSProperties = {
  display: "grid",
  gap: "0.35rem",
};

const eyebrowStyle: CSSProperties = {
  fontSize: "0.85rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--text-medium)",
};

const titleStyle: CSSProperties = {
  fontSize: "clamp(1.15rem, 2vw, 1.55rem)",
  fontWeight: 700,
  lineHeight: 1.3,
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "clamp(0.85rem, 2vw, 1.25rem)",
};

const cardStyle: CSSProperties = {
  position: "relative",
  display: "grid",
  gap: "0.6rem",
  padding: "1rem",
  borderRadius: "var(--radius-md)",
  textDecoration: "none",
  border: "1px solid var(--border-subtle)",
  background: "var(--surface-2)",
  color: "var(--text-high)",
  boxShadow: "var(--shadow-soft)",
  transition: "border-color 150ms ease, transform 150ms ease, box-shadow 150ms ease",
};

const badgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35rem",
  padding: "0.35rem 0.65rem",
  borderRadius: "999px",
  fontSize: "0.85rem",
  letterSpacing: "0.03em",
  color: "var(--text-medium)",
  border: "1px solid var(--border-subtle)",
  background: "var(--surface-1)",
};

const cardTitle: CSSProperties = {
  fontSize: "1.05rem",
  fontWeight: 700,
};

const cardDescription: CSSProperties = {
  color: "var(--text-medium)",
  lineHeight: 1.55,
  fontSize: "0.97rem",
};

function deriveCards(section?: SectionRegistryEntry): RoutingCard[] {
  const definition = (section?.definition as Record<string, unknown> | undefined) ?? {};
  const rawItems = Array.isArray((definition as Record<string, unknown>).items)
    ? ((definition as Record<string, unknown>).items as Record<string, unknown>[])
    : [];

  const mappedCards = rawItems
    .map((item, index) => {
      if (!item || typeof item !== "object") return undefined;
      const href =
        (item.href as string | undefined)
        ?? (item.link as string | undefined)
        ?? (item.path as string | undefined);
      if (!href) return undefined;

      const title =
        (item.title as string | undefined)
        ?? (item.label as string | undefined)
        ?? (item.name as string | undefined)
        ?? `Pathway ${index + 1}`;
      const description =
        (item.description as string | undefined)
        ?? (item.copy as string | undefined)
        ?? (item.body as string | undefined);
      const tag = (item.tag as string | undefined) ?? (item.category as string | undefined);

      return { title, description, href, tag } satisfies RoutingCard;
    })
    .filter(Boolean) as RoutingCard[];

  if (mappedCards.length > 0) return mappedCards;

  return [
    {
      title: "Dental implants",
      description: "Restorations planned with CBCT guidance for confident healing.",
      href: "/treatments/implants",
    },
    {
      title: "Veneers",
      description: "Refinement for shape and shade with conservative preparation.",
      href: "/treatments/veneers",
    },
    {
      title: "Orthodontics",
      description: "Aligner and brace options with mapped movement and reviews.",
      href: "/treatments/orthodontics",
    },
  ];
}

export function Section_TreatmentRoutingCards({ section }: { section?: SectionRegistryEntry } = {}) {
  const cards = deriveCards(section);
  const eyebrow = section?.eyebrow ?? (section?.definition as { label?: string })?.label ?? "Care pathways";
  const title =
    section?.title
    ?? (section?.definition as { title?: string })?.title
    ?? "Choose the pathway that fits";

  return (
    <section style={containerStyle}>
      <style>{`
        .champagne-routing-card {
          color: var(--text-high);
        }

        .champagne-routing-card:visited {
          color: var(--text-high);
        }

        .champagne-routing-card:hover {
          box-shadow: var(--shadow-soft), 0 0 0 1px var(--border-subtle);
          color: var(--text-high);
        }

        .champagne-routing-card:active {
          box-shadow: var(--shadow-soft), 0 0 0 1px var(--border-subtle);
          color: var(--text-high);
        }

        .champagne-routing-card:focus-visible {
          outline: 2px solid var(--border-subtle);
          outline-offset: 2px;
          box-shadow: var(--shadow-soft);
        }
      `}</style>
      <div style={headerStyle}>
        {eyebrow && <span style={eyebrowStyle}>{eyebrow}</span>}
        <h3 style={titleStyle}>{title}</h3>
      </div>
      <div style={gridStyle}>
        {cards.map((card) => (
          <a
            key={`${card.title}-${card.href}`}
            href={card.href}
            style={cardStyle}
            aria-label={`${card.title} pathway`}
            className="champagne-routing-card"
          >
            {card.tag && <span style={badgeStyle}>{card.tag}</span>}
            <div style={cardTitle}>{card.title}</div>
            {card.description && <p style={cardDescription}>{card.description}</p>}
            <span
              style={{
                fontSize: "0.92rem",
                color: "var(--text-medium)",
                letterSpacing: "0.04em",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              Continue
              <span aria-hidden role="presentation">
                →
              </span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

export default Section_TreatmentRoutingCards;
