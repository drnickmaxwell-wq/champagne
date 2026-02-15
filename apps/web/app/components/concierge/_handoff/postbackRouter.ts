export type HandoffKind = "BOOKING" | "EMERGENCY_CALLBACK" | "NEW_PATIENT";

const HANDOFF_ENDPOINTS: Record<HandoffKind, "/api/handoff/booking" | "/api/handoff/emergency-callback" | "/api/handoff/new-patient"> = {
  BOOKING: "/api/handoff/booking",
  EMERGENCY_CALLBACK: "/api/handoff/emergency-callback",
  NEW_PATIENT: "/api/handoff/new-patient",
};

type ParsedObjectPayload = {
  kind?: unknown;
  form?: unknown;
  type?: unknown;
};

function parseObjectPayload(payload: string): ParsedObjectPayload | null {
  if (!payload.trim().startsWith("{")) {
    return null;
  }

  try {
    const parsed = JSON.parse(payload) as unknown;
    if (parsed && typeof parsed === "object") {
      return parsed as ParsedObjectPayload;
    }
  } catch {
    return null;
  }

  return null;
}

export function resolveHandoffKind(payload: string): HandoffKind | null {
  const normalized = payload.trim();

  if (normalized === "BOOKING_REQUEST" || normalized === "BOOKING") {
    return "BOOKING";
  }

  if (normalized === "EMERGENCY_CALLBACK") {
    return "EMERGENCY_CALLBACK";
  }

  if (normalized === "NEW_PATIENT") {
    return "NEW_PATIENT";
  }

  const parsed = parseObjectPayload(normalized);
  if (!parsed) {
    return null;
  }

  if (parsed.kind === "handoff" && parsed.form === "booking") {
    return "BOOKING";
  }

  if (parsed.kind === "handoff" && parsed.form === "emergency_callback") {
    return "EMERGENCY_CALLBACK";
  }

  if (parsed.kind === "handoff" && parsed.form === "new_patient") {
    return "NEW_PATIENT";
  }

  if (parsed.type === "BOOKING") {
    return "BOOKING";
  }

  if (parsed.type === "EMERGENCY_CALLBACK") {
    return "EMERGENCY_CALLBACK";
  }

  if (parsed.type === "NEW_PATIENT") {
    return "NEW_PATIENT";
  }

  return null;
}

export function resolveHandoffEndpoint(kind: HandoffKind) {
  return HANDOFF_ENDPOINTS[kind];
}
