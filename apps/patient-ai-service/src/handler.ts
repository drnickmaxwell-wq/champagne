import type { IncomingMessage, ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";
import { resolveAuthContext } from "./auth.js";
import { auditRecordSchema, type AuditOutcome, type AuditSink } from "./audit.js";
import { isToolAllowed, type ToolName, type ToolRegistry } from "./tools.js";

export type HandlerDependencies = {
  auditSink: AuditSink;
  allowTools: ToolName[];
  toolRegistry: ToolRegistry;
  now: () => Date;
  requestIdFactory?: () => string;
};

type ConverseBody = {
  message?: unknown;
  toolRequest?: {
    name?: unknown;
  };
};

const json = (response: ServerResponse, status: number, body: Record<string, unknown>) => {
  response.writeHead(status, {
    "content-type": "application/json",
    "cache-control": "no-store"
  });
  response.end(JSON.stringify(body));
};

const readJsonBody = async (request: IncomingMessage): Promise<unknown> => {
  return new Promise((resolve, reject) => {
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

export const createHandler = (dependencies: HandlerDependencies) => {
  const requestIdFactory = dependencies.requestIdFactory ?? (() => randomUUID());

  return async (request: IncomingMessage, response: ServerResponse) => {
    const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
    const method = request.method ?? "GET";

    if (method === "GET" && url.pathname === "/health") {
      json(response, 200, { status: "ok", service: "patient-ai-service", zone: "B" });
      return;
    }

    if (method === "POST" && url.pathname === "/v1/converse") {
      const requestId = request.headers["x-request-id"]
        ? String(request.headers["x-request-id"])
        : requestIdFactory();
      const authResult = resolveAuthContext(request);
      const timestamp = dependencies.now().toISOString();
      let auditWritten = false;

      const writeAudit = async (outcome: AuditOutcome, reason?: string) => {
        if (auditWritten) {
          return;
        }
        auditWritten = true;
        const record = auditRecordSchema.parse({
          requestId,
          patientId: authResult.context.patientId,
          tenantId: authResult.context.tenantId,
          ts: timestamp,
          zone: "B",
          action: "converse",
          outcome,
          reason
        });
        await dependencies.auditSink.write(record);
      };

      if (!authResult.ok) {
        await writeAudit("deny", authResult.reason);
        json(response, 401, { error: authResult.reason, requestId });
        return;
      }

      let body: ConverseBody;

      try {
        body = (await readJsonBody(request)) as ConverseBody;
      } catch {
        await writeAudit("deny", "Invalid JSON body.");
        json(response, 400, { error: "Invalid JSON body.", requestId });
        return;
      }

      if (typeof body.message !== "string" || body.message.trim().length === 0) {
        await writeAudit("deny", "Message is required.");
        json(response, 400, { error: "Message is required.", requestId });
        return;
      }

      if (body.toolRequest?.name) {
        const name = String(body.toolRequest.name);
        if (!isToolAllowed(name, dependencies.allowTools)) {
          await writeAudit("deny", "Tool not allowed.");
          json(response, 403, { error: "Tool not allowed.", requestId });
          return;
        }

        try {
          const toolResult = await dependencies.toolRegistry.execute(
            name as ToolName,
            authResult.context
          );
          await writeAudit("allow");
          json(response, 200, {
            requestId,
            reply: `Echo (Zone B): ${body.message}`,
            toolResult
          });
          return;
        } catch (error) {
          await writeAudit("deny", error instanceof Error ? error.message : "Tool execution failed.");
          json(response, 500, { error: "Tool execution failed.", requestId });
          return;
        }
      }

      await writeAudit("allow");
      json(response, 200, {
        requestId,
        reply: `Echo (Zone B): ${body.message}`
      });
      return;
    }

    json(response, 404, { error: "Not found" });
  };
};
