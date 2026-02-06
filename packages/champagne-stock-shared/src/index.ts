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
