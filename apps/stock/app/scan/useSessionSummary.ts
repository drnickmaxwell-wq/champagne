"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { EventType } from "@champagne/stock-shared";

const STORAGE_KEY = "stock.scan.session.summary";

type SessionSummaryState = {
  received: number;
  withdrawn: number;
  locations: string[];
  activeLocationId: string | null;
  locationNames: Record<string, string>;
};

type RecordEventInput = {
  eventType: EventType;
  qty: number;
  locationId: string | null;
  locationName?: string | null;
};

const emptySummary = (): SessionSummaryState => ({
  received: 0,
  withdrawn: 0,
  locations: [],
  activeLocationId: null,
  locationNames: {}
});

const normalizeCount = (value: unknown) => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.floor(value));
};

const normalizeLocations = (value: unknown) => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((entry): entry is string => typeof entry === "string");
};

const normalizeActiveLocationId = (value: unknown) => {
  if (typeof value !== "string") {
    return null;
  }
  return value.length ? value : null;
};

const normalizeLocationNames = (value: unknown) => {
  if (!value || typeof value !== "object") {
    return {};
  }
  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, string] =>
        typeof entry[0] === "string" && typeof entry[1] === "string"
    )
  );
};

const parseStoredSummary = (value: string | null): SessionSummaryState => {
  if (!value) {
    return emptySummary();
  }
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return emptySummary();
    }
    const record = parsed as Record<string, unknown>;
    return {
      received: normalizeCount(record.received),
      withdrawn: normalizeCount(record.withdrawn),
      locations: normalizeLocations(record.locations),
      activeLocationId: normalizeActiveLocationId(record.activeLocationId),
      locationNames: normalizeLocationNames(record.locationNames)
    };
  } catch {
    return emptySummary();
  }
};

const readStoredSummary = () => {
  if (typeof window === "undefined") {
    return emptySummary();
  }
  return parseStoredSummary(window.sessionStorage.getItem(STORAGE_KEY));
};

export const useSessionSummary = () => {
  const [summary, setSummary] = useState<SessionSummaryState>(() =>
    readStoredSummary()
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(summary));
  }, [summary]);

  const recordEvent = useCallback((event: RecordEventInput) => {
    setSummary((prev) => {
      const qty = Math.max(0, Math.floor(event.qty));
      const locations = new Set(prev.locations);
      const locationNames = { ...prev.locationNames };
      const activeLocationId = event.locationId ?? prev.activeLocationId;
      if (event.locationId) {
        locations.add(event.locationId);
        if (event.locationName?.trim().length) {
          locationNames[event.locationId] = event.locationName.trim();
        }
      }
      const received =
        event.eventType === "RECEIVE" ? prev.received + qty : prev.received;
      const withdrawn =
        event.eventType === "WITHDRAW" ? prev.withdrawn + qty : prev.withdrawn;
      return {
        received,
        withdrawn,
        locations: Array.from(locations),
        activeLocationId,
        locationNames
      };
    });
  }, []);

  const endSession = useCallback(() => {
    setSummary(emptySummary());
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const locationCount = useMemo(
    () => summary.locations.length,
    [summary.locations]
  );

  const activeLocationName = useMemo(() => {
    if (!summary.activeLocationId) {
      return null;
    }
    return summary.locationNames[summary.activeLocationId] ?? null;
  }, [summary.activeLocationId, summary.locationNames]);

  return {
    summary,
    locationCount,
    activeLocationName,
    recordEvent,
    endSession
  };
};
