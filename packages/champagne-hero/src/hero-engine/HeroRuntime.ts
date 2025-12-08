import { HeroConfig } from "./HeroConfig";

export interface HeroRuntime {
  /**
   * TODO: expose runtime hooks for hero rendering integration.
   */
  getConfig: (experienceId: string) => Promise<HeroConfig | undefined>;
}
