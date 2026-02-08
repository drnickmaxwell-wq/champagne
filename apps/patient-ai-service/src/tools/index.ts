import { getPmsAdapter, getPmsAdapterName, type PmsAdapterName } from "../pms/index.js";
import type { PatientSummary, ToolContext, ToolName } from "./types.js";

const toolImplementations: Record<
  ToolName,
  (context: ToolContext) => Promise<{ result: PatientSummary | null; adapterName: PmsAdapterName }>
> = {
  getPatientSummary: async (context) => {
    const adapter = getPmsAdapter(context.tenantId);
    return {
      result: await adapter.getPatientSummary(context),
      adapterName: getPmsAdapterName(context.tenantId)
    };
  }
};

export const runTool = async (
  name: ToolName,
  context: ToolContext
): Promise<{ result: PatientSummary | null; adapterName: PmsAdapterName }> => {
  const handler = toolImplementations[name];
  return handler(context);
};

export const isToolAllowed = (name: string, allowList: ToolName[]) => {
  return allowList.includes(name as ToolName);
};

export type { PatientSummary, ToolContext, ToolName };
