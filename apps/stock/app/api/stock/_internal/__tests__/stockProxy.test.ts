import assert from "node:assert/strict";
import { createHash, createHmac } from "node:crypto";
import { describe, test } from "vitest";
import { buildV2CanonicalString, forwardStockServiceRequest } from "../stockProxy";

const secret = Buffer.from("0123456789abcdef0123456789abcdef");
const secretBase64 = secret.toString("base64");
const vector = {
  tenantId: "tenant-a",
  requestId: "req-vector-001",
  timestamp: "1763683200123",
  method: "POST",
  requestTarget: "/v1/events?b=2&a=1",
  keyId: "kid-vector-1",
  subject: "vector-producer",
  bodyBytes: Buffer.from('{"b":2, "a":1}', "utf8")
};

describe("Stock V2 producer", () => {
test("matches the Stock V2 golden canonical string and signature", () => {
  const canonical = buildV2CanonicalString(vector);
  assert.equal(
    canonical,
    "v2:dGVuYW50LWE:cmVxLXZlY3Rvci0wMDE:1763683200123:POST:L3YxL2V2ZW50cz9iPTImYT0x:a2lkLXZlY3Rvci0x:dmVjdG9yLXByb2R1Y2Vy:d0ed52f9264c29a600df1013daf0d1661f8f23390be6b58008de7e7d33c01080"
  );
  assert.equal(
    createHmac("sha256", secret).update(canonical).digest("base64"),
    "5Q6gJQTK/FY7nEb1rr4NdoipGtCV8QwmhQipBIpk2ls="
  );
});

test("binds exact bytes, target spelling, and empty GET bodies", () => {
  const emptyGet = buildV2CanonicalString({
    ...vector,
    method: "GET",
    requestTarget: "/v1/events?streamId=one&streamId=two",
    requestId: "req-vector-002",
    timestamp: "1763683200456",
    bodyBytes: new Uint8Array()
  });
  assert.match(emptyGet, /:GET:L3YxL2V2ZW50cz9zdHJlYW1JZD1vbmUmc3RyZWFtSWQ9dHdv:/u);
  assert.notEqual(
    buildV2CanonicalString({ ...vector, bodyBytes: Buffer.from("mutated") }),
    buildV2CanonicalString(vector)
  );
  assert.notEqual(
    buildV2CanonicalString({ ...vector, requestTarget: "/v1/events?a=1&b=2" }),
    buildV2CanonicalString(vector)
  );
  assert.equal(createHash("sha256").update(new Uint8Array()).digest("hex"), "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
});

test("rejects malformed targets and unsafe methods", () => {
  for (const requestTarget of ["/v1/events?", "https://stock/v1/events", "/v1/events#fragment", "/v1/events?bad=%ZZ"]) {
    assert.throws(() => buildV2CanonicalString({ ...vector, requestTarget }));
  }
  assert.throws(() => buildV2CanonicalString({ ...vector, method: "GET POST" }));
});

test("fails closed for duplicate, unknown, malformed, and legacy configuration", async () => {
  const originalFetch = globalThis.fetch;
  let forwardedRequest: Request | undefined;
  globalThis.fetch = async (input, init) => {
    forwardedRequest = new Request(input, init);
    return new Response("ok");
  };
  const request = new Request("https://champagne.test/api/stock/events", {
    method: "POST",
    headers: { "x-tenant-id": "tenant-a", "x-request-id": "req-1" },
    body: vector.bodyBytes
  });
  try {
    process.env.STOCK_SERVICE_URL = "https://stock.test";
    process.env.STOCK_SERVICE_KEY_ID = vector.keyId;
    process.env.STOCK_SERVICE_SUBJECT = vector.subject;
    process.env.STOCK_SERVICE_INTERNAL_KEYS = JSON.stringify({ [vector.keyId]: secretBase64 });
    process.env.INTERNAL_HMAC_SECRET = Buffer.from("legacy-secret").toString("base64");
    const response = await forwardStockServiceRequest({ request, method: "POST", path: "/v1/events", bodyBytes: vector.bodyBytes });
    assert.equal(response.status, 200);
    assert.equal(forwardedRequest?.url, "https://stock.test/v1/events");
    assert.equal(forwardedRequest?.headers.get("x-internal-signature-version"), "v2");
    assert.deepEqual(Buffer.from(await forwardedRequest!.arrayBuffer()), vector.bodyBytes);

    process.env.STOCK_SERVICE_KEY_ID = "unknown";
    assert.equal((await forwardStockServiceRequest({ request, method: "POST", path: "/v1/events", bodyBytes: vector.bodyBytes })).status, 503);
    process.env.STOCK_SERVICE_KEY_ID = vector.keyId;
    process.env.STOCK_SERVICE_INTERNAL_KEYS = `{"${vector.keyId}":"${secretBase64}","${vector.keyId}":"${secretBase64}"}`;
    assert.equal((await forwardStockServiceRequest({ request, method: "POST", path: "/v1/events", bodyBytes: vector.bodyBytes })).status, 503);
  } finally {
    globalThis.fetch = originalFetch;
    for (const name of ["STOCK_SERVICE_URL", "STOCK_SERVICE_KEY_ID", "STOCK_SERVICE_SUBJECT", "STOCK_SERVICE_INTERNAL_KEYS", "INTERNAL_HMAC_SECRET"]) delete process.env[name];
  }
});
});
