"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  appendOrderEvent,
  createOrder,
  fetchOpenOrders,
  type OrderEventAppendInput,
  type OrderCreateInput
} from "../lib/stock-service-client";
import { fetchProducts } from "../lib/ops-api";
import { createUlid } from "../lib/ulid";
import FeedbackCard from "../components/ui/FeedbackCard";
import LoadingLine from "../components/ui/LoadingLine";
import PageShell from "../components/ui/PageShell";
import { ActionLink, PrimaryActions } from "../components/ui/PrimaryActions";
import { ScreenHeader, Section } from "../components/ui/ScreenKit";

const LOCAL_ONLY_STORAGE_KEY = "stock.localOnlyMode";

type OpenOrderRow = {
  orderRefId: string;
  itemId: string;
  qtySuggested: number;
  status: string;
  createdAt: string;
};

type ItemOption = {
  id: string;
  name: string;
};

const isLocalOnlyModeEnabled = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(LOCAL_ONLY_STORAGE_KEY) === "true";
};

const resolveErrorMessage = (data: unknown, fallback: string) => {
  if (data && typeof data === "object") {
    const candidate = data as Record<string, unknown>;
    if (typeof candidate.message === "string") {
      return candidate.message;
    }
    if (typeof candidate.error === "string") {
      return candidate.error;
    }
  }
  return fallback;
};

const toOpenOrderRows = (data: unknown): OpenOrderRow[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.flatMap((entry) => {
    if (!entry || typeof entry !== "object") {
      return [];
    }

    const row = entry as Record<string, unknown>;
    const orderRefId = typeof row.orderRefId === "string" ? row.orderRefId : "";
    const itemId = typeof row.itemId === "string" ? row.itemId : "";
    const qtySuggested = typeof row.qtySuggested === "number" ? row.qtySuggested : 0;
    const status = typeof row.status === "string" ? row.status : "OPEN";
    const createdAt = typeof row.createdAt === "string" ? row.createdAt : "";

    if (!orderRefId || !itemId || !createdAt) {
      return [];
    }

    return [
      {
        orderRefId,
        itemId,
        qtySuggested,
        status,
        createdAt
      }
    ];
  });
};

export default function ReorderPage() {
  const [localOnlyMode, setLocalOnlyMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [orders, setOrders] = useState<OpenOrderRow[]>([]);
  const [items, setItems] = useState<ItemOption[]>([]);
  const [itemId, setItemId] = useState("");
  const [qtySuggested, setQtySuggested] = useState("1");

  const sortedOrders = useMemo(
    () =>
      [...orders].sort((left, right) => {
        const createdAtCompare = left.createdAt.localeCompare(right.createdAt);
        if (createdAtCompare !== 0) {
          return createdAtCompare;
        }
        return left.orderRefId.localeCompare(right.orderRefId);
      }),
    [orders]
  );

  const refreshOrders = useCallback(async () => {
    if (localOnlyMode) {
      return;
    }

    setLoading(true);
    setErrorMessage("");
    const openOrdersResult = await fetchOpenOrders();
    setLoading(false);

    if (!openOrdersResult.ok) {
      setOrders([]);
      setErrorMessage(resolveErrorMessage(openOrdersResult.data, "Failed to load open orders."));
      return;
    }

    setOrders(toOpenOrderRows(openOrdersResult.data));
  }, [localOnlyMode]);

  const refreshItems = useCallback(async () => {
    if (localOnlyMode) {
      return;
    }

    const productsResult = await fetchProducts();
    if (!productsResult.ok || !Array.isArray(productsResult.data)) {
      return;
    }

    const nextItems = productsResult.data.flatMap((entry) => {
      if (!entry || typeof entry !== "object") {
        return [];
      }
      const product = entry as Record<string, unknown>;
      const id = typeof product.id === "string" ? product.id : "";
      const name = typeof product.name === "string" ? product.name : "";
      if (!id || !name) {
        return [];
      }
      return [{ id, name }];
    });

    setItems(nextItems);
    if (!itemId && nextItems[0]?.id) {
      setItemId(nextItems[0].id);
    }
  }, [itemId, localOnlyMode]);

  useEffect(() => {
    const enabled = isLocalOnlyModeEnabled();
    setLocalOnlyMode(enabled);
    if (enabled) {
      return;
    }

    void refreshOrders();
    void refreshItems();
  }, [refreshItems, refreshOrders]);

  const handleCreateOrder = async () => {
    setErrorMessage("");
    setStatusMessage("");

    const parsedQty = Number.parseInt(qtySuggested, 10);
    if (!itemId) {
      setErrorMessage("Select an item before creating an order.");
      return;
    }
    if (!Number.isFinite(parsedQty) || parsedQty <= 0) {
      setErrorMessage("Quantity must be greater than 0.");
      return;
    }

    setSaving(true);
    const now = new Date().toISOString();
    const payload: OrderCreateInput = {
      orderRefId: createUlid(),
      itemId,
      qtySuggested: parsedQty,
      status: "OPEN",
      occurredAt: now,
      correlationId: createUlid(),
      actor: {
        id: "stock-ui",
        type: "system"
      }
    };

    const result = await createOrder(payload);
    setSaving(false);

    if (!result.ok) {
      setErrorMessage(resolveErrorMessage(result.data, "Failed to create order."));
      return;
    }

    setStatusMessage("Order created.");
    await refreshOrders();
  };

  const handleAppendStatus = async (
    orderRefId: string,
    status: OrderEventAppendInput["status"]
  ) => {
    setErrorMessage("");
    setStatusMessage("");
    setSaving(true);

    const payload: OrderEventAppendInput = {
      orderEventId: createUlid(),
      status,
      occurredAt: new Date().toISOString(),
      correlationId: createUlid(),
      actor: {
        id: "stock-ui",
        type: "system"
      }
    };

    const result = await appendOrderEvent(orderRefId, payload);
    setSaving(false);

    if (!result.ok) {
      setErrorMessage(resolveErrorMessage(result.data, "Failed to append order event."));
      return;
    }

    setStatusMessage(`Order ${orderRefId} marked ${status}.`);
    await refreshOrders();
  };

  return (
    <PageShell header={<ScreenHeader title="Orders" subtitle="Open order lifecycle" />}>
      <div className="stock-feedback-region" aria-live="polite">
        {loading || saving ? <LoadingLine label="Working..." /> : null}
        {localOnlyMode ? (
          <FeedbackCard
            title="Local-only mode"
            message="Orders service integration is disabled while local-only mode is enabled."
          />
        ) : null}
        {statusMessage ? (
          <FeedbackCard title="Status" role="status" message={statusMessage} />
        ) : null}
        {errorMessage ? (
          <FeedbackCard title="Error" role="alert" message={errorMessage} />
        ) : null}
      </div>

      {!localOnlyMode ? (
        <Section>
          <h2>Create order</h2>
          <label>
            Item
            <select value={itemId} onChange={(event) => setItemId(event.target.value)}>
              <option value="">Select item</option>
              {items.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Suggested quantity
            <input
              type="number"
              min={1}
              step={1}
              value={qtySuggested}
              onChange={(event) => setQtySuggested(event.target.value)}
            />
          </label>
          <PrimaryActions>
            <button type="button" onClick={handleCreateOrder} disabled={saving || loading}>
              Create order
            </button>
            <button type="button" onClick={() => void refreshOrders()} disabled={saving || loading}>
              Refresh
            </button>
          </PrimaryActions>
        </Section>
      ) : null}

      {!localOnlyMode ? (
        <Section>
          <h2>Open orders</h2>
          {sortedOrders.length === 0 ? <p>No open orders.</p> : null}
          {sortedOrders.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Created</th>
                  <th>Order ref</th>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedOrders.map((row) => (
                  <tr key={row.orderRefId}>
                    <td>{row.createdAt}</td>
                    <td>{row.orderRefId}</td>
                    <td>{row.itemId}</td>
                    <td>{row.qtySuggested}</td>
                    <td>{row.status}</td>
                    <td>
                      <PrimaryActions>
                        <button
                          type="button"
                          onClick={() => void handleAppendStatus(row.orderRefId, "SENT")}
                          disabled={saving || loading}
                        >
                          SENT
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleAppendStatus(row.orderRefId, "PARTIAL")}
                          disabled={saving || loading}
                        >
                          PARTIAL
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleAppendStatus(row.orderRefId, "RECEIVED")}
                          disabled={saving || loading}
                        >
                          RECEIVED
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleAppendStatus(row.orderRefId, "CANCELLED")}
                          disabled={saving || loading}
                        >
                          CANCELLED
                        </button>
                        <ActionLink
                          href={`/receive?orderRefId=${encodeURIComponent(
                            row.orderRefId
                          )}&itemId=${encodeURIComponent(row.itemId)}`}
                        >
                          Receive
                        </ActionLink>
                      </PrimaryActions>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </Section>
      ) : null}

      <PrimaryActions>
        <ActionLink href="/">Home</ActionLink>
        <ActionLink href="/scan">Scan</ActionLink>
        <ActionLink href="/orders/basket">Basket</ActionLink>
        <ActionLink href="/orders/suppliers">Supplier orders</ActionLink>
      </PrimaryActions>
    </PageShell>
  );
}
