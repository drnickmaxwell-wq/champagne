export type HealthStatus = {
  status: "ok";
  checkedAt: string;
  db: "ok";
};

export async function getHealthStatus(
  pool: { query: (text: string) => Promise<{ rows: unknown[] }> }
): Promise<HealthStatus> {
  await pool.query("SELECT 1");
  return {
    status: "ok",
    checkedAt: new Date().toISOString(),
    db: "ok"
  };
}

export * from "./schema";
export * from "./stockOps";
