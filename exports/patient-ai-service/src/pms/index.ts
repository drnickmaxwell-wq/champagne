import type { PmsAdapter } from "./adapter.js";
import { NullPmsAdapter } from "./adapters/null.js";
import { StubPmsAdapter } from "./adapters/stub.js";

export type PmsAdapterName = "stub" | "null";

const DEFAULT_TENANT_ID = "default";

const resolveAdapterName = (tenantId: string): PmsAdapterName => {
  if (tenantId === DEFAULT_TENANT_ID) {
    return "stub";
  }
  return "null";
};

export const getPmsAdapterName = (tenantId: string): PmsAdapterName => {
  return resolveAdapterName(tenantId);
};

export const getPmsAdapter = (tenantId: string): PmsAdapter => {
  const adapterName = resolveAdapterName(tenantId);
  if (adapterName === "stub") {
    return StubPmsAdapter;
  }
  return NullPmsAdapter;
};
