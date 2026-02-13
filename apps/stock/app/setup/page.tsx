"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageShell from "../components/ui/PageShell";
import Card from "../components/ui/Card";
import RoleModeSwitch from "../components/ui/RoleModeSwitch";
import { ScreenHeader, Section } from "../components/ui/ScreenKit";
import { PrimaryActions } from "../components/ui/PrimaryActions";
import { loadRoleMode, type StockRoleMode } from "../lib/localStores/roleMode";

export default function SetupPage() {
  const [role, setRole] = useState<StockRoleMode>("nurse");

  useEffect(() => {
    setRole(loadRoleMode());
  }, []);

  return (
    <PageShell
      header={
        <ScreenHeader
          eyebrow="Stock"
          title="Setup"
          subtitle="One-off setup tasks and admin screens."
          actions={<RoleModeSwitch />}
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
                <Link href="/setup/suppliers" className="stock-action-link">
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
            title="Print location pack"
            footer={
              <PrimaryActions>
                <Link href="/setup/locations-pack" className="stock-action-link">
                  Open print pack
                </Link>
              </PrimaryActions>
            }
          >
            Print all location QR labels in one pack.
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
          {role === "admin" ? (
            <Card
              title="Supplier orders (copy/email)"
              footer={
                <PrimaryActions>
                  <Link href="/orders/suppliers" className="stock-action-link">
                    Open supplier orders
                  </Link>
                </PrimaryActions>
              }
            >
              Copy, download or print supplier-ready order messages.
            </Card>
          ) : null}
        </div>
      </Section>
      <PrimaryActions>
        <Link href="/home" className="stock-action-link stock-action-link--secondary">
          Back to home
        </Link>
        {role === "nurse" ? (
          <Link href="/help" className="stock-action-link stock-action-link--secondary">
            Help
          </Link>
        ) : null}
      </PrimaryActions>
    </PageShell>
  );
}
