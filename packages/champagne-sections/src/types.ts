import type {
  ChampagneSectionLayout,
  ChampagneSectionLayoutSection,
} from "@champagne/manifests";
import type { JSX } from "react";

export interface SectionComponentProps {
  pageId: string;
  tenantId: string;
  layout?: ChampagneSectionLayout;
  section: ChampagneSectionLayoutSection;
  index: number;
}

export type SectionComponent = (props: SectionComponentProps) => JSX.Element | null;

export type SectionComponentRegistry = Record<string, SectionComponent>;
