import ChampagnePageBuilder from "../../../(champagne)/_builder/ChampagnePageBuilder";

export default async function ChampagnePreviewPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolvedParams = await params;
  const slugSegments = resolvedParams.slug ?? [];
  const joined = slugSegments.join("/");
  const normalizedSlug = joined ? `/${joined}` : "/";

  return <ChampagnePageBuilder slug={normalizedSlug} previewMode />;
}
