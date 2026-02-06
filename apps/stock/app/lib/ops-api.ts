const DEFAULT_BASE_URL = "http://localhost:3001";

type ApiResult = {
  ok: boolean;
  status: number;
  data: unknown;
};

const resolveBaseUrl = () => {
  const envBase = process.env.STOCK_OPS_API_BASE_URL;
  const trimmed = envBase ? envBase.trim() : "";
  const base = trimmed.length > 0 ? trimmed : DEFAULT_BASE_URL;
  return base.endsWith("/") ? base.slice(0, -1) : base;
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

const requestJson = async (url: string): Promise<ApiResult> => {
  const response = await fetch(url, { cache: "no-store" });
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

export const fetchScan = async (code: string): Promise<ApiResult> => {
  const baseUrl = resolveBaseUrl();
  const safeCode = encodeURIComponent(code);
  return requestJson(`${baseUrl}/scan/${safeCode}`);
};

export const fetchReorder = async (): Promise<ApiResult> => {
  const baseUrl = resolveBaseUrl();
  return requestJson(`${baseUrl}/reorder`);
};
