import type { ReactNode } from "react";

type PageShellProps = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  status?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
};

export default function PageShell({
  title,
  eyebrow,
  subtitle,
  status,
  actions,
  children
}: PageShellProps) {
  return (
    <section>
      <header style={{ marginBottom: "16px" }}>
        {eyebrow ? (
          <p style={{ margin: 0, fontSize: "14px", textTransform: "uppercase" }}>
            {eyebrow}
          </p>
        ) : null}
        <h1 style={{ margin: "4px 0" }}>{title}</h1>
        {subtitle ? <p style={{ margin: 0 }}>{subtitle}</p> : null}
        {status ? <div style={{ marginTop: "8px" }}>{status}</div> : null}
        {actions ? <div style={{ marginTop: "12px" }}>{actions}</div> : null}
      </header>
      <div style={{ display: "grid", gap: "16px" }}>{children}</div>
    </section>
  );
}
