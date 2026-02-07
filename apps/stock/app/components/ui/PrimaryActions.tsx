import type { ReactNode } from "react";
import Link from "next/link";

type PrimaryActionsProps = {
  children: ReactNode;
};

type ActionLinkProps = {
  href: string;
  children: ReactNode;
};

const actionContainerStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "12px"
} as const;

const actionStyle = {
  display: "inline-block",
  padding: "12px 18px",
  borderRadius: "10px",
  border: "1px solid currentColor",
  textDecoration: "none",
  fontWeight: 600
} as const;

export function PrimaryActions({ children }: PrimaryActionsProps) {
  return <div style={actionContainerStyle}>{children}</div>;
}

export function ActionLink({ href, children }: ActionLinkProps) {
  return (
    <Link href={href} style={actionStyle}>
      {children}
    </Link>
  );
}
