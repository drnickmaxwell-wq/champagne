import TreatmentBreadcrumb from '@/components/preview/nav/TreatmentBreadcrumb';
import TreatmentConsultationCta from '@/components/preview/cta/TreatmentConsultationCta';
import ChampagneTreatmentSurface from '@/components/preview/theme/ChampagneTreatmentSurface';

export default function CompositeBondingHeroSection(): JSX.Element {
  return (
    <ChampagneTreatmentSurface
      eyebrow="Composite bonding"
      headline="Hand-sculpted brilliance in a single visit"
      description="This layout previews the storytelling frame for the composite bonding launch. Final imagery and motion layers will be added once approved."
    >
      <TreatmentBreadcrumb current="Composite bonding" />
      <p className="cpv-card__lead">
        The production hero will introduce the artistry, showcase surface geometry, and invite guests to plan their visit with
        confidence.
      </p>
      <TreatmentConsultationCta />
    </ChampagneTreatmentSurface>
  );
}
