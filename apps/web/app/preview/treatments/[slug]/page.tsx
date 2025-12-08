import ChampagnePageBuilder from "../../../(champagne)/_builder/ChampagnePageBuilder";

export default async function PreviewTreatmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const pageSlug = `/treatments/${slug}`;

  return <ChampagnePageBuilder slug={pageSlug} previewMode />;
}
