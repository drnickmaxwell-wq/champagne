import { createServer } from "node:http";
import {
  appendEventAndApplyEffects,
  computeReorder,
  getHealthStatus,
  getScanResult,
  createProduct,
  listProducts,
  updateProduct
} from "@champagne/stock-db";
import {
  EventInputSchema,
  ProductCreateInputSchema,
  ProductUpdateInputSchema
} from "@champagne/stock-shared";
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

const parseProductCreatePayload = (body: unknown) => {
  return ProductCreateInputSchema.safeParse(body);
};

const parseProductUpdatePayload = (body: unknown) => {
  return ProductUpdateInputSchema.safeParse(body);
};

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);

  if (request.method === "GET" && url.pathname === "/health") {
    try {
      const health = await getHealthStatus(pool);
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify(health));
      return;
    } catch (error) {
      response.writeHead(500, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "Database unavailable." }));
      return;
    }
  }

  if (request.method === "GET" && url.pathname === "/products") {
    try {
      const products = await listProducts(pool, tenantId);
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify(products));
      return;
    } catch (error) {
      response.writeHead(500, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "Failed to load products." }));
      return;
    }
  }

  if (request.method === "POST" && url.pathname === "/products") {
    let body: unknown;

    try {
      body = await readJsonBody(request);
    } catch {
      response.writeHead(400, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "Invalid JSON body." }));
      return;
    }

    const parsed = parseProductCreatePayload(body);

    if (!parsed.success) {
      response.writeHead(400, { "content-type": "application/json" });
      response.end(
        JSON.stringify({ error: "Invalid payload.", details: parsed.error.flatten() })
      );
      return;
    }

    try {
      const product = await createProduct(pool, tenantId, parsed.data);
      response.writeHead(201, { "content-type": "application/json" });
      response.end(JSON.stringify(product));
      return;
    } catch (error) {
      response.writeHead(500, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "Failed to create product." }));
      return;
    }
  }

  if (request.method === "PATCH" && url.pathname.startsWith("/products/")) {
    const pathSegments = url.pathname.split("/");
    const productId = pathSegments[2] ?? "";
    if (pathSegments.length !== 3 || productId.length === 0) {
      response.writeHead(400, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "Product id is required." }));
      return;
    }

    let body: unknown;

    try {
      body = await readJsonBody(request);
    } catch {
      response.writeHead(400, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "Invalid JSON body." }));
      return;
    }

    const parsed = parseProductUpdatePayload(body);

    if (!parsed.success) {
      response.writeHead(400, { "content-type": "application/json" });
      response.end(
        JSON.stringify({ error: "Invalid payload.", details: parsed.error.flatten() })
      );
      return;
    }

    if (Object.keys(parsed.data).length === 0) {
      response.writeHead(400, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "No updates provided." }));
      return;
    }

    try {
      const product = await updateProduct(pool, tenantId, productId, parsed.data);
      if (!product) {
        response.writeHead(404, { "content-type": "application/json" });
        response.end(JSON.stringify({ error: "Product not found." }));
        return;
      }
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify(product));
      return;
    } catch (error) {
      response.writeHead(500, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "Failed to update product." }));
      return;
    }
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
      await appendEventAndApplyEffects(pool, tenantId, {
        ts: eventTs,
        eventType: payload.eventType,
        qtyDeltaUnits: payload.qtyDeltaUnits,
        userId: payload.userId,
        locationId: payload.locationId,
        productId: payload.productId,
        stockInstanceId: payload.stockInstanceId,
        meta: payload.meta
      });

      response.writeHead(201, { "content-type": "application/json" });
      response.end(JSON.stringify({ ok: true }));
      return;
    } catch (error) {
      if (error instanceof Error && error.message === "Stock instance not found.") {
        response.writeHead(404, { "content-type": "application/json" });
        response.end(
          JSON.stringify({ error: "Stock instance not found.", stockInstanceId: payload.stockInstanceId })
        );
        return;
      }

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
      const scanResult = await getScanResult(pool, tenantId, code);
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify(scanResult));
      return;
    } catch (error) {
      response.writeHead(500, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "Failed to resolve scan code." }));
      return;
    }
  }

  if (request.method === "GET" && url.pathname === "/reorder") {
    try {
      const suggestions = await computeReorder(pool, tenantId);
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
