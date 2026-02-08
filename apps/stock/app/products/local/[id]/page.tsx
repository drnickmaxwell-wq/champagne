"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { LocalProduct } from "../../../scan/localRegistry";
import { loadLocalBarcodeRegistry } from "../../../scan/localRegistry";
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
              <ActionLink href="/scan">Scan another</ActionLink>
              <ActionLink href="/products">Products</ActionLink>
            </PrimaryActions>
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
