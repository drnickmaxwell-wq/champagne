import type { PatientSummary, ToolContext } from "../types.js";

const hashPatientId = (patientId: string) => {
  return [...patientId].reduce((total, char) => total + char.charCodeAt(0), 0);
};

const addDays = (baseIso: string, days: number) => {
  const date = new Date(baseIso);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString();
};

export const getPatientSummaryStub = (context: ToolContext): PatientSummary => {
  const hash = hashPatientId(context.patientId);
  const hasAppointment = hash % 2 === 0;
  const hasPlanSummary = hash % 3 === 0;
  const hasNotes = hash % 5 === 0;

  const summary: PatientSummary = {
    patientId: context.patientId
  };

  if (hasAppointment) {
    summary.nextAppointment = {
      dateISO: addDays("2025-02-01T09:00:00.000Z", hash % 10),
      type: "hygiene-check"
    };
  }

  if (hasPlanSummary) {
    summary.currentPlanSummary =
      "Routine follow-up plan with focus on preventive care and cleaning.";
  }

  if (hasNotes) {
    summary.notes = "Reminder: bring updated insurance information.";
  }

  return summary;
};
