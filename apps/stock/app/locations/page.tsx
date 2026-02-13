"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  LocationSchema,
  LocationTypeSchema
} from "@champagne/stock-shared";
import type {
  Location,
  LocationType
} from "@champagne/stock-shared";
import FeedbackCard from "../components/ui/FeedbackCard";
import LoadingLine from "../components/ui/LoadingLine";
import PageShell from "../components/ui/PageShell";
import { ActionLink, PrimaryActions } from "../components/ui/PrimaryActions";
import {
  DebugDisclosure,
  ScreenHeader,
  Section
} from "../components/ui/ScreenKit";
import DisclosureCard from "../components/ui/DisclosureCard";
import {
  fetchLocations,
  patchLocation,
  postLocation
} from "../lib/ops-api";
import { loadLocationNotes, setNote } from "../lib/localStores/locationNotes";

type LocationDraft = {
  name: string;
  type: LocationType;
};

type PrintMode = "none" | "single" | "all";

const STOCK_PRINT_CLASS = "stock-printing";
const STOCK_PRINT_SINGLE_CLASS = "stock-printing--single";
const STOCK_PRINT_ALL_CLASS = "stock-printing--all";

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

const toDraft = (location: Location): LocationDraft => {
  return {
    name: location.name,
    type: location.type
  };
};

const buildPayload = (draft: LocationDraft) => {
  return {
    name: draft.name.trim(),
    type: draft.type
  };
};

const formatLocationType = (value: LocationType) => {
  return value
    .split("_")
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
};

export default function LocationsPage() {
  const locationTypes = useMemo(() => LocationTypeSchema.options, []);
  const [locations, setLocations] = useState<Location[]>([]);
  const [drafts, setDrafts] = useState<Record<string, LocationDraft>>({});
  const [createDraft, setCreateDraft] = useState<LocationDraft>(() => ({
    name: "",
    type: locationTypes[0] ?? "CUPBOARD"
  }));
  const [loading, setLoading] = useState(false);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [opsUnreachable, setOpsUnreachable] = useState(false);
  const [printTargetId, setPrintTargetId] = useState<string | null>(null);
  const [printMode, setPrintMode] = useState<PrintMode>("none");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});

  const updateDraft = (locationId: string, update: Partial<LocationDraft>) => {
    setDrafts((prev) => ({
      ...prev,
      [locationId]: {
        ...prev[locationId],
        ...update
      }
    }));
  };

  const loadLocations = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");
    setStatusMessage("");
    setOpsUnreachable(false);
    const result = await fetchLocations();
    setLoading(false);
    if (!result.ok) {
      if (result.status === 0) {
        setOpsUnreachable(true);
      }
      setErrorMessage(resolveErrorMessage(result.data));
      setLocations([]);
      return;
    }

    const parsed = LocationSchema.array().safeParse(result.data);
    if (!parsed.success) {
      setErrorMessage("Unexpected locations response.");
      setLocations([]);
      return;
    }

    setLocations(parsed.data);
    setDrafts((prev) => {
      const next: Record<string, LocationDraft> = { ...prev };
      parsed.data.forEach((location) => {
        next[location.id] = toDraft(location);
      });
      return next;
    });

    const loadedNotes = loadLocationNotes();
    setNotes(loadedNotes);
    setNoteDrafts((prev) => {
      const next: Record<string, string> = { ...prev };
      parsed.data.forEach((location) => {
        next[location.id] = loadedNotes[location.id] ?? "";
      });
      return next;
    });
  }, []);

  useEffect(() => {
    void loadLocations();
  }, [loadLocations]);

  const clearPrintBodyClasses = useCallback(() => {
    document.body.classList.remove(
      STOCK_PRINT_CLASS,
      STOCK_PRINT_SINGLE_CLASS,
      STOCK_PRINT_ALL_CLASS
    );
  }, []);

  const applyPrintBodyClasses = useCallback(
    (mode: PrintMode) => {
      clearPrintBodyClasses();
      if (mode === "none") {
        return;
      }

      document.body.classList.add(STOCK_PRINT_CLASS);
      if (mode === "single") {
        document.body.classList.add(STOCK_PRINT_SINGLE_CLASS);
      }
      if (mode === "all") {
        document.body.classList.add(STOCK_PRINT_ALL_CLASS);
      }
    },
    [clearPrintBodyClasses]
  );

  const resetPrintState = useCallback(() => {
    setPrintMode("none");
    setPrintTargetId(null);
    clearPrintBodyClasses();
  }, [clearPrintBodyClasses]);

  useEffect(() => {
    applyPrintBodyClasses(printMode);
    return () => {
      clearPrintBodyClasses();
    };
  }, [applyPrintBodyClasses, clearPrintBodyClasses, printMode]);

  useEffect(() => {
    const handleBeforePrint = () => {
      applyPrintBodyClasses(printMode);
    };

    const handleAfterPrint = () => {
      resetPrintState();
    };

    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
      clearPrintBodyClasses();
    };
  }, [applyPrintBodyClasses, clearPrintBodyClasses, printMode, resetPrintState]);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (creating) {
      return;
    }
    setStatusMessage("");
    setErrorMessage("");
    setOpsUnreachable(false);
    const payload = buildPayload(createDraft);
    if (!payload.name || !payload.type) {
      setErrorMessage("Name and type are required.");
      return;
    }

    setCreating(true);
    const result = await postLocation(payload);
    setCreating(false);
    if (!result.ok) {
      if (result.status === 0) {
        setOpsUnreachable(true);
      }
      setErrorMessage(resolveErrorMessage(result.data));
      return;
    }

    setStatusMessage("Location added.");
    setCreateDraft((prev) => ({
      ...prev,
      name: ""
    }));
    void loadLocations();
  };

  const handleUpdate = async (locationId: string) => {
    if (submittingId) {
      return;
    }
    const draft = drafts[locationId];
    if (!draft) {
      return;
    }
    const payload = buildPayload(draft);
    if (!payload.name || !payload.type) {
      setErrorMessage("Name and type are required.");
      return;
    }
    setErrorMessage("");
    setStatusMessage("");
    setOpsUnreachable(false);
    setSubmittingId(locationId);
    const result = await patchLocation(locationId, payload);
    setSubmittingId(null);
    if (!result.ok) {
      if (result.status === 0) {
        setOpsUnreachable(true);
      }
      setErrorMessage(resolveErrorMessage(result.data));
      return;
    }

    setStatusMessage("Location updated.");
    void loadLocations();
  };

  const handleDownload = (id: string) => {
    const canvas = document.getElementById(`qr-${id}`) as HTMLCanvasElement | null;
    if (!canvas) {
      return;
    }
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `location-${id}.png`;
    link.click();
  };

  const handlePrintSingle = (id: string) => {
    setPrintMode("single");
    setPrintTargetId(id);
    window.setTimeout(() => {
      window.print();
    }, 0);
  };

  const handlePrintAll = () => {
    setPrintMode("all");
    setPrintTargetId(null);
    window.setTimeout(() => {
      window.print();
    }, 0);
  };


  const updateNoteDraft = (locationId: string, value: string) => {
    setNoteDrafts((prev) => ({
      ...prev,
      [locationId]: value
    }));
  };

  const handleSaveNote = (locationId: string) => {
    const nextNotes = setNote(locationId, noteDrafts[locationId] ?? "");
    setNotes(nextNotes);
    setStatusMessage("Note saved.");
  };

  return (
    <PageShell
      header={
        <ScreenHeader
          title="Locations"
          subtitle="Manage cupboards, surgeries, and storage areas."
        />
      }
    >
      <div className="stock-feedback-region" aria-live="polite">
        {loading ? <LoadingLine label="Working..." /> : null}
        {opsUnreachable ? (
          <FeedbackCard
            title="Ops API unreachable"
            role="alert"
            message="Unable to reach ops-api. Check network or service status."
          />
        ) : null}
        {errorMessage ? (
          <FeedbackCard title="Error" role="alert" message={errorMessage} />
        ) : null}
        {statusMessage ? (
          <FeedbackCard title="Update" message={statusMessage} />
        ) : null}
      </div>

      <Section title="Add location">
        <form className="stock-form" onSubmit={handleCreate}>
          <div className="stock-form__row">
            <label className="stock-form__label">
              Name
              <input
                className="stock-form__input"
                name="locationName"
                value={createDraft.name}
                onChange={(event) =>
                  setCreateDraft((prev) => ({
                    ...prev,
                    name: event.target.value
                  }))
                }
                required
              />
            </label>
          </div>
          <div className="stock-form__row">
            <label className="stock-form__label">
              Type
              <select
                className="stock-form__input"
                name="locationType"
                value={createDraft.type}
                onChange={(event) =>
                  setCreateDraft((prev) => ({
                    ...prev,
                    type: event.target.value as LocationType
                  }))
                }
                required
              >
                {locationTypes.map((type) => (
                  <option key={type} value={type}>
                    {formatLocationType(type)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="stock-form__row">
            <button
              type="submit"
              className="stock-button stock-button--primary stock-form__button"
              disabled={creating}
            >
              Add location
            </button>
          </div>
        </form>
      </Section>

      <Section title="Current locations">
        <PrimaryActions>
          <button
            type="button"
            className="stock-button stock-button--secondary"
            onClick={handlePrintAll}
            disabled={locations.length === 0}
          >
            Print all locations
          </button>
          <ActionLink href="/setup/locations-pack">Open print pack</ActionLink>
        </PrimaryActions>
        <div className="qr-print-scope" data-print-mode={printMode}>
          {locations.length === 0 && !loading ? (
            <FeedbackCard title="Empty" message="No locations yet." />
          ) : null}
          {locations.map((location) => (
            <DisclosureCard
              key={location.id}
              summary={`${location.name} (${formatLocationType(location.type)})`}
            >
              <form
                className="stock-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleUpdate(location.id);
                }}
              >
                <div className="stock-form__row">
                  <label className="stock-form__label">
                    Name
                    <input
                      className="stock-form__input"
                      name={`locationName-${location.id}`}
                      value={drafts[location.id]?.name ?? location.name}
                      onChange={(event) =>
                        updateDraft(location.id, {
                          name: event.target.value
                        })
                      }
                      required
                    />
                  </label>
                </div>
                <div className="stock-form__row">
                  <label className="stock-form__label">
                    Type
                    <select
                      className="stock-form__input"
                      name={`locationType-${location.id}`}
                      value={drafts[location.id]?.type ?? location.type}
                      onChange={(event) =>
                        updateDraft(location.id, {
                          type: event.target.value as LocationType
                        })
                      }
                      required
                    >
                      {locationTypes.map((type) => (
                        <option key={type} value={type}>
                          {formatLocationType(type)}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="stock-form__row">
                  <label className="stock-form__label">
                    Notes (optional)
                    <textarea
                      className="stock-form__input stock-form__textarea"
                      name={`locationNote-${location.id}`}
                      value={noteDrafts[location.id] ?? ""}
                      onChange={(event) => updateNoteDraft(location.id, event.target.value)}
                      rows={3}
                    />
                  </label>
                </div>
                <div className="stock-form__row stock-note-actions">
                  <button
                    type="button"
                    className="stock-button stock-button--secondary"
                    onClick={() => handleSaveNote(location.id)}
                  >
                    Save note
                  </button>
                </div>
                <div className="stock-form__row">
                  <button
                    type="submit"
                    className="stock-button stock-button--primary stock-form__button"
                    disabled={submittingId === location.id}
                  >
                    Save changes
                  </button>
                </div>
              </form>
              <div
                className="qr-print-area qr-printable qr-block"
                data-print-active={printTargetId === location.id ? "true" : "false"}
              >
                <QRCodeCanvas
                  id={`qr-${location.id}`}
                  value={location.id}
                  size={160}
                  level="M"
                  includeMargin
                />
                <p className="qr-label">{`${location.name} — ${location.id}`}</p>
                {notes[location.id] ? (
                  <p className="qr-note">{notes[location.id]}</p>
                ) : null}
                <div className="qr-actions">
                  <button
                    type="button"
                    className="stock-button stock-button--secondary"
                    onClick={() => handleDownload(location.id)}
                  >
                    Download
                  </button>
                  <button
                    type="button"
                    className="stock-button stock-button--secondary"
                    onClick={() => handlePrintSingle(location.id)}
                  >
                    Print
                  </button>
                </div>
              </div>
            </DisclosureCard>
          ))}
        </div>
      </Section>

      <PrimaryActions>
        <ActionLink href="/home">Home</ActionLink>
        <ActionLink href="/setup">Setup</ActionLink>
        <ActionLink href="/scan">Scan</ActionLink>
        <ActionLink href="/reorder">Orders</ActionLink>
      </PrimaryActions>

      <DebugDisclosure summary="Technical details (for troubleshooting only)">
        <pre>{JSON.stringify(locations, null, 2)}</pre>
      </DebugDisclosure>
    </PageShell>
  );
}
