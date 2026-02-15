"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createUlid } from "../lib/ulid";
import {
  createReceipt,
  fetchReceivedSinceCount,
  type ReceiptCreateInput
} from "../lib/stock-service-client";
import { fetchLocations, fetchProducts } from "../lib/ops-api";

const LOCAL_ONLY_STORAGE_KEY = "stock.localOnlyMode";

type SelectOption = {
  id: string;
  name: string;
};

const isLocalOnlyModeEnabled = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(LOCAL_ONLY_STORAGE_KEY) === "true";
};

const readMessage = (data: unknown, fallback: string) => {
  if (data && typeof data === "object") {
    const message = (data as Record<string, unknown>).message;
    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }
  }
  return fallback;
};

export default function ReceivePage() {
  const params = useSearchParams();
  const itemIdFromQuery = params.get("itemId")?.trim() ?? "";
  const locationIdFromQuery = params.get("locationId")?.trim() ?? "";
  const orderRefIdFromQuery = params.get("orderRefId")?.trim() ?? "";

  const [itemId, setItemId] = useState(itemIdFromQuery);
  const [locationId, setLocationId] = useState(locationIdFromQuery);
  const [orderRefId, setOrderRefId] = useState(orderRefIdFromQuery);
  const [qtyReceived, setQtyReceived] = useState("1");
  const [note, setNote] = useState("");
  const [items, setItems] = useState<SelectOption[]>([]);
  const [locations, setLocations] = useState<SelectOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [projection, setProjection] = useState<unknown>(null);

  const showItemSelector = itemIdFromQuery.length === 0;
  const showLocationSelector = locationIdFromQuery.length === 0;

  useEffect(() => {
    if (!showItemSelector && !showLocationSelector) {
      return;
    }

    setLoadingOptions(true);
    void Promise.all([fetchProducts(), fetchLocations()])
      .then(([productsResult, locationsResult]) => {
        if (productsResult.ok && Array.isArray(productsResult.data)) {
          setItems(
            productsResult.data
              .filter((entry): entry is Record<string, unknown> =>
                typeof entry === "object" && entry !== null
              )
              .flatMap((entry) => {
                const id = typeof entry.id === "string" ? entry.id : "";
                const name = typeof entry.name === "string" ? entry.name : "";
                if (!id || !name) {
                  return [];
                }
                return [{ id, name }];
              })
          );
        }

        if (locationsResult.ok && Array.isArray(locationsResult.data)) {
          setLocations(
            locationsResult.data
              .filter((entry): entry is Record<string, unknown> =>
                typeof entry === "object" && entry !== null
              )
              .flatMap((entry) => {
                const id = typeof entry.id === "string" ? entry.id : "";
                const name = typeof entry.name === "string" ? entry.name : "";
                if (!id || !name) {
                  return [];
                }
                return [{ id, name }];
              })
          );
        }
      })
      .finally(() => {
        setLoadingOptions(false);
      });
  }, [showItemSelector, showLocationSelector]);

  const resolvedItemId = showItemSelector ? itemId : itemIdFromQuery;
  const resolvedLocationId = showLocationSelector ? locationId : locationIdFromQuery;

  const parsedQty = useMemo(() => Number.parseInt(qtyReceived, 10), [qtyReceived]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!resolvedItemId) {
      setError("Select an item before submitting.");
      return;
    }

    if (!Number.isFinite(parsedQty) || parsedQty <= 0) {
      setError("Quantity received must be greater than 0.");
      return;
    }

    if (note.length > 256) {
      setError("Note must be 256 characters or fewer.");
      return;
    }

    if (isLocalOnlyModeEnabled()) {
      setProjection(null);
      setSuccess("Local-only mode enabled. Receipt service call skipped.");
      return;
    }

    setSubmitting(true);
    const now = new Date().toISOString();
    const correlationId = createUlid();
    const payload: ReceiptCreateInput = {
      receiveEventId: createUlid(),
      itemId: resolvedItemId,
      qtyReceived: parsedQty,
      receivedAt: now,
      occurredAt: now,
      correlationId,
      actor: {
        id: "stock-ui",
        type: "system"
      },
      ...(resolvedLocationId ? { locationId: resolvedLocationId } : {}),
      ...(orderRefId.trim() ? { orderRefId: orderRefId.trim() } : {}),
      ...(note.trim() ? { note: note.trim() } : {})
    };

    const receiptResult = await createReceipt(payload);

    if (!receiptResult.ok) {
      setError(readMessage(receiptResult.data, "Failed to create receipt."));
      setSubmitting(false);
      return;
    }

    setSuccess("Receipt created successfully.");

    const projectionResult = await fetchReceivedSinceCount(resolvedLocationId || undefined);
    if (projectionResult.ok) {
      setProjection(projectionResult.data);
    } else {
      setProjection({
        message: readMessage(projectionResult.data, "Unable to load received-since-count projection.")
      });
    }

    setSubmitting(false);
  };

  return (
    <main style={{ padding: "1.25rem", display: "grid", gap: "1rem", maxWidth: "48rem" }}>
      <h1>Receive Stock</h1>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.75rem" }}>
        {showItemSelector ? (
          <label>
            Item
            <select
              value={itemId}
              onChange={(event) => setItemId(event.target.value)}
              disabled={loadingOptions || submitting}
            >
              <option value="">Select item</option>
              {items.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <p>Item ID: {itemIdFromQuery}</p>
        )}

        {showLocationSelector ? (
          <label>
            Location
            <select
              value={locationId}
              onChange={(event) => setLocationId(event.target.value)}
              disabled={loadingOptions || submitting}
            >
              <option value="">Unassigned</option>
              {locations.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <p>Location ID: {locationIdFromQuery}</p>
        )}

        {orderRefIdFromQuery.length === 0 ? (
          <label>
            Order reference ID (optional)
            <input
              type="text"
              value={orderRefId}
              onChange={(event) => setOrderRefId(event.target.value)}
              disabled={submitting}
            />
          </label>
        ) : (
          <p>Order reference ID: {orderRefIdFromQuery}</p>
        )}

        <label>
          Quantity received
          <input
            type="number"
            min={1}
            step={1}
            value={qtyReceived}
            onChange={(event) => setQtyReceived(event.target.value)}
            disabled={submitting}
            required
          />
        </label>

        <label>
          Note (optional, max 256)
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value.slice(0, 256))}
            maxLength={256}
            disabled={submitting}
          />
        </label>

        <button type="submit" disabled={submitting || loadingOptions}>
          {submitting ? "Submitting..." : "Create receipt"}
        </button>
      </form>

      {error ? <p role="alert">{error}</p> : null}
      {success ? <p>{success}</p> : null}

      {projection ? (
        <section>
          <h2>Received Since Count</h2>
          <pre>{JSON.stringify(projection, null, 2)}</pre>
        </section>
      ) : null}
    </main>
  );
}
