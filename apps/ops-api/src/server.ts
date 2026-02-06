import { createServer } from "node:http";
import { getHealthStatus } from "@champagne/stock-db";
import { EventTypeSchema } from "@champagne/stock-shared";
import { Pool } from "pg";
import { z } from "zod";

const port = Number(process.env.PORT ?? 4001);
const connectionString = process.env.DATABASE_URL;
const TENANT_ID = "00000000-0000-0000-0000-000000000000";

if (!connectionString) {
  throw new Error("DATABASE_URL is required for ops-api.");
}

const pool = new Pool({ connectionString });

const EventPayloadSchema = z
  .object({
    ts: z.string().datetime().optional(),
    created_at: z.string().datetime().optional(),
    event_type: EventTypeSchema,
    qty_delta_units: z.number().int(),
    user_id: z.string().uuid().optional(),
    location_id: z.string().uuid().optional(),
    product_id: z.string().uuid().optional(),
    stock_instance_id: z.string().uuid().optional(),
    meta_json: z.record(z.unknown()).optional()
  })
  .superRefine((data, ctx) => {
    if (!data.ts && !data.created_at) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "ts or created_at is required."
      });
    }
  });

type EventPayload = z.infer<typeof EventPayloadSchema>;

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
  return EventPayloadSchema.safeParse(body);
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

    const payload: EventPayload = parsed.data;
    const eventTs = payload.ts ?? payload.created_at;
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      if (payload.stock_instance_id) {
        const updateResult = await client.query(
          "UPDATE stock_instances SET qty_remaining = qty_remaining + $1 WHERE id = $2 AND tenant_id = $3 RETURNING id",
          [payload.qty_delta_units, payload.stock_instance_id, TENANT_ID]
        );

        if (updateResult.rowCount === 0) {
          await client.query("ROLLBACK");
          response.writeHead(404, { "content-type": "application/json" });
          response.end(
            JSON.stringify({ error: "Stock instance not found.", stock_instance_id: payload.stock_instance_id })
          );
          return;
        }
      }

      const insertResult = await client.query(
        "INSERT INTO events (tenant_id, ts, user_id, location_id, product_id, stock_instance_id, event_type, qty_delta_units, meta_json) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id",
        [
          TENANT_ID,
          eventTs,
          payload.user_id ?? null,
          payload.location_id ?? null,
          payload.product_id ?? null,
          payload.stock_instance_id ?? null,
          payload.event_type,
          payload.qty_delta_units,
          payload.meta_json ?? null
        ]
      );

      await client.query("COMMIT");

      response.writeHead(201, { "content-type": "application/json" });
      response.end(JSON.stringify({ id: insertResult.rows[0]?.id }));
      return;
    } catch (error) {
      await client.query("ROLLBACK");
      response.writeHead(500, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "Failed to write event." }));
      return;
    } finally {
      client.release();
    }
  }

  if (request.method === "GET" && url.pathname === "/reorder") {
    try {
      const result = await pool.query(
        "SELECT p.id, p.name, p.variant, p.min_level_units, p.max_level_units, p.supplier_hint, p.unit_label, p.pack_size_units, COALESCE(SUM(si.qty_remaining), 0) AS available_units FROM products p LEFT JOIN stock_instances si ON si.product_id = p.id AND si.tenant_id = p.tenant_id WHERE p.tenant_id = $1 GROUP BY p.id, p.name, p.variant, p.min_level_units, p.max_level_units, p.supplier_hint, p.unit_label, p.pack_size_units",
        [TENANT_ID]
      );

      if (result.rowCount === 0) {
        response.writeHead(200, { "content-type": "application/json" });
        response.end(JSON.stringify([]));
        return;
      }

      const suggestions = result.rows
        .map((row) => {
          const availableUnits = Number(row.available_units);
          const minLevelUnits = Number(row.min_level_units);
          const maxLevelUnits = Number(row.max_level_units);

          if (availableUnits >= minLevelUnits) {
            return null;
          }

          const suggestedOrderUnits = Math.max(0, maxLevelUnits - availableUnits);

          return {
            product_id: row.id,
            name: row.name,
            variant: row.variant ?? null,
            available_units: availableUnits,
            min_level_units: minLevelUnits,
            max_level_units: maxLevelUnits,
            suggested_order_units: suggestedOrderUnits,
            supplier_hint: row.supplier_hint ?? null,
            unit_label: row.unit_label,
            pack_size_units: Number(row.pack_size_units)
          };
        })
        .filter((item) => item !== null);

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
