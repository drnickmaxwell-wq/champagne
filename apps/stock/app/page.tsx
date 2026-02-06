import Link from "next/link";

export default function HomePage() {
  return (
    <section>
      <h1>Stock Module</h1>
      <p>Stub routes for the stock workflow.</p>
      <ul>
        <li>
          <Link href="/scan">Scan</Link>
        </li>
        <li>
          <Link href="/item/DEMO-001">Item</Link>
        </li>
        <li>
          <Link href="/reorder">Reorder</Link>
        </li>
      </ul>
    </section>
  );
}
