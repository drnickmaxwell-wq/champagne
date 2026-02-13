"use client";

export default function TenantBanner() {
  const tenantName =
    process.env.NEXT_PUBLIC_TENANT_NAME && process.env.NEXT_PUBLIC_TENANT_NAME.trim().length
      ? process.env.NEXT_PUBLIC_TENANT_NAME.trim()
      : "Local";

  return (
    <div className="stock-tenant-banner" role="status">
      <p>Data is stored on this device until sync is enabled.</p>
      <p>Tenant: {tenantName}</p>
    </div>
  );
}
