import { createServer } from "node:http";
import {
  appendEventAndUpdateQty,
  computeReorderSuggestions,
  getHealthStatus,
  lookupQrCode
} from "@champagne/stock-db";
import { EventInputSchema } from "@champagne/stock-shared";
import { Pool } from "pg";

const port = Number(process.env.PORT ?? 4001);

const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (typeof value === "string" && value.trim() !== "") {
    return value;
  }
  throw new Error(`Missing required env: ${name}`);
};

const optionalEnv = (name: string, fallback: string): string => {
  const value = process.env[name];
  return typeof value === "string" && value.trim() !== "" ? value : fallback;
};

const connectionString = requireEnv("STOCK_DATABASE_URL");
// Dev fallback only; override STOCK_TENANT_ID in real environments.
const tenantId = optionalEnv("STOCK_TENANT_ID", "00000000-0000-0000-0000-000000000001");

const pool = new Pool({ connectionString });

const readJsonBody = async (request: { on: (event: string, cb: (data: any) => void) => void }) => {
  return new Promise<unknown>((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += String(chunk);
    });
    request.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
};

const parseEventPayload = (body: unknown) => {
  return EventInputSchema.safeParse(body);
};

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);

  if (request.method === "GET" && url.pathname === "/health") {
    const health = await getHealthStatus();
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify(health));
    return;
  }

  if (request.method === "POST" && url.pathname === "/events") {
    let body: unknown;

    try {
      body = await readJsonBody(request);
    } catch {
      response.writeHead(400, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "Invalid JSON body." }));
      return;
    }

    const parsed = parseEventPayload(body);

    if (!parsed.success) {
      response.writeHead(400, { "content-type": "application/json" });
      response.end(
        JSON.stringify({ error: "Invalid payload.", details: parsed.error.flatten() })
      );
      return;
    }

    const payload = parsed.data;
    const eventTs = payload.ts ? new Date(payload.ts) : new Date();
    try {
      const writeResult = await appendEventAndUpdateQty(pool, tenantId, {
        ts: eventTs,
        eventType: payload.eventType,
        qtyDeltaUnits: payload.qtyDeltaUnits,
        userId: payload.userId,
        locationId: payload.locationId,
        productId: payload.productId,
        stockInstanceId: payload.stockInstanceId,
        meta: payload.meta
      });

      if (writeResult.status === "NOT_FOUND") {
        response.writeHead(404, { "content-type": "application/json" });
        response.end(
          JSON.stringify({ error: "Stock instance not found.", stockInstanceId: payload.stockInstanceId })
        );
        return;
      }

      response.writeHead(201, { "content-type": "application/json" });
      response.end(
        JSON.stringify({
          eventId: writeResult.eventId,
          stockInstance: writeResult.stockInstance
        })
      );
      return;
    } catch (error) {
      response.writeHead(500, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "Failed to write event." }));
      return;
    }
  }

  if (request.method === "GET" && url.pathname.startsWith("/scan/")) {
    const code = decodeURIComponent(url.pathname.slice("/scan/".length));
    if (!code) {
      response.writeHead(400, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "Scan code is required." }));
      return;
    }

    try {
      const lookupResult = await lookupQrCode(pool, tenantId, code);

      if (lookupResult.type === "LOCATION") {
        response.writeHead(200, { "content-type": "application/json" });
        response.end(
          JSON.stringify({
            result: "LOCATION",
            locationId: lookupResult.location.id,
            name: lookupResult.location.name,
            locationType: lookupResult.location.type,
            products: lookupResult.products
          })
        );
        return;
      }

      if (lookupResult.type === "STOCK_INSTANCE") {
        response.writeHead(200, { "content-type": "application/json" });
        response.end(
          JSON.stringify({
            result: "STOCK_INSTANCE",
            stockInstance: lookupResult.stockInstance,
            product: lookupResult.product,
            location: lookupResult.location
          })
        );
        return;
      }

      if (lookupResult.type === "PRODUCT_WITHDRAW") {
        response.writeHead(200, { "content-type": "application/json" });
        response.end(
          JSON.stringify({
            result: "PRODUCT_WITHDRAW",
            product: lookupResult.product
          })
        );
        return;
      }

      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({ result: "UNMATCHED", scannedCode: code }));
      return;
    } catch (error) {
      response.writeHead(500, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "Failed to resolve scan code." }));
      return;
    }
  }

  if (request.method === "GET" && url.pathname === "/reorder") {
    try {
      const suggestions = await computeReorderSuggestions(pool, tenantId);
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify(suggestions));
      return;
    } catch (error) {
      response.writeHead(500, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "Failed to load reorder suggestions." }));
      return;
    }
  }

  response.writeHead(404, { "content-type": "application/json" });
  response.end(JSON.stringify({ error: "Not found" }));
});

server.listen(port, () => {
  console.log(`ops-api listening on ${port}`);
});
