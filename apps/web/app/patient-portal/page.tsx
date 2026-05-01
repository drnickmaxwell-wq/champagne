import Link from "next/link";
import type { Metadata } from "next";
import { getPageManifest } from "@champagne/manifests";

import ChampagnePageBuilder from "../(champagne)/_builder/ChampagnePageBuilder";
import PatientAiPanel from "./PatientAiPanel";

const manifest = getPageManifest("/patient-portal") as
  | { label?: string; description?: string; intro?: string }
  | undefined;

export const metadata: Metadata = {
  title: manifest?.label ?? "Patient portal",
  description: manifest?.description ?? manifest?.intro ?? "Access patient portal information and support.",
};

type PortalIntent = "login" | "video" | "finance" | "upload";

type IntentCopy = {
  title: string;
  description: string;
  note?: string;
};

const INTENT_COPY: Record<PortalIntent, IntentCopy> = {
  login: {
    title: "Patient sign-in",
    description: "Use the portal sign-in when the practice has invited you to view appointment or treatment details.",
  },
  video: {
    title: "Video consultation",
    description: "Use this route when the practice has arranged a secure video consultation with you.",
    note: "If you need help arranging a video appointment, please contact the team and we will guide you.",
  },
  finance: {
    title: "Finance",
    description: "Use this route if the practice has asked you to review payment or plan information securely.",
    note: "If you are unsure whether finance information is available for your account, please contact the team first.",
  },
  upload: {
    title: "Upload documents",
    description: "Send forms or documents securely when the practice has asked you to upload information.",
  },
};

type PageSearchParams = Promise<Record<string, string | string[] | undefined>> | undefined;

function normalizeIntent(rawIntent?: string | string[]): PortalIntent {
  const value = Array.isArray(rawIntent) ? rawIntent[0] : rawIntent;
  const normalized = (value ?? "").toLowerCase();

  if (normalized === "video" || normalized === "finance" || normalized === "upload") return normalized;

  return "login";
}

function buildPortalHref(portalBase: string | undefined, intent: PortalIntent): string | null {
  if (!portalBase) return null;

  const normalizedBase = portalBase.replace(/\/+$/, "");

  try {
    const url = new URL(normalizedBase);
    url.searchParams.set("intent", intent);
    return url.toString();
  } catch {
    return null;
  }
}

function IntentLanding({ intent, portalHref }: { intent: PortalIntent; portalHref: string | null }) {
  const copy = INTENT_COPY[intent];

  return (
    <section className="mx-auto max-w-5xl px-4 py-14 md:px-6">
      <div className="space-y-6 rounded-2xl border border-neutral-200 bg-white/70 p-8 shadow-sm backdrop-blur">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-neutral-600">Patient Portal</p>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">{`Patient Portal - ${copy.title}`}</h1>
          <p className="text-lg leading-relaxed text-neutral-700">{copy.description}</p>
          {copy.note ? <p className="text-sm text-neutral-600">{copy.note}</p> : null}
        </div>

        <div className="space-y-3 rounded-xl border border-dashed border-neutral-200 bg-white p-6">
          <p className="text-sm font-medium text-neutral-800">Before you continue</p>
          <p className="text-sm leading-relaxed text-neutral-700">
            Continue only if the practice has already directed you to use this portal route. If you would prefer to
            speak to someone first, or you are unsure which route applies, our team can guide you.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {portalHref ? (
              <a
                href={portalHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Continue
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Continue
              </button>
            )}
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

        <PatientAiPanel />

        <div className="space-y-2 text-sm text-neutral-600">
          <p className="font-semibold text-neutral-800">Portal routes</p>
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
  const portalBase = process.env.NEXT_PUBLIC_PORTAL_URL?.trim();
  const portalHref = buildPortalHref(portalBase, intent);

  return (
    <>
      <IntentLanding intent={intent} portalHref={portalHref} />
      <ChampagnePageBuilder slug="/patient-portal" />
    </>
  );
}
