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
  loadSupplierStore,
  upsertSupplier,
  upsertSupplierProduct,
  type Supplier,
  type SupplierProductLink
} from "../localSuppliers";

type SupplierDraft = {
  name: string;
  notes: string;
  active: boolean;
};

type LinkDraft = {
  packSize: string;
  packLabel: string;
};

const toSupplierDraft = (supplier: Supplier): SupplierDraft => {
  return {
    name: supplier.name,
    notes: supplier.notes ?? "",
    active: supplier.active
  };
};

const toLinkDraft = (product: SupplierProductLink): LinkDraft => {
  return {
    packSize: String(product.packSize),
    packLabel: product.packLabel
  };
};

const parsePositiveIntegerInput = (value: string) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return parsed >= 1 ? parsed : null;
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
  const [supplierProducts, setSupplierProducts] = useState<SupplierProductLink[]>([]);
  const [draft, setDraft] = useState<SupplierDraft | null>(null);
  const [linkDrafts, setLinkDrafts] = useState<Record<string, LinkDraft>>(
    {}
  );
  const [newLink, setNewLink] = useState<LinkDraft & { productId: string }>(
    {
      productId: "",
      packSize: "",
      packLabel: ""
    }
  );
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const refreshStore = useCallback(() => {
    const store = loadSupplierStore();
    const currentSupplier = store.suppliers.find(
      (entry) => entry.id === supplierId
    );
    setSupplier(currentSupplier ?? null);
    setSupplierProducts(
      store.supplierProducts.filter((entry) => entry.supplierId === supplierId)
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
        next[product.productId] = next[product.productId] ?? toLinkDraft(product);
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
    const nextSupplier: Supplier = {
      id: supplier.id,
      name,
      notes: draft.notes.trim() || undefined,
      active: draft.active
    };
    upsertSupplier(nextSupplier);
    setStatusMessage("Supplier updated.");
    refreshStore();
  };

  const handleLinkUpdate = (productId: string) => {
    if (!supplier) {
      return;
    }
    const draftRow = linkDrafts[productId];
    if (!draftRow) {
      return;
    }
    const packSize = parsePositiveIntegerInput(draftRow.packSize);
    if (!packSize) {
      setErrorMessage("Pack size must be a number of 1 or more.");
      return;
    }
    const packLabel = draftRow.packLabel.trim();
    if (!packLabel) {
      setErrorMessage("Pack label is required.");
      return;
    }
    const payload: SupplierProductLink = {
      supplierId: supplier.id,
      productId,
      packSize,
      packLabel
    };
    upsertSupplierProduct(payload);
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
    const packSize = parsePositiveIntegerInput(newLink.packSize);
    if (!packSize) {
      setErrorMessage("Pack size must be a number of 1 or more.");
      return;
    }
    const packLabel = newLink.packLabel.trim();
    if (!packLabel) {
      setErrorMessage("Pack label is required.");
      return;
    }
    const payload: SupplierProductLink = {
      supplierId: supplier.id,
      productId,
      packSize,
      packLabel
    };
    upsertSupplierProduct(payload);
    setNewLink({
      productId: "",
      packSize: "",
      packLabel: ""
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
                  Notes
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
                <label>
                  Active
                  <input
                    className="stock-form__input"
                    type="checkbox"
                    checked={draft.active}
                    onChange={(event) =>
                      setDraft((prev) =>
                        prev ? { ...prev, active: event.target.checked } : prev
                      )
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
                  Pack size
                  <input
                    className="stock-form__input"
                    type="number"
                    min="1"
                    step="1"
                    value={newLink.packSize}
                    onChange={(event) =>
                      setNewLink((prev) => ({
                        ...prev,
                        packSize: event.target.value
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
                    required
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
                message="Add product links to track pack sizes."
              />
            ) : (
              <div className="stock-data-table" role="table" aria-label="Supplier links">
                <div className="stock-data-table__header" role="row">
                  <span role="columnheader">Product</span>
                  <span role="columnheader">Pack size</span>
                  <span role="columnheader">Pack label</span>
                  <span role="columnheader">Actions</span>
                </div>
                {supplierProducts.map((product) => {
                  const draftRow = linkDrafts[product.productId] ?? toLinkDraft(product);
                  const productName =
                    knownProducts.find((entry) => entry.id === product.productId)
                      ?.name ?? product.productId;
                  return (
                    <div key={product.productId} className="stock-data-table__row" role="row">
                      <div role="cell" className="stock-data-table__cell">
                        <strong>{productName}</strong>
                        <span className="stock-order-table__meta">{product.productId}</span>
                      </div>
                      <div role="cell" className="stock-data-table__cell">
                        <input
                          className="stock-form__input stock-data-table__input"
                          type="number"
                          min="1"
                          step="1"
                          value={draftRow.packSize}
                          onChange={(event) =>
                            setLinkDrafts((prev) => ({
                              ...prev,
                              [product.productId]: {
                                ...draftRow,
                                packSize: event.target.value
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
                              [product.productId]: {
                                ...draftRow,
                                packLabel: event.target.value
                              }
                            }))
                          }
                        />
                      </div>
                      <div role="cell" className="stock-data-table__cell">
                        <button
                          type="button"
                          className="stock-button stock-button--secondary stock-data-table__button"
                          onClick={() => handleLinkUpdate(product.productId)}
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
        <ActionLink href="/suppliers">Back to suppliers</ActionLink>
        <ActionLink href="/baseline">Baseline</ActionLink>
        <ActionLink href="/scan">Scan</ActionLink>
      </PrimaryActions>
    </PageShell>
  );
}
