import { Client } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to run seed data.");
}

const devTenantId =
  (process.env.STOCK_TENANT_ID && process.env.STOCK_TENANT_ID.trim()) ||
  "00000000-0000-0000-0000-000000000001";

const ids = {
  tenantId: devTenantId,
  locations: {
    mainCupboard: "00000000-0000-0000-0000-000000000101",
    surgery1: "00000000-0000-0000-0000-000000000102",
    surgery2: "00000000-0000-0000-0000-000000000103"
  },
  products: {
    compositeA2: "00000000-0000-0000-0000-000000000201",
    compositeA3: "00000000-0000-0000-0000-000000000202",
    compositeC2: "00000000-0000-0000-0000-000000000203",
    cottonRolls: "00000000-0000-0000-0000-000000000204",
    gloves: "00000000-0000-0000-0000-000000000205"
  },
  stockInstances: {
    compositeA2Batch: "00000000-0000-0000-0000-000000000301",
    compositeA3Batch: "00000000-0000-0000-0000-000000000302",
    compositeC2Batch: "00000000-0000-0000-0000-000000000303",
    cottonRollsBulk: "00000000-0000-0000-0000-000000000304",
    glovesBin: "00000000-0000-0000-0000-000000000305"
  },
  qrCodes: {
    locationMain: "00000000-0000-0000-0000-000000000401",
    compositeA2: "00000000-0000-0000-0000-000000000402",
    cottonRolls: "00000000-0000-0000-0000-000000000403"
  }
};

const client = new Client({ connectionString });
await client.connect();

try {
  await client.query("BEGIN");

  await client.query(
    "INSERT INTO tenants (id, name) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name",
    [ids.tenantId, "Champagne Dental"]
  );

  const locationRows = [
    [ids.locations.mainCupboard, ids.tenantId, "Main cupboard", "STORAGE"],
    [ids.locations.surgery1, ids.tenantId, "Surgery 1", "SURGERY"],
    [ids.locations.surgery2, ids.tenantId, "Surgery 2", "SURGERY"]
  ];

  for (const [id, tenantId, name, type] of locationRows) {
    await client.query(
      "INSERT INTO locations (id, tenant_id, name, type) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type",
      [id, tenantId, name, type]
    );
  }

  const productRows = [
    [
      ids.products.compositeA2,
      ids.tenantId,
      "Composite",
      "A2",
      "CONSUMABLE",
      "capsule",
      20,
      40,
      160,
      10,
      "3M Filtek"
    ],
    [
      ids.products.compositeA3,
      ids.tenantId,
      "Composite",
      "A3",
      "CONSUMABLE",
      "capsule",
      20,
      40,
      160,
      10,
      "3M Filtek"
    ],
    [
      ids.products.compositeC2,
      ids.tenantId,
      "Composite",
      "C2",
      "CONSUMABLE",
      "capsule",
      20,
      40,
      160,
      10,
      "3M Filtek"
    ],
    [
      ids.products.cottonRolls,
      ids.tenantId,
      "Cotton rolls",
      "Bulk box",
      "CONSUMABLE",
      "roll",
      200,
      400,
      1200,
      100,
      "Henry Schein"
    ],
    [
      ids.products.gloves,
      ids.tenantId,
      "Gloves",
      "Medium",
      "CONSUMABLE",
      "pair",
      100,
      200,
      600,
      20,
      "Unigloves"
    ]
  ];

  for (const row of productRows) {
    await client.query(
      `INSERT INTO products
        (id, tenant_id, name, variant, stock_class, unit_label, pack_size_units, min_level_units, max_level_units, default_withdraw_units, supplier_hint)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (id)
       DO UPDATE SET name = EXCLUDED.name, variant = EXCLUDED.variant, stock_class = EXCLUDED.stock_class,
         unit_label = EXCLUDED.unit_label, pack_size_units = EXCLUDED.pack_size_units,
         min_level_units = EXCLUDED.min_level_units, max_level_units = EXCLUDED.max_level_units,
         default_withdraw_units = EXCLUDED.default_withdraw_units, supplier_hint = EXCLUDED.supplier_hint`,
      row
    );
  }

  const stockRows = [
    [
      ids.stockInstances.compositeA2Batch,
      ids.tenantId,
      ids.products.compositeA2,
      ids.locations.mainCupboard,
      "A2-2025-01",
      "2026-03-31",
      60,
      42,
      "AVAILABLE"
    ],
    [
      ids.stockInstances.compositeA3Batch,
      ids.tenantId,
      ids.products.compositeA3,
      ids.locations.mainCupboard,
      "A3-2025-02",
      "2026-06-30",
      60,
      12,
      "AVAILABLE"
    ],
    [
      ids.stockInstances.compositeC2Batch,
      ids.tenantId,
      ids.products.compositeC2,
      ids.locations.mainCupboard,
      "C2-2025-03",
      "2026-09-30",
      40,
      35,
      "AVAILABLE"
    ],
    [
      ids.stockInstances.cottonRollsBulk,
      ids.tenantId,
      ids.products.cottonRolls,
      ids.locations.mainCupboard,
      null,
      null,
      500,
      120,
      "AVAILABLE"
    ],
    [
      ids.stockInstances.glovesBin,
      ids.tenantId,
      ids.products.gloves,
      ids.locations.surgery1,
      null,
      null,
      400,
      260,
      "AVAILABLE"
    ]
  ];

  for (const row of stockRows) {
    await client.query(
      `INSERT INTO stock_instances
        (id, tenant_id, product_id, location_id, batch_number, expiry_date, qty_received, qty_remaining, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (id)
       DO UPDATE SET product_id = EXCLUDED.product_id, location_id = EXCLUDED.location_id,
         batch_number = EXCLUDED.batch_number, expiry_date = EXCLUDED.expiry_date,
         qty_received = EXCLUDED.qty_received, qty_remaining = EXCLUDED.qty_remaining, status = EXCLUDED.status`,
      row
    );
  }

  const qrRows = [
    [
      ids.qrCodes.locationMain,
      ids.tenantId,
      "LOC-MAIN-CUPBOARD",
      "LOCATION",
      ids.locations.mainCupboard,
      "Main cupboard"
    ],
    [
      ids.qrCodes.compositeA2,
      ids.tenantId,
      "STOCK-COMP-A2-2025",
      "STOCK_INSTANCE",
      ids.stockInstances.compositeA2Batch,
      "Composite A2 batch"
    ],
    [
      ids.qrCodes.cottonRolls,
      ids.tenantId,
      "WITHDRAW-COTTON-ROLLS",
      "PRODUCT_WITHDRAW",
      ids.products.cottonRolls,
      "Cotton rolls"
    ]
  ];

  for (const row of qrRows) {
    await client.query(
      `INSERT INTO qr_codes (id, tenant_id, code, type, target_id, printed_label_text)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (tenant_id, code)
       DO UPDATE SET type = EXCLUDED.type, target_id = EXCLUDED.target_id, printed_label_text = EXCLUDED.printed_label_text`,
      row
    );
  }

  await client.query("COMMIT");
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  await client.end();
}
