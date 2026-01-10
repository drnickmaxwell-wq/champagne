import type { CSSProperties } from "react";
import "@champagne/tokens";
import type { SectionRegistryEntry } from "./SectionRegistry";

const containerStyle: CSSProperties = {
  position: "relative",
  borderRadius: "var(--radius-lg)",
  border: "1px solid var(--border-subtle)",
  padding: "clamp(1.5rem, 3vw, 2.5rem)",
  background: "var(--surface-1)",
  boxShadow: "var(--shadow-soft)",
  overflow: "hidden",
  color: "var(--text-high)",
};

const accentBar: CSSProperties = {
  position: "absolute",
  inset: "0 0 auto 0",
  height: "3px",
  background: "var(--border-subtle)",
};

const headerGrid: CSSProperties = {
  display: "grid",
  gap: "0.4rem",
  maxWidth: "720px",
};

const eyebrowStyle: CSSProperties = {
  fontSize: "0.9rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--text-medium)",
};

const titleStyle: CSSProperties = {
  fontSize: "clamp(1.35rem, 2vw, 1.8rem)",
  fontWeight: 700,
  lineHeight: 1.3,
};

const straplineStyle: CSSProperties = {
  fontSize: "1rem",
  color: "var(--text-medium)",
  lineHeight: 1.6,
};

const statsRow: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  flexWrap: "wrap",
  marginTop: "0.5rem",
};

const ratingBadge: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0.55rem 0.9rem",
  borderRadius: "999px",
  border: "1px solid var(--border-subtle)",
  background: "var(--surface-2)",
  color: "var(--text-high)",
  fontWeight: 700,
  boxShadow: "var(--shadow-soft)",
};

const reviewsGrid: CSSProperties = {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  marginTop: "1.5rem",
};

const cardStyle: CSSProperties = {
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--border-subtle)",
  padding: "1rem",
  background: "var(--surface-2)",
  display: "grid",
  gap: "0.5rem",
  boxShadow: "var(--shadow-soft)",
};

const quoteStyle: CSSProperties = {
  fontSize: "1rem",
  lineHeight: 1.55,
  color: "var(--text-medium)",
};

const nameStyle: CSSProperties = {
  fontSize: "0.95rem",
  color: "var(--text-high)",
  fontWeight: 600,
};

const sourceStyle: CSSProperties = {
  fontSize: "0.85rem",
  color: "var(--text-medium)",
};

export function Section_GoogleReviews({ section }: { section?: SectionRegistryEntry }) {
  const definition = (section?.definition as Record<string, unknown> | undefined) ?? {};
  const title = section?.title ?? (definition.title as string | undefined) ?? "Google reviews from Champagne patients";
  const eyebrow =
    section?.eyebrow ?? (definition.label as string | undefined) ?? (definition.eyebrow as string | undefined) ?? "Google Reviews";
  const strapline =
    section?.strapline ?? (definition.strapline as string | undefined) ?? "4.9-star feedback from patients who valued calm care.";
  const rating = section?.rating ?? (definition.rating as number | undefined) ?? 4.9;
  const reviewCount =
    section?.reviewCount ?? (definition.reviewCount as string | undefined) ?? "120+ reviews from Shoreham-by-Sea";
  const reviews =
    section?.reviews
      ?? (definition.reviews as SectionRegistryEntry["reviews"] | undefined)
      ?? [
        { quote: "Gentle, reassuring, and clear about every step.", name: "Google reviewer" },
        { quote: "Calm atmosphere with kind clinicians.", name: "Google reviewer" },
        { quote: "Explained options and pacing so I felt in control.", name: "Google reviewer" },
      ];

  return (
    <section style={containerStyle}>
      <div aria-hidden style={accentBar} />
      <div style={{ display: "grid", gap: "1rem" }}>
        <div style={headerGrid}>
          {eyebrow && <span style={eyebrowStyle}>{eyebrow}</span>}
          <h2 style={titleStyle}>{title}</h2>
          {strapline && <p style={straplineStyle}>{strapline}</p>}
          <div style={statsRow}>
            <span style={ratingBadge}>
              <span aria-hidden>★</span>
              <span>
                {rating.toFixed(1)} rating
                {reviewCount ? ` · ${reviewCount}` : ""}
              </span>
            </span>
          </div>
        </div>
        <div style={reviewsGrid}>
          {reviews?.map((review, index) => (
            <article key={review.name ?? review.quote ?? index} style={cardStyle}>
              <p style={quoteStyle}>{review.quote}</p>
              <div>
                {review.name && <div style={nameStyle}>{review.name}</div>}
                {(review.source || review.rating) && (
                  <div style={sourceStyle}>
                    {review.rating ? `${review.rating.toFixed(1)} ★` : ""}
                    {review.rating && review.source ? " · " : ""}
                    {review.source}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
