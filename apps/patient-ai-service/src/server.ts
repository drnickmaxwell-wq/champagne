import { createServer } from "node:http";
import { ConsoleAuditSink } from "./audit.js";
import { createHandler } from "./handler.js";
import { createToolRegistry } from "./tools.js";

const port = Number(process.env.PORT ?? 4010);

const server = createServer(
  createHandler({
    auditSink: new ConsoleAuditSink(),
    allowTools: ["readPatientPlanSummary", "listAppointments"],
    toolRegistry: createToolRegistry(),
    now: () => new Date()
  })
);

server.listen(port, () => {
  console.log(`patient-ai-service listening on ${port}`);
});
