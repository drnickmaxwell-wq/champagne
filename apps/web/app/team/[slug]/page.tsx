import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  buildTeamMemberProfileSchema,
  getPageManifestBySlug,
} from "@champagne/manifests";

import ChampagnePageBuilder from "../../(champagne)/_builder/ChampagnePageBuilder";

type PageParams = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const resolved = await params;
  const manifestPath = `/team/${resolved.slug}`;
  const manifest = getPageManifestBySlug(manifestPath) as
    | { label?: string; title?: string; description?: string; intro?: string; path?: string }
    | undefined;

  if (!manifest?.path) {
    return {
      title: "Page not found",
      description: "The page you are looking for could not be found.",
    };
  }

  const title = manifest.label ?? manifest.title ?? "Team";
  const description = manifest.description ?? manifest.intro ?? `Meet ${title}.`;

  return {
    title,
    description,
    alternates: {
      canonical: manifest.path,
    },
    openGraph: {
      title,
      description,
      url: manifest.path,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function TeamMemberPage({ params }: { params: PageParams }) {
  const resolved = await params;
  const manifestPath = `/team/${resolved.slug}`;
  const manifest = getPageManifestBySlug(manifestPath) as
    | { label?: string; title?: string; path?: string }
    | undefined;

  if (!manifest?.path) {
    return notFound();
  }

  const name = manifest.label ?? manifest.title ?? "Team member";
  const profileSchemaGraph = buildTeamMemberProfileSchema(manifest.path, name);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchemaGraph) }}
      />
      <ChampagnePageBuilder slug={manifestPath} />
    </>
  );
}
