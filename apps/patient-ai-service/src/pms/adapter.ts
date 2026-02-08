import type { Appointment, PatientSummary, ToolContext } from "../tools/types.js";

export interface PmsAdapter {
  getPatientSummary: (context: ToolContext) => Promise<PatientSummary | null>;
  listAppointments?: (context: ToolContext) => Promise<Appointment[]>;
  getTreatmentPlanSummary?: (context: ToolContext) => Promise<string | null>;
}
