import Link from "next/link";
import PageShell from "../components/ui/PageShell";
import Card from "../components/ui/Card";
import { ScreenHeader, Section } from "../components/ui/ScreenKit";
import { PrimaryActions } from "../components/ui/PrimaryActions";

export default function HelpPage() {
  return (
    <PageShell
      header={
        <ScreenHeader
          eyebrow="Stock"
          title="Help"
          subtitle="Quick guide for the stock workflow."
        />
      }
    >
      <Section title="Step-by-step guide">
        <div className="stock-grid">
          <Card title="1. First-time setup">
            Go to <strong>Setup</strong>, then complete your baseline counts,
            suppliers, locations, and products.
          </Card>
          <Card title="2. Everyday scanning">
            Use <strong>Scan</strong> to receive or withdraw stock. Add expiry
            dates when asked.
          </Card>
          <Card title="3. Create an order suggestion">
            In <strong>Setup → Baseline</strong>, open a location and create an
            order suggestion from baseline differences.
          </Card>
          <Card title="4. Supplier view, copy, or print">
            Review the supplier view, then copy, print, or download the order
            pack to place the order.
          </Card>
          <Card title="5. Expiry checks">
            Open <strong>Expiry</strong> to see items expiring soon and take
            action.
          </Card>
        </div>
      </Section>
      <PrimaryActions>
        <Link href="/" className="stock-action-link">
          Back to home
        </Link>
        <Link href="/setup" className="stock-action-link stock-action-link--secondary">
          Go to setup
        </Link>
      </PrimaryActions>
    </PageShell>
  );
}
