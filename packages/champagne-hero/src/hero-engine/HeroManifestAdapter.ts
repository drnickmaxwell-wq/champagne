import { HeroConfig } from "./HeroConfig";

export interface HeroManifestAdapter {
  /**
   * TODO: read hero data from manifests and canon definitions.
   */
  readManifest: (experienceId: string) => Promise<HeroConfig | undefined>;
}
