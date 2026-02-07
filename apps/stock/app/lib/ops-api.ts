import {
  EventInputSchema,
  ProductCreateInputSchema,
  ProductUpdateInputSchema
} from "@champagne/stock-shared";
import type {
  EventInput,
  ProductCreateInput,
  ProductUpdateInput
} from "@champagne/stock-shared";

type ApiResult<T> = {
  ok: boolean;
  status: number;
  data: T;
};

const resolveBaseUrl = () => {
  const envBase = process.env.NEXT_PUBLIC_OPS_API_BASE_URL;
  const trimmed = envBase ? envBase.trim() : "";
  const base = trimmed.length > 0 ? trimmed : "";
  return base.endsWith("/") ? base.slice(0, -1) : base;
};

const buildUrl = (path: string) => {
  const baseUrl = resolveBaseUrl();
  if (baseUrl.length === 0) {
    return path;
  }
  return `${baseUrl}${path}`;
};

const readResponseBody = async (response: Response) => {
  const text = await response.text();
  if (text.length === 0) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

const requestJson = async (
  url: string,
  init?: RequestInit
): Promise<ApiResult<unknown>> => {
  let response: Response;

  try {
    response = await fetch(url, { cache: "no-store", ...init });
  } catch {
    return { ok: false, status: 0, data: { message: "Network error." } };
  }

  const body = await readResponseBody(response);

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      data: body ?? { message: "Request failed" }
    };
  }

  return {
    ok: true,
    status: response.status,
    data: body
  };
};

export const fetchScan = async (code: string): Promise<ApiResult<unknown>> => {
  const safeCode = encodeURIComponent(code);
  return requestJson(buildUrl(`/scan/${safeCode}`));
};

export const fetchReorder = async (): Promise<ApiResult<unknown>> => {
  return requestJson(buildUrl("/reorder"));
};

export const fetchHealth = async (): Promise<ApiResult<unknown>> => {
  return requestJson(buildUrl("/health"));
};

export const postEvent = async (
  payload: EventInput
): Promise<ApiResult<unknown>> => {
  const parsed = EventInputSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      status: 0,
      data: { message: "Invalid event details. Please check the inputs." }
    };
  }

  return requestJson(buildUrl("/events"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(parsed.data)
  });
};

export const fetchProducts = async (): Promise<ApiResult<unknown>> => {
  return requestJson(buildUrl("/products"));
};

export const postProduct = async (
  payload: ProductCreateInput
): Promise<ApiResult<unknown>> => {
  const parsed = ProductCreateInputSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      status: 0,
      data: { message: "Invalid product details. Please check the inputs." }
    };
  }

  return requestJson(buildUrl("/products"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(parsed.data)
  });
};

export const patchProduct = async (
  productId: string,
  payload: ProductUpdateInput
): Promise<ApiResult<unknown>> => {
  const parsed = ProductUpdateInputSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      status: 0,
      data: { message: "Invalid product update. Please check the inputs." }
    };
  }

  return requestJson(buildUrl(`/products/${productId}`), {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(parsed.data)
  });
};
