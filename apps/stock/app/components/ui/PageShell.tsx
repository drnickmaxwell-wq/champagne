import type { ReactNode } from "react";
import { ScreenHeader } from "./ScreenKit";

type PageShellProps = {
  title?: string;
  eyebrow?: string;
  subtitle?: string;
  status?: ReactNode;
  actions?: ReactNode;
  header?: ReactNode;
  children: ReactNode;
};

export default function PageShell({
  title,
  eyebrow,
  subtitle,
  status,
  actions,
  header,
  children
}: PageShellProps) {
  return (
    <section className="stock-page-shell stock-shell">
      {header ?? (
        <ScreenHeader
          title={title ?? ""}
          eyebrow={eyebrow}
          subtitle={subtitle}
          status={status}
          actions={actions}
        />
      )}
      <div className="stock-page-shell__content">{children}</div>
    </section>
  );
}
