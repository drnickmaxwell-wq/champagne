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
    <dl className="stock-field-list stock-fieldlist">{children}</dl>
  );
}

export function FieldRow({ label, value }: FieldRowProps) {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  return (
    <div className="stock-field-row">
      <dt className="stock-field-label">{label}</dt>
      <dd className="stock-field-value">{value}</dd>
    </div>
  );
}
