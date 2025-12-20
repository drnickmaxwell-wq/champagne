import type { CSSProperties } from "react";
import "@champagne/tokens";
import type { SectionRegistryEntry } from "./SectionRegistry";

const containerStyle: CSSProperties = {
  position: "relative",
  borderRadius: "var(--radius-lg)",
  border: "1px solid var(--champagne-keyline-gold, rgba(255, 215, 137, 0.28))",
  padding: "clamp(1.5rem, 3vw, 2.5rem)",
  background:
    "linear-gradient(180deg, color-mix(in srgb, var(--bg-ink, #06070c) 86%, transparent), color-mix(in srgb, var(--bg-ink-soft, #0c0f16) 82%, transparent)), radial-gradient(circle at 18% 12%, color-mix(in srgb, var(--smh-white, #ffffff) 14%, transparent), transparent 38%)",
  boxShadow: "var(--shadow-soft, 0 10px 36px rgba(0,0,0,0.35))",
  overflow: "hidden",
};

const accentBar: CSSProperties = {
  position: "absolute",
  inset: "0 0 auto 0",
  height: "3px",
  background:
    "linear-gradient(90deg, color-mix(in srgb, var(--champagne-keyline-gold, #ffd789) 40%, transparent), color-mix(in srgb, var(--champagne-keyline-gold, #ffd789) 8%, transparent))",
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
  color: "var(--text-medium, rgba(255,255,255,0.72))",
};

const titleStyle: CSSProperties = {
  fontSize: "clamp(1.35rem, 2vw, 1.8rem)",
  fontWeight: 700,
  lineHeight: 1.3,
};

const straplineStyle: CSSProperties = {
  fontSize: "1rem",
  color: "var(--text-medium, rgba(255,255,255,0.78))",
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
  border: "1px solid var(--champagne-keyline-gold, rgba(255, 215, 137, 0.35))",
  background: "color-mix(in srgb, var(--bg-ink, #06070c) 70%, transparent)",
  fontWeight: 700,
};

const reviewsGrid: CSSProperties = {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  marginTop: "1.5rem",
};

const cardStyle: CSSProperties = {
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--champagne-keyline-gold, rgba(255, 215, 137, 0.25))",
  padding: "1rem",
  background: "linear-gradient(180deg, color-mix(in srgb, var(--bg-ink, #06070c) 82%, transparent), color-mix(in srgb, var(--bg-ink-soft, #0c0f16) 76%, transparent))",
  display: "grid",
  gap: "0.5rem",
};

const quoteStyle: CSSProperties = {
  fontSize: "1rem",
  lineHeight: 1.55,
  color: "var(--text-medium, rgba(255,255,255,0.85))",
};

const nameStyle: CSSProperties = {
  fontSize: "0.95rem",
  color: "var(--text-strong, rgba(255,255,255,0.92))",
  fontWeight: 600,
};

const sourceStyle: CSSProperties = {
  fontSize: "0.85rem",
  color: "var(--text-medium, rgba(255,255,255,0.7))",
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
