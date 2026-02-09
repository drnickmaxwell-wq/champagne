import type { DraftStatus } from "./draftStatus";

export type CsvMeta = {
  generatedAt: string;
  draftStatus: DraftStatus;
  generatedBy: string;
  warning: string;
};

export type CsvRow = {
  productId: string;
  productName: string;
  category: string;
  locationId: string;
  locationName: string;
  unitType: string;
  quantity?: number;
  baselineCount?: number;
  varianceNote: string;
  reviewStatus: DraftStatus;
};

const csvColumns = [
  "product_id",
  "product_name",
  "category",
  "location_id",
  "location_name",
  "unit_type",
  "quantity",
  "baseline_count",
  "variance_note",
  "review_status"
] as const;

const escapeCsvValue = (value: string | number | undefined) => {
  if (value === undefined || value === null) {
    return "";
  }
  if (typeof value === "number" && !Number.isFinite(value)) {
    return "";
  }
  const stringValue = String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

const formatCsvRow = (values: Array<string | number | undefined>) => {
  return values.map((value) => escapeCsvValue(value)).join(",");
};

export const buildOrderDraftCsv = (meta: CsvMeta, rows: CsvRow[]) => {
  const metaRows = [
    `# Generated_at: ${meta.generatedAt}`,
    `# Draft_status: ${meta.draftStatus}`,
    `# Generated_by: ${meta.generatedBy}`,
    `# Warning: ${meta.warning}`
  ];

  const headerRow = formatCsvRow([...csvColumns]);
  const metaLines = metaRows.map((line) => formatCsvRow([line]));
  const dataRows = rows.map((row) =>
    formatCsvRow([
      row.productId,
      row.productName,
      row.category,
      row.locationId,
      row.locationName,
      row.unitType,
      row.quantity,
      row.baselineCount,
      row.varianceNote,
      row.reviewStatus
    ])
  );

  return [...metaLines, headerRow, ...dataRows].join("\n");
};

export const getOrderDraftCsvColumns = () => {
  return [...csvColumns];
};
