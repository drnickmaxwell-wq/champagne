import Link from "next/link";

import ChampagnePageBuilder from "../(champagne)/_builder/ChampagnePageBuilder";

type PortalIntent = "login" | "video" | "finance" | "upload";

type IntentCopy = {
  title: string;
  description: string;
  note?: string;
};

const INTENT_COPY: Record<PortalIntent, IntentCopy> = {
  login: {
    title: "Sign in",
    description: "Access your patient records, appointments, and treatment updates.",
  },
  video: {
    title: "Video consultation",
    description: "Join or schedule a secure video consultation with the clinical team.",
    note: "Video visits are rolling out gradually. If you need help scheduling, please contact us.",
  },
  finance: {
    title: "Finance",
    description: "Review payment options, manage instalments, and check your plan status.",
    note: "Finance access is being enabled for patients in phases.",
  },
  upload: {
    title: "Upload documents",
    description: "Share medical histories, x-rays, and consent forms securely with the practice.",
  },
};

type PageSearchParams = Promise<Record<string, string | string[] | undefined>> | undefined;

function normalizeIntent(rawIntent?: string | string[]): PortalIntent {
  const value = Array.isArray(rawIntent) ? rawIntent[0] : rawIntent;
  const normalized = (value ?? "").toLowerCase();

  if (normalized === "video" || normalized === "finance" || normalized === "upload") return normalized;

  return "login";
}

function IntentLanding({ intent }: { intent: PortalIntent }) {
  const copy = INTENT_COPY[intent];

  return (
    <section className="mx-auto max-w-5xl px-4 py-14 md:px-6">
      <div className="space-y-6 rounded-2xl border border-neutral-200 bg-white/70 p-8 shadow-sm backdrop-blur">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-neutral-600">Patient Portal</p>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
            {`Patient Portal — ${copy.title}`}
          </h1>
          <p className="text-lg leading-relaxed text-neutral-700">{copy.description}</p>
          {copy.note ? <p className="text-sm text-neutral-600">{copy.note}</p> : null}
        </div>

        <div className="space-y-3 rounded-xl border border-dashed border-neutral-200 bg-white p-6">
          <p className="text-sm font-medium text-neutral-800">What happens next?</p>
          <p className="text-sm leading-relaxed text-neutral-700">
            Continue to the patient portal using the intent below. If the online flow is not yet available
            for your account, our team will guide you through the next steps.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="#"
              aria-disabled
              onClick={(event) => event.preventDefault()}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-800 aria-disabled:cursor-not-allowed aria-disabled:opacity-60"
            >
              Continue
            </Link>
            <Link
              href="/contact"
              className="text-sm font-semibold text-neutral-900 underline-offset-4 transition hover:underline"
            >
              Contact
            </Link>
            <Link
              href="/treatments"
              className="text-sm font-semibold text-neutral-900 underline-offset-4 transition hover:underline"
            >
              Treatments
            </Link>
          </div>
        </div>

        <div className="space-y-2 text-sm text-neutral-600">
          <p className="font-semibold text-neutral-800">Supported intents</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {Object.entries(INTENT_COPY).map(([key, value]) => (
              <li key={key} className="rounded-lg border border-neutral-200 bg-white px-4 py-3 text-neutral-700">
                <div className="font-semibold text-neutral-900">{value.title}</div>
                <div className="text-sm leading-relaxed text-neutral-700">{value.description}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default async function PatientPortalPage({ searchParams }: { searchParams?: PageSearchParams }) {
  const resolvedParams = (await searchParams) ?? {};
  const intent = normalizeIntent(resolvedParams.intent);

  return (
    <>
      <IntentLanding intent={intent} />
      <ChampagnePageBuilder slug="/patient-portal" />
    </>
  );
}
