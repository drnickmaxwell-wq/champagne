import { FounderStudio } from "./_components/FounderStudio";
import { HeroV2LabAdapter } from "./_components/HeroV2LabAdapter";
import { Room11Composer } from "./_components/Room11Composer";

export default function DesignLabPage() {
  return <main className="dl-main"><FounderStudio hero={<HeroV2LabAdapter route="/" />} /><Room11Composer /></main>;
}
