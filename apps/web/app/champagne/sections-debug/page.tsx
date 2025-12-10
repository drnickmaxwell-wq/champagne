"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  getSectionFxDefaults,
  getSectionLayoutSections,
  getSectionLayouts,
  getSectionPrmDefaults,
  useValidatedManifest,
  type ChampagneManifest,
  type ChampagneSectionLayoutSection,
} from "@champagne/manifests";
import PageBuilder from "../../components/PageBuilder";

const tenantId = "smh-dental";
const layoutOptions = getSectionLayouts().filter((layout) => layout.routeId?.startsWith("treatments."));
const fallbackRoute = layoutOptions.find((layout) => layout.routeId === "treatments.implants")?.routeId;
const initialRoute = fallbackRoute ?? layoutOptions[0]?.routeId ?? "treatments.implants";

function mapSectionsToManifest(sections: ChampagneSectionLayoutSection[]): ChampagneManifest {
  return {
    sections: sections.map((section, index) => ({
      id: section.instanceId || `${section.componentId}-${index + 1}`,
      type: section.componentId,
      props: {
        variantId: section.variantId,
        order: section.order,
        slot: section.slot,
        seoRole: section.seoRole,
        visibility: section.visibility,
        propsRef: section.propsRef,
        experiments: section.experiments,
      },
    })),
  };
}

function loadManifestForPageId(pageId: string, tenant?: string): ChampagneManifest | undefined {
  const { sections } = getSectionLayoutSections(pageId, tenant);
  if (!sections.length) return undefined;
  return mapSectionsToManifest(sections);
}

export default function SectionsDebugPage() {
  const [routeId, setRouteId] = useState(initialRoute);

  const manifest = useMemo(() => loadManifestForPageId(routeId, tenantId), [routeId]);
  const { sections } = useValidatedManifest(manifest);
  const fxDefaults = useMemo(() => getSectionFxDefaults(), []);
  const prmDefaults = useMemo(() => getSectionPrmDefaults(), []);

  return (
    <main className="min-h-screen bg-[var(--surface-page)] text-[var(--text-high)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
        <header className="flex items-baseline justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--text-soft)]">Champagne</p>
            <h1 className="text-2xl font-semibold tracking-tight">Sections Debugger</h1>
            <p className="mt-1 text-sm text-[var(--text-soft)]">
              Manifest-driven preview for treatment stacks. Switch routes to inspect ordering and defaults.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-[var(--text-soft)]">
            <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 font-medium text-[var(--text-high)]">
              Tenant: {tenantId}
            </span>
            <Link
              href="/"
              className="text-sm text-[var(--accent-gold, var(--text-high))] underline-offset-4 hover:underline"
            >
              Back to site
            </Link>
          </div>
        </header>

        <section className="rounded-2xl border border-[color-mix(in_srgb,var(--border-subtle)_70%,transparent)] bg-[color-mix(in_srgb,var(--surface-card)_92%,transparent)] p-4 text-sm">
          <div className="flex flex-wrap items-center gap-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-[var(--text-soft)]" htmlFor="route-select">
              Route
            </label>
            <select
              id="route-select"
              className="rounded-lg border border-[color-mix(in_srgb,var(--border-subtle)_80%,transparent)] bg-[var(--surface-subtle)] px-3 py-2 text-sm"
              value={routeId}
              onChange={(event) => setRouteId(event.target.value)}
            >
              {layoutOptions.map((entry) => (
                <option key={entry.routeId} value={entry.routeId}>
                  {entry.routeId}
                </option>
              ))}
            </select>
            <div className="text-xs text-[var(--text-soft)]">Sections: {sections.length}</div>
          </div>
        </section>

        <section className="rounded-2xl border border-[color-mix(in_srgb,var(--border-subtle)_70%,transparent)] bg-[color-mix(in_srgb,var(--surface-card)_92%,transparent)] p-4 text-sm">
          <h2 className="text-sm font-semibold tracking-tight">Rendered Layout Preview</h2>
          <p className="mb-4 mt-1 text-xs text-[var(--text-soft)]">
            Rendered via the same <code>PageBuilder</code> used in production routes.
          </p>
          <PageBuilder pageId={routeId} tenantId={tenantId} />
        </section>

        <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
          <DebugManifestViewer manifest={manifest} sections={sections} />

          <div className="space-y-4">
            <section className="rounded-2xl border border-[color-mix(in_srgb,var(--border-subtle)_70%,transparent)] bg-[color-mix(in_srgb,var(--surface-card)_92%,transparent)] p-4 text-sm">
              <h3 className="text-sm font-semibold tracking-tight">FX defaults</h3>
              <p className="mb-3 mt-1 text-xs text-[var(--text-soft)]">Per-section defaults from manifests.</p>
              <div className="rounded-xl bg-[var(--surface-subtle)] p-3 font-mono text-[11px] text-[var(--text-soft)]">
                <pre className="whitespace-pre-wrap">{JSON.stringify(fxDefaults.fxDefaults, null, 2)}</pre>
              </div>
            </section>

            <section className="rounded-2xl border border-[color-mix(in_srgb,var(--border-subtle)_70%,transparent)] bg-[color-mix(in_srgb,var(--surface-card)_92%,transparent)] p-4 text-sm">
              <h3 className="text-sm font-semibold tracking-tight">PRM defaults</h3>
              <p className="mb-3 mt-1 text-xs text-[var(--text-soft)]">Reduced motion guidance by section.</p>
              <div className="rounded-xl bg-[var(--surface-subtle)] p-3 font-mono text-[11px] text-[var(--text-soft)]">
                <pre className="whitespace-pre-wrap">{JSON.stringify(prmDefaults.prmRules, null, 2)}</pre>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function DebugManifestViewer({
  manifest,
  sections,
}: {
  manifest?: ChampagneManifest;
  sections: ReturnType<typeof useValidatedManifest>["sections"];
}) {
  if (!manifest) {
    return (
      <section className="rounded-2xl border border-[color-mix(in_srgb,var(--border-subtle)_70%,transparent)] bg-[color-mix(in_srgb,var(--surface-card)_92%,transparent)] p-4 text-sm text-[var(--text-soft)]">
        No manifest loaded for this route. Ensure a section layout manifest exists for the selected pageId.
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[color-mix(in_srgb,var(--border-subtle)_70%,transparent)] bg-[color-mix(in_srgb,var(--surface-card)_92%,transparent)] p-4 text-sm">
      <h2 className="text-sm font-semibold tracking-tight">Resolved Sections</h2>
      <p className="mb-3 mt-1 text-xs text-[var(--text-soft)]">
        Post-validation ordering. IDs come from layout instance IDs when available.
      </p>
      {sections.length === 0 ? (
        <div className="text-xs text-[var(--text-soft)]">No sections declared in this manifest.</div>
      ) : (
        <ul className="space-y-2">
          {sections.map((section, idx) => (
            <li
              key={section.id ?? `${section.type}-${idx}`}
              className="flex items-start justify-between gap-3 rounded-xl bg-[color-mix(in_srgb,var(--surface-elevated)_96%,transparent)] px-3 py-2"
            >
              <div className="flex flex-col">
                <span className="font-mono text-[11px] uppercase tracking-wide text-[var(--text-soft)]">
                  #{idx + 1} {section.id}
                </span>
                <span className="text-sm font-medium">{section.type}</span>
              </div>
              <pre className="max-h-32 max-w-[60%] overflow-auto rounded-lg bg-[color-mix(in_srgb,var(--surface-subtle)_98%,transparent)] p-2 text-[11px] text-[var(--text-soft)]">
                {JSON.stringify(section.props ?? {}, null, 2)}
              </pre>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
