"use client";

import { useCallback, useEffect, useState } from "react";
import ScanForm from "./ScanForm";
import Scanner from "./Scanner";
import { fetchHealth, fetchScan } from "../lib/ops-api";
import { ScanResponseSchema } from "@champagne/stock-shared";
import FeedbackCard from "../components/ui/FeedbackCard";
import { FieldRow } from "../components/ui/FieldList";
import LoadingLine from "../components/ui/LoadingLine";
import StockPageTemplate from "../components/StockPageTemplate";
import { ActionLink, PrimaryActions } from "../components/ui/PrimaryActions";
import StatusLine from "../components/ui/StatusLine";
import {
  ActionSection,
  KeyValueGrid,
  ScreenHeader,
  Section
} from "../components/ui/ScreenKit";

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
  const [lastActionMessage, setLastActionMessage] = useState("");
  const [opsUnreachable, setOpsUnreachable] = useState(false);
  const [manualFocus, setManualFocus] = useState(false);
  const [opsStatus, setOpsStatus] = useState<"ok" | "offline" | "unknown">(
    "unknown"
  );

  const checkOpsStatus = useCallback(async () => {
    const result = await fetchHealth();
    setOpsUnreachable(result.status === 0);
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
    setOpsUnreachable(false);
    const result = await fetchScan(code);
    setLoading(false);
    if (!result.ok) {
      if (result.status === 0) {
        setOpsUnreachable(true);
      }
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
      const normalized = code.trim().toUpperCase();
      setCameraOpen(false);
      setScanCode(normalized);
      setManualFocus(false);
      void loadScan(normalized);
    },
    [loadScan]
  );

  const handleStop = useCallback(() => {
    setCameraOpen(false);
  }, []);

  const handleCameraUnavailable = useCallback(() => {
    setCameraOpen(false);
    setManualFocus(true);
  }, []);

  const parsedScan = ScanResponseSchema.safeParse(scanResult);
  const scanData = parsedScan.success ? parsedScan.data : null;
  const formatProduct = (name: string, variant?: string | null) => {
    const cleanVariant = variant?.trim() ?? "";
    return cleanVariant.length ? `${name} (${cleanVariant})` : name;
  };
  const productTitle =
    scanData &&
    (scanData.result === "STOCK_INSTANCE" ||
      scanData.result === "PRODUCT_WITHDRAW")
      ? formatProduct(scanData.product.name, scanData.product.variant)
      : null;
  const scanTitle =
    scanData?.result === "LOCATION"
      ? scanData.name
      : scanData?.result === "UNMATCHED"
        ? "Unknown code"
        : productTitle;
  const scanSubtitle =
    scanData?.result === "LOCATION"
      ? "Stock location"
      : scanData?.result === "STOCK_INSTANCE"
        ? "Stock instance"
        : scanData?.result === "PRODUCT_WITHDRAW"
          ? "Product withdraw"
          : null;
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

  const opsLabel =
    opsStatus === "ok" ? "OK" : opsStatus === "offline" ? "Offline" : "Unknown";
  const lastActionValue = lastActionMessage || "None yet";
  const isUnmatched = scanData?.result === "UNMATCHED";
  const locationLabel =
    scanData && "location" in scanData
      ? scanData.location?.name ?? "Not set"
      : scanData?.result === "LOCATION"
        ? scanData.name
        : "Not set";

  useEffect(() => {
    if (isUnmatched) {
      setManualFocus(true);
    }
  }, [isUnmatched]);

  return (
    <StockPageTemplate
      header={
        <ScreenHeader
          title="Scan"
          status={
            <StatusLine
              items={[
                { label: "Ops", value: opsLabel },
                { label: "Last action", value: lastActionValue }
              ]}
            />
          }
          actions={
            <PrimaryActions>
              <button type="button" onClick={() => void checkOpsStatus()}>
                Retry ops
              </button>
            </PrimaryActions>
          }
        />
      }
    >
      <div className="stock-feedback-region" aria-live="polite">
        {loading ? <LoadingLine label="Working..." /> : null}
        {opsUnreachable ? (
          <FeedbackCard
            title="Ops API unreachable"
            role="alert"
            message="Unable to reach ops-api. Check network or service status."
          />
        ) : null}
        {errorMessage ? (
          <FeedbackCard title="Error" role="alert" message={errorMessage} />
        ) : null}
        {isUnmatched ? (
          <FeedbackCard
            title="Unknown code"
            message="We do not recognise this code yet. Try manual search below."
          />
        ) : null}
      </div>
      <Section title="Camera scan">
        {cameraOpen ? (
          <>
            <Scanner
              onDetected={handleDetected}
              onStop={handleStop}
              onUnavailable={handleCameraUnavailable}
            />
            <PrimaryActions>
              <button
                type="button"
                onClick={() => setCameraOpen(false)}
                className="stock-button stock-button--secondary"
              >
                Stop camera
              </button>
            </PrimaryActions>
          </>
        ) : (
          <PrimaryActions>
            <button
              type="button"
              onClick={() => setCameraOpen(true)}
              className="stock-button stock-button--primary"
            >
              Use camera
            </button>
          </PrimaryActions>
        )}
      </Section>
      <Section title="Manual entry">
        <ScanForm
          defaultCode={scanCode}
          disabled={loading}
          autoFocus={manualFocus}
          onSubmitCode={(code) => {
            setScanCode(code);
            void loadScan(code);
          }}
        />
      </Section>
      {scanData ? (
        <Section title="Scan result">
          <div className="stock-scan-result">
            {scanSubtitle ? (
              <p className="stock-scan-result__subtitle">{scanSubtitle}</p>
            ) : null}
            {scanTitle ? (
              <h3 className="stock-scan-result__title">{scanTitle}</h3>
            ) : null}
            {scanData.result === "LOCATION" ? (
              <KeyValueGrid>
                <FieldRow label="Products" value={scanData.products.length} />
              </KeyValueGrid>
            ) : null}
            {scanData.result === "STOCK_INSTANCE" ? (
              <KeyValueGrid>
                <FieldRow label="Location" value={locationLabel} />
                <FieldRow
                  label="Batch"
                  value={scanData.stockInstance.batchNumber}
                />
                {scanData.stockInstance.expiryDate ? (
                  <FieldRow
                    label="Expiry"
                    value={scanData.stockInstance.expiryDate}
                  />
                ) : null}
              </KeyValueGrid>
            ) : null}
            {scanData.result === "PRODUCT_WITHDRAW" ? (
              <KeyValueGrid>
                <FieldRow label="Location" value={locationLabel} />
                <FieldRow
                  label="Default withdraw"
                  value={`${scanData.product.defaultWithdrawUnits} ${scanData.product.unitLabel}`}
                />
              </KeyValueGrid>
            ) : null}
            {scanData.result === "UNMATCHED" ? (
              <p className="stock-scan-result__message">
                Unknown code. Use the manual search below to find the item.
              </p>
            ) : null}
            {scanData.result === "LOCATION" ? (
              <PrimaryActions>
                <button
                  type="button"
                  className="stock-button stock-button--primary"
                >
                  View items here
                </button>
              </PrimaryActions>
            ) : null}
          </div>
        </Section>
      ) : null}
      {actionTarget ? (
        <ActionSection
          key={`${actionTarget.productId ?? "none"}-${actionTarget.stockInstanceId ?? "none"}`}
          productId={actionTarget.productId}
          stockInstanceId={actionTarget.stockInstanceId}
          locationId={actionTarget.locationId ?? null}
          locationName={locationLabel}
          defaultQuantity={
            scanData?.result === "PRODUCT_WITHDRAW" ||
            scanData?.result === "STOCK_INSTANCE"
              ? scanData.product.defaultWithdrawUnits
              : undefined
          }
          allowedActions={["WITHDRAW"]}
          onEventSuccess={() => {
            if (scanCode.length > 0) {
              void loadScan(scanCode);
            }
          }}
          onLastActionMessage={(message) => setLastActionMessage(message)}
        />
      ) : null}
      {scanData?.result === "STOCK_INSTANCE" ? (
        <PrimaryActions>
          <button type="button" className="stock-button stock-button--secondary">
            Adjust
          </button>
        </PrimaryActions>
      ) : null}
      <PrimaryActions>
        <ActionLink href="/scan">Scan another</ActionLink>
        <ActionLink href="/baseline">Baseline (one-time)</ActionLink>
        <ActionLink href="/locations">Locations</ActionLink>
        <ActionLink href="/products">Products</ActionLink>
      </PrimaryActions>
    </StockPageTemplate>
  );
}
