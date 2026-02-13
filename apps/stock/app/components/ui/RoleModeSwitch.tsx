"use client";

import { useEffect, useState } from "react";
import {
  loadRoleMode,
  saveRoleMode,
  type StockRoleMode
} from "../../lib/localStores/roleMode";

export default function RoleModeSwitch() {
  const [role, setRole] = useState<StockRoleMode>("nurse");

  useEffect(() => {
    setRole(loadRoleMode());
  }, []);

  const handleChange = (next: StockRoleMode) => {
    setRole(next);
    saveRoleMode(next);
  };

  return (
    <div className="stock-role-switch" role="group" aria-label="Mode">
      <button
        type="button"
        className={`stock-button stock-button--secondary${role === "nurse" ? " stock-role-switch__button--active" : ""}`}
        onClick={() => handleChange("nurse")}
      >
        Nurse mode
      </button>
      <button
        type="button"
        className={`stock-button stock-button--secondary${role === "admin" ? " stock-role-switch__button--active" : ""}`}
        onClick={() => handleChange("admin")}
      >
        Admin mode
      </button>
    </div>
  );
}
