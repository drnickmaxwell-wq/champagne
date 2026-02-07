"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import ScanForm from "../scan/ScanForm";
import Scanner from "../scan/Scanner";
import { fetchLocations, fetchScan } from "../lib/ops-api";
import { LocationSchema, ScanResponseSchema } from "@champagne/stock-shared";
import type { Location, ScanResponse } from "@champagne/stock-shared";
import FeedbackCard from "../components/ui/FeedbackCard";
import { FieldRow } from "../components/ui/FieldList";
import LoadingLine from "../components/ui/LoadingLine";
import PageShell from "../components/ui/PageShell";
import { ActionLink, PrimaryActions } from "../components/ui/PrimaryActions";
import Card from "../components/ui/Card";
import {
  ActionSection,
  DebugDisclosure,
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
  return "Failed to load baseline data.";
};

const formatProduct = (name: string, variant?: string | null) => {
  const cleanVariant = variant?.trim() ?? "";
  return cleanVariant.length ? `${name} (${cleanVariant})` : name;
};

export default function BaselinePage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [activeLocationId, setActiveLocationId] = useState<string | null>(null);
  const [completedLocationIds, setCompletedLocationIds] = useState<string[]>([]);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [scanCode, setScanCode] = useState("");
  const [scanResult, setScanResult] = useState<ScanResponse | null>(null);
  const [scanError, setScanError] = useState("");
  const [manualFocus, setManualFocus] = useState(false);
  const [recordedMessage, setRecordedMessage] = useState("");

  const activeLocation = useMemo(() => {
    return locations.find((location) => location.id === activeLocationId) ?? null;
  }, [locations, activeLocationId]);

  const remainingLocations = useMemo(() => {
    return locations.filter((location) => !completedLocationIds.includes(location.id));
  }, [locations, completedLocationIds]);

  const currentStep = activeLocationId ? 2 : 1;

  const loadLocations = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");
    const result = await fetchLocations();
    setLoading(false);

    if (!result.ok) {
      setErrorMessage(resolveErrorMessage(result.data));
      return;
    }

    const parsed = LocationSchema.array().safeParse(result.data);
    if (!parsed.success) {
      setErrorMessage("Unexpected locations response.");
      return;
    }

    setLocations(parsed.data);
  }, []);

  useEffect(() => {
    void loadLocations();
  }, [loadLocations]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    if (mediaQuery.matches) {
      setCameraOpen(true);
    }
  }, []);

  const loadScan = useCallback(async (code: string) => {
    setScanError("");
    setRecordedMessage("");
    const result = await fetchScan(code);
    if (!result.ok) {
      setScanError(resolveErrorMessage(result.data));
      setScanResult(null);
      return;
    }

    const parsed = ScanResponseSchema.safeParse(result.data);
    if (!parsed.success) {
      setScanError("Unexpected scan response.");
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

  const handleConfirmLocation = () => {
    if (!selectedLocationId) {
      return;
    }
    setActiveLocationId(selectedLocationId);
    setScanResult(null);
    setScanCode("");
    setRecordedMessage("");
    setScanError("");
  };

  const handleFinishLocation = () => {
    if (!activeLocationId) {
      return;
    }
    setCompletedLocationIds((prev) => {
      if (prev.includes(activeLocationId)) {
        return prev;
      }
      return [...prev, activeLocationId];
    });
    setActiveLocationId(null);
    setSelectedLocationId(null);
    setScanResult(null);
    setScanCode("");
    setRecordedMessage("");
    setScanError("");
  };

  const handleNextItem = () => {
    setScanResult(null);
    setScanCode("");
    setRecordedMessage("");
    setScanError("");
  };

  const isUnmatched = scanResult?.result === "UNMATCHED";
  const actionTarget =
    scanResult && scanResult.result === "STOCK_INSTANCE"
      ? {
          productId: scanResult.product.id,
          stockInstanceId: scanResult.stockInstance.id
        }
      : scanResult && scanResult.result === "PRODUCT_WITHDRAW"
        ? { productId: scanResult.product.id }
        : null;

  return (
    <PageShell>
      <ScreenHeader
        eyebrow="Stock"
        title="Baseline setup (one-time)"
        subtitle="Complete this once to record what exists right now before you start tracking ongoing movement."
        status={loading ? <LoadingLine label="Loading" /> : undefined}
        actions={
          <PrimaryActions>
            <ActionLink href="/scan">Scan</ActionLink>
            <ActionLink href="/products">Products</ActionLink>
            <ActionLink href="/locations">Locations</ActionLink>
            <ActionLink href="/reorder">Reorder</ActionLink>
          </PrimaryActions>
        }
      />

      <div className="stock-progress" aria-label="Baseline steps">
        <div
          className={`stock-progress__step${currentStep === 1 ? " stock-progress__step--active" : ""}`}
        >
          Step 1: Select location
        </div>
        <div
          className={`stock-progress__step${currentStep === 2 ? " stock-progress__step--active" : ""}`}
        >
          Step 2: Add stock
        </div>
        <div className="stock-progress__step">Step 3: Finish location</div>
      </div>

      {errorMessage ? (
        <FeedbackCard title="Error" role="alert" message={errorMessage} />
      ) : null}

      {!activeLocationId ? (
        <Section title="Step 1: Select a location">
          {locations.length === 0 && !loading ? (
            <FeedbackCard
              title="No locations yet"
              message="Create a location first, then return to baseline setup."
            />
          ) : null}
          <div className="stock-location-grid">
            {locations.map((location) => {
              const isSelected = location.id === selectedLocationId;
              const isCompleted = completedLocationIds.includes(location.id);
              return (
                <button
                  key={location.id}
                  type="button"
                  className={`stock-location-tile${isSelected ? " stock-location-tile--active" : ""}`}
                  onClick={() => setSelectedLocationId(location.id)}
                >
                  <div className="stock-location-tile__title">{location.name}</div>
                  <div className="stock-location-tile__meta">
                    {location.type}
                  </div>
                  {isCompleted ? (
                    <div className="stock-location-tile__status">Completed</div>
                  ) : null}
                </button>
              );
            })}
          </div>
          <PrimaryActions>
            <button
              type="button"
              className="stock-button stock-button--primary"
              onClick={handleConfirmLocation}
              disabled={!selectedLocationId}
            >
              Confirm location
            </button>
          </PrimaryActions>
        </Section>
      ) : null}

      {activeLocation ? (
        <>
          <Section title="Step 2: Add stock">
            <p className="stock-status">
              Recording stock for <strong>{activeLocation.name}</strong>. Scan or
              enter items and use Receive to record what exists now.
            </p>
            {scanError ? (
              <FeedbackCard title="Scan error" message={scanError} />
            ) : null}
            {recordedMessage ? (
              <FeedbackCard title="Recorded" message={recordedMessage} />
            ) : null}
            {isUnmatched ? (
              <FeedbackCard
                title="No match"
                message="No match found for this code. Try another item."
              />
            ) : null}
            <Card title="Camera scan">
              {cameraOpen ? (
                <>
                  <Scanner
                    onDetected={handleDetected}
                    onStop={handleStop}
                    onUnavailable={handleCameraUnavailable}
                  />
                  <PrimaryActions>
                    <button type="button" onClick={() => setCameraOpen(false)}>
                      Stop camera
                    </button>
                  </PrimaryActions>
                </>
              ) : (
                <PrimaryActions>
                  <button type="button" onClick={() => setCameraOpen(true)}>
                    Use camera
                  </button>
                </PrimaryActions>
              )}
            </Card>
            <Card title="Manual entry">
              <ScanForm
                defaultCode={scanCode}
                disabled={!activeLocationId}
                autoFocus={manualFocus}
                onSubmitCode={(code) => {
                  setScanCode(code);
                  void loadScan(code);
                }}
              />
            </Card>
            {scanResult && scanResult.result !== "UNMATCHED" ? (
              <Card title="Match summary">
                <KeyValueGrid>
                  {scanResult.result === "LOCATION" ? (
                    <FieldRow label="Location" value={scanResult.name} />
                  ) : null}
                  {scanResult.result === "STOCK_INSTANCE" ? (
                    <>
                      <FieldRow
                        label="Product"
                        value={formatProduct(
                          scanResult.product.name,
                          scanResult.product.variant
                        )}
                      />
                      <FieldRow label="Batch" value={scanResult.stockInstance.batchNumber} />
                      {scanResult.stockInstance.expiryDate ? (
                        <FieldRow
                          label="Expiry"
                          value={scanResult.stockInstance.expiryDate}
                        />
                      ) : null}
                    </>
                  ) : null}
                  {scanResult.result === "PRODUCT_WITHDRAW" ? (
                    <FieldRow
                      label="Product"
                      value={formatProduct(
                        scanResult.product.name,
                        scanResult.product.variant
                      )}
                    />
                  ) : null}
                </KeyValueGrid>
              </Card>
            ) : null}
            {actionTarget ? (
              <ActionSection
                productId={actionTarget.productId}
                stockInstanceId={actionTarget.stockInstanceId}
                locationId={activeLocationId}
                locationName={activeLocation.name}
                onEventSuccess={() => {
                  setRecordedMessage("Recorded. Add the next item.");
                }}
              />
            ) : null}
            {recordedMessage ? (
              <PrimaryActions>
                <button
                  type="button"
                  className="stock-button stock-button--secondary"
                  onClick={handleNextItem}
                >
                  Add next item
                </button>
              </PrimaryActions>
            ) : null}
            {scanResult ? (
              <DebugDisclosure summary="Technical details (for troubleshooting only)">
                <pre>{JSON.stringify(scanResult, null, 2)}</pre>
              </DebugDisclosure>
            ) : null}
          </Section>

          <Section title="Step 3: Finish location">
            <p className="stock-status">
              When you have recorded everything for this location, mark it as finished.
            </p>
            <PrimaryActions>
              <button
                type="button"
                className="stock-button stock-button--primary"
                onClick={handleFinishLocation}
              >
                Finished this location
              </button>
            </PrimaryActions>
          </Section>
        </>
      ) : null}

      <Section title="Completion">
        <div className="stock-completion-grid">
          <div className="stock-completion-card">
            <div className="stock-completion-card__label">Completed</div>
            <div className="stock-completion-card__value">
              {completedLocationIds.length}
            </div>
          </div>
          <div className="stock-completion-card">
            <div className="stock-completion-card__label">Remaining</div>
            <div className="stock-completion-card__value">
              {remainingLocations.length}
            </div>
          </div>
        </div>
        {remainingLocations.length > 0 ? (
          <ul className="stock-list">
            {remainingLocations.map((location) => (
              <li key={location.id}>{location.name}</li>
            ))}
          </ul>
        ) : (
          <FeedbackCard
            title="All locations complete"
            message="Baseline setup is finished. You can now manage reorders."
          />
        )}
        <PrimaryActions>
          <ActionLink href="/reorder">Go to reorder</ActionLink>
        </PrimaryActions>
      </Section>
    </PageShell>
  );
}
