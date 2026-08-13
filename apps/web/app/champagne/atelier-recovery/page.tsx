import archiveRegistry from "./data/archive/v27-registry.json";
import { persistenceStatus, readPreferenceDataset } from "./data/preferences/persistence";
import { readReconstructionReviewDataset, reconstructionReviewPersistenceStatus } from "./data/reconstruction-review/persistence";
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
    archivePath: item.provenance.archivePath,
    crop: item.provenance.crop,
    technicalStatus: item.technicalStatus,
    implementationAvailable: item.implementationAvailable,
    usableInPageComposition: item.usableInPageComposition,
  };
}

export default async function AtelierRecoveryPage() {
  if (archiveRegistry.items.length !== 331) {
    throw new Error("Atelier recovery requires the complete 331-item archive");
  }

  const [dataset, reconstructionReviewDataset] = await Promise.all([readPreferenceDataset(), readReconstructionReviewDataset()]);
  return <RecoveryWorkspace archive={archiveRegistry.items.map(toArchiveItem)} initialDataset={dataset} persistence={persistenceStatus()} initialReconstructionReviewDataset={reconstructionReviewDataset} reconstructionReviewPersistence={reconstructionReviewPersistenceStatus()} />;
}
