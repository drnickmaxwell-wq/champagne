import type { Appointment } from "../../tools/types.js";
import type { PmsAdapter } from "../adapter.js";

export const NullPmsAdapter: PmsAdapter = {
  async getPatientSummary(): Promise<null> {
    return null;
  },
  async listAppointments(): Promise<Appointment[]> {
    return [];
  },
  async getTreatmentPlanSummary(): Promise<null> {
    return null;
  }
};
