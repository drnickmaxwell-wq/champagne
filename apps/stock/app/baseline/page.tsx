"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import ScanForm from "../scan/ScanForm";
import Scanner from "../scan/Scanner";
import {
  loadLocalBarcodeRegistry,
  saveLocalBarcodeRegistry
} from "../scan/localRegistry";
import type { LocalBarcodeRegistry, LocalProduct } from "../scan/localRegistry";
import FeedbackCard from "../components/ui/FeedbackCard";
import { FieldRow } from "../components/ui/FieldList";
import LoadingLine from "../components/ui/LoadingLine";
import MessagePanel from "../components/ui/MessagePanel";
import PageShell from "../components/ui/PageShell";
import { ActionLink, PrimaryActions } from "../components/ui/PrimaryActions";
import Card from "../components/ui/Card";
import { KeyValueGrid, ScreenHeader, Section } from "../components/ui/ScreenKit";
import {
  loadBaselineEntries,
  upsertBaselineEntry
} from "./localBaseline";

const generateLocalId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `baseline-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
};

type PendingProduct = {
  id: string;
  name: string;
  barcode: string;
  countedUnits: number;
};

export default function BaselinePage() {
  const [registry, setRegistry] = useState<LocalBarcodeRegistry>(() =>
    loadLocalBarcodeRegistry()
  );
  const [activeLocationId, setActiveLocationId] = useState<string | null>(null);
  const [activeLocationName, setActiveLocationName] = useState<string | null>(
    null
  );
  const [cameraOpen, setCameraOpen] = useState(false);
  const [scanCode, setScanCode] = useState("");
  const [manualFocus, setManualFocus] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<PendingProduct | null>(
    null
  );
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRegistry(loadLocalBarcodeRegistry());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    if (mediaQuery.matches) {
      setCameraOpen(true);
    }
  }, []);

  const activeLocationLabel = useMemo(() => {
    if (!activeLocationId) {
      return "None";
    }
    return activeLocationName ?? activeLocationId;
  }, [activeLocationId, activeLocationName]);

  const resolveProduct = useCallback(
    (barcode: string) => {
      const binding = registry.bindings.find(
        (entry) => entry.barcode === barcode
      );
      if (!binding) {
        return null;
      }
      return (
        registry.products.find((product) => product.id === binding.productId) ??
        null
      );
    },
    [registry]
  );

  const handleLocationScan = useCallback((barcode: string) => {
    setActiveLocationId(barcode);
    setActiveLocationName(barcode);
    setPendingProduct(null);
    setMessage(`Location set to ${barcode}.`);
  }, []);

  const handleProductScan = useCallback(
    (product: LocalProduct, barcode: string) => {
      if (!activeLocationId) {
        setPendingProduct(null);
        setMessage("Scan a location first");
        return;
      }
      setActiveLocationName((prevName) => {
        if (prevName && prevName !== activeLocationId) {
          return prevName;
        }
        return prevName ?? activeLocationId;
      });
      const existingEntry = loadBaselineEntries().find(
        (entry) =>
          entry.locationId === activeLocationId &&
          entry.productId === product.id
      );
      setPendingProduct({
        id: product.id,
        name: product.name,
        barcode,
        countedUnits: existingEntry?.countedUnits ?? 1
      });
      setMessage("");
    },
    [activeLocationId]
  );

  const handleScanCode = useCallback(
    (code: string) => {
      const normalized = code.trim().toUpperCase();
      if (!normalized) {
        return;
      }
      setLoading(true);
      setScanCode(normalized);
      setManualFocus(false);
      const product = resolveProduct(normalized);
      if (product) {
        handleProductScan(product, normalized);
        setLoading(false);
        return;
      }
      handleLocationScan(normalized);
      setLoading(false);
    },
    [handleLocationScan, handleProductScan, resolveProduct]
  );

  const handleDetected = useCallback(
    (code: string) => {
      setCameraOpen(false);
      handleScanCode(code);
    },
    [handleScanCode]
  );

  const handleStop = useCallback(() => {
    setCameraOpen(false);
  }, []);

  const handleCameraUnavailable = useCallback(() => {
    setCameraOpen(false);
    setManualFocus(true);
  }, []);

  const handleSaveCount = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!pendingProduct || !activeLocationId) {
      return;
    }
    const now = new Date().toISOString();
    const updatedRegistry = loadLocalBarcodeRegistry();
    const matchedProduct = updatedRegistry.products.find(
      (product) => product.id === pendingProduct.id
    );
    if (matchedProduct && matchedProduct.barcode !== pendingProduct.barcode) {
      const nextProducts = updatedRegistry.products.map((product) =>
        product.id === matchedProduct.id
          ? { ...product, barcode: pendingProduct.barcode }
          : product
      );
      const nextBindings = updatedRegistry.bindings.filter(
        (binding) => binding.productId !== matchedProduct.id
      );
      nextBindings.push({
        barcode: pendingProduct.barcode,
        productId: matchedProduct.id,
        createdAt: now
      });
      const nextRegistry: LocalBarcodeRegistry = {
        version: 1,
        products: nextProducts,
        bindings: nextBindings
      };
      saveLocalBarcodeRegistry(nextRegistry);
      setRegistry(nextRegistry);
    }
    const existingEntry = loadBaselineEntries().find(
      (entry) =>
        entry.locationId === activeLocationId &&
        entry.productId === pendingProduct.id
    );
    const entryId = existingEntry?.id ?? generateLocalId();
    upsertBaselineEntry({
      id: entryId,
      locationId: activeLocationId,
      locationName: activeLocationName ?? undefined,
      productId: pendingProduct.id,
      productName: pendingProduct.name,
      barcode: pendingProduct.barcode,
      countedUnits: pendingProduct.countedUnits,
      updatedAt: now
    });
    setMessage(`Saved ${pendingProduct.countedUnits} for ${pendingProduct.name}.`);
    setPendingProduct(null);
  };

  return (
    <PageShell>
      <ScreenHeader
        eyebrow="Stock"
        title="Baseline count"
        subtitle="Scan each location, then count every product inside that location."
        status={loading ? <LoadingLine label="Working" /> : undefined}
        actions={
          <PrimaryActions>
            <ActionLink href="/scan">Scan</ActionLink>
            <ActionLink href="/products">Products</ActionLink>
            <ActionLink href="/locations">Locations</ActionLink>
            <ActionLink href="/reorder">Reorder</ActionLink>
          </PrimaryActions>
        }
      />

      <MessagePanel title="Baseline Mode">
        Baseline mode records the starting count for each product in a location.
        <div className="stock-helper">
          Scan a location label to set the active location, then scan products.
        </div>
      </MessagePanel>
      <PrimaryActions>
        <ActionLink href="/scan">Exit baseline</ActionLink>
      </PrimaryActions>

      <Section title="Active location">
        <KeyValueGrid>
          <FieldRow label="Location" value={activeLocationLabel} />
        </KeyValueGrid>
        {activeLocationId ? (
          <PrimaryActions>
            <ActionLink href={`/baseline/${activeLocationId}`}>
              Review baseline for this location
            </ActionLink>
          </PrimaryActions>
        ) : null}
      </Section>

      {message ? (
        <MessagePanel title="Baseline status" role="status">
          {message}
        </MessagePanel>
      ) : null}

      <Section title="Camera scan">
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
      </Section>

      <Section title="Manual entry">
        <ScanForm
          defaultCode={scanCode}
          disabled={loading}
          autoFocus={manualFocus}
          onSubmitCode={handleScanCode}
        />
      </Section>

      {pendingProduct ? (
        <Section title="Count for this item">
          <Card>
            <KeyValueGrid>
              <FieldRow label="Product" value={pendingProduct.name} />
              <FieldRow label="Barcode" value={pendingProduct.barcode} />
            </KeyValueGrid>
            <form className="stock-form" onSubmit={handleSaveCount}>
              <div className="stock-form__row">
                <label className="stock-form__label" htmlFor="baseline-count">
                  Counted units
                </label>
                <input
                  id="baseline-count"
                  className="stock-form__input"
                  type="number"
                  min={0}
                  step={1}
                  value={pendingProduct.countedUnits}
                  onChange={(event) =>
                    setPendingProduct((prev) =>
                      prev
                        ? {
                            ...prev,
                            countedUnits: Number.isNaN(
                              event.target.valueAsNumber
                            )
                              ? prev.countedUnits
                              : Math.max(0, event.target.valueAsNumber)
                          }
                        : prev
                    )
                  }
                  required
                />
              </div>
              <PrimaryActions>
                <button
                  type="submit"
                  className="stock-button stock-button--primary"
                >
                  Save
                </button>
              </PrimaryActions>
            </form>
          </Card>
        </Section>
      ) : null}

      {!pendingProduct && !activeLocationId && scanCode ? (
        <FeedbackCard title="Missing location" message="Scan a location first." />
      ) : null}
    </PageShell>
  );
}
