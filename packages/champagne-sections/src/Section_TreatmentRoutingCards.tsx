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
  border: "1px solid var(--champagne-keyline-gold, rgba(255, 215, 137, 0.22))",
  background:
    "linear-gradient(140deg, color-mix(in srgb, var(--bg-ink, #06070c) 90%, transparent), color-mix(in srgb, var(--bg-ink-soft, #0c0f16) 76%, transparent)), radial-gradient(circle at 16% 14%, color-mix(in srgb, var(--smh-white, #ffffff) 12%, transparent), transparent 36%)",
  boxShadow: "var(--shadow-soft, 0 10px 36px rgba(0,0,0,0.34))",
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
  color: "var(--text-medium, rgba(235,235,235,0.8))",
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
  border: "1px solid rgba(255,255,255,0.12)",
  background:
    "linear-gradient(145deg, color-mix(in srgb, var(--surface-glass, rgba(255,255,255,0.04)) 85%, transparent), color-mix(in srgb, var(--surface-glass, rgba(255,255,255,0.04)) 45%, transparent))",
  color: "var(--text-high)",
  boxShadow: "0 18px 40px rgba(0,0,0,0.28)",
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
  color: "var(--text-medium, rgba(235,235,235,0.78))",
  border: "1px solid color-mix(in srgb, var(--champagne-keyline-gold, #ffd789) 55%, transparent)",
  background:
    "linear-gradient(120deg, color-mix(in srgb, var(--champagne-keyline-gold, #ffd789) 14%, transparent), color-mix(in srgb, var(--bg-ink-soft, #0c0f16) 75%, transparent))",
};

const cardTitle: CSSProperties = {
  fontSize: "1.05rem",
  fontWeight: 700,
};

const cardDescription: CSSProperties = {
  color: "var(--text-medium, rgba(230,230,230,0.82))",
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
          >
            {card.tag && <span style={badgeStyle}>{card.tag}</span>}
            <div style={cardTitle}>{card.title}</div>
            {card.description && <p style={cardDescription}>{card.description}</p>}
            <span
              style={{
                fontSize: "0.92rem",
                color: "var(--text-medium, rgba(230,230,230,0.82))",
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
