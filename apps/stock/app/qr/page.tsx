import PageShell from "../components/ui/PageShell";
import { ActionLink, PrimaryActions } from "../components/ui/PrimaryActions";
import { ScreenHeader, Section } from "../components/ui/ScreenKit";

type QrPageProps = {
  searchParams?: Promise<{ code?: string }>;
};

export default async function QrPage({ searchParams }: QrPageProps) {
  const resolvedParams = await searchParams;
  const code = resolvedParams?.code?.trim() ?? "";

  return (
    <PageShell header={<ScreenHeader title="Create QR" subtitle="Scan setup" />}>
      <Section title="Next steps">
        <p className="stock-status">
          Create a QR code for a product or location using the ops tools, then
          print and apply it to the shelf or container.
        </p>
        {code ? (
          <p className="stock-status">
            Scanned code: <strong>{code}</strong>
          </p>
        ) : null}
      </Section>
      <PrimaryActions>
        <ActionLink href="/scan">Back to scan</ActionLink>
        <ActionLink href="/locations">Locations</ActionLink>
        <ActionLink href="/products">Products</ActionLink>
      </PrimaryActions>
    </PageShell>
  );
}
