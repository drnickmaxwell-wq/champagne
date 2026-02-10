"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import FeedbackCard from "../components/ui/FeedbackCard";
import { FieldRow } from "../components/ui/FieldList";
import PageShell from "../components/ui/PageShell";
import { ActionLink, PrimaryActions } from "../components/ui/PrimaryActions";
import {
  KeyValueGrid,
  ScreenHeader,
  Section
} from "../components/ui/ScreenKit";
import Card from "../components/ui/Card";
import {
  clearSuppliers,
  exportSupplierCsv,
  loadSuppliers,
  orderingMethodOptions,
  upsertSupplier,
  type Supplier,
  type SupplierOrderingMethod
} from "./localSuppliers";
import {
  loadSupplierCatalog,
  type SupplierCatalogItem
} from "./localSupplierCatalog";
import {
  loadProductSupplierPreferences,
  type ProductSupplierPreference
} from "./localSupplierPrefs";

type SupplierDraft = {
  name: string;
  orderingMethod: SupplierOrderingMethod;
  phone: string;
  email: string;
  portalUrl: string;
  notes: string;
};

const createSupplierId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `supplier-${Date.now()}`;
};

const emptyDraft: SupplierDraft = {
  name: "",
  orderingMethod: orderingMethodOptions[0] ?? "EMAIL",
  phone: "",
  email: "",
  portalUrl: "",
  notes: ""
};

const downloadCsv = (filename: string, csv: string) => {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => loadSuppliers());
  const [catalogItems, setCatalogItems] = useState<SupplierCatalogItem[]>(
    () => loadSupplierCatalog()
  );
  const [preferences, setPreferences] = useState<ProductSupplierPreference[]>(
    () => loadProductSupplierPreferences()
  );
  const [draft, setDraft] = useState<SupplierDraft>(emptyDraft);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const refreshStore = useCallback(() => {
    setSuppliers(loadSuppliers());
    setCatalogItems(loadSupplierCatalog());
    setPreferences(loadProductSupplierPreferences());
  }, []);

  useEffect(() => {
    refreshStore();
  }, [refreshStore]);

  const supplierProductsBySupplier = useMemo(() => {
    const counts: Record<string, number> = {};
    catalogItems.forEach((item) => {
      counts[item.supplierId] = (counts[item.supplierId] ?? 0) + 1;
    });
    return counts;
  }, [catalogItems]);

  const handleAddSupplier = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setStatusMessage("");
    const name = draft.name.trim();
    if (!name) {
      setErrorMessage("Supplier name is required.");
      return;
    }
    const now = new Date().toISOString();
    const supplier: Supplier = {
      id: createSupplierId(),
      name,
      orderingMethod: draft.orderingMethod,
      contact: {
        phone: draft.phone.trim() || undefined,
        email: draft.email.trim() || undefined,
        portalUrl: draft.portalUrl.trim() || undefined,
        notes: draft.notes.trim() || undefined
      },
      createdAt: now,
      updatedAt: now
    };
    const nextSuppliers = upsertSupplier(supplier);
    setSuppliers(nextSuppliers);
    setDraft(emptyDraft);
    setStatusMessage("Supplier saved.");
  };

  const handleClear = () => {
    const confirmed = window.confirm(
      "Clear the offline supplier registry? This removes local data only."
    );
    if (!confirmed) {
      return;
    }
    setSuppliers(clearSuppliers());
    setStatusMessage("Supplier registry cleared.");
  };

  const handleExport = () => {
    const csv = exportSupplierCsv(suppliers, catalogItems, preferences);
    downloadCsv("supplier-registry.csv", csv);
  };

  return (
    <PageShell
      header={
        <ScreenHeader
          eyebrow="Suppliers"
          title="Offline supplier registry"
          subtitle="Track preferred suppliers locally without placing any orders."
        />
      }
    >
      <div className="stock-feedback-region" aria-live="polite">
        {statusMessage ? (
          <FeedbackCard title="Status" role="status" message={statusMessage} />
        ) : null}
        {errorMessage ? (
          <FeedbackCard title="Error" role="alert" message={errorMessage} />
        ) : null}
      </div>

      <Section title="Registry status">
        <KeyValueGrid>
          <FieldRow label="Suppliers" value={suppliers.length} />
          <FieldRow
            label="Catalog items"
            value={catalogItems.length}
          />
          <FieldRow label="Preferred suppliers" value={preferences.length} />
        </KeyValueGrid>
        <PrimaryActions>
          <button
            type="button"
            className="stock-button stock-button--primary"
            onClick={handleExport}
            disabled={suppliers.length === 0}
          >
            Export CSV
          </button>
          <button
            type="button"
            className="stock-button stock-button--secondary"
            onClick={handleClear}
            disabled={suppliers.length === 0}
          >
            Clear registry
          </button>
        </PrimaryActions>
      </Section>

      <Section title="Add supplier">
        <form className="stock-form" onSubmit={handleAddSupplier}>
          <div className="stock-form__row">
            <label>
              Supplier name
              <input
                className="stock-form__input"
                value={draft.name}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, name: event.target.value }))
                }
                required
              />
            </label>
            <label>
              How to order
              <select
                className="stock-form__input"
                value={draft.orderingMethod}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    orderingMethod: event.target.value as SupplierOrderingMethod
                  }))
                }
                required
              >
                {orderingMethodOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="stock-form__row">
            <label>
              Phone
              <input
                className="stock-form__input"
                value={draft.phone}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, phone: event.target.value }))
                }
              />
            </label>
            <label>
              Email
              <input
                className="stock-form__input"
                value={draft.email}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, email: event.target.value }))
                }
              />
            </label>
          </div>
          <div className="stock-form__row">
            <label>
              Portal URL
              <input
                className="stock-form__input"
                value={draft.portalUrl}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, portalUrl: event.target.value }))
                }
              />
            </label>
            <label>
              Contact notes
              <input
                className="stock-form__input"
                value={draft.notes}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, notes: event.target.value }))
                }
              />
            </label>
          </div>
          <div className="stock-form__row">
            <button
              type="submit"
              className="stock-button stock-button--primary stock-form__button"
            >
              Save supplier
            </button>
          </div>
        </form>
      </Section>

      <Section title="Supplier list">
        {suppliers.length === 0 ? (
          <FeedbackCard
            title="No suppliers yet"
            message="Add a supplier to track offline availability."
          />
        ) : (
          <div className="stock-grid">
            {suppliers.map((supplier) => {
              const productCount = supplierProductsBySupplier[supplier.id] ?? 0;
              return (
                <Card key={supplier.id} title={supplier.name}>
                  <KeyValueGrid>
                    <FieldRow label="Products" value={productCount} />
                    <FieldRow
                      label="How to order"
                      value={supplier.orderingMethod}
                    />
                    {supplier.contact.email ? (
                      <FieldRow label="Email" value={supplier.contact.email} />
                    ) : null}
                    {supplier.contact.phone ? (
                      <FieldRow label="Phone" value={supplier.contact.phone} />
                    ) : null}
                  </KeyValueGrid>
                  {supplier.contact.notes ? (
                    <p className="stock-field-value">{supplier.contact.notes}</p>
                  ) : null}
                  <PrimaryActions>
                    <Link className="stock-action-link" href={`/suppliers/${supplier.id}`}>
                      Open supplier
                    </Link>
                  </PrimaryActions>
                </Card>
              );
            })}
          </div>
        )}
      </Section>

      <PrimaryActions>
        <ActionLink href="/">Home</ActionLink>
        <ActionLink href="/setup">Setup</ActionLink>
        <ActionLink href="/scan">Scan</ActionLink>
        <ActionLink href="/reorder">Orders</ActionLink>
      </PrimaryActions>
    </PageShell>
  );
}
