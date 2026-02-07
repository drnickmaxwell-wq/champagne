import type { ReactNode } from "react";

type FieldListProps = {
  children: ReactNode;
};

type FieldRowProps = {
  label: string;
  value: ReactNode;
};

export function FieldList({ children }: FieldListProps) {
  return (
    <dl style={{ margin: 0, display: "grid", gap: "8px" }}>{children}</dl>
  );
}

export function FieldRow({ label, value }: FieldRowProps) {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <dt style={{ minWidth: "140px", fontWeight: 600 }}>{label}</dt>
      <dd style={{ margin: 0 }}>{value}</dd>
    </div>
  );
}
