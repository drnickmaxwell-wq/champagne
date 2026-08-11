import archiveRegistry from "./data/archive/v27-registry.json";
import { getBrandAuthoritySummary } from "./data/authority/brand-authority";
import { A0_CAPABILITY_STATE } from "./data/contracts/contracts";
import { RecoveryWorkspace } from "./RecoveryWorkspace";

type RegistryItem = (typeof archiveRegistry.items)[number];

function toArchiveItem(item: RegistryItem) {
  return {
    id: item.id,
    title: item.title,
    family: item.family,
    purpose: item.purpose ?? "Archived visual authority retained for faithful reconstruction review.",
    labRoom: item.labRoom,
    asset: `/assets/champagne/design-lab/v27/${item.id}.png`,
    parentBoard: item.provenance.parentBoard,
    technicalStatus: item.technicalStatus,
    implementationAvailable: item.implementationAvailable,
    usableInPageComposition: item.usableInPageComposition,
  };
}

export default function AtelierRecoveryPage() {
  if (archiveRegistry.items.length !== 331) {
    throw new Error("Atelier recovery requires the complete 331-item archive");
  }

  return (
    <RecoveryWorkspace
      archive={archiveRegistry.items.map(toArchiveItem)}
      brand={getBrandAuthoritySummary()}
      capabilities={A0_CAPABILITY_STATE}
    />
  );
}
