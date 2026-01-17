import type { HeroOverlayContentConfig, HeroOverlayLayoutConfig, HeroOverlaySource } from "./heroOverlay";

export function HeroOverlayContent({
  content,
  layout,
  source,
  debugEnabled = false,
  debugPayload,
}: {
  content: HeroOverlayContentConfig;
  layout: HeroOverlayLayoutConfig;
  source?: HeroOverlaySource;
  debugEnabled?: boolean;
  debugPayload?: Record<string, unknown>;
}) {
  if (!content.headline && !content.subheadline && !content.cta && !content.secondaryCta && !content.eyebrow) {
    return null;
  }

  const align = layout.contentAlign === "center" ? "center" : "start";
  const maxWidth = layout.maxWidth ? `${layout.maxWidth}px` : "960px";
  const padding = layout.padding ?? "clamp(2rem, 4vw, 3.5rem)";
  const verticalOffset = layout.verticalOffset ?? "0px";

  return (
    <div
      data-hero-overlay="true"
      data-hero-overlay-source={source}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 15,
        display: "grid",
        alignItems: align === "center" ? "center" : "stretch",
        pointerEvents: "auto",
      }}
    >
      {debugEnabled && source ? (
        <div
          style={{
            position: "absolute",
            top: "0.75rem",
            right: "0.75rem",
            fontSize: "0.7rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "0.35rem 0.55rem",
            borderRadius: "var(--radius-sm)",
            background: "var(--surface-ink-soft)",
            color: "var(--text-high)",
            border: "1px solid var(--champagne-keyline-gold)",
          }}
        >
          Hero overlay · {source}
        </div>
      ) : null}
      {debugEnabled && debugPayload ? (
        <pre
          style={{
            position: "absolute",
            bottom: "0.75rem",
            right: "0.75rem",
            maxWidth: "520px",
            maxHeight: "240px",
            overflow: "auto",
            padding: "0.75rem",
            fontSize: "0.7rem",
            lineHeight: 1.4,
            borderRadius: "var(--radius-sm)",
            background: "var(--surface-ink-soft)",
            color: "var(--text-high)",
            border: "1px solid var(--champagne-keyline-gold)",
            whiteSpace: "pre-wrap",
          }}
        >
          {JSON.stringify(debugPayload, null, 2)}
        </pre>
      ) : null}
      <div
        style={{
          justifyItems: align,
          textAlign: align,
          display: "grid",
          gap: "1rem",
          maxWidth,
          padding,
          transform: `translateY(${verticalOffset})`,
          pointerEvents: "auto",
        }}
      >
        {content.eyebrow && (
          <span style={{ letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-medium)" }}>
            {content.eyebrow}
          </span>
        )}
        {content.headline && (
          <h1 style={{ fontSize: "clamp(2.2rem, 3.2vw, 3rem)", lineHeight: 1.05 }}>
            {content.headline}
          </h1>
        )}
        {content.subheadline && (
          <p style={{ color: "var(--text-medium)", fontSize: "1.08rem", lineHeight: 1.6, maxWidth: "820px" }}>
            {content.subheadline}
          </p>
        )}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: align }}>
          {content.cta && (
            <a
              href={content.cta.href}
              style={{
                padding: "0.9rem 1.6rem",
                borderRadius: "var(--radius-md)",
                background: "var(--surface-gold-soft)",
                color: "var(--text-high)",
                border: "1px solid var(--champagne-keyline-gold)",
                textDecoration: "none",
                boxShadow: "var(--shadow-soft)",
              }}
            >
              {content.cta.label}
            </a>
          )}
          {content.secondaryCta && (
            <a
              href={content.secondaryCta.href}
              style={{
                padding: "0.9rem 1.2rem",
                borderRadius: "var(--radius-md)",
                background: "var(--surface-ink-soft)",
                color: "var(--text-high)",
                border: "1px solid var(--champagne-keyline-gold)",
                textDecoration: "none",
              }}
            >
              {content.secondaryCta.label}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
