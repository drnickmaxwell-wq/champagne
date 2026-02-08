import { createServer } from "node:http";
import { once } from "node:events";
import { test } from "node:test";
import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import { ConsoleAuditSink, MemoryAuditSink, type AuditSink } from "./audit.js";
import { createHandler } from "./handler.js";
import { createToolRegistry } from "./tools.js";

const startServer = async (auditSink: AuditSink) => {
  const server = createServer(
    createHandler({
      auditSink,
      allowTools: ["readPatientPlanSummary", "listAppointments"],
      toolRegistry: createToolRegistry(),
      now: () => new Date("2025-01-01T00:00:00.000Z"),
      requestIdFactory: () => "req-123"
    })
  );

  server.listen(0);
  await once(server, "listening");
  const address = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${address.port}`;

  return { server, baseUrl };
};

test("returns 401 when patient header is missing", async () => {
  const auditSink = new MemoryAuditSink();
  const { server, baseUrl } = await startServer(auditSink);

  const response = await fetch(`${baseUrl}/v1/converse`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-tenant-id": "tenant-001"
    },
    body: JSON.stringify({ message: "hello" })
  });

  assert.equal(response.status, 401);
  assert.equal(auditSink.records.length, 1);
  assert.equal(auditSink.records[0]?.outcome, "deny");

  server.close();
});

test("emits audit record when request is allowed", async () => {
  const auditSink = new MemoryAuditSink();
  const { server, baseUrl } = await startServer(auditSink);

  const response = await fetch(`${baseUrl}/v1/converse`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-patient-id": "patient-001",
      "x-tenant-id": "tenant-001"
    },
    body: JSON.stringify({ message: "hello" })
  });

  assert.equal(response.status, 200);
  assert.equal(auditSink.records.length, 1);
  assert.equal(auditSink.records[0]?.outcome, "allow");
  assert.equal(auditSink.records[0]?.patientId, "patient-001");

  server.close();
});

test("denies tool execution when tool is not allowlisted", async () => {
  const auditSink = new MemoryAuditSink();
  const { server, baseUrl } = await startServer(auditSink);

  const response = await fetch(`${baseUrl}/v1/converse`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-patient-id": "patient-002",
      "x-tenant-id": "tenant-002"
    },
    body: JSON.stringify({ message: "hello", toolRequest: { name: "exportRecords" } })
  });

  assert.equal(response.status, 403);
  assert.equal(auditSink.records.length, 1);
  assert.equal(auditSink.records[0]?.outcome, "deny");

  server.close();
});

test("logs avoid raw message content", async () => {
  const auditSink = new ConsoleAuditSink();
  const logs: string[] = [];
  const originalLog = console.log;
  console.log = (...args: unknown[]) => {
    logs.push(args.map((entry) => String(entry)).join(" "));
  };

  try {
    const { server, baseUrl } = await startServer(auditSink);

    const response = await fetch(`${baseUrl}/v1/converse`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-patient-id": "patient-003",
        "x-tenant-id": "tenant-003"
      },
      body: JSON.stringify({ message: "super secret message" })
    });

    assert.equal(response.status, 200);
    assert.equal(logs.some((entry) => entry.includes("super secret message")), false);

    server.close();
  } finally {
    console.log = originalLog;
  }
});
