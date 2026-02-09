export type OrderDraftPackLineItem = {
  productId: string;
  productName: string;
  qtyUnits: number;
  supplierId?: string;
  supplierSku?: string;
  packLabel?: string;
  notes?: string;
};

export type SupplierOrderPack = {
  supplierId?: string;
  items: OrderDraftPackLineItem[];
};

export const groupDraftLineItemsBySupplier = (
  items: OrderDraftPackLineItem[]
): SupplierOrderPack[] => {
  const grouped = new Map<string, OrderDraftPackLineItem[]>();
  const unassigned: OrderDraftPackLineItem[] = [];

  items.forEach((item) => {
    if (!item.supplierId) {
      unassigned.push(item);
      return;
    }
    const list = grouped.get(item.supplierId) ?? [];
    list.push(item);
    grouped.set(item.supplierId, list);
  });

  const packs: SupplierOrderPack[] = Array.from(grouped.entries()).map(
    ([supplierId, groupedItems]) => ({
      supplierId,
      items: groupedItems
    })
  );

  if (unassigned.length > 0) {
    packs.push({ items: unassigned });
  }

  return packs;
};

const formatPackLineItem = (item: OrderDraftPackLineItem) => {
  const details = [
    item.supplierSku ? `SKU: ${item.supplierSku}` : "SKU missing",
    item.packLabel ? `Pack: ${item.packLabel}` : null,
    item.notes ? `Notes: ${item.notes}` : null
  ].filter(Boolean);
  const detailText = details.length > 0 ? ` — ${details.join(" | ")}` : "";
  return `${item.productName} — Qty ${item.qtyUnits}${detailText}`;
};

export const buildEmailOrderPack = (params: {
  supplierName: string;
  items: OrderDraftPackLineItem[];
}) => {
  const lines = [
    "Subject: Order request — [Practice name] — [Delivery date]",
    "",
    `Hello ${params.supplierName} team,`,
    "",
    "This is [Practice name]. Please place the following order for delivery to [Delivery address] on [Delivery date].",
    "",
    "Items:",
    ...params.items.map((item) => `- ${formatPackLineItem(item)}`),
    "",
    "Thank you,",
    "[Your name]"
  ];

  return lines.join("\n");
};

export const buildPhoneOrderPack = (params: {
  supplierName: string;
  items: OrderDraftPackLineItem[];
}) => {
  const lines = [
    `Phone order script — ${params.supplierName}`,
    "",
    "Hi, this is [Your name] from [Practice name]. I would like to place an order.",
    "Can you confirm our account before we begin?",
    "",
    "Items to order:",
    ...params.items.map(
      (item, index) => `${index + 1}) ${formatPackLineItem(item)}`
    ),
    "",
    "Please confirm the expected delivery date."
  ];

  return lines.join("\n");
};

export const buildPortalOrderPack = (params: {
  supplierName: string;
  items: OrderDraftPackLineItem[];
}) => {
  const lines = [
    `Portal checklist — ${params.supplierName}`,
    "",
    "Account: [Practice name]",
    "Delivery address: [Delivery address]",
    "Requested delivery date: [Delivery date]",
    "",
    "Items to enter:",
    ...params.items.map((item) => `- [ ] ${formatPackLineItem(item)}`)
  ];

  return lines.join("\n");
};

export const buildSupplierPackDownload = (params: {
  supplierName: string;
  emailText: string;
  phoneText: string;
  portalText: string;
}) => {
  return [
    `Supplier order pack — ${params.supplierName}`,
    "",
    params.emailText,
    "",
    params.phoneText,
    "",
    params.portalText,
    ""
  ].join("\n");
};
