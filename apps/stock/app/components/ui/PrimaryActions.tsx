import type { ReactNode } from "react";
import Link from "next/link";

type PrimaryActionsProps = {
  children: ReactNode;
};

type ActionLinkProps = {
  href: string;
  children: ReactNode;
};

export function PrimaryActions({ children }: PrimaryActionsProps) {
  return <div className="stock-primary-actions stock-actions">{children}</div>;
}

export function ActionLink({ href, children }: ActionLinkProps) {
  return (
    <Link href={href} className="stock-action-link stock-action-link--primary">
      {children}
    </Link>
  );
}
