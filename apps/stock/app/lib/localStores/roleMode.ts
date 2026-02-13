export type StockRoleMode = "nurse" | "admin";

const STORAGE_KEY = "stock.ui.role.v1";

export const loadRoleMode = (): StockRoleMode => {
  if (typeof window === "undefined") {
    return "nurse";
  }
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === "admin" ? "admin" : "nurse";
};

export const saveRoleMode = (mode: StockRoleMode) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, mode);
};
