import type { Supplier } from "../../../suppliers/localSuppliers";
import type { SupplierOrderPack } from "./orderPacks";

export type SupplierOrderLine = {
  productId: string;
  productName: string;
  qtyUnits: number;
  supplierSku?: string;
  packLabel?: string;
  notes?: string;
};

export type SupplierOrderView = {
  supplierId?: string;
  supplierName: string;
  orderingMethod: string;
  contact: {
    phone?: string;
    email?: string;
    portalUrl?: string;
    notes?: string;
  };
  lines: SupplierOrderLine[];
};

const normalizeSupplierName = (
  supplierId: string | undefined,
  supplier?: Supplier
) => {
  if (supplier?.name?.trim()) {
    return supplier.name.trim();
  }
  if (supplierId) {
    return supplierId;
  }
  return "Unassigned items";
};

const normalizeOrderingMethod = (supplier?: Supplier) => {
  return supplier?.orderingMethod?.trim() || "Not provided";
};

export const buildSupplierOrderViews = (
  packs: SupplierOrderPack[],
  supplierById: Map<string, Supplier>
): SupplierOrderView[] => {
  return packs.map((pack) => {
    const supplier = pack.supplierId
      ? supplierById.get(pack.supplierId)
      : undefined;

    return {
      supplierId: pack.supplierId,
      supplierName: normalizeSupplierName(pack.supplierId, supplier),
      orderingMethod: normalizeOrderingMethod(supplier),
      contact: {
        phone: supplier?.contact?.phone,
        email: supplier?.contact?.email,
        portalUrl: supplier?.contact?.portalUrl,
        notes: supplier?.contact?.notes
      },
      lines: pack.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        qtyUnits: item.qtyUnits,
        supplierSku: item.supplierSku,
        packLabel: item.packLabel,
        notes: item.notes
      }))
    };
  });
};

const formatSupplierOrderLine = (line: SupplierOrderLine) => {
  const details = [
    line.supplierSku ? `SKU ${line.supplierSku}` : null,
    line.packLabel ? `Pack ${line.packLabel}` : null,
    line.notes ? `Notes: ${line.notes}` : null
  ].filter(Boolean);
  const detailText = details.length > 0 ? ` (${details.join(" | ")})` : "";
  return `- ${line.productName} — ${line.qtyUnits} units${detailText}`;
};

export const buildSupplierOrderText = (views: SupplierOrderView[]) => {
  return views
    .map((view) => {
      const contactLines = [
        `Phone: ${view.contact.phone || "Not provided"}`,
        `Email: ${view.contact.email || "Not provided"}`,
        `Portal: ${view.contact.portalUrl || "Not provided"}`,
        `Notes: ${view.contact.notes || "Not provided"}`
      ];
      return [
        `Supplier: ${view.supplierName}`,
        `Order method: ${view.orderingMethod}`,
        ...contactLines,
        ...view.lines.map(formatSupplierOrderLine)
      ].join("\n");
    })
    .join("\n\n");
};
