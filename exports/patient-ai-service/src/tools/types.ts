export type ToolName = "getPatientSummary";

export type ToolContext = {
  patientId: string;
  tenantId: string;
};

export type Appointment = {
  dateISO: string;
  type: string;
};

export type PatientSummary = {
  patientId: string;
  nextAppointment?: Appointment;
  currentPlanSummary?: string;
  notes?: string;
};
