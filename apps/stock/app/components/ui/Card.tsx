import type { ReactNode } from "react";

type CardProps = {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function Card({ title, children, footer }: CardProps) {
  return (
    <div className="stock-card">
      {title ? <h2 className="stock-card__title">{title}</h2> : null}
      <div className="stock-card__body">{children}</div>
      {footer ? <div className="stock-card__footer">{footer}</div> : null}
    </div>
  );
}
