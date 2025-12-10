import PageBuilder from "../../components/PageBuilder";

type PageParams = Promise<{ page: string }>;

export default async function SitePage({ params }: { params: PageParams }) {
  const resolved = await params;
  const pageId = decodeURIComponent(resolved.page);

  return <PageBuilder pageId={pageId} />;
}
