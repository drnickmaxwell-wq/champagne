export type HealthStatus = {
  status: "ok";
  checkedAt: string;
};

export async function getHealthStatus(): Promise<HealthStatus> {
  return {
    status: "ok",
    checkedAt: new Date().toISOString()
  };
}

export * from "./schema";
