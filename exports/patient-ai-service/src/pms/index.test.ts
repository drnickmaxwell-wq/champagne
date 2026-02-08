import { test } from "node:test";
import assert from "node:assert/strict";
import { getPmsAdapter, getPmsAdapterName } from "./index.js";
import { NullPmsAdapter } from "./adapters/null.js";
import { StubPmsAdapter } from "./adapters/stub.js";

const baseContext = {
  patientId: "patient-123",
  tenantId: "default"
};

test("stub adapter returns deterministic data", async () => {
  const adapter = StubPmsAdapter;
  const summary = await adapter.getPatientSummary(baseContext);
  const appointments = await adapter.listAppointments?.(baseContext);

  assert.ok(summary);
  assert.equal(summary.patientId, baseContext.patientId);
  assert.ok(Array.isArray(appointments));
});

test("null adapter returns empty responses", async () => {
  const adapter = NullPmsAdapter;
  const summary = await adapter.getPatientSummary(baseContext);
  const appointments = await adapter.listAppointments?.(baseContext);
  const planSummary = await adapter.getTreatmentPlanSummary?.(baseContext);

  assert.equal(summary, null);
  assert.deepEqual(appointments, []);
  assert.equal(planSummary, null);
});

test("adapter resolution switches by tenant", async () => {
  assert.equal(getPmsAdapterName("default"), "stub");
  assert.equal(getPmsAdapterName("unknown"), "null");
  assert.equal(getPmsAdapter("default"), StubPmsAdapter);
  assert.equal(getPmsAdapter("unknown"), NullPmsAdapter);
});
