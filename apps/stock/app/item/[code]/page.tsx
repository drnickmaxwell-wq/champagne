import Link from "next/link";
import { fetchScan } from "../../lib/ops-api";

export default async function Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const result = await fetchScan(code);

  return (
    <section>
      <h1>Item: {code}</h1>
      <pre>{JSON.stringify(result, null, 2)}</pre>
      <p>
        <Link href="/scan">Back to scan</Link>
      </p>
      <p>
        <Link href="/reorder">View reorder list</Link>
      </p>
    </section>
  );
}
