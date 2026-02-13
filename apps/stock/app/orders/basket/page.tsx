"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PageShell from "../../components/ui/PageShell";
import Card from "../../components/ui/Card";
import FeedbackCard from "../../components/ui/FeedbackCard";
import { PrimaryActions } from "../../components/ui/PrimaryActions";
import { ScreenHeader, Section } from "../../components/ui/ScreenKit";
import {
  clearOrderBasket,
  loadOrderBasket,
  removeOrderBasketItem,
  upsertOrderBasketItem,
  type OrderBasketItem
} from "../../lib/localStores/orderBasket";
import { loadLocalSuppliers } from "../../lib/localStores/suppliers";
import { loadProductSupplierMap } from "../../lib/localStores/productSupplierMap";
import { loadLocalBarcodeRegistry } from "../../scan/localRegistry";

type BasketViewItem = OrderBasketItem & {
  productName: string;
  supplierSummary: string;
};

const parseQty = (value: string) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 0;
  }
  return parsed;
};

export default function BasketReviewPage() {
  const [basket, setBasket] = useState<OrderBasketItem[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    setBasket(loadOrderBasket());
  }, []);

  const basketItems = useMemo<BasketViewItem[]>(() => {
    const { products } = loadLocalBarcodeRegistry();
    const productById = new Map(products.map((product) => [product.id, product]));
    const supplierById = new Map(loadLocalSuppliers().map((supplier) => [supplier.id, supplier]));
    const mappings = loadProductSupplierMap();

    return basket.map((item) => {
      const product = productById.get(item.productId);
      const mapping = mappings[item.productId];
      const supplier = mapping?.supplierId ? supplierById.get(mapping.supplierId) : null;
      const supplierSummary = mapping?.supplierId
        ? [
            supplier?.name || mapping.supplierId,
            mapping.supplierSku ? `SKU ${mapping.supplierSku}` : null,
            mapping.packSize ? `Pack ${mapping.packSize}` : null
          ]
            .filter(Boolean)
            .join(" — ")
        : "No supplier mapping";

      return {
        ...item,
        productName: product?.name || item.productId,
        supplierSummary
      };
    });
  }, [basket]);

  const applyUpdate = (item: OrderBasketItem) => {
    const next = upsertOrderBasketItem(item);
    setBasket(next);
  };

  const handleQtyChange = (item: OrderBasketItem, qtyValue: string) => {
    applyUpdate({
      ...item,
      qty: parseQty(qtyValue)
    });
    setConfirmClear(false);
  };

  const handleNotesChange = (item: OrderBasketItem, notes: string) => {
    applyUpdate({
      ...item,
      notes
    });
    setConfirmClear(false);
  };

  const handleRemove = (productId: string) => {
    const next = removeOrderBasketItem(productId);
    setBasket(next);
    setConfirmClear(false);
    setStatusMessage("Basket item removed.");
  };

  const handleClearBasket = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setStatusMessage("Press Clear basket again to confirm.");
      return;
    }
    const next = clearOrderBasket();
    setBasket(next);
    setConfirmClear(false);
    setStatusMessage("Basket cleared.");
  };

  return (
    <PageShell
      header={
        <ScreenHeader
          eyebrow="Stock"
          title="Basket"
          subtitle="Review and edit supplier basket items stored locally on this device."
        />
      }
    >
      {statusMessage ? <FeedbackCard title="Status" role="status" message={statusMessage} /> : null}

      <Section title="Basket items">
        {basketItems.length === 0 ? (
          <FeedbackCard title="Basket empty" message="Add items from Orders before exporting supplier messages." />
        ) : null}

        <div className="stock-grid">
          {basketItems.map((item) => (
            <Card key={item.productId} title={item.productName} className="stock-card--primary">
              <p>
                <strong>Product ID:</strong> {item.productId}
              </p>
              <p>
                <strong>Supplier mapping:</strong> {item.supplierSummary}
              </p>

              <label className="stock-form__label" htmlFor={`qty-${item.productId}`}>
                Quantity
              </label>
              <input
                id={`qty-${item.productId}`}
                className="stock-form__input"
                type="number"
                min={0}
                value={item.qty}
                onChange={(event) => handleQtyChange(item, event.target.value)}
              />

              <label className="stock-form__label" htmlFor={`notes-${item.productId}`}>
                Notes
              </label>
              <textarea
                id={`notes-${item.productId}`}
                className="stock-form__input"
                rows={3}
                value={item.notes ?? ""}
                onChange={(event) => handleNotesChange(item, event.target.value)}
              />

              <PrimaryActions>
                <button
                  type="button"
                  className="stock-button stock-button--secondary"
                  onClick={() => handleRemove(item.productId)}
                >
                  Remove
                </button>
              </PrimaryActions>
            </Card>
          ))}
        </div>
      </Section>

      <PrimaryActions>
        <button
          type="button"
          className="stock-button stock-button--secondary"
          onClick={handleClearBasket}
        >
          {confirmClear ? "Confirm clear basket" : "Clear basket"}
        </button>
        <Link href="/orders/suppliers" className="stock-action-link stock-action-link--secondary">
          Supplier orders (copy/email)
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
