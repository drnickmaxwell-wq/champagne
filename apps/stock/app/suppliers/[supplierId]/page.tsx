"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import FeedbackCard from "../../components/ui/FeedbackCard";
import LoadingLine from "../../components/ui/LoadingLine";
import { FieldRow } from "../../components/ui/FieldList";
import PageShell from "../../components/ui/PageShell";
import { ActionLink, PrimaryActions } from "../../components/ui/PrimaryActions";
import {
  KeyValueGrid,
  ScreenHeader,
  Section
} from "../../components/ui/ScreenKit";
import { loadBaselineEntries } from "../../baseline/localBaseline";
import {
  loadSuppliers,
  orderingMethodOptions,
  upsertSupplier,
  type Supplier,
  type SupplierOrderingMethod
} from "../localSuppliers";
import {
  loadSupplierCatalog,
  upsertSupplierCatalogItem,
  type SupplierCatalogItem
} from "../localSupplierCatalog";

type SupplierDraft = {
  name: string;
  orderingMethod: SupplierOrderingMethod;
  phone: string;
  email: string;
  portalUrl: string;
  notes: string;
};

type LinkDraft = {
  packLabel: string;
  supplierSku: string;
  notes: string;
};

const toSupplierDraft = (supplier: Supplier): SupplierDraft => {
  return {
    name: supplier.name,
    orderingMethod: supplier.orderingMethod,
    phone: supplier.contact.phone ?? "",
    email: supplier.contact.email ?? "",
    portalUrl: supplier.contact.portalUrl ?? "",
    notes: supplier.contact.notes ?? ""
  };
};

const toLinkDraft = (product: SupplierCatalogItem): LinkDraft => {
  return {
    supplierSku: product.supplierSku,
    packLabel: product.supplierPackLabel ?? "",
    notes: product.notes ?? ""
  };
};

export default function SupplierDetailPage() {
  const params = useParams();
  const supplierParam = params?.supplierId;
  const supplierId =
    typeof supplierParam === "string"
      ? supplierParam
      : Array.isArray(supplierParam)
        ? supplierParam[0] ?? ""
        : "";
  const [loading, setLoading] = useState(true);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [supplierProducts, setSupplierProducts] = useState<SupplierCatalogItem[]>([]);
  const [draft, setDraft] = useState<SupplierDraft | null>(null);
  const [linkDrafts, setLinkDrafts] = useState<Record<string, LinkDraft>>(
    {}
  );
  const [newLink, setNewLink] = useState<
    LinkDraft & { productId: string }
  >({
    productId: "",
    supplierSku: "",
    packLabel: "",
    notes: ""
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const refreshStore = useCallback(() => {
    const suppliers = loadSuppliers();
    const currentSupplier = suppliers.find(
      (entry) => entry.id === supplierId
    );
    setSupplier(currentSupplier ?? null);
    setSupplierProducts(
      loadSupplierCatalog().filter((entry) => entry.supplierId === supplierId)
    );
    setLoading(false);
    if (currentSupplier) {
      setDraft((prev) => prev ?? toSupplierDraft(currentSupplier));
    }
  }, [supplierId]);

  useEffect(() => {
    refreshStore();
  }, [refreshStore]);

  useEffect(() => {
    setLinkDrafts((prev) => {
      const next: Record<string, LinkDraft> = { ...prev };
      supplierProducts.forEach((product) => {
        next[product.id] = next[product.id] ?? toLinkDraft(product);
      });
      return next;
    });
  }, [supplierProducts]);

  const knownProducts = useMemo(() => {
    const entries = loadBaselineEntries();
    const seen = new Map<string, string>();
    entries.forEach((entry) => {
      if (!seen.has(entry.productId)) {
        seen.set(entry.productId, entry.productName);
      }
    });
    return Array.from(seen.entries()).map(([id, name]) => ({
      id,
      name
    }));
  }, []);

  const handleSaveSupplier = () => {
    if (!draft || !supplier) {
      return;
    }
    setErrorMessage("");
    setStatusMessage("");
    const name = draft.name.trim();
    if (!name) {
      setErrorMessage("Supplier name is required.");
      return;
    }
    const now = new Date().toISOString();
    const nextSupplier: Supplier = {
      id: supplier.id,
      name,
      orderingMethod: draft.orderingMethod,
      contact: {
        phone: draft.phone.trim() || undefined,
        email: draft.email.trim() || undefined,
        portalUrl: draft.portalUrl.trim() || undefined,
        notes: draft.notes.trim() || undefined
      },
      createdAt: supplier.createdAt,
      updatedAt: now
    };
    upsertSupplier(nextSupplier);
    setStatusMessage("Supplier updated.");
    refreshStore();
  };

  const handleLinkUpdate = (itemId: string) => {
    if (!supplier) {
      return;
    }
    const draftRow = linkDrafts[itemId];
    if (!draftRow) {
      return;
    }
    const supplierSku = draftRow.supplierSku.trim();
    if (!supplierSku) {
      setErrorMessage("Supplier SKU is required.");
      return;
    }
    const now = new Date().toISOString();
    const existing = supplierProducts.find((item) => item.id === itemId);
    if (!existing) {
      setErrorMessage("Supplier link not found.");
      return;
    }
    const payload: SupplierCatalogItem = {
      id: existing.id,
      supplierId: existing.supplierId,
      productId: existing.productId,
      supplierSku,
      supplierPackLabel: draftRow.packLabel.trim() || undefined,
      notes: draftRow.notes.trim() || undefined,
      createdAt: existing.createdAt,
      updatedAt: now
    };
    upsertSupplierCatalogItem(payload);
    setStatusMessage("Supplier link updated.");
    refreshStore();
  };

  const handleAddLink = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supplier) {
      return;
    }
    setErrorMessage("");
    setStatusMessage("");
    const productId = newLink.productId.trim();
    if (!productId) {
      setErrorMessage("Select a product.");
      return;
    }
    const supplierSku = newLink.supplierSku.trim();
    if (!supplierSku) {
      setErrorMessage("Supplier SKU is required.");
      return;
    }
    const now = new Date().toISOString();
    const payload: SupplierCatalogItem = {
      id:
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `supplier-link-${Date.now()}`,
      supplierId: supplier.id,
      productId,
      supplierSku,
      supplierPackLabel: newLink.packLabel.trim() || undefined,
      notes: newLink.notes.trim() || undefined,
      createdAt: now,
      updatedAt: now
    };
    upsertSupplierCatalogItem(payload);
    setNewLink({
      productId: "",
      supplierSku: "",
      packLabel: "",
      notes: ""
    });
    setStatusMessage("Supplier link added.");
    refreshStore();
  };

  const supplierName = supplier?.name ?? "Supplier";

  return (
    <PageShell
      header={
        <ScreenHeader
          eyebrow="Supplier"
          title={supplierName}
          subtitle="Update supplier details and supply options."
        />
      }
    >
      <div className="stock-feedback-region" aria-live="polite">
        {loading ? <LoadingLine label="Loading supplier..." /> : null}
        {statusMessage ? (
          <FeedbackCard title="Status" role="status" message={statusMessage} />
        ) : null}
        {errorMessage ? (
          <FeedbackCard title="Error" role="alert" message={errorMessage} />
        ) : null}
      </div>

      {!loading && !supplier ? (
        <Section title="Missing supplier">
          <FeedbackCard
            title="Supplier not found"
            message="Return to the supplier list and pick a valid supplier."
          />
          <PrimaryActions>
            <ActionLink href="/suppliers">Back to suppliers</ActionLink>
          </PrimaryActions>
        </Section>
      ) : null}

      {supplier && draft ? (
        <>
          <Section title="Supplier details">
            <KeyValueGrid>
              <FieldRow label="Supplier ID" value={supplier.id} />
              <FieldRow
                label="Products linked"
                value={supplierProducts.length}
              />
              <FieldRow
                label="How to order"
                value={supplier.orderingMethod}
              />
            </KeyValueGrid>
            <form className="stock-form" onSubmit={(event) => event.preventDefault()}>
              <div className="stock-form__row">
                <label>
                  Supplier name
                  <input
                    className="stock-form__input"
                    value={draft.name}
                    onChange={(event) =>
                      setDraft((prev) => (prev ? { ...prev, name: event.target.value } : prev))
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
                      setDraft((prev) =>
                        prev
                          ? {
                              ...prev,
                              orderingMethod:
                                event.target.value as SupplierOrderingMethod
                            }
                          : prev
                      )
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
                      setDraft((prev) =>
                        prev ? { ...prev, phone: event.target.value } : prev
                      )
                    }
                  />
                </label>
                <label>
                  Email
                  <input
                    className="stock-form__input"
                    value={draft.email}
                    onChange={(event) =>
                      setDraft((prev) =>
                        prev ? { ...prev, email: event.target.value } : prev
                      )
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
                      setDraft((prev) =>
                        prev ? { ...prev, portalUrl: event.target.value } : prev
                      )
                    }
                  />
                </label>
                <label>
                  Contact notes
                  <input
                    className="stock-form__input"
                    value={draft.notes}
                    onChange={(event) =>
                      setDraft((prev) => (prev ? { ...prev, notes: event.target.value } : prev))
                    }
                  />
                </label>
              </div>
              <div className="stock-form__row">
                <button
                  type="button"
                  className="stock-button stock-button--primary stock-form__button"
                  onClick={handleSaveSupplier}
                >
                  Save supplier
                </button>
              </div>
            </form>
          </Section>

          <Section title="Add supplier product link">
            <form className="stock-form" onSubmit={handleAddLink}>
              <div className="stock-form__row">
                <label>
                  Product
                  <input
                    className="stock-form__input"
                    list="supplier-product-options"
                    value={newLink.productId}
                    onChange={(event) =>
                      setNewLink((prev) => ({
                        ...prev,
                        productId: event.target.value
                      }))
                    }
                    placeholder="Product ID"
                    required
                  />
                </label>
                <label>
                  Supplier SKU
                  <input
                    className="stock-form__input"
                    value={newLink.supplierSku}
                    onChange={(event) =>
                      setNewLink((prev) => ({
                        ...prev,
                        supplierSku: event.target.value
                      }))
                    }
                    required
                  />
                </label>
              </div>
              <div className="stock-form__row">
                <label>
                  Pack label
                  <input
                    className="stock-form__input"
                    value={newLink.packLabel}
                    onChange={(event) =>
                      setNewLink((prev) => ({
                        ...prev,
                        packLabel: event.target.value
                      }))
                    }
                    placeholder="Box of 10"
                  />
                </label>
                <label>
                  Notes
                  <input
                    className="stock-form__input"
                    value={newLink.notes}
                    onChange={(event) =>
                      setNewLink((prev) => ({
                        ...prev,
                        notes: event.target.value
                      }))
                    }
                  />
                </label>
              </div>
              <div className="stock-form__row">
                <button
                  type="submit"
                  className="stock-button stock-button--primary stock-form__button"
                >
                  Save link
                </button>
              </div>
            </form>
            <datalist id="supplier-product-options">
              {knownProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </datalist>
          </Section>

          <Section title="Existing supplier links">
            {supplierProducts.length === 0 ? (
              <FeedbackCard
                title="No product links yet"
                message="Add product links to track supplier SKUs."
              />
            ) : (
              <div className="stock-data-table" role="table" aria-label="Supplier links">
                <div className="stock-data-table__header" role="row">
                  <span role="columnheader">Product</span>
                  <span role="columnheader">Supplier SKU</span>
                  <span role="columnheader">Pack label</span>
                  <span role="columnheader">Notes</span>
                  <span role="columnheader">Actions</span>
                </div>
                {supplierProducts.map((product) => {
                  const draftRow = linkDrafts[product.id] ?? toLinkDraft(product);
                  const productName =
                    knownProducts.find((entry) => entry.id === product.productId)
                      ?.name ?? product.productId;
                  return (
                    <div key={product.id} className="stock-data-table__row" role="row">
                      <div role="cell" className="stock-data-table__cell">
                        <strong>{productName}</strong>
                        <span className="stock-order-table__meta">{product.productId}</span>
                      </div>
                      <div role="cell" className="stock-data-table__cell">
                        <input
                          className="stock-form__input stock-data-table__input"
                          value={draftRow.supplierSku}
                          onChange={(event) =>
                            setLinkDrafts((prev) => ({
                              ...prev,
                              [product.id]: {
                                ...draftRow,
                                supplierSku: event.target.value
                              }
                            }))
                          }
                        />
                      </div>
                      <div role="cell" className="stock-data-table__cell">
                        <input
                          className="stock-form__input stock-data-table__input"
                          value={draftRow.packLabel}
                          onChange={(event) =>
                            setLinkDrafts((prev) => ({
                              ...prev,
                              [product.id]: {
                                ...draftRow,
                                packLabel: event.target.value
                              }
                            }))
                          }
                        />
                      </div>
                      <div role="cell" className="stock-data-table__cell">
                        <input
                          className="stock-form__input stock-data-table__input"
                          value={draftRow.notes}
                          onChange={(event) =>
                            setLinkDrafts((prev) => ({
                              ...prev,
                              [product.id]: {
                                ...draftRow,
                                notes: event.target.value
                              }
                            }))
                          }
                        />
                      </div>
                      <div role="cell" className="stock-data-table__cell">
                        <button
                          type="button"
                          className="stock-button stock-button--secondary stock-data-table__button"
                          onClick={() => handleLinkUpdate(product.id)}
                        >
                          Save row
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Section>
        </>
      ) : null}

      <PrimaryActions>
        <ActionLink href="/">Home</ActionLink>
        <ActionLink href="/setup">Setup</ActionLink>
        <ActionLink href="/suppliers">Back to suppliers</ActionLink>
        <ActionLink href="/scan">Scan</ActionLink>
      </PrimaryActions>
    </PageShell>
  );
}
