"use client";

import { useState } from "react";
import {
  EventTypeSchema,
  StockInstanceSnapshotSchema
} from "@champagne/stock-shared";
import type { EventType } from "@champagne/stock-shared";
import { postEvent } from "../lib/ops-api";
import LoadingLine from "./ui/LoadingLine";

type EventActionPanelProps = {
  productId?: string;
  stockInstanceId?: string;
  locationId?: string | null;
  locationName?: string | null;
  onEventSuccess?: () => void;
  onLastActionMessage?: (message: string) => void;
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

const resolveUpdatedQty = (data: unknown) => {
  if (data && typeof data === "object") {
    const candidate = data as Record<string, unknown>;
    if ("stockInstance" in candidate) {
      const parsed = StockInstanceSnapshotSchema.safeParse(candidate.stockInstance);
      if (parsed.success) {
        return parsed.data.qtyRemaining;
      }
    }
  }
  return null;
};

export default function EventActionPanel({
  productId,
  stockInstanceId,
  locationId,
  locationName,
  onEventSuccess,
  onLastActionMessage
}: EventActionPanelProps) {
  const [qtyInput, setQtyInput] = useState("1");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [lastActionMessage, setLastActionMessage] = useState("");

  const canWithdraw = EventTypeSchema.options.includes("WITHDRAW");
  const canReceive = EventTypeSchema.options.includes("RECEIVE");

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

    const updatedQty = resolveUpdatedQty(result.data);
    const verb = eventType === "WITHDRAW" ? "Withdrew" : "Received";
    const locationLabel = locationName?.trim().length
      ? locationName
      : "Inventory";
    const updatedSuffix =
      updatedQty === null ? "" : ` (Remaining ${updatedQty})`;
    setStatusMessage(`${verb} ${clampedQty} -> ${locationLabel}${updatedSuffix}`);
    const message = `Last action: ${eventType} x${clampedQty} at ${new Date().toLocaleString()}`;
    setLastActionMessage(message);
    onLastActionMessage?.(message);
    onEventSuccess?.();
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
