export type ToolName = "getPatientSummary";

export type ToolContext = {
  patientId: string;
  tenantId: string;
};

export type PatientSummary = {
  patientId: string;
  nextAppointment?: {
    dateISO: string;
    type: string;
  };
  currentPlanSummary?: string;
  notes?: string;
};
