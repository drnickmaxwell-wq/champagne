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
  type SupplierProduct
} from "../localSuppliers";

type SupplierDraft = {
  name: string;
  notes: string;
  minOrderPence: string;
  deliveryDays: string;
  contact: string;
};

type PricingDraft = {
  supplierSku: string;
  unitPricePence: string;
  packSize: string;
};

const toSupplierDraft = (supplier: Supplier): SupplierDraft => {
  return {
    name: supplier.name,
    notes: supplier.notes ?? "",
    minOrderPence: supplier.minOrderPence ?? "",
    deliveryDays: supplier.deliveryDays ?? "",
    contact: supplier.contact ?? ""
  };
};

const toPricingDraft = (product: SupplierProduct): PricingDraft => {
  return {
    supplierSku: product.supplierSku ?? "",
    unitPricePence: String(product.unitPricePence),
    packSize: product.packSize ? String(product.packSize) : ""
  };
};

const parseIntegerInput = (value: string) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return Math.max(0, parsed);
};

const formatCurrency = (valuePence: number) => {
  const formatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP"
  });
  return formatter.format(valuePence / 100);
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
  const [supplierProducts, setSupplierProducts] = useState<SupplierProduct[]>([]);
  const [draft, setDraft] = useState<SupplierDraft | null>(null);
  const [pricingDrafts, setPricingDrafts] = useState<Record<string, PricingDraft>>(
    {}
  );
  const [newPricing, setNewPricing] = useState<PricingDraft & { productId: string }>(
    {
      productId: "",
      supplierSku: "",
      unitPricePence: "",
      packSize: ""
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
    setPricingDrafts((prev) => {
      const next: Record<string, PricingDraft> = { ...prev };
      supplierProducts.forEach((product) => {
        next[product.productId] = next[product.productId] ?? toPricingDraft(product);
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
      minOrderPence: draft.minOrderPence.trim() || undefined,
      deliveryDays: draft.deliveryDays.trim() || undefined,
      contact: draft.contact.trim() || undefined
    };
    upsertSupplier(nextSupplier);
    setStatusMessage("Supplier updated.");
    refreshStore();
  };

  const handlePricingUpdate = (productId: string) => {
    if (!supplier) {
      return;
    }
    const draftRow = pricingDrafts[productId];
    if (!draftRow) {
      return;
    }
    const unitPricePence = parseIntegerInput(draftRow.unitPricePence);
    if (unitPricePence === null) {
      setErrorMessage("Unit price must be a number.");
      return;
    }
    const packSize = draftRow.packSize.trim()
      ? parseIntegerInput(draftRow.packSize)
      : null;
    if (packSize === null && draftRow.packSize.trim()) {
      setErrorMessage("Pack size must be a number.");
      return;
    }
    const payload: SupplierProduct = {
      supplierId: supplier.id,
      productId,
      supplierSku: draftRow.supplierSku.trim() || undefined,
      unitPricePence,
      packSize: packSize ?? undefined,
      lastUpdatedISO: new Date().toISOString()
    };
    upsertSupplierProduct(payload);
    setStatusMessage("Pricing updated.");
    refreshStore();
  };

  const handleAddPricing = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supplier) {
      return;
    }
    setErrorMessage("");
    setStatusMessage("");
    const productId = newPricing.productId.trim();
    if (!productId) {
      setErrorMessage("Select a product.");
      return;
    }
    const unitPricePence = parseIntegerInput(newPricing.unitPricePence);
    if (unitPricePence === null) {
      setErrorMessage("Unit price must be a number.");
      return;
    }
    const packSize = newPricing.packSize.trim()
      ? parseIntegerInput(newPricing.packSize)
      : null;
    if (packSize === null && newPricing.packSize.trim()) {
      setErrorMessage("Pack size must be a number.");
      return;
    }
    const payload: SupplierProduct = {
      supplierId: supplier.id,
      productId,
      supplierSku: newPricing.supplierSku.trim() || undefined,
      unitPricePence,
      packSize: packSize ?? undefined,
      lastUpdatedISO: new Date().toISOString()
    };
    upsertSupplierProduct(payload);
    setNewPricing({
      productId: "",
      supplierSku: "",
      unitPricePence: "",
      packSize: ""
    });
    setStatusMessage("Pricing added.");
    refreshStore();
  };

  const supplierName = supplier?.name ?? "Supplier";

  return (
    <PageShell
      header={
        <ScreenHeader
          eyebrow="Supplier"
          title={supplierName}
          subtitle="Update supplier details and offline pricing."
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
                label="Products priced"
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
                  Min order (pence)
                  <input
                    className="stock-form__input"
                    value={draft.minOrderPence}
                    onChange={(event) =>
                      setDraft((prev) =>
                        prev ? { ...prev, minOrderPence: event.target.value } : prev
                      )
                    }
                  />
                </label>
                <label>
                  Delivery days
                  <input
                    className="stock-form__input"
                    value={draft.deliveryDays}
                    onChange={(event) =>
                      setDraft((prev) =>
                        prev ? { ...prev, deliveryDays: event.target.value } : prev
                      )
                    }
                  />
                </label>
                <label>
                  Contact
                  <input
                    className="stock-form__input"
                    value={draft.contact}
                    onChange={(event) =>
                      setDraft((prev) =>
                        prev ? { ...prev, contact: event.target.value } : prev
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

          <Section title="Add product pricing">
            <form className="stock-form" onSubmit={handleAddPricing}>
              <div className="stock-form__row">
                <label>
                  Product
                  <input
                    className="stock-form__input"
                    list="supplier-product-options"
                    value={newPricing.productId}
                    onChange={(event) =>
                      setNewPricing((prev) => ({
                        ...prev,
                        productId: event.target.value
                      }))
                    }
                    placeholder="Product ID"
                    required
                  />
                </label>
                <label>
                  Unit price (pence)
                  <input
                    className="stock-form__input"
                    type="number"
                    min="0"
                    step="1"
                    value={newPricing.unitPricePence}
                    onChange={(event) =>
                      setNewPricing((prev) => ({
                        ...prev,
                        unitPricePence: event.target.value
                      }))
                    }
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
                    value={newPricing.packSize}
                    onChange={(event) =>
                      setNewPricing((prev) => ({
                        ...prev,
                        packSize: event.target.value
                      }))
                    }
                  />
                </label>
              </div>
              <div className="stock-form__row">
                <label>
                  Supplier SKU
                  <input
                    className="stock-form__input"
                    value={newPricing.supplierSku}
                    onChange={(event) =>
                      setNewPricing((prev) => ({
                        ...prev,
                        supplierSku: event.target.value
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
                  Save pricing
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

          <Section title="Existing pricing">
            {supplierProducts.length === 0 ? (
              <FeedbackCard
                title="No prices yet"
                message="Add pricing rows to enable order estimates."
              />
            ) : (
              <div className="stock-data-table" role="table" aria-label="Supplier pricing">
                <div className="stock-data-table__header" role="row">
                  <span role="columnheader">Product</span>
                  <span role="columnheader">Unit price</span>
                  <span role="columnheader">Pack size</span>
                  <span role="columnheader">Supplier SKU</span>
                  <span role="columnheader">Last updated</span>
                  <span role="columnheader">Actions</span>
                </div>
                {supplierProducts.map((product) => {
                  const draftRow = pricingDrafts[product.productId] ?? toPricingDraft(product);
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
                          min="0"
                          step="1"
                          value={draftRow.unitPricePence}
                          onChange={(event) =>
                            setPricingDrafts((prev) => ({
                              ...prev,
                              [product.productId]: {
                                ...draftRow,
                                unitPricePence: event.target.value
                              }
                            }))
                          }
                        />
                        <span className="stock-order-table__meta">
                          {formatCurrency(product.unitPricePence)}
                        </span>
                      </div>
                      <div role="cell" className="stock-data-table__cell">
                        <input
                          className="stock-form__input stock-data-table__input"
                          type="number"
                          min="1"
                          step="1"
                          value={draftRow.packSize}
                          onChange={(event) =>
                            setPricingDrafts((prev) => ({
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
                          value={draftRow.supplierSku}
                          onChange={(event) =>
                            setPricingDrafts((prev) => ({
                              ...prev,
                              [product.productId]: {
                                ...draftRow,
                                supplierSku: event.target.value
                              }
                            }))
                          }
                        />
                      </div>
                      <div role="cell" className="stock-data-table__cell">
                        {new Date(product.lastUpdatedISO).toLocaleDateString("en-GB")}
                      </div>
                      <div role="cell" className="stock-data-table__cell">
                        <button
                          type="button"
                          className="stock-button stock-button--secondary stock-data-table__button"
                          onClick={() => handlePricingUpdate(product.productId)}
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
