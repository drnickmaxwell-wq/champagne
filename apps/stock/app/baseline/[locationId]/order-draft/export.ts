import type { DraftOrigin } from "../../baselineDraft";

export type OrderDraftExportLineItem = {
  productId: string;
  productName: string;
  qtyUnits: number;
  supplierId?: string;
  supplierSku?: string;
  packLabel?: string;
};

export type OrderDraftExportV1 = {
  contractVersion: "stock.orderDraft.v1";
  payloadVersion: "v1";
  generatedAt: string;
  draftId: string;
  origin: DraftOrigin;
  locationRefs: Array<{
    locationId: string;
    locationName: string;
  }>;
  lineItems: OrderDraftExportLineItem[];
  notes?: string;
};

type BuildOrderDraftExportParams = {
  draftId: string;
  origin: DraftOrigin;
  locationId: string;
  locationName: string;
  lineItems: OrderDraftExportLineItem[];
  notes?: string;
  generatedAt: string;
};

export const buildOrderDraftExport = (
  params: BuildOrderDraftExportParams
): OrderDraftExportV1 => {
  return {
    contractVersion: "stock.orderDraft.v1",
    payloadVersion: "v1",
    generatedAt: params.generatedAt,
    draftId: params.draftId,
    origin: params.origin,
    locationRefs: [
      {
        locationId: params.locationId,
        locationName: params.locationName
      }
    ],
    lineItems: params.lineItems.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      qtyUnits: item.qtyUnits,
      ...(item.supplierId ? { supplierId: item.supplierId } : {}),
      ...(item.supplierSku ? { supplierSku: item.supplierSku } : {}),
      ...(item.packLabel ? { packLabel: item.packLabel } : {})
    })),
    ...(params.notes ? { notes: params.notes } : {})
  };
};
