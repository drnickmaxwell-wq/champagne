export type StockDbPool = {
  query: (
    text: string,
    params?: ReadonlyArray<unknown>
  ) => Promise<{ rows: any[]; rowCount: number | null }>;
  connect: () => Promise<{
    query: (
      text: string,
      params?: ReadonlyArray<unknown>
    ) => Promise<{ rows: any[]; rowCount: number | null }>;
    release: () => void;
  }>;
};

export type LocationRecord = {
  id: string;
  name: string;
  type: string;
};

export type ProductRecord = {
  id: string;
  name: string;
  variant: string | null;
  stockClass: string;
  unitLabel: string;
  packSizeUnits: number;
  minLevelUnits: number;
  maxLevelUnits: number;
  defaultWithdrawUnits: number;
  supplierHint: string | null;
};

export type StockInstanceRecord = {
  id: string;
  productId: string;
  locationId: string | null;
  batchNumber: string | null;
  expiryDate: string | null;
  qtyReceived: number;
  qtyRemaining: number;
  status: string;
};

export type LocationProductAvailability = {
  productId: string;
  name: string;
  variant: string | null;
  unitLabel: string;
  availableUnits: number;
  minLevelUnits: number;
  maxLevelUnits: number;
  lowStock: boolean;
};

export type QrLookupResult =
  | {
      type: "LOCATION";
      location: LocationRecord;
      products: LocationProductAvailability[];
    }
  | {
      type: "STOCK_INSTANCE";
      stockInstance: StockInstanceRecord;
      product: ProductRecord;
      location: LocationRecord | null;
    }
  | {
      type: "PRODUCT_WITHDRAW";
      product: ProductRecord;
    }
  | {
      type: "UNMATCHED";
    };

export type EventInsertInput = {
  ts: Date;
  eventType: string;
  qtyDeltaUnits: number;
  userId?: string;
  locationId?: string;
  productId?: string;
  stockInstanceId?: string;
  meta?: Record<string, unknown>;
};

export type EventWriteResult = {
  ok: true;
};

export type ProductCreateInput = {
  name: string;
  variant?: string | null;
  stockClass: string;
  unitLabel: string;
  packSizeUnits: number;
  minLevelUnits: number;
  maxLevelUnits: number;
  defaultWithdrawUnits: number;
  supplierHint?: string | null;
};

export type ProductUpdateInput = Partial<ProductCreateInput>;

const mapProduct = (row: any): ProductRecord => {
  return {
    id: row.id,
    name: row.name,
    variant: row.variant ?? null,
    stockClass: row.stock_class,
    unitLabel: row.unit_label,
    packSizeUnits: Number(row.pack_size_units),
    minLevelUnits: Number(row.min_level_units),
    maxLevelUnits: Number(row.max_level_units),
    defaultWithdrawUnits: Number(row.default_withdraw_units),
    supplierHint: row.supplier_hint ?? null
  };
};

const mapStockInstance = (row: any): StockInstanceRecord => {
  return {
    id: row.id,
    productId: row.product_id ?? row.stock_product_id,
    locationId: row.location_id ?? null,
    batchNumber: row.batch_number ?? null,
    expiryDate: row.expiry_date ? String(row.expiry_date) : null,
    qtyReceived: Number(row.qty_received),
    qtyRemaining: Number(row.qty_remaining),
    status: row.status
  };
};

export async function lookupQrCode(
  pool: StockDbPool,
  tenantId: string,
  code: string
): Promise<QrLookupResult> {
  const qrResult = await pool.query(
    "SELECT type, target_id FROM qr_codes WHERE tenant_id = $1 AND code = $2",
    [tenantId, code]
  );

  if (qrResult.rowCount === 0) {
    return { type: "UNMATCHED" };
  }

  const qrRow = qrResult.rows[0];

  if (qrRow.type === "LOCATION") {
    const locationResult = await pool.query(
      "SELECT id, name, type FROM locations WHERE tenant_id = $1 AND id = $2",
      [tenantId, qrRow.target_id]
    );

    if (locationResult.rowCount === 0) {
      return { type: "UNMATCHED" };
    }

    const location = locationResult.rows[0] as LocationRecord;
    const productsResult = await pool.query(
      `SELECT p.id, p.name, p.variant, p.unit_label, p.min_level_units, p.max_level_units,
        COALESCE(SUM(si.qty_remaining), 0) AS available_units
       FROM stock_instances si
       JOIN products p ON p.id = si.product_id
       WHERE si.tenant_id = $1 AND si.location_id = $2
       GROUP BY p.id, p.name, p.variant, p.unit_label, p.min_level_units, p.max_level_units
       ORDER BY p.name ASC`,
      [tenantId, location.id]
    );

    const products = (productsResult.rows as Array<Record<string, unknown>>).map((row) => {
      const availableUnits = Number(row.available_units);
      const minLevelUnits = Number(row.min_level_units);
      const maxLevelUnits = Number(row.max_level_units);
      return {
        productId: String(row.id),
        name: String(row.name),
        variant: row.variant ? String(row.variant) : null,
        unitLabel: String(row.unit_label),
        availableUnits,
        minLevelUnits,
        maxLevelUnits,
        lowStock: availableUnits < minLevelUnits
      };
    });

    return {
      type: "LOCATION",
      location,
      products
    };
  }

  if (qrRow.type === "STOCK_INSTANCE") {
    const instanceResult = await pool.query(
      `SELECT si.id, si.product_id AS stock_product_id, si.location_id, si.batch_number, si.expiry_date, si.qty_received,
        si.qty_remaining, si.status,
        p.id AS product_id, p.name, p.variant, p.stock_class, p.unit_label, p.pack_size_units,
        p.min_level_units, p.max_level_units, p.default_withdraw_units, p.supplier_hint,
        l.id AS location_id, l.name AS location_name, l.type AS location_type
       FROM stock_instances si
       JOIN products p ON p.id = si.product_id
       LEFT JOIN locations l ON l.id = si.location_id
       WHERE si.tenant_id = $1 AND si.id = $2`,
      [tenantId, qrRow.target_id]
    );

    if (instanceResult.rowCount === 0) {
      return { type: "UNMATCHED" };
    }

    const row = instanceResult.rows[0];

    return {
      type: "STOCK_INSTANCE",
      stockInstance: mapStockInstance(row),
      product: mapProduct(row),
      location: row.location_id
        ? {
            id: row.location_id,
            name: row.location_name,
            type: row.location_type
          }
        : null
    };
  }

  if (qrRow.type === "PRODUCT_WITHDRAW") {
    const productResult = await pool.query(
      "SELECT id, name, variant, stock_class, unit_label, pack_size_units, min_level_units, max_level_units, default_withdraw_units, supplier_hint FROM products WHERE tenant_id = $1 AND id = $2",
      [tenantId, qrRow.target_id]
    );

    if (productResult.rowCount === 0) {
      return { type: "UNMATCHED" };
    }

    return {
      type: "PRODUCT_WITHDRAW",
      product: mapProduct(productResult.rows[0])
    };
  }

  return { type: "UNMATCHED" };
}

export async function appendEventAndApplyEffects(
  pool: StockDbPool,
  tenantId: string,
  payload: EventInsertInput
): Promise<EventWriteResult> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    if (payload.stockInstanceId) {
      const updateResult = await client.query(
        `UPDATE stock_instances
         SET qty_remaining = GREATEST(0, qty_remaining + $1)
         WHERE id = $2 AND tenant_id = $3
         RETURNING id, product_id, location_id, batch_number, expiry_date, qty_received, qty_remaining, status`,
        [payload.qtyDeltaUnits, payload.stockInstanceId, tenantId]
      );

      if (updateResult.rowCount === 0) {
        await client.query("ROLLBACK");
        throw new Error("Stock instance not found.");
      }
    }

    const insertResult = await client.query(
      `INSERT INTO events (tenant_id, ts, user_id, location_id, product_id, stock_instance_id, event_type, qty_delta_units, meta_json)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id`,
      [
        tenantId,
        payload.ts,
        payload.userId ?? null,
        payload.locationId ?? null,
        payload.productId ?? null,
        payload.stockInstanceId ?? null,
        payload.eventType,
        payload.qtyDeltaUnits,
        payload.meta ?? null
      ]
    );

    await client.query("COMMIT");

    if (!insertResult.rows[0]?.id) {
      throw new Error("Failed to insert event.");
    }

    return { ok: true };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function computeReorder(pool: StockDbPool, tenantId: string) {
  const result = await pool.query(
    `SELECT p.id, p.name, p.variant, p.min_level_units, p.max_level_units, p.supplier_hint,
      p.unit_label, p.pack_size_units, COALESCE(SUM(si.qty_remaining), 0) AS available_units
     FROM products p
     LEFT JOIN stock_instances si ON si.product_id = p.id AND si.tenant_id = p.tenant_id
     WHERE p.tenant_id = $1
     GROUP BY p.id, p.name, p.variant, p.min_level_units, p.max_level_units, p.supplier_hint, p.unit_label, p.pack_size_units
     ORDER BY p.name ASC`,
    [tenantId]
  );

  return (result.rows as Array<Record<string, unknown>>).map((row) => {
    const availableUnits = Number(row.available_units);
    const maxLevelUnits = Number(row.max_level_units);
    return {
      productId: String(row.id),
      name: String(row.name),
      variant: row.variant ? String(row.variant) : null,
      availableUnits,
      minLevelUnits: Number(row.min_level_units),
      maxLevelUnits,
      suggestedOrderUnits: Math.max(0, maxLevelUnits - availableUnits),
      supplierHint: row.supplier_hint ? String(row.supplier_hint) : null,
      unitLabel: String(row.unit_label),
      packSizeUnits: Number(row.pack_size_units)
    };
  });
}

export async function listProducts(pool: StockDbPool, tenantId: string) {
  const result = await pool.query(
    `SELECT id, name, variant, stock_class, unit_label, pack_size_units, min_level_units,
      max_level_units, default_withdraw_units, supplier_hint
     FROM products
     WHERE tenant_id = $1
     ORDER BY name ASC`,
    [tenantId]
  );

  return (result.rows as Array<Record<string, unknown>>).map((row) => mapProduct(row));
}

export async function createProduct(
  pool: StockDbPool,
  tenantId: string,
  payload: ProductCreateInput
) {
  const result = await pool.query(
    `INSERT INTO products (tenant_id, name, variant, stock_class, unit_label, pack_size_units, min_level_units,
      max_level_units, default_withdraw_units, supplier_hint)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING id, name, variant, stock_class, unit_label, pack_size_units, min_level_units,
      max_level_units, default_withdraw_units, supplier_hint`,
    [
      tenantId,
      payload.name,
      payload.variant ?? null,
      payload.stockClass,
      payload.unitLabel,
      payload.packSizeUnits,
      payload.minLevelUnits,
      payload.maxLevelUnits,
      payload.defaultWithdrawUnits,
      payload.supplierHint ?? null
    ]
  );

  if (result.rowCount === 0) {
    throw new Error("Failed to create product.");
  }

  return mapProduct(result.rows[0]);
}

export async function updateProduct(
  pool: StockDbPool,
  tenantId: string,
  productId: string,
  payload: ProductUpdateInput
) {
  const updates: Array<{ column: string; value: unknown }> = [];

  if (payload.name !== undefined) {
    updates.push({ column: "name", value: payload.name });
  }
  if (payload.variant !== undefined) {
    updates.push({ column: "variant", value: payload.variant ?? null });
  }
  if (payload.stockClass !== undefined) {
    updates.push({ column: "stock_class", value: payload.stockClass });
  }
  if (payload.unitLabel !== undefined) {
    updates.push({ column: "unit_label", value: payload.unitLabel });
  }
  if (payload.packSizeUnits !== undefined) {
    updates.push({ column: "pack_size_units", value: payload.packSizeUnits });
  }
  if (payload.minLevelUnits !== undefined) {
    updates.push({ column: "min_level_units", value: payload.minLevelUnits });
  }
  if (payload.maxLevelUnits !== undefined) {
    updates.push({ column: "max_level_units", value: payload.maxLevelUnits });
  }
  if (payload.defaultWithdrawUnits !== undefined) {
    updates.push({ column: "default_withdraw_units", value: payload.defaultWithdrawUnits });
  }
  if (payload.supplierHint !== undefined) {
    updates.push({ column: "supplier_hint", value: payload.supplierHint ?? null });
  }

  if (updates.length === 0) {
    return null;
  }

  const assignments = updates.map((item, index) => `${item.column} = $${index + 1}`);
  const values = updates.map((item) => item.value);
  const tenantIndex = updates.length + 1;
  const idIndex = updates.length + 2;

  const result = await pool.query(
    `UPDATE products
     SET ${assignments.join(", ")}
     WHERE tenant_id = $${tenantIndex} AND id = $${idIndex}
     RETURNING id, name, variant, stock_class, unit_label, pack_size_units, min_level_units,
      max_level_units, default_withdraw_units, supplier_hint`,
    [...values, tenantId, productId]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return mapProduct(result.rows[0]);
}

export async function getScanResult(
  pool: StockDbPool,
  tenantId: string,
  code: string
) {
  const lookupResult = await lookupQrCode(pool, tenantId, code);

  if (lookupResult.type === "LOCATION") {
    return {
      result: "LOCATION",
      locationId: lookupResult.location.id,
      name: lookupResult.location.name,
      locationType: lookupResult.location.type,
      products: lookupResult.products
    };
  }

  if (lookupResult.type === "STOCK_INSTANCE") {
    return {
      result: "STOCK_INSTANCE",
      stockInstance: lookupResult.stockInstance,
      product: lookupResult.product,
      location: lookupResult.location
    };
  }

  if (lookupResult.type === "PRODUCT_WITHDRAW") {
    return {
      result: "PRODUCT_WITHDRAW",
      product: lookupResult.product
    };
  }

  return { result: "UNMATCHED", scannedCode: code };
}
