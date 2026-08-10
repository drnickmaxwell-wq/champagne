import { AtelierPreviewDocument } from "../_components/AtelierPreviewDocument";
import { HeroV2LabAdapter } from "../_components/HeroV2LabAdapter";

export default function AtelierPreviewPage() {
  return <AtelierPreviewDocument heroes={{
    home: <HeroV2LabAdapter route="/" />,
    implants: <HeroV2LabAdapter route="/treatments/dental-implants" />,
    bonding: <HeroV2LabAdapter route="/treatments/composite-bonding" />,
  }} />;
}
