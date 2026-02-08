export type AuditOutcome = "allow" | "deny";

export type AuditRecord = {
  requestId: string;
  patientId: string;
  tenantId: string;
  timestamp: string;
  action: "converse";
  outcome: AuditOutcome;
};

export type AuditSink = {
  write: (record: AuditRecord) => Promise<void> | void;
};

export class ConsoleAuditSink implements AuditSink {
  write(record: AuditRecord) {
    console.log(JSON.stringify({ audit: record }));
  }
}

export class MemoryAuditSink implements AuditSink {
  records: AuditRecord[] = [];

  write(record: AuditRecord) {
    this.records.push(record);
  }
}
