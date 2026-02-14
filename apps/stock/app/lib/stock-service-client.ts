import type { EventInput } from "@champagne/stock-shared";

type ApiResult<T> = {
  ok: boolean;
  status: number;
  data: T;
};

const LOCAL_ONLY_STORAGE_KEY = "stock.localOnlyMode";

const resolveTenantId = () => {
  const fromEnv = process.env.NEXT_PUBLIC_TENANT_ID?.trim();
  if (fromEnv) {
    return fromEnv;
  }

  const fromName = process.env.NEXT_PUBLIC_TENANT_NAME?.trim();
  return fromName && fromName.length > 0 ? fromName : null;
};

const readResponseBody = async (response: Response) => {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

const isLocalOnlyMode = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(LOCAL_ONLY_STORAGE_KEY) === "true";
};

const requestProxy = async (
  path: string,
  init?: RequestInit
): Promise<ApiResult<unknown>> => {
  if (isLocalOnlyMode()) {
    return { ok: false, status: 0, data: { message: "Local-only mode enabled." } };
  }

  const tenantId = resolveTenantId();
  if (!tenantId) {
    return { ok: false, status: 0, data: { message: "Missing tenant id." } };
  }

  let response: Response;

  try {
    response = await fetch(path, {
      cache: "no-store",
      ...init,
      headers: {
        "x-tenant-id": tenantId,
        ...(init?.headers ?? {})
      }
    });
  } catch {
    return { ok: false, status: 0, data: { message: "Network error." } };
  }

  const data = await readResponseBody(response);

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      data: data ?? { message: "Request failed." }
    };
  }

  return { ok: true, status: response.status, data };
};

export const postStockServiceEvent = async (payload: EventInput) => {
  return requestProxy("/api/stock/events", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });
};

export const readStockServiceEvents = async (query?: URLSearchParams) => {
  const search = query && query.size > 0 ? `?${query.toString()}` : "";
  return requestProxy(`/api/stock/events/read${search}`);
};
