import { createHash, createHmac, randomBytes } from "node:crypto";

const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "content-length"
]);

type InternalKeyMap = Record<string, string>;

const encodeTime = (time: number) => {
  let value = time;
  let output = "";

  for (let index = 0; index < 10; index += 1) {
    output = CROCKFORD[value % 32] + output;
    value = Math.floor(value / 32);
  }

  return output;
};

const encodeRandom = () => {
  const bytes = randomBytes(16);
  let random = 0n;
  for (const byte of bytes) {
    random = (random << 8n) | BigInt(byte);
  }

  let output = "";
  for (let index = 0; index < 16; index += 1) {
    output = CROCKFORD[Number(random % 32n)] + output;
    random /= 32n;
  }

  return output;
};

const createUlid = () => `${encodeTime(Date.now())}${encodeRandom()}`;

const sha256Hex = (bytes: Uint8Array) =>
  createHash("sha256").update(bytes).digest("hex");

const readInternalSecret = () => {
  const keyId = process.env.STOCK_SERVICE_KEY_ID?.trim();
  const keysRaw = process.env.STOCK_SERVICE_INTERNAL_KEYS;

  if (!keyId || !keysRaw) {
    return null;
  }

  let parsed: InternalKeyMap;

  try {
    parsed = JSON.parse(keysRaw) as InternalKeyMap;
  } catch {
    return null;
  }

  const base64Secret = parsed[keyId];
  if (typeof base64Secret !== "string" || base64Secret.trim().length === 0) {
    return null;
  }

  try {
    return {
      keyId,
      subject: process.env.STOCK_SERVICE_SUBJECT?.trim() || "apps/stock-proxy",
      secret: Buffer.from(base64Secret, "base64")
    };
  } catch {
    return null;
  }
};

const cleanBaseUrl = () => {
  const raw = process.env.STOCK_SERVICE_URL?.trim() ?? "";
  if (raw.length === 0) {
    return "";
  }
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
};

const copyHeaders = (source: Headers) => {
  const headers = new Headers();

  for (const [name, value] of source.entries()) {
    if (!HOP_BY_HOP_HEADERS.has(name.toLowerCase())) {
      headers.set(name, value);
    }
  }

  return headers;
};

export const forwardStockServiceRequest = async ({
  request,
  method,
  path,
  queryString,
  bodyBytes
}: {
  request: Request;
  method: "GET" | "POST";
  path:
    | "/v1/events"
    | "/v1/qr/decode"
    | "/v1/receipts"
    | "/v1/projections/received-since-count";
  queryString?: string;
  bodyBytes: Uint8Array;
}) => {
  const baseUrl = cleanBaseUrl();
  const auth = readInternalSecret();

  if (!baseUrl || !auth) {
    return Response.json(
      { message: "Stock service proxy is not configured." },
      { status: 503 }
    );
  }

  const tenantId = request.headers.get("x-tenant-id")?.trim();
  if (!tenantId) {
    return Response.json(
      { message: "Missing x-tenant-id header." },
      { status: 400 }
    );
  }

  const requestId = request.headers.get("x-request-id")?.trim() || createUlid();
  const timestamp = Date.now().toString();
  const pathWithQuery = queryString && queryString.length > 0 ? `${path}?${queryString}` : path;
  const bodyHash = sha256Hex(bodyBytes);
  const canonicalString = `v1:${tenantId}:${requestId}:${timestamp}:${method}:${path}:${bodyHash}`;
  const signature = createHmac("sha256", auth.secret)
    .update(canonicalString)
    .digest("base64");

  const headers = new Headers();
  headers.set("x-tenant-id", tenantId);
  headers.set("x-request-id", requestId);
  headers.set("x-timestamp", timestamp);
  headers.set("x-internal-key-id", auth.keyId);
  headers.set("x-internal-signature", signature);
  headers.set("x-internal-subject", auth.subject);

  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("content-type", contentType);
  }

  const upstreamResponse = await fetch(`${baseUrl}${pathWithQuery}`, {
    method,
    headers,
    body: method === "POST" ? Buffer.from(bodyBytes) : undefined,
    cache: "no-store"
  });

  const responseHeaders = copyHeaders(upstreamResponse.headers);
  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders
  });
};
