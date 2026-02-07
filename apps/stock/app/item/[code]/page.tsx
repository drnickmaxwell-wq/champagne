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

  const loadItem = useCallback(async () => {
    if (code.length === 0) {
      return;
    }
    setLoading(true);
    setErrorMessage("");
    const result = await fetchScan(code);
    setLoading(false);
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

  return (
    <section>
      <h1>Item: {code}</h1>
      {loading ? <p>Loading item...</p> : null}
      {errorMessage ? <p>{errorMessage}</p> : null}
      {scanData ? <pre>{JSON.stringify(scanData, null, 2)}</pre> : null}
      {actionTarget ? (
        <EventActionPanel
          productId={actionTarget.productId}
          stockInstanceId={actionTarget.stockInstanceId}
          locationId={actionTarget.locationId ?? null}
          onEventSuccess={() => {
            void loadItem();
          }}
        />
      ) : null}
      <p>
        <Link href="/scan">Back to scan</Link>
      </p>
      <p>
        <Link href="/reorder">View reorder list</Link>
      </p>
    </section>
  );
}
