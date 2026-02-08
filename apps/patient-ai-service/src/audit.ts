import { z } from "zod";

export const auditRecordSchema = z.object({
  requestId: z.string().min(1),
  tenantId: z.string().min(1),
  patientId: z.string().min(1),
  ts: z.string().min(1),
  zone: z.literal("B"),
  action: z.literal("converse"),
  outcome: z.enum(["allow", "deny"]),
  reason: z.string().min(1).optional(),
  toolsUsed: z.array(z.string().min(1)).optional()
});

export type AuditOutcome = z.infer<typeof auditRecordSchema>["outcome"];
export type AuditRecord = z.infer<typeof auditRecordSchema>;

export type AuditSink = {
  write: (record: AuditRecord) => Promise<void> | void;
};

export class ConsoleAuditSink implements AuditSink {
  write(record: AuditRecord) {
    console.log(
      JSON.stringify({
        audit: {
          requestId: record.requestId,
          tenantId: record.tenantId,
          patientId: record.patientId,
          outcome: record.outcome
        }
      })
    );
  }
}

export class MemoryAuditSink implements AuditSink {
  records: AuditRecord[] = [];

  write(record: AuditRecord) {
    this.records.push(record);
  }
}
