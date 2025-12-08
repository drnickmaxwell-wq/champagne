import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const allowedTreatments: Record<string, string> = {
  "dental-implants": "Dental Implants",
  "clear-aligners": "Clear aligner orthodontics (Spark and other systems)",
  "smile-makeovers": "Smile Makeovers",
  "teeth-whitening": "Teeth Whitening",
  "3d-dentistry-scanning": "3D Dentistry & Scanning",
};

export default async function TreatmentPage({ params }: PageProps) {
  const { slug } = await params;
  const title = allowedTreatments[slug];

  if (!title) {
    return notFound();
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-neutral-400">Treatment</p>
        <h1 className="text-3xl font-semibold text-neutral-50">{title}</h1>
        <p className="text-neutral-300">
          This page is a placeholder for the full details about {title.toLowerCase()}. The complete experience will
          include clinical information, patient guidance, and how it integrates with the Champagne Ecosystem.
        </p>
      </div>

      <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-4 text-sm text-neutral-300">
        <p className="font-semibold text-neutral-100">Routing info</p>
        <p>Slug: {slug}</p>
      </div>

      <Link
        href="/treatments"
        className="w-fit rounded-md border border-neutral-800 px-4 py-2 text-sm font-medium text-neutral-100 transition hover:border-neutral-700 hover:bg-neutral-900"
      >
        ← Back to treatments
      </Link>
    </div>
  );
}
