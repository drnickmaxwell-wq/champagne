import { z } from "zod";

export type StockScanStatus = "idle" | "active" | "paused";

export type StockScanSession = {
  id: string;
  status: StockScanStatus;
  startedAt: string;
};

export type StockItem = {
  code: string;
  name: string;
  quantity: number;
};

export type ReorderRequest = {
  itemCode: string;
  quantity: number;
  requestedBy: string;
};

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

export const ScanResponseSchema = z.discriminatedUnion("result", [
  z.object({
    result: z.literal("LOCATION"),
    locationId: z.string(),
    name: z.string(),
    locationType: z.string()
  }),
  z.object({
    result: z.literal("STOCK_INSTANCE"),
    stockInstanceId: z.string(),
    productId: z.string(),
    locationId: z.string()
  }),
  z.object({
    result: z.literal("PRODUCT_WITHDRAW"),
    productId: z.string(),
    defaultWithdrawUnits: z.number().int().nonnegative()
  }),
  z.object({
    result: z.literal("UNMATCHED"),
    scannedCode: z.string()
  })
]);
export type ScanResponse = z.infer<typeof ScanResponseSchema>;

export const ReorderSuggestionSchema = z.object({
  productId: z.string(),
  currentUnits: z.number().int().nonnegative(),
  suggestedUnits: z.number().int().positive(),
  minLevelUnits: z.number().int().nonnegative(),
  maxLevelUnits: z.number().int().positive(),
  reason: z.string()
});
export type ReorderSuggestion = z.infer<typeof ReorderSuggestionSchema>;
