import styles from "./page.module.css";

const ASSISTANT_MESSAGES = [
  {
    id: "welcome",
    text: `Good afternoon — welcome to Champagne Concierge.\n\nI can guide you through treatment pathways with calm, practical next steps.\n\n- Explain options in plain language\n- Outline what a first visit usually includes\n- Keep recommendations aligned with your page context\n\nSource hint: Preview copy only.`,
  },
  {
    id: "context",
    text: `If you're exploring implants, we can begin with suitability signals and imaging flow.\n\nA concise path is usually consult, scan, then a phased treatment plan.`,
  },
];

const FOLLOW_UP_OPTIONS = [
  "Compare implant options",
  "What happens at consult?",
  "Recovery timeline",
  "Costs & planning",
];

type MessageBlock =
  | { type: "paragraph"; text: string; emphasized?: boolean }
  | { type: "bullet"; text: string }
  | { type: "sourceHint"; text: string };

function toMessageBlocks(text: string): MessageBlock[] {
  const lines = text.split("\n");
  const blocks: MessageBlock[] = [];
  let firstParagraphApplied = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith("Source hint:")) {
      blocks.push({ type: "sourceHint", text: line });
      continue;
    }

    if (line.startsWith("- ")) {
      blocks.push({ type: "bullet", text: line.slice(2).trim() });
      continue;
    }

    blocks.push({ type: "paragraph", text: line, emphasized: !firstParagraphApplied });
    firstParagraphApplied = true;
  }

  return blocks;
}

export default function ChatPreviewPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "clamp(1.25rem, 3.5vw, 2.5rem)",
        background: "var(--bg-ink)",
        color: "var(--text-high)",
        display: "grid",
      }}
    >
      <section
        style={{
          width: "min(100%, 48rem)",
          margin: "0 auto",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--champagne-keyline-gold)",
          background: "var(--surface-ink-soft)",
          boxShadow: "var(--shadow-soft)",
          padding: "clamp(1rem, 2.2vw, 1.5rem)",
          display: "grid",
          gap: "1rem",
        }}
      >
        <header style={{ display: "grid", gap: "0.25rem" }}>
          <p style={{ margin: 0, color: "var(--text-medium)", letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.82rem" }}>
            Internal Preview
          </p>
          <h1 style={{ margin: 0, fontSize: "clamp(1.25rem, 2.1vw, 1.8rem)" }}>Champagne Concierge</h1>
        </header>

        <div style={{ display: "grid", gap: "0.8rem" }}>
          {ASSISTANT_MESSAGES.map((message) => {
            const blocks = toMessageBlocks(message.text);
            return (
              <article
                key={message.id}
                style={{
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--champagne-keyline-gold)",
                  background: "var(--surface-glass)",
                  padding: "0.9rem 1rem",
                }}
              >
                <p
                  style={{
                    margin: "0 0 0.4rem",
                    fontSize: "0.78rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: "var(--text-medium)",
                  }}
                >
                  Concierge
                </p>

                <div style={{ display: "grid", gap: "0.45rem" }}>
                  {blocks.map((block, index) => {
                    if (block.type === "bullet") {
                      return (
                        <p key={`${message.id}-bullet-${index}`} style={{ margin: 0, paddingLeft: "1rem", color: "var(--text-high)", lineHeight: 1.5 }}>
                          • {block.text}
                        </p>
                      );
                    }

                    if (block.type === "sourceHint") {
                      return (
                        <p key={`${message.id}-source-${index}`} style={{ margin: "0.2rem 0 0", color: "var(--text-medium)", fontSize: "0.84rem", lineHeight: 1.45 }}>
                          {block.text}
                        </p>
                      );
                    }

                    return (
                      <p
                        key={`${message.id}-paragraph-${index}`}
                        style={{
                          margin: 0,
                          color: "var(--text-high)",
                          lineHeight: 1.55,
                          fontWeight: block.emphasized ? 600 : 400,
                        }}
                      >
                        {block.text}
                      </p>
                    );
                  })}
                </div>
              </article>
            );
          })}

          <article
            style={{
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--champagne-keyline-gold)",
              background: "var(--surface-glass)",
              padding: "0.85rem 1rem",
              display: "grid",
              gap: "0.75rem",
            }}
          >
            <p style={{ margin: 0, color: "var(--text-high)", fontWeight: 600 }}>Which direction would you like to explore next?</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem" }}>
              {FOLLOW_UP_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  style={{
                    borderRadius: "999px",
                    border: "1px solid var(--champagne-keyline-gold)",
                    background: "var(--surface-ink)",
                    color: "var(--text-high)",
                    padding: "0.45rem 0.75rem",
                    font: "inherit",
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </article>

          <article aria-label="Concierge typing" className={styles.typingRow}>
            <span className={styles.typingDot} />
            <span className={styles.typingDot} />
            <span className={styles.typingDot} />
          </article>
        </div>
      </section>
    </main>
  );
}
