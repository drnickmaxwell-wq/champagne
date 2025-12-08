import type { ReactNode } from 'react';

import { Section } from '@/components/preview/PreviewBlocks';

interface ChampagneTreatmentSurfaceProps {
  eyebrow?: string;
  headline?: string;
  description?: string;
  children?: ReactNode;
}

export default function ChampagneTreatmentSurface({
  eyebrow,
  headline,
  description,
  children,
}: ChampagneTreatmentSurfaceProps): JSX.Element {
  return (
    <Section
      eyebrow={eyebrow}
      title={headline ?? 'Preview surface'}
      description={description ? <p>{description}</p> : undefined}
    >
      {children}
    </Section>
  );
}
