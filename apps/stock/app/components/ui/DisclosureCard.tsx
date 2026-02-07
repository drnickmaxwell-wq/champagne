import type { ReactNode } from "react";

type DisclosureCardProps = {
  summary: string;
  children: ReactNode;
};

export default function DisclosureCard({
  summary,
  children
}: DisclosureCardProps) {
  return (
    <details className="stock-disclosure-card">
      <summary className="stock-disclosure-summary">{summary}</summary>
      <div className="stock-disclosure-body">{children}</div>
    </details>
  );
}
