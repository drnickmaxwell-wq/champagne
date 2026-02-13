"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageShell from "../components/ui/PageShell";
import Card from "../components/ui/Card";
import RoleModeSwitch from "../components/ui/RoleModeSwitch";
import TenantBanner from "../components/ui/TenantBanner";
import { ScreenHeader, Section } from "../components/ui/ScreenKit";
import { PrimaryActions } from "../components/ui/PrimaryActions";
import { loadRoleMode, type StockRoleMode } from "../lib/localStores/roleMode";

export default function HomeDashboardPage() {
  const [role, setRole] = useState<StockRoleMode>("nurse");

  useEffect(() => {
    const nextRole = loadRoleMode();
    setRole(nextRole);
    const onStorage = () => setRole(loadRoleMode());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <PageShell
      header={
        <ScreenHeader
          eyebrow="Stock"
          title="Home"
          subtitle="Pick the task you need right now."
          actions={<RoleModeSwitch />}
        />
      }
    >
      <TenantBanner />
      <Section title="Daily actions">
        <div className="stock-dashboard-grid">
          <Card
            className="stock-card--action"
            title="Scan"
            footer={
              <PrimaryActions>
                <Link href="/scan" className="stock-action-link">
                  Scan stock
                </Link>
              </PrimaryActions>
            }
          >
            Scan items in or out during the day.
          </Card>
          <Card
            className="stock-card--action"
            title="Orders"
            footer={
              <PrimaryActions>
                <Link href="/reorder" className="stock-action-link">
                  Orders
                </Link>
              </PrimaryActions>
            }
          >
            Review and prepare supplier orders.
          </Card>
          <Card
            className="stock-card--action"
            title="Expiry"
            footer={
              <PrimaryActions>
                <Link href="/expiry" className="stock-action-link">
                  Expiry
                </Link>
              </PrimaryActions>
            }
          >
            Check what needs using soon.
          </Card>
          <Card
            className="stock-card--action"
            title="Help"
            footer={
              <PrimaryActions>
                <Link href="/help" className="stock-action-link">
                  Help
                </Link>
              </PrimaryActions>
            }
          >
            Step-by-step guide for the team.
          </Card>
        </div>
      </Section>

      {role === "admin" ? (
        <Section title="Admin tools">
          <div className="stock-dashboard-grid">
            <Card
              title="Setup"
              footer={
                <PrimaryActions>
                  <Link href="/setup" className="stock-action-link stock-action-link--secondary">
                    Open setup
                  </Link>
                </PrimaryActions>
              }
            >
              Locations, baseline and suppliers.
            </Card>
            <Card
              title="Print QR setup pack"
              footer={
                <PrimaryActions>
                  <Link
                    href="/setup/locations-pack"
                    className="stock-action-link stock-action-link--secondary"
                  >
                    Open print pack
                  </Link>
                </PrimaryActions>
              }
            >
              Print all location labels in one pack.
            </Card>
          </div>
        </Section>
      ) : null}
    </PageShell>
  );
}
