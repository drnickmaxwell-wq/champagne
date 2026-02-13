"use client";

import { useEffect, useState } from "react";
import { loadRoleMode, type StockRoleMode } from "../../lib/localStores/roleMode";

export default function TenantBanner() {
  const tenantName =
    process.env.NEXT_PUBLIC_TENANT_NAME && process.env.NEXT_PUBLIC_TENANT_NAME.trim().length
      ? process.env.NEXT_PUBLIC_TENANT_NAME.trim()
      : "Local";
  const [roleMode, setRoleMode] = useState<StockRoleMode>("nurse");

  useEffect(() => {
    setRoleMode(loadRoleMode());
  }, []);

  return (
    <div className="stock-tenant-banner" role="status">
      <p>This Stock system is in local-only mode: data is saved on this device.</p>
      <p>Tenant: {tenantName}</p>
      {roleMode === "admin" ? <p>Setup → Locations Pack prints QR labels for rooms/cupboards.</p> : null}
    </div>
  );
}
