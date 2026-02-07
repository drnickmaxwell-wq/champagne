import type { ComponentProps, ReactNode } from "react";
import EventActionPanel from "../EventActionPanel";
import Card from "./Card";
import DisclosureCard from "./DisclosureCard";
import { FieldList } from "./FieldList";

export type ScreenHeaderProps = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  status?: ReactNode;
  actions?: ReactNode;
};

export function ScreenHeader({
  title,
  eyebrow,
  subtitle,
  status,
  actions
}: ScreenHeaderProps) {
  return (
    <header className="stock-page-shell__header">
      {eyebrow ? <p className="stock-page-shell__eyebrow">{eyebrow}</p> : null}
      <h1 className="stock-page-shell__title">{title}</h1>
      {subtitle ? <p className="stock-page-shell__subtitle">{subtitle}</p> : null}
      {status ? (
        <div className="stock-page-shell__status stock-status">{status}</div>
      ) : null}
      {actions ? (
        <div className="stock-page-shell__actions stock-actions">{actions}</div>
      ) : null}
    </header>
  );
}

type SectionProps = {
  title?: string;
  footer?: ReactNode;
  children: ReactNode;
};

export function Section({ title, footer, children }: SectionProps) {
  return (
    <Card title={title} footer={footer}>
      {children}
    </Card>
  );
}

type KeyValueGridProps = {
  children: ReactNode;
};

export function KeyValueGrid({ children }: KeyValueGridProps) {
  return <FieldList>{children}</FieldList>;
}

type ActionSectionProps = ComponentProps<typeof EventActionPanel>;

export function ActionSection(props: ActionSectionProps) {
  return (
    <Card>
      <EventActionPanel {...props} />
    </Card>
  );
}

type DebugDisclosureProps = {
  summary: string;
  children: ReactNode;
};

export function DebugDisclosure({ summary, children }: DebugDisclosureProps) {
  return <DisclosureCard summary={summary}>{children}</DisclosureCard>;
}
