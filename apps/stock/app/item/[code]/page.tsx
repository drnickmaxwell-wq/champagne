"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchScan } from "../../lib/ops-api";
import { ScanResponseSchema } from "@champagne/stock-shared";
import EventActionPanel from "../../components/EventActionPanel";
import Card from "../../components/ui/Card";
import DisclosureCard from "../../components/ui/DisclosureCard";
import FeedbackCard from "../../components/ui/FeedbackCard";
import { FieldList, FieldRow } from "../../components/ui/FieldList";
import PageShell from "../../components/ui/PageShell";
import { ActionLink, PrimaryActions } from "../../components/ui/PrimaryActions";
import StatusLine from "../../components/ui/StatusLine";

const resolveErrorMessage = (data: unknown) => {
  if (data && typeof data === "object") {
    const candidate = data as Record<string, unknown>;
    if (typeof candidate.message === "string") {
      return candidate.message;
    }
    if (typeof candidate.error === "string") {
      return candidate.error;
    }
  }
  return "Failed to fetch item.";
};

export default function Page() {
  const params = useParams();
  const codeParam = params?.code;
  const code =
    typeof codeParam === "string"
      ? codeParam
      : Array.isArray(codeParam)
        ? codeParam[0] ?? ""
        : "";
  const [scanResult, setScanResult] = useState<unknown>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastActionMessage, setLastActionMessage] = useState("");

  const loadItem = useCallback(async (options?: { refresh?: boolean }) => {
    if (code.length === 0) {
      return;
    }
    const isRefresh = options?.refresh ?? false;
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setErrorMessage("");
    const result = await fetchScan(code);
    setLoading(false);
    setRefreshing(false);
    if (!result.ok) {
      setErrorMessage(resolveErrorMessage(result.data));
      setScanResult(null);
      return;
    }
    const parsed = ScanResponseSchema.safeParse(result.data);
    if (!parsed.success) {
      setErrorMessage("Unexpected scan response.");
      setScanResult(null);
      return;
    }
    setScanResult(parsed.data);
  }, [code]);

  useEffect(() => {
    void loadItem();
  }, [loadItem]);

  const parsedScan = ScanResponseSchema.safeParse(scanResult);
  const scanData = parsedScan.success ? parsedScan.data : null;
  const actionTarget =
    scanData && scanData.result === "STOCK_INSTANCE"
      ? {
          productId: scanData.product.id,
          stockInstanceId: scanData.stockInstance.id,
          locationId: scanData.location?.id ?? null
        }
      : scanData && scanData.result === "PRODUCT_WITHDRAW"
        ? { productId: scanData.product.id }
        : null;
  const targetType = scanData
    ? scanData.result === "LOCATION"
      ? "Location"
      : scanData.result === "STOCK_INSTANCE"
        ? "Stock instance"
        : scanData.result === "PRODUCT_WITHDRAW"
          ? "Product withdraw"
          : scanData.result === "UNMATCHED"
            ? "Unmatched"
            : "Unknown"
    : "Unknown";
  const showDetails = scanData && scanData.result !== "UNMATCHED";

  const lastActionValue = lastActionMessage || "None yet";

  return (
    <PageShell
      eyebrow="Item"
      title={code}
      subtitle={`Resolved target: ${targetType}`}
      status={
        <StatusLine items={[{ label: "Last action", value: lastActionValue }]} />
      }
    >
      {loading ? (
        <FeedbackCard title="Loading" role="status" message="Loading item..." />
      ) : null}
      {refreshing ? (
        <FeedbackCard title="Refreshing" role="status" message="Refreshing..." />
      ) : null}
      {errorMessage ? (
        <FeedbackCard title="Error" role="alert" message={errorMessage} />
      ) : null}
      <Card title="Primary details">
        {scanData && scanData.result === "UNMATCHED" ? (
          <p>No match found for this code.</p>
        ) : null}
        {showDetails ? (
          <FieldList>
            {scanData?.result === "LOCATION" ? (
              <>
                <FieldRow label="Location" value={scanData.name} />
                <FieldRow label="Type" value={scanData.locationType} />
                <FieldRow label="Products" value={scanData.products.length} />
              </>
            ) : null}
            {scanData?.result === "STOCK_INSTANCE" ? (
              <>
                <FieldRow label="Product" value={scanData.product.name} />
                <FieldRow label="Variant" value={scanData.product.variant} />
                <FieldRow
                  label="Stock class"
                  value={scanData.product.stockClass}
                />
                <FieldRow
                  label="Location"
                  value={scanData.location?.name ?? null}
                />
                <FieldRow
                  label="Batch"
                  value={scanData.stockInstance.batchNumber}
                />
                <FieldRow label="Expiry" value={scanData.stockInstance.expiryDate} />
                <FieldRow
                  label="Qty remaining"
                  value={scanData.stockInstance.qtyRemaining}
                />
                <FieldRow
                  label="Qty received"
                  value={scanData.stockInstance.qtyReceived}
                />
                <FieldRow
                  label="Status"
                  value={scanData.stockInstance.status}
                />
              </>
            ) : null}
            {scanData?.result === "PRODUCT_WITHDRAW" ? (
              <>
                <FieldRow label="Product" value={scanData.product.name} />
                <FieldRow label="Variant" value={scanData.product.variant} />
                <FieldRow
                  label="Stock class"
                  value={scanData.product.stockClass}
                />
                <FieldRow label="Unit" value={scanData.product.unitLabel} />
                <FieldRow
                  label="Pack size"
                  value={scanData.product.packSizeUnits}
                />
                <FieldRow
                  label="Default withdraw"
                  value={scanData.product.defaultWithdrawUnits}
                />
                <FieldRow
                  label="Min level"
                  value={scanData.product.minLevelUnits}
                />
                <FieldRow
                  label="Max level"
                  value={scanData.product.maxLevelUnits}
                />
                <FieldRow
                  label="Supplier"
                  value={scanData.product.supplierHint}
                />
              </>
            ) : null}
          </FieldList>
        ) : null}
      </Card>
      {actionTarget ? (
        <Card>
          <EventActionPanel
            productId={actionTarget.productId}
            stockInstanceId={actionTarget.stockInstanceId}
            locationId={actionTarget.locationId ?? null}
            onEventSuccess={() => {
              void loadItem({ refresh: true });
            }}
            onLastActionMessage={(message) => setLastActionMessage(message)}
          />
        </Card>
      ) : null}
      {scanData ? (
        <DisclosureCard summary="Debug scan response">
          <pre>{JSON.stringify(scanData, null, 2)}</pre>
        </DisclosureCard>
      ) : null}
      <PrimaryActions>
        <ActionLink href="/scan">Scan another</ActionLink>
        <ActionLink href="/reorder">Reorder</ActionLink>
      </PrimaryActions>
    </PageShell>
  );
}
