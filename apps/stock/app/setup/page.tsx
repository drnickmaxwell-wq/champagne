import Link from "next/link";
import PageShell from "../components/ui/PageShell";
import Card from "../components/ui/Card";
import { ScreenHeader, Section } from "../components/ui/ScreenKit";
import { PrimaryActions } from "../components/ui/PrimaryActions";

export default function SetupPage() {
  return (
    <PageShell
      header={
        <ScreenHeader
          eyebrow="Stock"
          title="Setup"
          subtitle="One-off setup tasks and admin screens."
        />
      }
    >
      <Section title="Setup tasks">
        <div className="stock-grid">
          <Card
            title="Baseline"
            footer={
              <PrimaryActions>
                <Link href="/baseline" className="stock-action-link">
                  Open baseline
                </Link>
              </PrimaryActions>
            }
          >
            Set your starting counts for each location.
          </Card>
          <Card
            title="Suppliers"
            footer={
              <PrimaryActions>
                <Link href="/suppliers" className="stock-action-link">
                  Open suppliers
                </Link>
              </PrimaryActions>
            }
          >
            Add supplier contacts and ordering details.
          </Card>
          <Card
            title="Locations"
            footer={
              <PrimaryActions>
                <Link href="/locations" className="stock-action-link">
                  Manage locations
                </Link>
              </PrimaryActions>
            }
          >
            Set the rooms or storage areas you scan into.
          </Card>
          <Card
            title="Products"
            footer={
              <PrimaryActions>
                <Link href="/products" className="stock-action-link">
                  Manage products
                </Link>
              </PrimaryActions>
            }
          >
            Add or update product details and minimum levels.
          </Card>
        </div>
      </Section>
      <PrimaryActions>
        <Link href="/" className="stock-action-link stock-action-link--secondary">
          Back to home
        </Link>
      </PrimaryActions>
    </PageShell>
  );
}
