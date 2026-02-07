import type { ReactNode } from "react";

type DisclosureCardProps = {
  summary: string;
  children: ReactNode;
};

const cardStyle = {
  border: "1px solid currentColor",
  borderRadius: "12px",
  padding: "16px"
} as const;

export default function DisclosureCard({
  summary,
  children
}: DisclosureCardProps) {
  return (
    <details style={cardStyle}>
      <summary style={{ cursor: "pointer" }}>{summary}</summary>
      <div style={{ marginTop: "12px" }}>{children}</div>
    </details>
  );
}
