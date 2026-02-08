import type { ReactNode } from "react";
import PageShell from "./ui/PageShell";
import { ScreenHeader } from "./ui/ScreenKit";

type StockPageTemplateProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  header?: ReactNode;
};

export default function StockPageTemplate({
  children,
  title,
  description,
  header
}: StockPageTemplateProps) {
  const resolvedHeader =
    header ?? (title ? <ScreenHeader title={title} subtitle={description} /> : undefined);

  return <PageShell header={resolvedHeader}>{children}</PageShell>;
}
