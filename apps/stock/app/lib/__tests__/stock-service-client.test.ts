import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createReceipt, decodeQr, fetchReceivedSinceCount } from "../stock-service-client";

type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

const createStorage = (): StorageLike => {
  const store = new Map<string, string>();
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value);
    }
  };
};

let storage: StorageLike;

beforeEach(() => {
  process.env.NEXT_PUBLIC_TENANT_ID = "tenant-test";
  storage = createStorage();
  vi.stubGlobal("window", { localStorage: storage });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});



describe("receipt helpers", () => {
  it("posts createReceipt payload to proxy", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ ok: true }), {
        status: 201,
        headers: { "content-type": "application/json" }
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    await createReceipt({
      receiveEventId: "01TEST",
      itemId: "item-1",
      qtyReceived: 2,
      receivedAt: "2026-01-01T00:00:00.000Z",
      correlationId: "01CORR",
      occurredAt: "2026-01-01T00:00:00.000Z",
      actor: {
        actorId: "stock-ui",
        actorType: "USER"
      }
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/stock/receipts",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "content-type": "application/json",
          "x-tenant-id": "tenant-test"
        })
      })
    );
  });

  it("adds location query when fetching projection", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ count: 4 }), {
        status: 200,
        headers: { "content-type": "application/json" }
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    await fetchReceivedSinceCount("loc-1");

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/stock/projections/received-since-count?locationId=loc-1",
      expect.objectContaining({
        headers: expect.objectContaining({ "x-tenant-id": "tenant-test" })
      })
    );
  });
});

describe("decodeQr", () => {
  it("returns decoded payload from proxy", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ ok: true, type: "ITEM", id: "item-1" }), {
        status: 200,
        headers: { "content-type": "application/json" }
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await decodeQr("V2:ITEM:item-1");

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/stock/qr/decode?payload=V2%3AITEM%3Aitem-1",
      expect.objectContaining({
        headers: expect.objectContaining({ "x-tenant-id": "tenant-test" })
      })
    );
    expect(result).toEqual({ ok: true, type: "ITEM", id: "item-1" });
  });

  it("returns decode failure in local-only mode", async () => {
    storage.setItem("stock.localOnlyMode", "true");

    const result = await decodeQr("V2:ITEM:item-1");

    expect(result.ok).toBe(false);
    expect(result.errorCode).toBe("DECODE_FAILED");
  });
});
