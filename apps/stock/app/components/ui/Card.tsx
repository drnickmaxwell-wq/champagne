import type { ReactNode } from "react";

type CardProps = {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
};

const cardStyle = {
  border: "1px solid currentColor",
  borderRadius: "12px",
  padding: "16px"
} as const;

export default function Card({ title, children, footer }: CardProps) {
  return (
    <div style={cardStyle}>
      {title ? <h2 style={{ marginTop: 0 }}>{title}</h2> : null}
      {children}
      {footer ? <div style={{ marginTop: "12px" }}>{footer}</div> : null}
    </div>
  );
}
