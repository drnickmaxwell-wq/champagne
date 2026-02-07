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
    <section className="stock-page-shell">
      <header className="stock-page-shell__header">
        {eyebrow ? (
          <p className="stock-page-shell__eyebrow">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="stock-page-shell__title">{title}</h1>
        {subtitle ? (
          <p className="stock-page-shell__subtitle">{subtitle}</p>
        ) : null}
        {status ? (
          <div className="stock-page-shell__status">{status}</div>
        ) : null}
        {actions ? (
          <div className="stock-page-shell__actions">{actions}</div>
        ) : null}
      </header>
      <div className="stock-page-shell__content">{children}</div>
    </section>
  );
}
