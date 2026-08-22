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

const KEY_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/u;
const BASE64_PATTERN = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/u;

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

const encodeCanonicalField = (value: string) =>
  Buffer.from(value, "utf8").toString("base64url");

const decodeStrictBase64 = (value: string) => {
  if (!BASE64_PATTERN.test(value) || value.length === 0) {
    return null;
  }

  const decoded = Buffer.from(value, "base64");
  return decoded.length > 0 && decoded.toString("base64") === value ? decoded : null;
};

const assertSafeText = (name: string, value: string, maxLength: number | null = 256) => {
  if (
    value.length === 0 ||
    (maxLength !== null && value.length > maxLength) ||
    /[\u0000-\u001f\u007f]/u.test(value)
  ) {
    throw new Error(`Invalid ${name}`);
  }
};

export const buildV2CanonicalString = ({
  tenantId,
  requestId,
  timestamp,
  method,
  requestTarget,
  keyId,
  subject,
  bodyBytes
}: {
  tenantId: string;
  requestId: string;
  timestamp: string;
  method: string;
  requestTarget: string;
  keyId: string;
  subject: string;
  bodyBytes: Uint8Array;
}) => {
  assertSafeText("tenant id", tenantId);
  assertSafeText("request id", requestId);
  assertSafeText("timestamp", timestamp);
  assertSafeText("request target", requestTarget, null);
  assertSafeText("key id", keyId);
  assertSafeText("subject", subject);

  const queryDelimiterIndex = requestTarget.indexOf("?");
  if (
    !/^\/[^\s]*$/u.test(requestTarget) ||
    requestTarget.startsWith("//") ||
    requestTarget.includes("\\") ||
    requestTarget.includes("#") ||
    (queryDelimiterIndex >= 0 && queryDelimiterIndex === requestTarget.length - 1) ||
    /%(?![0-9A-Fa-f]{2})/u.test(requestTarget)
  ) {
    throw new Error("Request target must be an origin-form target");
  }

  const normalizedMethod = method.toUpperCase();
  if (!/^[A-Z]+$/u.test(normalizedMethod)) {
    throw new Error("Invalid HTTP method");
  }

  return [
    "v2",
    encodeCanonicalField(tenantId),
    encodeCanonicalField(requestId),
    timestamp,
    normalizedMethod,
    encodeCanonicalField(requestTarget),
    encodeCanonicalField(keyId),
    encodeCanonicalField(subject),
    sha256Hex(bodyBytes)
  ].join(":");
};

const hasOwn = (value: object, key: PropertyKey) =>
  Object.prototype.hasOwnProperty.call(value, key);

const rejectDuplicateTopLevelKeyIds = (raw: string) => {
  let index = 0;
  const skipWhitespace = () => {
    while (/\s/u.test(raw[index] ?? "")) index += 1;
  };
  const skipString = () => {
    index += 1;
    while (index < raw.length) {
      if (raw[index] === "\\") index += 2;
      else if (raw[index++] === '"') return;
    }
    throw new Error("Invalid JSON string");
  };
  const skipValue = () => {
    const opening = raw[index];
    if (opening === '"') return skipString();
    if (opening !== "{" && opening !== "[") {
      while (index < raw.length && !",}".includes(raw[index] ?? "")) index += 1;
      return;
    }
    const closing = opening === "{" ? "}" : "]";
    let depth = 0;
    while (index < raw.length) {
      if (raw[index] === '"') skipString();
      else {
        if (raw[index] === opening) depth += 1;
        if (raw[index] === closing && --depth === 0) {
          index += 1;
          return;
        }
        index += 1;
      }
    }
    throw new Error("Invalid JSON value");
  };

  skipWhitespace();
  if (raw[index++] !== "{") return;
  const keys = new Set<string>();
  skipWhitespace();
  while (raw[index] !== "}") {
    if (raw[index] !== '"') throw new Error("Invalid JSON object");
    const start = index;
    skipString();
    const key = JSON.parse(raw.slice(start, index)) as string;
    if (keys.has(key)) throw new Error("Duplicate key id");
    keys.add(key);
    skipWhitespace();
    if (raw[index++] !== ":") throw new Error("Invalid JSON object");
    skipWhitespace();
    skipValue();
    skipWhitespace();
    if (raw[index] === ",") {
      index += 1;
      skipWhitespace();
    } else if (raw[index] !== "}") {
      throw new Error("Invalid JSON object");
    }
  }
};

const readInternalSecret = () => {
  const keyId = process.env.STOCK_SERVICE_KEY_ID?.trim();
  const keysRaw = process.env.STOCK_SERVICE_INTERNAL_KEYS;

  if (!keyId || !keysRaw) {
    return null;
  }

  let parsed: InternalKeyMap;

  try {
    rejectDuplicateTopLevelKeyIds(keysRaw);
    parsed = JSON.parse(keysRaw) as InternalKeyMap;
  } catch {
    return null;
  }

  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return null;
  }

  if (!KEY_ID_PATTERN.test(keyId) || !hasOwn(parsed, keyId)) {
    return null;
  }

  const base64Secret = parsed[keyId];
  const secret = typeof base64Secret === "string" ? decodeStrictBase64(base64Secret) : null;
  const subject = process.env.STOCK_SERVICE_SUBJECT?.trim();
  if (!secret || secret.length < 16 || !subject) {
    return null;
  }

  return { keyId, subject, secret };
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
  path: "/v1/events" | "/v1/qr/decode";
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
  const requestTarget = queryString && queryString.length > 0 ? `${path}?${queryString}` : path;
  if (method === "GET" && bodyBytes.length > 0) {
    return Response.json(
      { message: "GET requests must not carry a body." },
      { status: 400 }
    );
  }

  let canonicalString: string;
  try {
    canonicalString = buildV2CanonicalString({
      tenantId,
      requestId,
      timestamp,
      method,
      requestTarget,
      keyId: auth.keyId,
      subject: auth.subject,
      bodyBytes
    });
  } catch {
    return Response.json(
      { message: "Invalid Stock service request target." },
      { status: 400 }
    );
  }

  const signature = createHmac("sha256", auth.secret)
    .update(canonicalString)
    .digest("base64");

  const headers = new Headers();
  headers.set("x-tenant-id", tenantId);
  headers.set("x-request-id", requestId);
  headers.set("x-timestamp", timestamp);
  headers.set("x-internal-key-id", auth.keyId);
  headers.set("x-internal-signature-version", "v2");
  headers.set("x-internal-signature", signature);
  headers.set("x-internal-subject", auth.subject);

  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("content-type", contentType);
  }

  const upstreamResponse = await fetch(`${baseUrl}${requestTarget}`, {
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
