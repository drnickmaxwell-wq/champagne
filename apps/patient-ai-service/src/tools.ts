export type ToolName = "readPatientPlanSummary" | "listAppointments";

export type ToolContext = {
  patientId: string;
  tenantId: string;
};

export type ToolResult = {
  name: ToolName;
  data: Record<string, unknown>;
};

export type ToolRegistry = {
  execute: (name: ToolName, context: ToolContext) => Promise<ToolResult>;
};

const toolImplementations: Record<ToolName, (context: ToolContext) => ToolResult> = {
  readPatientPlanSummary: (context) => ({
    name: "readPatientPlanSummary",
    data: {
      patientId: context.patientId,
      summary: "Stubbed care plan summary.",
      updatedAt: "2025-01-01T00:00:00.000Z"
    }
  }),
  listAppointments: (context) => ({
    name: "listAppointments",
    data: {
      patientId: context.patientId,
      appointments: [
        {
          id: "appt-001",
          when: "2025-02-01T09:00:00.000Z",
          status: "scheduled"
        }
      ]
    }
  })
};

export const createToolRegistry = (): ToolRegistry => {
  return {
    execute: async (name, context) => {
      const handler = toolImplementations[name];
      return handler(context);
    }
  };
};

export const isToolAllowed = (name: string, allowList: ToolName[]) => {
  return allowList.includes(name as ToolName);
};
