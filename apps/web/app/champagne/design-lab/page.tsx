import { Atelier } from "./_components/Atelier";
import { HeroV2LabAdapter } from "./_components/HeroV2LabAdapter";

export default function DesignLabPage() {
  return <Atelier heroes={{
    home: <HeroV2LabAdapter route="/" />,
    implants: <HeroV2LabAdapter route="/treatments/dental-implants" />,
    bonding: <HeroV2LabAdapter route="/treatments/composite-bonding" />,
  }} />;
}
