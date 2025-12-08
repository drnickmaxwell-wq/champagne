export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { readFile, readdir, stat } from "fs/promises";
import { join } from "path";

const CWD = process.cwd();
const BRAND_PUBLIC = join(CWD, "public", "brand");
const BRAND_ROOT = join(CWD, "brand");

const CHAMPAGNE_MANIFEST_FILE = "champagne_machine_manifest_full.json";
const MANUS_MANIFEST_FILE = "manus_import_unified_manifest_20251104.json";

const NORMALIZE_ID = (id: string) =>
  ({
    "hero-champagne-v2": "hero",
    "hero-champagne": "hero",
  }[id] || id);

type LoadResult<T> =
  | {
      ok: true;
      json: T;
      path: string;
      bytes: number;
      mtime: string;
    }
  | {
      ok: false;
      json: null;
      path: string;
      bytes: null;
      mtime: null;
      error: string;
    };

type ManifestSummary = {
  componentCount: number;
  componentKeys: Set<string>;
  assetCount: number;
  assetPaths: Set<string>;
  guardCount: number;
  guardEntries: Set<string>;
};

async function loadManifest<T = unknown>(fileName: string): Promise<LoadResult<T>> {
  const absPath = join(BRAND_PUBLIC, fileName);
  const pathLabel = `/brand/${fileName}`;

  try {
    const stats = await stat(absPath);

    if (!stats.isFile()) {
      return {
        ok: false,
        json: null,
        path: pathLabel,
        bytes: null,
        mtime: null,
        error: "Path exists but is not a file.",
      };
    }

    if (stats.size === 0) {
      return {
        ok: false,
        json: null,
        path: pathLabel,
        bytes: 0,
        mtime: stats.mtime.toISOString(),
        error: "Manifest file is empty (0 bytes).",
      };
    }

    try {
      const content = await readFile(absPath, "utf8");
      const parsed = JSON.parse(content) as T;
      normaliseManifest(parsed);
      return {
        ok: true,
        json: parsed,
        path: pathLabel,
        bytes: stats.size,
        mtime: stats.mtime.toISOString(),
      };
    } catch (error: unknown) {
      return {
        ok: false,
        json: null,
        path: pathLabel,
        bytes: stats.size,
        mtime: stats.mtime.toISOString(),
        error: `Invalid JSON — ${String((error as { message?: unknown })?.message ?? error)}`,
      };
    }
  } catch (error: unknown) {
    const message = String((error as { message?: unknown })?.message ?? error);
    return {
      ok: false,
      json: null,
      path: pathLabel,
      bytes: null,
      mtime: null,
      error: message.includes("ENOENT") ? "File not found." : message,
    };
  }
}

async function listDir(absDir: string) {
  try {
    const entries = await readdir(absDir);
    const detailed = await Promise.all(
      entries.map(async (name) => {
        try {
          const s = await stat(join(absDir, name));
          return { name, bytes: s.size, mtime: s.mtime.toISOString() };
        } catch {
          return { name, bytes: null, mtime: null };
        }
      })
    );
    return { ok: true as const, dir: absDir, entries: detailed };
  } catch (error: unknown) {
    return {
      ok: false as const,
      dir: absDir,
      error: String((error as { message?: unknown })?.message ?? error),
    };
  }
}

function addComponentKey(set: Set<string>, value: unknown) {
  if (typeof value === "string" && value.trim()) {
    set.add(NORMALIZE_ID(value.trim()));
  } else if (typeof value === "number") {
    set.add(NORMALIZE_ID(String(value)));
  }
}

function addToSet(set: Set<string>, value: unknown) {
  if (typeof value === "string" && value.trim()) {
    set.add(value.trim());
  } else if (typeof value === "number") {
    set.add(String(value));
  }
}

function normaliseManifest(manifest: unknown) {
  if (!manifest || typeof manifest !== "object") {
    return manifest;
  }

  const record = manifest as { components?: unknown };
  const { components } = record;

  if (Array.isArray(components)) {
    record.components = components.map((component) => {
      if (component && typeof component === "object") {
        const entry = component as Record<string, unknown>;
        const value = entry.id;
        if (typeof value === "string") {
          entry.id = NORMALIZE_ID(value);
        }
      }
      return component;
    });
  }

  return manifest;
}

function summarise(manifest: unknown): ManifestSummary {
  const componentKeys = new Set<string>();
  const assetPaths = new Set<string>();
  const guardEntries = new Set<string>();

  if (!manifest || typeof manifest !== "object") {
    return {
      componentCount: 0,
      componentKeys,
      assetCount: 0,
      assetPaths,
      guardCount: 0,
      guardEntries,
    };
  }

  const { sections, components, assets_summary: assetsSummary, guards } = manifest as Record<
    string,
    unknown
  >;

  if (sections) {
    if (Array.isArray(sections)) {
      for (const entry of sections) {
        addComponentKey(componentKeys, entry);
      }
    } else if (typeof sections === "object") {
      Object.keys(sections as Record<string, unknown>).forEach((key) => addComponentKey(componentKeys, key));
    }
  }

  if (components) {
    if (Array.isArray(components)) {
      for (const component of components) {
        if (component && typeof component === "object") {
          const record = component as Record<string, unknown>;
          if (record.id) {
            addComponentKey(componentKeys, record.id);
          } else if (record.key) {
            addComponentKey(componentKeys, record.key);
          } else if (record.name) {
            addComponentKey(componentKeys, record.name);
          }

          const assets = record.assets;
          if (assets !== undefined) {
            collectAssetEntries(assets, assetPaths);
          }
        } else {
          addComponentKey(componentKeys, component);
        }
      }
    } else if (typeof components === "object") {
      Object.keys(components as Record<string, unknown>).forEach((key) => addComponentKey(componentKeys, key));
    }
  }

  if (assetsSummary && typeof assetsSummary === "object") {
    for (const value of Object.values(assetsSummary as Record<string, unknown>)) {
      collectAssetEntries(value, assetPaths);
    }
  }

  if (guards && typeof guards === "object") {
    for (const guardValue of Object.values(guards as Record<string, unknown>)) {
      if (Array.isArray(guardValue)) {
        for (const entry of guardValue) {
          addToSet(guardEntries, entry);
        }
      } else if (guardValue && typeof guardValue === "object") {
        Object.values(guardValue as Record<string, unknown>).forEach((entry) => addToSet(guardEntries, entry));
      } else {
        addToSet(guardEntries, guardValue);
  }
}

function collectAssetEntries(candidate: unknown, set: Set<string>) {
  if (!candidate) {
    return;
  }

  if (typeof candidate === "string") {
    const trimmed = candidate.trim();
    if (trimmed && (trimmed.includes("/") || trimmed.includes("."))) {
      addToSet(set, trimmed);
    }
    return;
  }

  if (Array.isArray(candidate)) {
    for (const item of candidate) {
      collectAssetEntries(item, set);
    }
    return;
  }

  if (typeof candidate === "object") {
    const record = candidate as Record<string, unknown>;
    if ("path" in record) {
      collectAssetEntries(record.path, set);
    }
    if ("file" in record) {
      collectAssetEntries(record.file, set);
    }
    for (const value of Object.values(record)) {
      if (value !== record.path && value !== record.file) {
        collectAssetEntries(value, set);
      }
    }
  }
}
  }

  return {
    componentCount: componentKeys.size,
    componentKeys,
    assetCount: assetPaths.size,
    assetPaths,
    guardCount: guardEntries.size,
    guardEntries,
  };
}

function collectAssetEntries(candidate: unknown, set: Set<string>) {
  if (!candidate) {
    return;
  }

  if (typeof candidate === "string") {
    const trimmed = candidate.trim();
    if (trimmed && (trimmed.includes("/") || trimmed.includes("."))) {
      addToSet(set, trimmed);
    }
    return;
  }

  if (Array.isArray(candidate)) {
    for (const item of candidate) {
      collectAssetEntries(item, set);
    }
    return;
  }

  if (typeof candidate === "object") {
    const record = candidate as Record<string, unknown>;
    if ("path" in record) {
      collectAssetEntries(record.path, set);
    }
    if ("file" in record) {
      collectAssetEntries(record.file, set);
    }
    for (const value of Object.values(record)) {
      if (value !== record.path && value !== record.file) {
        collectAssetEntries(value, set);
      }
    }
  }
}

function hasVersion(candidate: unknown, version: string) {
  if (!candidate || typeof candidate !== "object") {
    return false;
  }

  const record = candidate as { version?: unknown };
  return typeof record.version === "string" && record.version === version;
}

export default async function ManusAuditPage() {
  const [brandPublicList, brandRootList, champagne, manus] = await Promise.all([
    listDir(BRAND_PUBLIC),
    listDir(BRAND_ROOT),
    loadManifest(CHAMPAGNE_MANIFEST_FILE),
    loadManifest(MANUS_MANIFEST_FILE),
  ]);

  const champagneJson = champagne.ok ? champagne.json : null;
  const manusJson = manus.ok ? manus.json : null;

  const champagneSummary = summarise(champagneJson);
  const manusSummary = summarise(manusJson);

  const champagneIds = [...champagneSummary.componentKeys].sort();
  const manusIds = [...manusSummary.componentKeys].sort();

  const missingInManus = champagne.ok && manus.ok
    ? champagneIds.filter((key) => !manusSummary.componentKeys.has(key))
    : [];

  const extraInManus = champagne.ok && manus.ok
    ? manusIds.filter((key) => !champagneSummary.componentKeys.has(key))
    : [];

  const trimError = (error: string) =>
    error.length > 180 ? `${error.slice(0, 180)}…` : error;

  const champagneErrorSnippet = !champagne.ok ? trimError(champagne.error) : null;
  const manusErrorSnippet = !manus.ok ? trimError(manus.error) : null;

  const champagneStubLoaded = hasVersion(champagneJson, "canon-stub-1");
  const manusStubLoaded = hasVersion(manusJson, "canon-stub-1");

  return (
    <main className="prose max-w-3xl mx-auto p-6">
      <h1>Manus audit overview</h1>
      <p>Quick comparison between the Manus delivery package and the Champagne canon manifest.</p>

      <section>
        <h2>Diagnostics</h2>
        <p>
          process.cwd(): <code>{CWD}</code>
        </p>

        <div>
          <h3>Brand directory listings</h3>
          <div>
            <h4>
              public brand: <code>{BRAND_PUBLIC}</code>
            </h4>
            {brandPublicList.ok ? (
              brandPublicList.entries.length ? (
                <ul>
                  {brandPublicList.entries.map((entry) => (
                    <li key={entry.name}>
                      <code>{entry.name}</code> —{" "}
                      {typeof entry.bytes === "number" ? `${entry.bytes} bytes` : "size n/a"}
                      {entry.mtime ? ` (modified ${entry.mtime})` : ""}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Directory is empty.</p>
              )
            ) : (
              <p>Error: {brandPublicList.error}</p>
            )}
          </div>
          <div>
            <h4>
              root brand: <code>{BRAND_ROOT}</code>
            </h4>
            {brandRootList.ok ? (
              brandRootList.entries.length ? (
                <ul>
                  {brandRootList.entries.map((entry) => (
                    <li key={entry.name}>
                      <code>{entry.name}</code> —{" "}
                      {typeof entry.bytes === "number" ? `${entry.bytes} bytes` : "size n/a"}
                      {entry.mtime ? ` (modified ${entry.mtime})` : ""}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Directory is empty.</p>
              )
            ) : (
              <p>Error: {brandRootList.error}</p>
            )}
          </div>
        </div>

        <div>
          <h3>Manifest details</h3>
          {[
            {
              label: "Champagne manifest",
              result: champagne,
              summary: champagneSummary,
              ids: champagneIds,
              error: champagneErrorSnippet,
            },
            {
              label: "Manus manifest",
              result: manus,
              summary: manusSummary,
              ids: manusIds,
              error: manusErrorSnippet,
            },
          ].map(({ label, result, summary, ids, error }) => {
            const sizeDisplay =
              typeof result.bytes === "number"
                ? `${result.bytes} bytes${result.bytes === 0 ? " (empty)" : ""}`
                : "n/a";
            const modifiedDisplay = result.mtime ?? "n/a";

            return (
              <div key={label}>
                <h4>{label}</h4>
                <ul>
                  <li>
                    path: <code>{result.path}</code>
                  </li>
                  <li>size: {sizeDisplay}</li>
                  <li>mtime: {modifiedDisplay}</li>
                  <li>
                    components: <b>{summary.componentCount}</b>
                  </li>
                  <li>
                    assets: <b>{summary.assetCount}</b>
                  </li>
                  <li>
                    guards: <b>{summary.guardCount}</b>
                  </li>
                </ul>
                {result.ok ? (
                  <div>
                    <h5>Normalized component IDs</h5>
                    {ids.length ? (
                      <ul>
                        {ids.map((id) => (
                          <li key={id}>
                            <code>{id}</code>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No component entries.</p>
                    )}
                  </div>
                ) : (
                  <p>
                    Error: <code>{error ?? result.error}</code>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <h3>Totals</h3>
      <ul>
        <li>
          Champagne components: <b>{champagneSummary.componentCount}</b>
          {!champagne.ok && champagneErrorSnippet ? ` (unavailable: ${champagneErrorSnippet})` : ""}
        </li>
        <li>
          Manus components: <b>{manusSummary.componentCount}</b>
          {!manus.ok && manusErrorSnippet ? ` (unavailable: ${manusErrorSnippet})` : ""}
        </li>
        <li>
          Champagne assets tracked: <b>{champagneSummary.assetCount}</b>
        </li>
        <li>
          Manus assets tracked: <b>{manusSummary.assetCount}</b>
        </li>
        <li>
          Champagne guard entries: <b>{champagneSummary.guardCount}</b>
        </li>
        <li>
          Manus guard entries: <b>{manusSummary.guardCount}</b>
        </li>
      </ul>

      {champagneStubLoaded || manusStubLoaded ? (
        <p>Champagne reference loaded as stub (replace with full canon).</p>
      ) : null}

      <h3>Missing from Manus</h3>
      {champagne.ok && manus.ok ? (
        missingInManus.length ? (
          <ul>{missingInManus.map((k) => <li key={k}>{k}</li>)}</ul>
        ) : (
          <p>No gaps detected between the manifests.</p>
        )
      ) : (
        <p>Waiting for both manifests to load before diffing.</p>
      )}

      <h3>Extra in Manus</h3>
      {champagne.ok && manus.ok ? (
        extraInManus.length ? (
          <ul>{extraInManus.map((k) => <li key={k}>{k}</li>)}</ul>
        ) : (
          <p>No Manus-only entries detected.</p>
        )
      ) : (
        <p>Waiting for both manifests to load before diffing.</p>
      )}

      <h3>Report</h3>
      <pre>Run: pnpm brand:audit</pre>
    </main>
  );
}
