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
    <div role={role}>
      <strong>{title}</strong>
      <div>{children}</div>
    </div>
  );
}
