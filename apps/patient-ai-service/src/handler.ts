import type { IncomingMessage, ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";
import { resolveAuthContext } from "./auth.js";
import { auditRecordSchema, type AuditOutcome, type AuditSink } from "./audit.js";
import { isToolAllowed, runTool, type PatientSummary, type ToolName } from "./tools/index.js";

export type HandlerDependencies = {
  auditSink: AuditSink;
  allowTools: ToolName[];
  now: () => Date;
  requestIdFactory?: () => string;
};

type ConverseBody = {
  message?: unknown;
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

      const writeAudit = async (
        outcome: AuditOutcome,
        reason?: string,
        toolsUsed?: string[]
      ) => {
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
          reason,
          toolsUsed
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

      const toolName: ToolName = "getPatientSummary";
      if (!isToolAllowed(toolName, dependencies.allowTools)) {
        await writeAudit("deny", "Tool not allowed.");
        json(response, 403, { error: "Tool not allowed.", requestId });
        return;
      }

      let toolResult: PatientSummary;
      try {
        toolResult = await runTool(toolName, authResult.context);
      } catch (error) {
        await writeAudit("deny", error instanceof Error ? error.message : "Tool execution failed.");
        json(response, 500, { error: "Tool execution failed.", requestId });
        return;
      }

      const reply = buildReply(body.message, toolResult);
      await writeAudit("allow", undefined, [toolName]);
      json(response, 200, {
        requestId,
        reply,
        toolResult
      });
      return;
    }

    json(response, 404, { error: "Not found" });
  };
};

const isRelatedQuestion = (message: string) => {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("appointment") ||
    normalized.includes("plan") ||
    normalized.includes("summary") ||
    normalized.includes("patient")
  );
};

const buildReply = (message: string, summary: PatientSummary) => {
  if (!isRelatedQuestion(message)) {
    return `I can share a patient summary for ${summary.patientId}, including next appointment and plan details when available. What would you like to know?`;
  }

  const lines: string[] = [`Patient ${summary.patientId} summary:`];

  if (summary.nextAppointment) {
    lines.push(
      `Next appointment: ${summary.nextAppointment.dateISO} (${summary.nextAppointment.type}).`
    );
  }

  if (summary.currentPlanSummary) {
    lines.push(`Current plan summary: ${summary.currentPlanSummary}`);
  }

  if (summary.notes) {
    lines.push(`Notes: ${summary.notes}`);
  }

  if (lines.length === 1) {
    lines.push("No additional summary details are available right now.");
  }

  return lines.join(" ");
};
