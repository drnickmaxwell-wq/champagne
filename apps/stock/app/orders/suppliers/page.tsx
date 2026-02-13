"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PageShell from "../../components/ui/PageShell";
import FeedbackCard from "../../components/ui/FeedbackCard";
import Card from "../../components/ui/Card";
import { PrimaryActions } from "../../components/ui/PrimaryActions";
import { ScreenHeader, Section } from "../../components/ui/ScreenKit";
import { loadOrderBasket } from "../../lib/localStores/orderBasket";
import { loadLocalSuppliers } from "../../lib/localStores/suppliers";
import { loadProductSupplierMap } from "../../lib/localStores/productSupplierMap";
import { loadLocalBarcodeRegistry } from "../../scan/localRegistry";
import {
  buildSupplierOrderBlocks,
  buildSupplierOrderFilename,
  buildSupplierOrderText
} from "./orderExport";

export default function SupplierOrdersPage() {
  const [copiedSupplierId, setCopiedSupplierId] = useState<string | null>(null);
  const [copyError, setCopyError] = useState<string>("");
  const [printMode, setPrintMode] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    const onStorage = () => setRefreshTick((tick) => tick + 1);
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const supplierBlocks = useMemo(() => {
    const basket = loadOrderBasket();
    const suppliers = loadLocalSuppliers();
    const mappings = loadProductSupplierMap();
    const { products } = loadLocalBarcodeRegistry();
    return buildSupplierOrderBlocks({ basket, suppliers, mappings, products });
  }, [refreshTick]);

  const handleCopy = async (supplierId: string, text: string) => {
    setCopyError("");
    setCopiedSupplierId(null);
    if (!navigator.clipboard?.writeText) {
      setCopyError("Clipboard is unavailable on this device. Please copy from the text box manually.");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSupplierId(supplierId);
    } catch {
      setCopyError("Could not copy to clipboard. Please copy from the text box manually.");
    }
  };

  const handleDownload = (supplierNameOrId: string, text: string) => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const anchor = window.document.createElement("a");
    anchor.href = url;
    anchor.download = buildSupplierOrderFilename(supplierNameOrId);
    window.document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    setPrintMode(true);
    window.setTimeout(() => {
      const reset = () => {
        setPrintMode(false);
        window.removeEventListener("afterprint", reset);
      };
      window.addEventListener("afterprint", reset, { once: true });
      window.print();
      window.setTimeout(reset, 1000);
    }, 0);
  };

  return (
    <PageShell
      header={
        <ScreenHeader
          eyebrow="Stock"
          title="Supplier orders (copy/email)"
          subtitle="Copy, download or print supplier-ready order text with no prices."
        />
      }
    >
      {printMode ? (
        <FeedbackCard title="Print mode" message="Preparing supplier order printout..." />
      ) : null}
      {copyError ? <FeedbackCard title="Copy" role="alert" message={copyError} /> : null}

      <Section title="Supplier order messages">
        {supplierBlocks.length === 0 ? (
          <FeedbackCard
            title="No supplier orders yet"
            message="Add items to the order basket from Orders to generate supplier messages."
          />
        ) : null}

        <div className="stock-grid">
          {supplierBlocks.map((block) => {
            const orderText = buildSupplierOrderText(block);
            return (
              <Card key={block.supplierId} title={block.supplierName} className="stock-card--primary">
                <p>
                  <strong>Ordering email:</strong> {block.orderingEmail?.trim() || "Not recorded"}
                </p>
                <p>
                  <strong>Cut-off notes:</strong> {block.cutoffNotes?.trim() || "None"}
                </p>
                <textarea
                  className="stock-form__input"
                  value={orderText}
                  readOnly
                  rows={Math.max(10, block.lines.length + 7)}
                  aria-label={`Order message for ${block.supplierName}`}
                />
                <PrimaryActions>
                  <button
                    type="button"
                    className="stock-button stock-button--primary"
                    onClick={() => void handleCopy(block.supplierId, orderText)}
                  >
                    Copy order text
                  </button>
                  <button
                    type="button"
                    className="stock-button stock-button--secondary"
                    onClick={() => handleDownload(block.supplierName || block.supplierId, orderText)}
                  >
                    Download .txt
                  </button>
                  <button
                    type="button"
                    className="stock-button stock-button--secondary"
                    onClick={handlePrint}
                  >
                    Print
                  </button>
                  {copiedSupplierId === block.supplierId ? <span>Copied</span> : null}
                </PrimaryActions>
              </Card>
            );
          })}
        </div>
      </Section>

      <PrimaryActions>
        <Link href="/orders/basket" className="stock-action-link stock-action-link--secondary">
          Basket review
        </Link>
        <Link href="/reorder" className="stock-action-link stock-action-link--secondary">
          Back to Orders
        </Link>
        <Link href="/home" className="stock-action-link stock-action-link--secondary">
          Back to home
        </Link>
      </PrimaryActions>
    </PageShell>
  );
}
