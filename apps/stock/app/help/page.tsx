"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageShell from "../components/ui/PageShell";
import Card from "../components/ui/Card";
import RoleModeSwitch from "../components/ui/RoleModeSwitch";
import { ScreenHeader, Section } from "../components/ui/ScreenKit";
import { PrimaryActions } from "../components/ui/PrimaryActions";
import { loadRoleMode, type StockRoleMode } from "../lib/localStores/roleMode";

export default function HelpPage() {
  const [role, setRole] = useState<StockRoleMode>("nurse");

  useEffect(() => {
    setRole(loadRoleMode());
  }, []);

  return (
    <PageShell
      header={
        <ScreenHeader
          eyebrow="Stock"
          title="Help"
          subtitle="How we use this at SMH."
          actions={<RoleModeSwitch />}
        />
      }
    >
      <Section title="Daily steps">
        <div className="stock-grid">
          <Card title="1) Start your shift">
            Open <strong>Scan</strong> and choose your location before scanning.
          </Card>
          <Card title="2) Scan items">
            Scan each product. Pick receive or withdraw and confirm quantity.
          </Card>
          <Card title="3) Check expiry">
            Open <strong>Expiry</strong> to review items due soon in your location.
          </Card>
          <Card title="4) Place orders">
            Open <strong>Orders</strong> to see what needs reordering.
          </Card>
          <Card title="5) Print location pack">
            Use <strong>Setup pack</strong> when you need fresh QR labels.
          </Card>
        </div>
      </Section>

      <Section title="Quick links">
        <PrimaryActions>
          <Link href="/scan" className="stock-action-link">Scan</Link>
          <Link href="/locations" className="stock-action-link">Locations</Link>
          <Link href="/expiry" className="stock-action-link">Expiry</Link>
          <Link href="/reorder" className="stock-action-link">Orders</Link>
          <Link href="/setup/locations-pack" className="stock-action-link">Setup pack</Link>
        </PrimaryActions>
      </Section>

      {role === "admin" ? (
        <Section title="Setup (Admin)">
          <PrimaryActions>
            <Link href="/setup" className="stock-action-link stock-action-link--secondary">
              Open setup
            </Link>
            <Link href="/baseline" className="stock-action-link stock-action-link--secondary">
              Baseline
            </Link>
          </PrimaryActions>
        </Section>
      ) : null}

      <PrimaryActions>
        <Link href="/home" className="stock-action-link stock-action-link--secondary">
          Back to home
        </Link>
      </PrimaryActions>
    </PageShell>
  );
}
