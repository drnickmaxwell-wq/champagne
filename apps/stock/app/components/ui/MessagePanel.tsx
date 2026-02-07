import type { ReactNode } from "react";

type MessagePanelProps = {
  title: string;
  children: ReactNode;
  role?: "status" | "alert";
};

export default function MessagePanel({
  title,
  children,
  role
}: MessagePanelProps) {
  return (
    <div role={role} className="stock-message-panel">
      <strong className="stock-message-panel__title">{title}</strong>
      <div className="stock-message-panel__body">{children}</div>
    </div>
  );
}
