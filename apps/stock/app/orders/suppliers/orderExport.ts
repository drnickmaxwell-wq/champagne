import type { LocalSupplier } from "../../lib/localStores/suppliers";
import type { OrderBasketItem } from "../../lib/localStores/orderBasket";
import type { ProductSupplierMapping } from "../../lib/localStores/productSupplierMap";
import type { LocalProduct } from "../../scan/localRegistry";

export type SupplierOrderLine = {
  productName: string;
  qty: number;
  supplierSku?: string;
  packSize?: string;
  notes?: string;
};

export type SupplierOrderBlock = {
  supplierId: string;
  supplierName: string;
  orderingEmail?: string;
  cutoffNotes?: string;
  lines: SupplierOrderLine[];
};

type BuildSupplierOrderBlocksArgs = {
  basket: OrderBasketItem[];
  products: LocalProduct[];
  suppliers: LocalSupplier[];
  mappings: Record<string, ProductSupplierMapping>;
};

const formatLine = (line: SupplierOrderLine) => {
  const details = [
    `Qty ${line.qty}`,
    line.supplierSku ? `Supplier SKU ${line.supplierSku}` : null,
    line.packSize ? `Pack size ${line.packSize}` : null,
    line.notes ? `Notes ${line.notes}` : null
  ].filter(Boolean);

  return `- ${line.productName} — ${details.join(" — ")}`;
};

export const buildSupplierOrderText = (block: SupplierOrderBlock) => {
  const header = [
    `Supplier: ${block.supplierName}`,
    `Ordering email: ${block.orderingEmail?.trim() || "Not recorded"}`,
    `Cut-off notes: ${block.cutoffNotes?.trim() || "None"}`,
    "",
    "Items to order:",
    ...(block.lines.length > 0
      ? block.lines.map(formatLine)
      : ["- No items in basket for this supplier"])
  ];

  return header.join("\n");
};

export const buildSupplierOrderBlocks = ({
  basket,
  products,
  suppliers,
  mappings
}: BuildSupplierOrderBlocksArgs): SupplierOrderBlock[] => {
  const productById = new Map(products.map((product) => [product.id, product]));
  const supplierById = new Map(suppliers.map((supplier) => [supplier.id, supplier]));
  const grouped = new Map<string, SupplierOrderLine[]>();

  basket.forEach((item) => {
    const mapping = mappings[item.productId];
    if (!mapping?.supplierId || item.qty <= 0) {
      return;
    }
    const productName = productById.get(item.productId)?.name ?? item.productId;
    const lines = grouped.get(mapping.supplierId) ?? [];
    lines.push({
      productName,
      qty: item.qty,
      supplierSku: mapping.supplierSku,
      packSize: mapping.packSize,
      notes: item.notes || mapping.notes
    });
    grouped.set(mapping.supplierId, lines);
  });

  return Array.from(grouped.entries())
    .map(([supplierId, lines]) => {
      const supplier = supplierById.get(supplierId);
      return {
        supplierId,
        supplierName: supplier?.name?.trim() || supplierId,
        orderingEmail: supplier?.orderingEmail,
        cutoffNotes: supplier?.cutoffNotes,
        lines
      };
    })
    .sort((a, b) => a.supplierName.localeCompare(b.supplierName));
};

export const buildSupplierOrderFilename = (
  supplierNameOrId: string,
  now: Date = new Date()
) => {
  const datePart = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
  ].join("");

  const supplierPart = supplierNameOrId
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "supplier";

  return `supplier-order-${supplierPart}-${datePart}.txt`;
};
