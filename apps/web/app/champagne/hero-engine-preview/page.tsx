import { HeroRenderer } from "../../components/hero/HeroRenderer";
import { DevPanel } from "./DevPanel";

type PreviewSearchParams = Promise<Record<string, string | string[] | undefined> | undefined> | undefined;

export default async function Page({ searchParams }: { searchParams?: PreviewSearchParams }) {
  const resolvedSearchParams = await searchParams;
  const variantParam = resolvedSearchParams?.variant;
  const variantId = Array.isArray(variantParam) ? variantParam[0] : variantParam;
  const prmParam = resolvedSearchParams?.prm;
  const prm = Array.isArray(prmParam) ? prmParam[0] === "1" : prmParam === "1";

  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "var(--surface-ink-soft)",
        color: "var(--text-high)",
      }}
    >
      <DevPanel variantId={variantId} prm={prm} />
      <HeroRenderer variantId={variantId || undefined} prm={prm} />
    </main>
  );
}
