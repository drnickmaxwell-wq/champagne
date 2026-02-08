import type { IncomingMessage } from "node:http";

export type AuthContext = {
  patientId: string;
  tenantId: string;
};

export type AuthResult =
  | { ok: true; context: AuthContext }
  | { ok: false; reason: string; context: AuthContext };

const readHeader = (request: IncomingMessage, name: string) => {
  const value = request.headers[name];
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

export const resolveAuthContext = (request: IncomingMessage): AuthResult => {
  const patientId = readHeader(request, "x-patient-id");
  const tenantId = readHeader(request, "x-tenant-id");

  if (typeof patientId !== "string" || patientId.trim().length === 0) {
    return {
      ok: false,
      reason: "Missing patient id.",
      context: {
        patientId: "unknown",
        tenantId: typeof tenantId === "string" && tenantId.trim() ? tenantId : "unknown"
      }
    };
  }

  if (typeof tenantId !== "string" || tenantId.trim().length === 0) {
    return {
      ok: false,
      reason: "Missing tenant id.",
      context: {
        patientId: patientId.trim(),
        tenantId: "unknown"
      }
    };
  }

  return {
    ok: true,
    context: {
      patientId: patientId.trim(),
      tenantId: tenantId.trim()
    }
  };
};
