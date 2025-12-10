export interface ChampagneSectionEntry {
  id?: string;
  type?: string;
  props?: Record<string, unknown>;
}

export interface ChampagneManifest {
  sections?: ChampagneSectionEntry[];
  [key: string]: unknown;
}
