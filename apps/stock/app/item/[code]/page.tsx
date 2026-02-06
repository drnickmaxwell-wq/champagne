import Link from "next/link";
import { fetchScan } from "../../lib/ops-api";

type ItemPageProps = {
  params: {
    code: string;
  };
};

export default async function ItemPage({ params }: ItemPageProps) {
  const result = await fetchScan(params.code);

  return (
    <section>
      <h1>Item: {params.code}</h1>
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
