import type { StockScanSession } from "@champagne/stock-shared";

const activeSession: StockScanSession = {
  id: "demo-session",
  status: "idle",
  startedAt: "pending"
};

export default function ScanPage() {
  return (
    <section>
      <h1>Scan</h1>
      <p>Scanner status: {activeSession.status}</p>
      <p>Session: {activeSession.id}</p>
    </section>
  );
}
