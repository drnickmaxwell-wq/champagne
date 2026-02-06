import { fetchReorder } from "../lib/ops-api";

export default async function ReorderPage() {
  const result = await fetchReorder();

  return (
    <section>
      <h1>Reorder</h1>
      <pre>{JSON.stringify(result, null, 2)}</pre>
      <p>Flat list for now; supplier grouping later.</p>
    </section>
  );
}
