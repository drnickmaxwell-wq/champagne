import { cookies } from "next/headers";
import PortalShell from "./portal-shell";

export default async function Page() {
  const cookieStore = await cookies();
  const patientId = cookieStore.get("patientId")?.value ?? null;

  return <PortalShell initialPatientId={patientId} />;
}
