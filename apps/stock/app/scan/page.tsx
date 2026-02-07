"use client";

import { useCallback, useEffect, useState } from "react";
import ScanForm from "./ScanForm";
import Scanner from "./Scanner";
import { fetchHealth, fetchScan } from "../lib/ops-api";
import { ScanResponseSchema } from "@champagne/stock-shared";
import EventActionPanel from "../components/EventActionPanel";

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
  return "Failed to fetch scan result.";
};

export default function ScanPage() {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [scanCode, setScanCode] = useState("");
  const [scanResult, setScanResult] = useState<unknown>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [opsStatus, setOpsStatus] = useState<"ok" | "offline" | "unknown">(
    "unknown"
  );

  const checkOpsStatus = useCallback(async () => {
    const result = await fetchHealth();
    setOpsStatus(result.ok ? "ok" : "offline");
  }, []);

  useEffect(() => {
    void checkOpsStatus();
    if (typeof window === "undefined") {
      return;
    }
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    if (mediaQuery.matches) {
      setCameraOpen(true);
    }
  }, [checkOpsStatus]);

  const loadScan = useCallback(async (code: string) => {
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
  }, []);

  const handleDetected = useCallback(
    (code: string) => {
      setCameraOpen(false);
      setScanCode(code);
      void loadScan(code);
    },
    [loadScan]
  );

  const handleStop = useCallback(() => {
    setCameraOpen(false);
  }, []);

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
      <h1>Scan</h1>
      <div>
        <p>Ops: {opsStatus === "ok" ? "OK" : "Offline"}</p>
        <button type="button" onClick={() => void checkOpsStatus()}>
          Retry
        </button>
      </div>
      <div>
        <h2>Camera scan</h2>
        {cameraOpen ? (
          <>
            <Scanner onDetected={handleDetected} onStop={handleStop} />
            <button type="button" onClick={() => setCameraOpen(false)}>
              Stop camera
            </button>
          </>
        ) : (
          <button type="button" onClick={() => setCameraOpen(true)}>
            Use camera
          </button>
        )}
      </div>
      <div>
        <h2>Manual entry</h2>
        <ScanForm
          defaultCode={scanCode}
          onSubmitCode={(code) => {
            setScanCode(code);
            void loadScan(code);
          }}
        />
      </div>
      {loading ? <p>Loading scan result...</p> : null}
      {errorMessage ? <p>{errorMessage}</p> : null}
      {scanData ? (
        <div>
          <h2>Result</h2>
          <pre>{JSON.stringify(scanData, null, 2)}</pre>
        </div>
      ) : null}
      {actionTarget ? (
        <EventActionPanel
          productId={actionTarget.productId}
          stockInstanceId={actionTarget.stockInstanceId}
          locationId={actionTarget.locationId ?? null}
          onEventSuccess={() => {
            if (scanCode.length > 0) {
              void loadScan(scanCode);
            }
          }}
        />
      ) : null}
    </section>
  );
}
