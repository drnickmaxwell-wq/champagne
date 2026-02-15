import styles from "./concierge.module.css";

type ConciergeMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ConciergeShellProps = {
  open: boolean;
  pending: boolean;
  messages: ConciergeMessage[];
  input: string;
  error: string | null;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
};

export function ConciergeShell({
  open,
  pending,
  messages,
  input,
  error,
  onInputChange,
  onSubmit,
  onClose,
}: ConciergeShellProps) {
  return (
    <aside className={styles.panel} data-open={open} aria-hidden={!open}>
      <div className={styles.panelHeader}>
        <p className={styles.panelTitle}>Champagne Concierge</p>
        <button type="button" className={styles.iconButton} onClick={onClose} aria-label="Close concierge">
          ×
        </button>
      </div>

      <div className={styles.messages}>
        {messages.length === 0 ? (
          <p className={styles.emptyState}>Ask about treatments, pricing, or availability.</p>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={styles.messageRow} data-role={message.role}>
              <p>{message.content}</p>
            </div>
          ))
        )}
      </div>

      <div className={styles.inputWrap}>
        <textarea
          className={styles.input}
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
          onInput={(event) => {
            const target = event.currentTarget;
            target.style.height = "auto";
            target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onSubmit();
            }
          }}
          placeholder="Type your question"
          rows={1}
          disabled={pending}
          aria-label="Concierge input"
        />
        <button
          type="button"
          className={styles.iconButton}
          onClick={onSubmit}
          disabled={pending || !input.trim()}
          aria-label="Send message"
        >
          ↗
        </button>
      </div>

      {pending ? <p className={styles.errorText}>Thinking…</p> : null}
      {error ? <p className={styles.errorText}>{error}</p> : null}
    </aside>
  );
}
