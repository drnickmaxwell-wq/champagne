"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ScanPage from "../scan/page";
import { loadLocalBarcodeRegistry } from "../scan/localRegistry";
import { fetchLocations, fetchProducts } from "../lib/ops-api";
import {
  createReceipt,
  fetchReceivedSinceCount,
  type CreateReceiptInput
} from "../lib/stock-service-client";

type Option = {
  id: string;
  label: string;
};

const LOCAL_ONLY_STORAGE_KEY = "stock.localOnlyMode";
const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

const encodeTime = (time: number) => {
  let value = time;
  let output = "";

  for (let index = 0; index < 10; index += 1) {
    output = CROCKFORD[value % 32] + output;
    value = Math.floor(value / 32);
  }

  return output;
};

const encodeRandom = () => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let random = 0n;

  for (const byte of bytes) {
    random = (random << 8n) | BigInt(byte);
  }

  let output = "";
  for (let index = 0; index < 16; index += 1) {
    output = CROCKFORD[Number(random % 32n)] + output;
    random /= 32n;
  }

  return output;
};

const createUlid = () => `${encodeTime(Date.now())}${encodeRandom()}`;

const resolveMessage = (data: unknown, fallback: string) => {
  if (data && typeof data === "object") {
    const value = data as Record<string, unknown>;
    if (typeof value.message === "string") {
      return value.message;
    }
  }
  return fallback;
};

const fromCollection = (value: unknown): Option[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") {
      return [];
    }

    const candidate = entry as Record<string, unknown>;
    const id =
      typeof candidate.id === "string"
        ? candidate.id
        : typeof candidate.productId === "string"
          ? candidate.productId
          : typeof candidate.locationId === "string"
            ? candidate.locationId
            : null;
    const label =
      typeof candidate.name === "string"
        ? candidate.name
        : typeof candidate.label === "string"
          ? candidate.label
          : null;

    if (!id || !label) {
      return [];
    }

    return [{ id, label }];
  });
};

export default function ReceivePage() {
  const searchParams = useSearchParams();
  const [localOnlyMode, setLocalOnlyMode] = useState(false);
  const [items, setItems] = useState<Option[]>([]);
  const [locations, setLocations] = useState<Option[]>([]);
  const [itemId, setItemId] = useState(searchParams.get("itemId")?.trim() ?? "");
  const [locationId, setLocationId] = useState(
    searchParams.get("locationId")?.trim() ?? ""
  );
  const [orderRefId, setOrderRefId] = useState(
    searchParams.get("orderRefId")?.trim() ?? ""
  );
  const [qtyReceived, setQtyReceived] = useState("1");
  const [note, setNote] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [receivedCount, setReceivedCount] = useState<unknown>(null);
  const [submitting, setSubmitting] = useState(false);

  const itemFromQuery = searchParams.get("itemId")?.trim() ?? "";
  const locationFromQuery = searchParams.get("locationId")?.trim() ?? "";

  useEffect(() => {
    setItemId(itemFromQuery);
  }, [itemFromQuery]);

  useEffect(() => {
    setLocationId(locationFromQuery);
  }, [locationFromQuery]);

  useEffect(() => {
    const orderRef = searchParams.get("orderRefId")?.trim() ?? "";
    setOrderRefId(orderRef);
  }, [searchParams]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setLocalOnlyMode(window.localStorage.getItem(LOCAL_ONLY_STORAGE_KEY) === "true");

    const registry = loadLocalBarcodeRegistry();
    const localItems = registry.products.map((product) => ({
      id: product.id,
      label: product.name
    }));
    setItems(localItems);

    void fetchProducts().then((result) => {
      if (!result.ok) {
        return;
      }
      const remoteItems = fromCollection(result.data);
      if (remoteItems.length > 0) {
        setItems(remoteItems);
      }
    });

    void fetchLocations().then((result) => {
      if (!result.ok) {
        return;
      }
      setLocations(fromCollection(result.data));
    });
  }, []);

  const countRows = useMemo(() => {
    if (!receivedCount || typeof receivedCount !== "object") {
      return [];
    }

    const source = receivedCount as Record<string, unknown>;
    if (Array.isArray(source.rows)) {
      return source.rows.filter((entry) => typeof entry === "object" && entry !== null);
    }

    if (Array.isArray(source.data)) {
      return source.data.filter((entry) => typeof entry === "object" && entry !== null);
    }

    return [source];
  }, [receivedCount]);

  const selectedItemId = itemFromQuery || itemId;
  const selectedLocationId = locationFromQuery || locationId;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const qty = Number.parseInt(qtyReceived, 10);
    if (!selectedItemId) {
      setErrorMessage("Select an item before submitting.");
      return;
    }
    if (!Number.isFinite(qty) || qty <= 0) {
      setErrorMessage("Quantity must be greater than zero.");
      return;
    }
    if (note.length > 256) {
      setErrorMessage("Note must be 256 characters or less.");
      return;
    }

    if (localOnlyMode) {
      setSuccessMessage("Saved in local-only mode. Service call skipped.");
      return;
    }

    const nowIso = new Date().toISOString();
    const payload: CreateReceiptInput = {
      receiveEventId: createUlid(),
      itemId: selectedItemId,
      qtyReceived: qty,
      receivedAt: nowIso,
      correlationId: createUlid(),
      occurredAt: nowIso,
      actor: {
        actorId: "stock-ui",
        actorType: "USER"
      },
      ...(selectedLocationId ? { locationId: selectedLocationId } : {}),
      ...(orderRefId.trim() ? { orderRefId: orderRefId.trim() } : {}),
      ...(note.trim() ? { note: note.trim() } : {})
    };

    setSubmitting(true);
    const receiptResult = await createReceipt(payload);
    setSubmitting(false);

    if (!receiptResult.ok) {
      setErrorMessage(resolveMessage(receiptResult.data, "Receipt creation failed."));
      return;
    }

    setSuccessMessage("Receipt created successfully.");
    const projectionResult = await fetchReceivedSinceCount(selectedLocationId || undefined);
    if (projectionResult.ok) {
      setReceivedCount(projectionResult.data);
    }
  };

  if (localOnlyMode) {
    return <ScanPage />;
  }

  return (
    <main className="stock-page stock-page--compact">
      <section className="stock-card">
        <h1>Receive Stock</h1>
        <p>Create a receipt event and read the received-since-count projection.</p>
        <form onSubmit={handleSubmit} className="stock-form">
          {!itemFromQuery ? (
            <label>
              Item
              <select
                value={itemId}
                onChange={(input) => setItemId(input.target.value)}
                required
              >
                <option value="">Select an item</option>
                {items.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <p>
              <strong>Item:</strong> {itemFromQuery}
            </p>
          )}

          {!locationFromQuery ? (
            <label>
              Location
              <select
                value={locationId}
                onChange={(input) => setLocationId(input.target.value)}
              >
                <option value="">No location</option>
                {locations.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <p>
              <strong>Location:</strong> {locationFromQuery}
            </p>
          )}

          <label>
            Order Ref
            <input
              type="text"
              value={orderRefId}
              onChange={(input) => setOrderRefId(input.target.value)}
              maxLength={128}
            />
          </label>

          <label>
            Quantity Received
            <input
              type="number"
              min={1}
              value={qtyReceived}
              onChange={(input) => setQtyReceived(input.target.value)}
              required
            />
          </label>

          <label>
            Note (optional)
            <textarea
              value={note}
              onChange={(input) => setNote(input.target.value.slice(0, 256))}
              maxLength={256}
            />
          </label>

          <button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Create receipt"}
          </button>
        </form>

        {successMessage ? <p role="status">{successMessage}</p> : null}
        {errorMessage ? <p role="alert">{errorMessage}</p> : null}
      </section>

      {countRows.length > 0 ? (
        <section className="stock-card">
          <h2>Received Since Count</h2>
          <table>
            <thead>
              <tr>
                {Object.keys(countRows[0] as Record<string, unknown>).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {countRows.map((row, index) => {
                const typedRow = row as Record<string, unknown>;
                return (
                  <tr key={`${index}-${JSON.stringify(typedRow)}`}>
                    {Object.keys(countRows[0] as Record<string, unknown>).map((key) => (
                      <td key={key}>{String(typedRow[key] ?? "")}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      ) : null}
    </main>
  );
}
