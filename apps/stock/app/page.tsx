import Link from "next/link";
import PageShell from "./components/ui/PageShell";
import Card from "./components/ui/Card";
import { ScreenHeader, Section } from "./components/ui/ScreenKit";
import { PrimaryActions } from "./components/ui/PrimaryActions";

export default function HomePage() {
  return (
    <PageShell
      header={
        <ScreenHeader
          eyebrow="Stock"
          title="Home"
          subtitle="Pick the task you need right now."
        />
      }
    >
      <Section title="Daily actions">
        <div className="stock-dashboard-grid">
          <Card
            className="stock-card--action"
            title="Scan"
            footer={
              <PrimaryActions>
                <Link href="/scan" className="stock-action-link">
                  Start scanning
                </Link>
              </PrimaryActions>
            }
          >
            Receive, withdraw, or update stock levels by scanning barcodes.
          </Card>
          <Card
            className="stock-card--action"
            title="Orders"
            footer={
              <PrimaryActions>
                <Link href="/reorder" className="stock-action-link">
                  Open orders
                </Link>
              </PrimaryActions>
            }
          >
            Review order suggestions and send to suppliers.
          </Card>
          <Card
            className="stock-card--action"
            title="Expiry"
            footer={
              <PrimaryActions>
                <Link href="/expiry" className="stock-action-link">
                  Check expiry
                </Link>
              </PrimaryActions>
            }
          >
            See what is expiring soon and take action.
          </Card>
          <Card
            className="stock-card--action"
            title="Help"
            footer={
              <PrimaryActions>
                <Link href="/help" className="stock-action-link">
                  View guide
                </Link>
              </PrimaryActions>
            }
          >
            Step-by-step guide for setup, scanning, and ordering.
          </Card>
        </div>
      </Section>
      <Section title="Setup">
        <Card
          title="Clinic setup"
          footer={
            <PrimaryActions>
              <Link href="/setup" className="stock-action-link stock-action-link--secondary">
                Go to setup
              </Link>
            </PrimaryActions>
          }
        >
          Baseline counts, suppliers, locations, and product lists live here.
        </Card>
      </Section>
    </PageShell>
  );
}
