"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchScan } from "../../lib/ops-api";
import { ScanResponseSchema } from "@champagne/stock-shared";
import EventActionPanel from "../../components/EventActionPanel";

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

  const renderDetail = (label: string, value: string | number | null) => {
    if (value === null || value === undefined || value === "") {
      return null;
    }
    return (
      <div style={{ display: "flex", gap: "8px" }}>
        <dt style={{ minWidth: "140px", fontWeight: 600 }}>{label}</dt>
        <dd style={{ margin: 0 }}>{value}</dd>
      </div>
    );
  };

  return (
    <section>
      <header style={{ marginBottom: "16px" }}>
        <p style={{ margin: 0, fontSize: "14px", textTransform: "uppercase" }}>
          Item
        </p>
        <h1 style={{ margin: "4px 0" }}>{code}</h1>
        <p style={{ margin: 0 }}>Resolved target: {targetType}</p>
        {loading ? <p>Loading item...</p> : null}
        {refreshing ? <p>Refreshing...</p> : null}
      </header>
      <div style={{ display: "grid", gap: "16px" }}>
        <div
          style={{
            border: "1px solid currentColor",
            borderRadius: "12px",
            padding: "16px"
          }}
        >
          <h2 style={{ marginTop: 0 }}>Primary details</h2>
          {errorMessage ? <p>{errorMessage}</p> : null}
          {scanData && scanData.result === "UNMATCHED" ? (
            <p>No match found for this code.</p>
          ) : null}
          {showDetails ? (
            <dl style={{ margin: 0, display: "grid", gap: "8px" }}>
              {scanData?.result === "LOCATION"
                ? [
                    renderDetail("Location", scanData.name),
                    renderDetail("Type", scanData.locationType),
                    renderDetail("Products", scanData.products.length)
                  ]
                : null}
              {scanData?.result === "STOCK_INSTANCE"
                ? [
                    renderDetail("Product", scanData.product.name),
                    renderDetail("Variant", scanData.product.variant),
                    renderDetail("Stock class", scanData.product.stockClass),
                    renderDetail("Location", scanData.location?.name ?? null),
                    renderDetail("Batch", scanData.stockInstance.batchNumber),
                    renderDetail(
                      "Expiry",
                      scanData.stockInstance.expiryDate
                    ),
                    renderDetail(
                      "Qty remaining",
                      scanData.stockInstance.qtyRemaining
                    ),
                    renderDetail(
                      "Qty received",
                      scanData.stockInstance.qtyReceived
                    ),
                    renderDetail("Status", scanData.stockInstance.status)
                  ]
                : null}
              {scanData?.result === "PRODUCT_WITHDRAW"
                ? [
                    renderDetail("Product", scanData.product.name),
                    renderDetail("Variant", scanData.product.variant),
                    renderDetail("Stock class", scanData.product.stockClass),
                    renderDetail("Unit", scanData.product.unitLabel),
                    renderDetail("Pack size", scanData.product.packSizeUnits),
                    renderDetail(
                      "Default withdraw",
                      scanData.product.defaultWithdrawUnits
                    ),
                    renderDetail(
                      "Min level",
                      scanData.product.minLevelUnits
                    ),
                    renderDetail(
                      "Max level",
                      scanData.product.maxLevelUnits
                    ),
                    renderDetail("Supplier", scanData.product.supplierHint)
                  ]
                : null}
            </dl>
          ) : null}
        </div>
        {actionTarget ? (
          <div
            style={{
              border: "1px solid currentColor",
              borderRadius: "12px",
              padding: "16px"
            }}
          >
            <h2 style={{ marginTop: 0 }}>Actions</h2>
            <EventActionPanel
              productId={actionTarget.productId}
              stockInstanceId={actionTarget.stockInstanceId}
              locationId={actionTarget.locationId ?? null}
              onEventSuccess={() => {
                void loadItem({ refresh: true });
              }}
            />
          </div>
        ) : null}
        {scanData ? (
          <details
            style={{
              border: "1px solid currentColor",
              borderRadius: "12px",
              padding: "16px"
            }}
          >
            <summary style={{ cursor: "pointer" }}>
              Debug scan response
            </summary>
            <pre style={{ marginTop: "12px" }}>
              {JSON.stringify(scanData, null, 2)}
            </pre>
          </details>
        ) : null}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px"
          }}
        >
          <Link
            href="/scan"
            style={{
              display: "inline-block",
              padding: "12px 18px",
              borderRadius: "10px",
              border: "1px solid currentColor",
              textDecoration: "none",
              fontWeight: 600
            }}
          >
            Scan another
          </Link>
          <Link
            href="/reorder"
            style={{
              display: "inline-block",
              padding: "12px 18px",
              borderRadius: "10px",
              border: "1px solid currentColor",
              textDecoration: "none",
              fontWeight: 600
            }}
          >
            Reorder
          </Link>
        </div>
      </div>
    </section>
  );
}
