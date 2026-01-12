import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTreatmentManifest } from "@champagne/manifests";

import ChampagnePageBuilder from "../../(champagne)/_builder/ChampagnePageBuilder";

export const dynamic = "force-dynamic";

type PageParams = { slug: string };

const SITE_NAME = "St Mary’s House Dental";

const toTitleCase = (value: string) =>
  value
    .split("-")
    .map((word) => (word ? `${word[0].toUpperCase()}${word.slice(1)}` : word))
    .join(" ");

const buildEmergencyMetadata = (slug: string): Metadata => {
  const label = toTitleCase(slug.replace(/^emergency-/, "emergency-"));
  return {
    title: `${label} | ${SITE_NAME}`,
    description: `Support for ${label.toLowerCase()}, including urgent guidance and how to reach the team.`,
  };
};

const buildImplantMetadata = (slug: string): Metadata => {
  if (slug === "implants") {
    return {
      title: `Dental implants | ${SITE_NAME}`,
      description: "Overview of implant options, timelines, and support from the clinical team.",
    };
  }

  const suffix = toTitleCase(slug.replace(/^implants?-/, ""));
  const suffixLower = suffix ? suffix.toLowerCase() : "implant care";

  return {
    title: `Dental implants – ${suffix} | ${SITE_NAME}`,
    description: `Learn about ${suffixLower} for dental implants, with planning guidance and next steps.`,
  };
};

async function resolveTreatment(params: Promise<PageParams>) {
  const resolved = await params;
  const manifest = getTreatmentManifest(resolved.slug);
  const pageSlug = manifest?.path ?? `/treatments/${resolved.slug}`;

  return { manifest, pageSlug, slug: resolved.slug };
}

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { manifest, slug } = await resolveTreatment(params);

  if (!manifest) {
    return { title: "Treatment not found" };
  }

  if (slug.startsWith("emergency-")) {
    return buildEmergencyMetadata(slug);
  }

  if (slug.startsWith("implants") || slug.startsWith("implant-")) {
    return buildImplantMetadata(slug);
  }

  const label = manifest.label ?? "Treatment";
  const baseDescription = (manifest as { description?: string }).description?.trim();
  const fallbackDescription = `${label} treatment overview, support options, and next steps at ${SITE_NAME}.`;
  const description = baseDescription
    ? `${baseDescription} Learn about ${label.toLowerCase()} at ${SITE_NAME}.`
    : fallbackDescription;

  return {
    title: `${label} | ${SITE_NAME}`,
    description,
  };
}

export default async function TreatmentPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { manifest, pageSlug } = await resolveTreatment(params);

  if (!manifest) {
    return notFound();
  }

  return (
    <>
      <ChampagnePageBuilder slug={pageSlug} />
    </>
  );
}
