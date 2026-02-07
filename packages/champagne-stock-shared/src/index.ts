import { z } from "zod";

export const StockClassSchema = z.enum([
  "CONSUMABLE",
  "IMPLANT",
  "EQUIPMENT",
  "PHARMACY",
  "LAB"
]);
export type StockClass = z.infer<typeof StockClassSchema>;

export const EventTypeSchema = z.enum([
  "RECEIVE",
  "WITHDRAW",
  "ADJUST",
  "TRANSFER",
  "COUNT",
  "EXPIRE",
  "RETURN"
]);
export type EventType = z.infer<typeof EventTypeSchema>;

export const LocationTypeSchema = z.enum([
  "CUPBOARD",
  "SURGERY",
  "STORAGE",
  "EMERGENCY",
  "OTHER"
]);
export type LocationType = z.infer<typeof LocationTypeSchema>;

export const LocationSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: LocationTypeSchema
});
export type Location = z.infer<typeof LocationSchema>;

export const LocationCreateInputSchema = z.object({
  name: z.string().min(1),
  type: LocationTypeSchema
});
export type LocationCreateInput = z.infer<typeof LocationCreateInputSchema>;

export const LocationUpdateInputSchema = LocationCreateInputSchema.partial();
export type LocationUpdateInput = z.infer<typeof LocationUpdateInputSchema>;

export const EventInputSchema = z.object({
  ts: z.string().datetime().optional(),
  eventType: EventTypeSchema,
  qtyDeltaUnits: z.number().int(),
  userId: z.string().uuid().optional(),
  locationId: z.string().uuid().optional(),
  productId: z.string().uuid().optional(),
  stockInstanceId: z.string().uuid().optional(),
  meta: z.record(z.unknown()).optional()
});
export type EventInput = z.infer<typeof EventInputSchema>;

export const ProductSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  variant: z.string().nullable(),
  stockClass: StockClassSchema,
  unitLabel: z.string(),
  packSizeUnits: z.number().int().positive(),
  minLevelUnits: z.number().int().nonnegative(),
  maxLevelUnits: z.number().int().positive(),
  defaultWithdrawUnits: z.number().int().positive(),
  supplierHint: z.string().nullable()
});
export type ProductSummary = z.infer<typeof ProductSummarySchema>;

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  variant: z.string().nullable(),
  stockClass: StockClassSchema,
  unitLabel: z.string(),
  packSizeUnits: z.number().int().positive(),
  minLevelUnits: z.number().int().nonnegative(),
  maxLevelUnits: z.number().int().positive(),
  defaultWithdrawUnits: z.number().int().positive(),
  supplierHint: z.string().nullable()
});
export type Product = z.infer<typeof ProductSchema>;

export const ProductCreateInputSchema = z.object({
  name: z.string().min(1),
  variant: z.string().nullable().optional(),
  stockClass: StockClassSchema,
  unitLabel: z.string().min(1),
  packSizeUnits: z.number().int().positive(),
  minLevelUnits: z.number().int().nonnegative(),
  maxLevelUnits: z.number().int().positive(),
  defaultWithdrawUnits: z.number().int().positive(),
  supplierHint: z.string().nullable().optional()
});
export type ProductCreateInput = z.infer<typeof ProductCreateInputSchema>;

export const ProductUpdateInputSchema = ProductCreateInputSchema.partial();
export type ProductUpdateInput = z.infer<typeof ProductUpdateInputSchema>;

export const StockInstanceSnapshotSchema = z.object({
  id: z.string(),
  productId: z.string(),
  locationId: z.string().nullable(),
  batchNumber: z.string().nullable(),
  expiryDate: z.string().nullable(),
  qtyReceived: z.number().int().nonnegative(),
  qtyRemaining: z.number().int().nonnegative(),
  status: z.string()
});
export type StockInstanceSnapshot = z.infer<typeof StockInstanceSnapshotSchema>;

export const ScanLocationProductSchema = z.object({
  productId: z.string(),
  name: z.string(),
  variant: z.string().nullable(),
  unitLabel: z.string(),
  availableUnits: z.number().int().nonnegative(),
  minLevelUnits: z.number().int().nonnegative(),
  maxLevelUnits: z.number().int().nonnegative(),
  lowStock: z.boolean()
});
export type ScanLocationProduct = z.infer<typeof ScanLocationProductSchema>;

export const ScanResponseSchema = z.discriminatedUnion("result", [
  z.object({
    result: z.literal("LOCATION"),
    locationId: z.string(),
    name: z.string(),
    locationType: z.string(),
    products: z.array(ScanLocationProductSchema)
  }),
  z.object({
    result: z.literal("STOCK_INSTANCE"),
    stockInstance: StockInstanceSnapshotSchema,
    product: ProductSummarySchema,
    location: z
      .object({
        id: z.string(),
        name: z.string(),
        type: z.string()
      })
      .nullable()
  }),
  z.object({
    result: z.literal("PRODUCT_WITHDRAW"),
    product: ProductSummarySchema
  }),
  z.object({
    result: z.literal("UNMATCHED"),
    scannedCode: z.string()
  })
]);
export type ScanResponse = z.infer<typeof ScanResponseSchema>;

export const ReorderSuggestionSchema = z.object({
  productId: z.string(),
  name: z.string(),
  variant: z.string().nullable(),
  availableUnits: z.number().int().nonnegative(),
  minLevelUnits: z.number().int().nonnegative(),
  maxLevelUnits: z.number().int().positive(),
  suggestedOrderUnits: z.number().int().nonnegative(),
  supplierHint: z.string().nullable(),
  unitLabel: z.string(),
  packSizeUnits: z.number().int().positive()
});
export type ReorderSuggestion = z.infer<typeof ReorderSuggestionSchema>;

export const EventResponseSchema = z.object({
  eventId: z.string(),
  stockInstance: StockInstanceSnapshotSchema.nullable()
});
export type EventResponse = z.infer<typeof EventResponseSchema>;
