export type ChampagneCTAVariant = "primary" | "secondary" | "ghost";

export type ChampagneCTARelationship =
  | "next_step"
  | "prerequisite"
  | "maintenance"
  | "alternative"
  | "related"
  | "book";

export interface ChampagneCTAConfig {
  id: string;
  label: string;
  href: string;
  variant?: ChampagneCTAVariant;
  relationship?: ChampagneCTARelationship;
}

export type ChampagneCTAInput =
  | string
  | ChampagneCTAConfig
  | ({ preset?: string } & Partial<ChampagneCTAConfig>);
