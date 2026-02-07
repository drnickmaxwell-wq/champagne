import type { ReactNode } from "react";

type CardProps = {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export default function Card({ title, children, footer, className }: CardProps) {
  const cardClassName = className
    ? `stock-card ${className}`
    : "stock-card";
  return (
    <div className={cardClassName}>
      {title ? <h2 className="stock-card__title">{title}</h2> : null}
      <div className="stock-card__body">{children}</div>
      {footer ? <div className="stock-card__footer">{footer}</div> : null}
    </div>
  );
}
