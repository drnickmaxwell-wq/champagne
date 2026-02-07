import type { ReactNode } from "react";

type LoadingLineProps = {
  label?: ReactNode;
};

export default function LoadingLine({ label = "Working..." }: LoadingLineProps) {
  return (
    <div className="stock-loading-line" role="status">
      <span className="stock-inline-spinner" aria-hidden="true" />
      <span className="stock-loading-line__label">{label}</span>
    </div>
  );
}
