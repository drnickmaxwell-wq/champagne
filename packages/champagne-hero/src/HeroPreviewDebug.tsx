import type { HeroRegistryEntry } from "./HeroRegistry";

interface HeroPreviewDebugProps {
  hero: HeroRegistryEntry;
}

export function HeroPreviewDebug({ hero }: HeroPreviewDebugProps) {
  return (
    <div
      style={{
        marginTop: "1rem",
        padding: "0.75rem 1rem",
        borderRadius: "var(--radius-md)",
        background: "var(--surface-ink-soft)",
        border: "1px solid var(--champagne-keyline-gold)",
        color: "var(--text-high)",
        fontSize: "0.875rem",
      }}
    >
      <div style={{ fontWeight: 600 }}>Hero Debug</div>
      <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "0.25rem 0.75rem", marginTop: "0.35rem" }}>
        <dt style={{ opacity: 0.7 }}>ID</dt>
        <dd>{hero.id}</dd>
        {hero.sourcePagePath && (
          <>
            <dt style={{ opacity: 0.7 }}>Page</dt>
            <dd>{hero.sourcePagePath}</dd>
          </>
        )}
        {hero.category && (
          <>
            <dt style={{ opacity: 0.7 }}>Category</dt>
            <dd>{hero.category}</dd>
          </>
        )}
      </dl>
    </div>
  );
}
