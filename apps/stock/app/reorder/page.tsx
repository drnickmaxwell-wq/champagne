import type { ReorderRequest } from "@champagne/stock-shared";

const draftRequest: ReorderRequest = {
  itemCode: "DEMO-001",
  requestedBy: "ops-demo",
  quantity: 1
};

export default function ReorderPage() {
  return (
    <section>
      <h1>Reorder</h1>
      <p>Item: {draftRequest.itemCode}</p>
      <p>Quantity: {draftRequest.quantity}</p>
      <p>Requested by: {draftRequest.requestedBy}</p>
    </section>
  );
}
