export type BrandManifest = {
  name: string;
  gradientVar?: string;
  goldVar?: string;
  waves: ManifestWaves;
  textures: ManifestTextures;
  particles?: ManifestParticles;
  motion?: ManifestMotion;
  gradient?: unknown;
  gold?: unknown;
  typography?: unknown;
  tokens?: string;
  version?: string;
  static?: unknown;
  dynamic?: unknown;
};

type ManifestWaves = {
  mask: string;
  background?: string;
  [key: string]: string | undefined;
};

type ManifestTextures = {
  filmGrain: string;
  glassSoft: string;
  [key: string]: string;
};

type ManifestParticles = {
  soft?: string;
  poster?: string;
  [key: string]: string | undefined;
};

type ManifestMotion = {
  [key: string]: string | undefined;
};

const MANIFEST_PRIMARY_PATH = "/brand/manifest.json";
const MANIFEST_FALLBACK_PATH = "/assets/champagne/manifest.json";

let manifestCache: BrandManifest | null = null;
let manifestPromise: Promise<BrandManifest> | null = null;

export async function getBrandManifestClient(): Promise<BrandManifest> {
  return loadWithCache(loadClientManifest);
}

export async function getBrandManifestServer(
  root = process.cwd(),
): Promise<BrandManifest> {
  if (typeof window !== "undefined") {
    throw new Error("Server-only");
  }

  return loadWithCache(async () => {
    const [{ readFile }, { join }] = await Promise.all([
      import(/* webpackIgnore: true */ "node:fs/promises"),
      import(/* webpackIgnore: true */ "node:path"),
    ]);

    const manifestFiles = [
      join(root, "public", "brand", "manifest.json"),
      join(root, "public", "assets", "champagne", "manifest.json"),
    ];

    for (const manifestPath of manifestFiles) {
      try {
        const fileContents = await readFile(manifestPath, "utf8");
        return JSON.parse(fileContents) as BrandManifest;
      } catch (error) {
        const errorWithCode = error as { code?: string; message?: string };

        if (errorWithCode.code === "ENOENT") {
          continue;
        }

        throw new Error(
          `Failed to load brand manifest from ${manifestPath}: ${errorWithCode.message ?? "unknown error"}`,
        );
      }
    }

    throw new Error("Brand manifest not found");
  });
}

export async function getBrandManifest(): Promise<BrandManifest> {
  if (typeof window !== "undefined") {
    return getBrandManifestClient();
  }

  return getBrandManifestServer();
}

export async function getWaves(): Promise<ManifestWaves> {
  const manifest = await getBrandManifest();
  return manifest.waves;
}

export async function getTextures(): Promise<ManifestTextures> {
  const manifest = await getBrandManifest();
  return manifest.textures;
}

export async function getParticles(): Promise<ManifestParticles | undefined> {
  const manifest = await getBrandManifest();
  return manifest.particles;
}

export async function getHeroLayers() {
  const manifest = await getBrandManifest();

  return {
    waves: manifest.waves,
    textures: manifest.textures,
    particles: manifest.particles,
    motion: manifest.motion,
  };
}

function loadWithCache(
  loader: () => Promise<BrandManifest>,
): Promise<BrandManifest> {
  if (manifestCache) {
    return Promise.resolve(manifestCache);
  }

  if (!manifestPromise) {
    manifestPromise = loader()
      .then((manifest) => {
        manifestCache = manifest;
        return manifest;
      })
      .catch((error) => {
        manifestPromise = null;
        throw error;
      });
  }

  return manifestPromise!;
}

async function loadClientManifest(): Promise<BrandManifest> {
  try {
    const response = await fetch(MANIFEST_PRIMARY_PATH, {
      cache: "force-cache",
    });

    if (response.ok) {
      return (await response.json()) as BrandManifest;
    }

    if (response.status !== 404) {
      throw new Error(`Brand manifest request failed (${response.status})`);
    }
  } catch (error) {
    const isTypeError = error instanceof Error && error.name === "TypeError";

    if (!isTypeError) {
      throw error;
    }
  }

  try {
    const fallbackResponse = await fetch(MANIFEST_FALLBACK_PATH, {
      cache: "force-cache",
    });

    if (fallbackResponse.ok) {
      return (await fallbackResponse.json()) as BrandManifest;
    }
  } catch (error) {
    const isTypeError = error instanceof Error && error.name === "TypeError";

    if (!isTypeError) {
      throw error;
    }
  }

  throw new Error("Brand manifest unavailable");
}
