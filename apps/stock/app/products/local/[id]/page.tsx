"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import type { LocalProduct } from "../../../scan/localRegistry";
import { loadLocalBarcodeRegistry } from "../../../scan/localRegistry";
import {
  loadSuppliers,
  type Supplier
} from "../../../suppliers/localSuppliers";
import {
  loadSupplierCatalog,
  upsertSupplierCatalogItem,
  type SupplierCatalogItem
} from "../../../suppliers/localSupplierCatalog";
import {
  clearProductSupplierPreference,
  loadProductSupplierPreferences,
  upsertProductSupplierPreference,
  type ProductSupplierPreference
} from "../../../suppliers/localSupplierPrefs";
import { loadLocalSuppliers, type LocalSupplier } from "../../../lib/localStores/suppliers";
import { clearMapping, getMapping, setMapping } from "../../../lib/localStores/productSupplierMap";
import {
  getExpiryStatus,
  getLotsForProduct,
  type LocalStockLot
} from "../../../stockLots/localLots";
import FeedbackCard from "../../../components/ui/FeedbackCard";
import { FieldRow } from "../../../components/ui/FieldList";
import PageShell from "../../../components/ui/PageShell";
import { ActionLink, PrimaryActions } from "../../../components/ui/PrimaryActions";
import {
  KeyValueGrid,
  ScreenHeader,
  Section
} from "../../../components/ui/ScreenKit";

const formatBoolean = (value: boolean) => {
  return value ? "Yes" : "No";
};

const formatExpiryStatus = (expiryDate: string) => {
  const status = getExpiryStatus(expiryDate);
  if (status === "expired") {
    return "Expired";
  }
  if (status === "near-expiry") {
    return "Near expiry";
  }
  if (status === "ok") {
    return "OK";
  }
  return "Unknown";
};

export default function LocalProductPage() {
  const params = useParams();
  const idParam = params?.id;
  const id =
    typeof idParam === "string"
      ? idParam
      : Array.isArray(idParam)
        ? idParam[0] ?? ""
        : "";
  const [product, setProduct] = useState<LocalProduct | null>(null);
  const [lots, setLots] = useState<LocalStockLot[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [catalogItems, setCatalogItems] = useState<SupplierCatalogItem[]>([]);
  const [preferences, setPreferences] = useState<ProductSupplierPreference[]>([]);
  const [preferredSupplierId, setPreferredSupplierId] = useState("");
  const [localSuppliers, setLocalSuppliers] = useState<LocalSupplier[]>([]);
  const [mappingForm, setMappingForm] = useState({ supplierId: "", supplierSku: "", packSize: "", notes: "" });
  const [mappingDraft, setMappingDraft] = useState({
    supplierId: "",
    supplierSku: "",
    packLabel: ""
  });

  const refreshSupplierData = useCallback(() => {
    const nextSuppliers = loadSuppliers();
    const nextCatalog = loadSupplierCatalog();
    const nextPrefs = loadProductSupplierPreferences();
    setSuppliers(nextSuppliers);
    setCatalogItems(nextCatalog);
    setPreferences(nextPrefs);
    const preference = nextPrefs.find((pref) => pref.productId === id);
    setPreferredSupplierId(preference?.preferredSupplierId ?? "");
  }, [id]);

  useEffect(() => {
    const registry = loadLocalBarcodeRegistry();
    const match = registry.products.find((entry) => entry.id === id) ?? null;
    setProduct(match);
  }, [id]);

  useEffect(() => {
    if (!id) {
      setLots([]);
      return;
    }
    setLots(getLotsForProduct(id));
  }, [id]);

  useEffect(() => {
    refreshSupplierData();
    setLocalSuppliers(loadLocalSuppliers());
  }, [refreshSupplierData]);

  useEffect(() => {
    if (!id) return;
    const existing = getMapping(id);
    setMappingForm({
      supplierId: existing?.supplierId ?? "",
      supplierSku: existing?.supplierSku ?? "",
      packSize: existing?.packSize ?? "",
      notes: existing?.notes ?? ""
    });
  }, [id]);

  const catalogForProduct = useMemo(() => {
    return catalogItems.filter((item) => item.productId === id);
  }, [catalogItems, id]);

  const preferredSupplier = useMemo(() => {
    return suppliers.find((supplier) => supplier.id === preferredSupplierId);
  }, [preferredSupplierId, suppliers]);

  const handleSavePreference = () => {
    if (!id) {
      return;
    }
    const now = new Date().toISOString();
    if (!preferredSupplierId) {
      clearProductSupplierPreference(id);
      refreshSupplierData();
      return;
    }
    const existing =
      preferences.find((pref) => pref.productId === id) ?? null;
    upsertProductSupplierPreference({
      productId: id,
      preferredSupplierId,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now
    });
    refreshSupplierData();
  };

  const handleSaveLocalMapping = () => {
    if (!id || !mappingForm.supplierId.trim()) return;
    setMapping(id, {
      supplierId: mappingForm.supplierId.trim(),
      supplierSku: mappingForm.supplierSku.trim() || undefined,
      packSize: mappingForm.packSize.trim() || undefined,
      notes: mappingForm.notes.trim() || undefined
    });
  };

  const handleClearLocalMapping = () => {
    if (!id) return;
    clearMapping(id);
    setMappingForm({ supplierId: "", supplierSku: "", packSize: "", notes: "" });
  };

  const handleAddMapping = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) {
      return;
    }
    const supplierId = mappingDraft.supplierId.trim();
    const supplierSku = mappingDraft.supplierSku.trim();
    if (!supplierId || !supplierSku) {
      return;
    }
    const now = new Date().toISOString();
    const newItem: SupplierCatalogItem = {
      id:
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `supplier-catalog-${Date.now()}`,
      supplierId,
      productId: id,
      supplierSku,
      supplierPackLabel: mappingDraft.packLabel.trim() || undefined,
      createdAt: now,
      updatedAt: now
    };
    upsertSupplierCatalogItem(newItem);
    setMappingDraft({
      supplierId: "",
      supplierSku: "",
      packLabel: ""
    });
    refreshSupplierData();
  };

  return (
    <PageShell
      header={
        <ScreenHeader
          eyebrow="Local product"
          title={product?.name ?? "Product"}
          subtitle={product ? `Barcode: ${product.barcode}` : "Not found"}
        />
      }
    >
      {!product ? (
        <FeedbackCard
          title="Product not found"
          message="This local product is not available on this device."
        />
      ) : (
        <>
          <Section title="Details">
            <KeyValueGrid>
              <FieldRow label="Name" value={product.name} />
              <FieldRow label="Unit type" value={product.unitType} />
              <FieldRow label="Category" value={product.category} />
              <FieldRow
                label="Batch & expiry tracking"
                value={formatBoolean(product.requiresBatchTracking)}
              />
              <FieldRow label="Barcode" value={product.barcode} />
            </KeyValueGrid>
            <PrimaryActions>
              <ActionLink href="/">Home</ActionLink>
              <ActionLink href="/setup">Setup</ActionLink>
              <ActionLink href="/scan">Scan another</ActionLink>
            </PrimaryActions>
          </Section>
          <Section title="Suppliers">
            <KeyValueGrid>
              <FieldRow
                label="Preferred supplier"
                value={preferredSupplier?.name ?? "Not set"}
              />
              <FieldRow
                label="How to order"
                value={preferredSupplier?.orderingMethod ?? "—"}
              />
            </KeyValueGrid>
            <form className="stock-form" onSubmit={(event) => event.preventDefault()}>
              <div className="stock-form__row">
                <label>
                  Preferred supplier
                  <select
                    className="stock-form__input"
                    value={preferredSupplierId}
                    onChange={(event) => setPreferredSupplierId(event.target.value)}
                  >
                    <option value="">No preference</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="stock-form__row">
                <button
                  type="button"
                  className="stock-button stock-button--primary stock-form__button"
                  onClick={handleSavePreference}
                >
                  Save preference
                </button>
              </div>
            </form>
            {catalogForProduct.length === 0 ? (
              <p>No supplier SKUs mapped yet.</p>
            ) : (
              <div className="stock-data-table" role="table" aria-label="Supplier SKUs">
                <div className="stock-data-table__header" role="row">
                  <span role="columnheader">Supplier</span>
                  <span role="columnheader">Supplier SKU</span>
                  <span role="columnheader">Pack label</span>
                </div>
                {catalogForProduct.map((item) => {
                  const supplierName =
                    suppliers.find((supplier) => supplier.id === item.supplierId)
                      ?.name ?? item.supplierId;
                  return (
                    <div key={item.id} className="stock-data-table__row" role="row">
                      <div role="cell" className="stock-data-table__cell">
                        <strong>{supplierName}</strong>
                      </div>
                      <div role="cell" className="stock-data-table__cell">
                        {item.supplierSku}
                      </div>
                      <div role="cell" className="stock-data-table__cell">
                        {item.supplierPackLabel ?? "—"}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <form className="stock-form" onSubmit={handleAddMapping}>
              <div className="stock-form__row">
                <label>
                  Supplier
                  <select
                    className="stock-form__input"
                    value={mappingDraft.supplierId}
                    onChange={(event) =>
                      setMappingDraft((prev) => ({
                        ...prev,
                        supplierId: event.target.value
                      }))
                    }
                    required
                  >
                    <option value="">Select supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Supplier SKU
                  <input
                    className="stock-form__input"
                    value={mappingDraft.supplierSku}
                    onChange={(event) =>
                      setMappingDraft((prev) => ({
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
                    value={mappingDraft.packLabel}
                    onChange={(event) =>
                      setMappingDraft((prev) => ({
                        ...prev,
                        packLabel: event.target.value
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
                  Add supplier SKU
                </button>
              </div>
            </form>
          </Section>
          <Section title="Supplier mapping (local)">
            {mappingForm.supplierId ? null : <p>No supplier info saved yet.</p>}
            <form className="stock-form" onSubmit={(event) => event.preventDefault()}>
              <div className="stock-form__row">
                <label>
                  Supplier
                  <select
                    className="stock-form__input"
                    value={mappingForm.supplierId}
                    onChange={(event) =>
                      setMappingForm((prev) => ({ ...prev, supplierId: event.target.value }))
                    }
                  >
                    <option value="">Select supplier</option>
                    {localSuppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Supplier SKU
                  <input
                    className="stock-form__input"
                    value={mappingForm.supplierSku}
                    onChange={(event) =>
                      setMappingForm((prev) => ({ ...prev, supplierSku: event.target.value }))
                    }
                  />
                </label>
              </div>
              <div className="stock-form__row">
                <label>
                  Pack size
                  <input
                    className="stock-form__input"
                    value={mappingForm.packSize}
                    onChange={(event) =>
                      setMappingForm((prev) => ({ ...prev, packSize: event.target.value }))
                    }
                  />
                </label>
                <label>
                  Notes
                  <input
                    className="stock-form__input"
                    value={mappingForm.notes}
                    onChange={(event) =>
                      setMappingForm((prev) => ({ ...prev, notes: event.target.value }))
                    }
                  />
                </label>
              </div>
              <PrimaryActions>
                <button type="button" className="stock-button stock-button--primary" onClick={handleSaveLocalMapping}>
                  Save supplier info
                </button>
                <button type="button" className="stock-button stock-button--secondary" onClick={handleClearLocalMapping}>
                  Clear
                </button>
              </PrimaryActions>
            </form>
          </Section>

          <Section title="Batch lots">
            {lots.length ? (
              <div className="stock-lot-list">
                {lots.map((lot) => (
                  <div key={lot.id} className="stock-lot-list__item">
                    <KeyValueGrid>
                      <FieldRow label="Batch" value={lot.batchNumber} />
                      <FieldRow label="Expiry" value={lot.expiryDate} />
                      <FieldRow
                        label="Status"
                        value={formatExpiryStatus(lot.expiryDate)}
                      />
                      <FieldRow label="Notes" value={lot.notes ?? ""} />
                    </KeyValueGrid>
                  </div>
                ))}
              </div>
            ) : (
              <p>No batch lots have been recorded yet.</p>
            )}
          </Section>
        </>
      )}
    </PageShell>
  );
}
