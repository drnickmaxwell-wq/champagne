import type {
  ChampagneSectionLayout,
  ChampagneSectionLayoutSection,
} from "@champagne/manifests";
import type { ComponentType, JSX } from "react";
import type { FxProps } from "./fx";

export interface SectionComponentProps {
  pageId: string;
  tenantId: string;
  layout?: ChampagneSectionLayout;
  section: ChampagneSectionLayoutSection;
  index: number;
  fx?: FxProps;
}

export type SectionComponent = (props: SectionComponentProps) => JSX.Element | null;

export type SectionComponentRegistry = Record<string, SectionComponent>;
export type SectionComponentMap = Record<string, ComponentType<any>>;
