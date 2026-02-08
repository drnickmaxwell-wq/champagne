"use client";

import { useEffect, useState } from "react";
import { EventResponseSchema, EventTypeSchema } from "@champagne/stock-shared";
import type { EventType } from "@champagne/stock-shared";
import { postEvent } from "../lib/ops-api";
import LoadingLine from "./ui/LoadingLine";

type EventActionPanelProps = {
  productId?: string;
  stockInstanceId?: string;
  locationId?: string | null;
  locationName?: string | null;
  defaultQuantity?: number;
  allowedActions?: EventType[];
  onEventRequest?: (payload: EventRequestPayload) => void;
  onEventSuccess?: (payload: EventSuccessPayload) => void;
  onLastActionMessage?: (message: string) => void;
};

export type EventSuccessPayload = {
  eventType: EventType;
  qty: number;
  locationId: string | null;
  locationName?: string | null;
};

export type EventRequestPayload = {
  eventType: EventType;
  qty: number;
  productId?: string;
  stockInstanceId?: string;
  locationId: string | null;
  locationName?: string | null;
  continue: () => void;
};

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
  return "Request failed.";
};

const resolveEventOutcome = (data: unknown) => {
  const parsed = EventResponseSchema.safeParse(data);
  if (!parsed.success) {
    return { updatedQty: null, locationId: null };
  }
  return {
    updatedQty: parsed.data.stockInstance?.qtyRemaining ?? null,
    locationId: parsed.data.stockInstance?.locationId ?? null
  };
};

const resolveDefaultQuantity = (value?: number) => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 1;
  }
  return Math.max(1, Math.floor(value));
};

export default function EventActionPanel({
  productId,
  stockInstanceId,
  locationId,
  locationName,
  defaultQuantity,
  allowedActions,
  onEventRequest,
  onEventSuccess,
  onLastActionMessage
}: EventActionPanelProps) {
  const [qtyInput, setQtyInput] = useState(() =>
    String(resolveDefaultQuantity(defaultQuantity))
  );
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [lastActionMessage, setLastActionMessage] = useState("");

  const canWithdraw = allowedActions
    ? allowedActions.includes("WITHDRAW")
    : EventTypeSchema.options.includes("WITHDRAW");
  const canReceive = allowedActions
    ? allowedActions.includes("RECEIVE")
    : EventTypeSchema.options.includes("RECEIVE");

  useEffect(() => {
    setQtyInput(String(resolveDefaultQuantity(defaultQuantity)));
  }, [defaultQuantity, productId, stockInstanceId]);

  const clampQtyInput = (value: string) => {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed)) {
      return "1";
    }
    return String(Math.max(1, parsed));
  };

  const adjustQty = (delta: number) => {
    const parsed = Number.parseInt(qtyInput, 10);
    const base = Number.isFinite(parsed) ? parsed : 1;
    const next = Math.max(1, base + delta);
    setQtyInput(String(next));
  };

  const submitEvent = async (eventType: EventType, clampedQty: number) => {
    const qtyDeltaUnits =
      eventType === "WITHDRAW" ? -clampedQty : clampedQty;
    setSubmitting(true);
    const result = await postEvent({
      eventType,
      qtyDeltaUnits,
      productId,
      stockInstanceId,
      locationId: locationId ?? undefined
    });
    setSubmitting(false);

    if (!result.ok) {
      setErrorMessage(resolveErrorMessage(result.data));
      return;
    }

    const outcome = resolveEventOutcome(result.data);
    const verb = eventType === "WITHDRAW" ? "Withdrew" : "Received";
    const locationLabel = locationName?.trim().length
      ? locationName
      : "Inventory";
    const updatedSuffix =
      outcome.updatedQty === null ? "" : ` (Remaining ${outcome.updatedQty})`;
    setStatusMessage(`${verb} ${clampedQty} -> ${locationLabel}${updatedSuffix}`);
    const message = `Last action: ${eventType} x${clampedQty} at ${new Date().toLocaleString()}`;
    setLastActionMessage(message);
    onLastActionMessage?.(message);
    onEventSuccess?.({
      eventType,
      qty: clampedQty,
      locationId: outcome.locationId ?? locationId ?? null,
      locationName: locationName?.trim().length ? locationName : null
    });
  };

  const handleEvent = async (eventType: EventType) => {
    if (submitting) {
      return;
    }
    setStatusMessage("");
    setErrorMessage("");
    const qtyNumber = Number.parseInt(qtyInput, 10);
    const clampedQty = Number.isFinite(qtyNumber) ? Math.max(1, qtyNumber) : 1;
    if (!Number.isFinite(qtyNumber) || qtyNumber <= 0) {
      setQtyInput(String(clampedQty));
    }

    if (onEventRequest) {
      onEventRequest({
        eventType,
        qty: clampedQty,
        productId,
        stockInstanceId,
        locationId: locationId ?? null,
        locationName,
        continue: () => void submitEvent(eventType, clampedQty)
      });
      return;
    }

    await submitEvent(eventType, clampedQty);
  };

  if (!productId && !stockInstanceId) {
    return null;
  }

  const lastActionValue = lastActionMessage || "Last action: none yet";

  return (
    <div
      className={`stock-event-panel${submitting ? " stock-event-panel--busy" : ""}`}
    >
      <h2 className="stock-event-panel__title">Actions</h2>
      <div className="stock-event-panel__field">
        <label htmlFor="event-qty" className="stock-event-panel__label">
          Quantity
        </label>
        <div className="stock-stepper">
          <button
            type="button"
            className="stock-button stock-button--secondary stock-stepper__button"
            onClick={() => adjustQty(-1)}
            disabled={submitting}
            aria-label="Decrease quantity"
          >
            -
          </button>
          <input
            id="event-qty"
            type="number"
            min="1"
            step="1"
            value={qtyInput}
            disabled={submitting}
            onChange={(event) => setQtyInput(clampQtyInput(event.target.value))}
            className="stock-event-panel__input"
          />
          <button
            type="button"
            className="stock-button stock-button--secondary stock-stepper__button"
            onClick={() => adjustQty(1)}
            disabled={submitting}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>
      <div className="stock-event-panel__actions">
        {canWithdraw ? (
          <button
            type="button"
            onClick={() => handleEvent("WITHDRAW")}
            disabled={submitting}
            className="stock-button stock-button--primary stock-event-panel__button"
          >
            Withdraw
          </button>
        ) : null}
        {canReceive ? (
          <button
            type="button"
            onClick={() => handleEvent("RECEIVE")}
            disabled={submitting}
            className="stock-button stock-button--primary stock-event-panel__button"
          >
            Receive
          </button>
        ) : null}
      </div>
      <div className="stock-event-panel__messages" aria-live="polite">
        {statusMessage ? (
          <p
            role="status"
            className="stock-event-panel__message stock-event-panel__message--success"
          >
            <strong>Success:</strong> {statusMessage}
          </p>
        ) : null}
        {submitting ? <LoadingLine label="Working..." /> : null}
        {errorMessage ? (
          <p
            role="alert"
            className="stock-event-panel__message stock-event-panel__message--error"
          >
            <strong>Error:</strong> {errorMessage}
          </p>
        ) : null}
        <p
          role="status"
          className="stock-event-panel__message stock-event-panel__message--neutral"
        >
          <strong>{lastActionValue}</strong>
        </p>
      </div>
    </div>
  );
}
