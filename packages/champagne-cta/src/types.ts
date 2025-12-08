export type ChampagneCTAVariant = "primary" | "secondary" | "ghost";

export interface ChampagneCTAConfig {
  id: string;
  label: string;
  href: string;
  variant?: ChampagneCTAVariant;
}

export type ChampagneCTAInput =
  | string
  | ChampagneCTAConfig
  | ({ preset?: string } & Partial<ChampagneCTAConfig>);
