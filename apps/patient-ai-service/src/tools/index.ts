import { getPatientSummaryStub } from "./impl/stub.js";
import type { PatientSummary, ToolContext, ToolName } from "./types.js";

const toolImplementations: Record<ToolName, (context: ToolContext) => PatientSummary> = {
  getPatientSummary: (context) => getPatientSummaryStub(context)
};

export const runTool = async (name: ToolName, context: ToolContext): Promise<PatientSummary> => {
  const handler = toolImplementations[name];
  return handler(context);
};

export const isToolAllowed = (name: string, allowList: ToolName[]) => {
  return allowList.includes(name as ToolName);
};

export type { PatientSummary, ToolContext, ToolName };
