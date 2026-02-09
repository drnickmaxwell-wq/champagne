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
  clearSupplierStore,
  exportSupplierCsv,
  loadSupplierStore,
  upsertSupplier,
  type Supplier
} from "./localSuppliers";

type SupplierDraft = {
  name: string;
  notes: string;
  minOrderPence: string;
  deliveryDays: string;
  contact: string;
};

const createSupplierId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `supplier-${Date.now()}`;
};

const emptyDraft: SupplierDraft = {
  name: "",
  notes: "",
  minOrderPence: "",
  deliveryDays: "",
  contact: ""
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
  const [store, setStore] = useState(() => loadSupplierStore());
  const [draft, setDraft] = useState<SupplierDraft>(emptyDraft);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const refreshStore = useCallback(() => {
    setStore(loadSupplierStore());
  }, []);

  useEffect(() => {
    refreshStore();
  }, [refreshStore]);

  const supplierProductsBySupplier = useMemo(() => {
    const counts: Record<string, number> = {};
    store.supplierProducts.forEach((product) => {
      counts[product.supplierId] = (counts[product.supplierId] ?? 0) + 1;
    });
    return counts;
  }, [store.supplierProducts]);

  const handleAddSupplier = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setStatusMessage("");
    const name = draft.name.trim();
    if (!name) {
      setErrorMessage("Supplier name is required.");
      return;
    }
    const supplier: Supplier = {
      id: createSupplierId(),
      name,
      notes: draft.notes.trim() || undefined,
      minOrderPence: draft.minOrderPence.trim() || undefined,
      deliveryDays: draft.deliveryDays.trim() || undefined,
      contact: draft.contact.trim() || undefined
    };
    const nextStore = upsertSupplier(supplier);
    setStore(nextStore);
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
    setStore(clearSupplierStore());
    setStatusMessage("Supplier registry cleared.");
  };

  const handleExport = () => {
    const csv = exportSupplierCsv(store);
    downloadCsv("supplier-registry.csv", csv);
  };

  return (
    <PageShell
      header={
        <ScreenHeader
          eyebrow="Suppliers"
          title="Offline supplier registry"
          subtitle="Track preferred suppliers and pricing locally without placing any orders."
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
          <FieldRow label="Suppliers" value={store.suppliers.length} />
          <FieldRow
            label="Supplier product prices"
            value={store.supplierProducts.length}
          />
          <FieldRow label="Storage version" value={store.version} />
        </KeyValueGrid>
        <PrimaryActions>
          <button
            type="button"
            className="stock-button stock-button--primary"
            onClick={handleExport}
            disabled={store.suppliers.length === 0}
          >
            Export CSV
          </button>
          <button
            type="button"
            className="stock-button stock-button--secondary"
            onClick={handleClear}
            disabled={store.suppliers.length === 0}
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
              Notes
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
            <label>
              Min order (pence)
              <input
                className="stock-form__input"
                value={draft.minOrderPence}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    minOrderPence: event.target.value
                  }))
                }
              />
            </label>
            <label>
              Delivery days
              <input
                className="stock-form__input"
                value={draft.deliveryDays}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    deliveryDays: event.target.value
                  }))
                }
              />
            </label>
            <label>
              Contact
              <input
                className="stock-form__input"
                value={draft.contact}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, contact: event.target.value }))
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
        {store.suppliers.length === 0 ? (
          <FeedbackCard
            title="No suppliers yet"
            message="Add a supplier to track offline pricing."
          />
        ) : (
          <div className="stock-grid">
            {store.suppliers.map((supplier) => {
              const productCount = supplierProductsBySupplier[supplier.id] ?? 0;
              return (
                <Card key={supplier.id} title={supplier.name}>
                  <KeyValueGrid>
                    <FieldRow label="Products" value={productCount} />
                    <FieldRow
                      label="Min order"
                      value={supplier.minOrderPence ?? "—"}
                    />
                    <FieldRow
                      label="Delivery"
                      value={supplier.deliveryDays ?? "—"}
                    />
                  </KeyValueGrid>
                  {supplier.notes ? (
                    <p className="stock-field-value">{supplier.notes}</p>
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
        <ActionLink href="/baseline">Baseline</ActionLink>
        <ActionLink href="/scan">Scan</ActionLink>
        <ActionLink href="/reorder">Reorder</ActionLink>
      </PrimaryActions>
    </PageShell>
  );
}
