import type { ReactNode } from "react";

type StatusItem = {
  label: string;
  value: ReactNode;
};

type StatusLineProps = {
  items: StatusItem[];
};

export default function StatusLine({ items }: StatusLineProps) {
  const visibleItems = items.filter((item) => item.value !== null);
  if (visibleItems.length === 0) {
    return null;
  }
  return (
    <div className="stock-status-line">
      {visibleItems.map((item) => (
        <span key={item.label}>
          {item.label}: {item.value}
        </span>
      ))}
    </div>
  );
}
