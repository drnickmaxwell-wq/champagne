export type CTAStylePreset = "primary" | "secondary" | "luxury-gold" | "ghost" | (string & {});

export interface ChampagneCTAConfig {
  id: string;
  label: string;
  href: string;
  preset?: CTAStylePreset;
  description?: string;
  [key: string]: unknown;
}

export type CTAReference = string | Partial<ChampagneCTAConfig>;
