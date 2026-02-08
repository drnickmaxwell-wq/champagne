import type { Appointment, PatientSummary, ToolContext } from "../../tools/types.js";
import type { PmsAdapter } from "../adapter.js";

const hashPatientId = (patientId: string) => {
  return [...patientId].reduce((total, char) => total + char.charCodeAt(0), 0);
};

const addDays = (baseIso: string, days: number) => {
  const date = new Date(baseIso);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString();
};

const buildAppointment = (hash: number): Appointment => {
  return {
    dateISO: addDays("2025-02-01T09:00:00.000Z", hash % 10),
    type: "hygiene-check"
  };
};

const buildStubSummary = (context: ToolContext) => {
  const hash = hashPatientId(context.patientId);
  const hasAppointment = hash % 2 === 0;
  const hasPlanSummary = hash % 3 === 0;
  const hasNotes = hash % 5 === 0;

  return {
    hash,
    hasAppointment,
    hasPlanSummary,
    hasNotes
  };
};

export const StubPmsAdapter: PmsAdapter = {
  async getPatientSummary(context: ToolContext): Promise<PatientSummary> {
    const { hash, hasAppointment, hasPlanSummary, hasNotes } = buildStubSummary(context);
    const summary: PatientSummary = {
      patientId: context.patientId
    };

    if (hasAppointment) {
      summary.nextAppointment = buildAppointment(hash);
    }

    if (hasPlanSummary) {
      summary.currentPlanSummary =
        "Routine follow-up plan with focus on preventive care and cleaning.";
    }

    if (hasNotes) {
      summary.notes = "Reminder: bring updated insurance information.";
    }

    return summary;
  },
  async listAppointments(context: ToolContext): Promise<Appointment[]> {
    const { hash, hasAppointment } = buildStubSummary(context);
    if (!hasAppointment) {
      return [];
    }
    return [buildAppointment(hash)];
  },
  async getTreatmentPlanSummary(context: ToolContext): Promise<string | null> {
    const { hasPlanSummary } = buildStubSummary(context);
    if (!hasPlanSummary) {
      return null;
    }
    return "Routine follow-up plan with focus on preventive care and cleaning.";
  }
};
