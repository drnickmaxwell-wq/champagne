import type { SupplierCatalogItem } from "./localSupplierCatalog";
import type { ProductSupplierPreference } from "./localSupplierPrefs";
import { findSupplierCatalogItem } from "./localSupplierCatalog";
import { getPreferredSupplierId } from "./localSupplierPrefs";

export type DraftLineSupplierMeta = {
  supplierId?: string;
  supplierSku?: string;
  packLabel?: string;
};

export const buildDraftLineSupplierMeta = (
  productId: string,
  preferences: ProductSupplierPreference[],
  catalogItems: SupplierCatalogItem[]
): DraftLineSupplierMeta => {
  const preferredSupplierId = getPreferredSupplierId(productId, preferences);
  if (!preferredSupplierId) {
    return {};
  }
  const catalogItem = findSupplierCatalogItem(
    preferredSupplierId,
    productId,
    catalogItems
  );
  return {
    supplierId: preferredSupplierId,
    supplierSku: catalogItem?.supplierSku,
    packLabel: catalogItem?.supplierPackLabel
  };
};
