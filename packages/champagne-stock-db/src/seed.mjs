import { Client } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to run seed data.");
}

const client = new Client({ connectionString });
await client.connect();

try {
  await client.query("BEGIN");

  const tenantResult = await client.query(
    "INSERT INTO tenants (name) VALUES ($1) RETURNING id",
    ["Champagne Dental"]
  );
  const tenantId = tenantResult.rows[0].id;

  const locationResult = await client.query(
    "INSERT INTO locations (tenant_id, name, type) VALUES ($1, $2, $3), ($1, $4, $5), ($1, $6, $7) RETURNING id",
    [
      tenantId,
      "Main cupboard",
      "STORAGE",
      "Surgery 1",
      "SURGERY",
      "Surgery 2",
      "SURGERY"
    ]
  );
  const [mainCupboardId] = locationResult.rows.map((row) => row.id);

  await client.query(
    "INSERT INTO products (tenant_id, name, variant, stock_class, unit_label, pack_size_units, min_level_units, max_level_units, default_withdraw_units, supplier_hint) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10), ($1,$11,$12,$13,$14,$15,$16,$17,$18,$19), ($1,$20,$21,$22,$23,$24,$25,$26,$27,$28), ($1,$29,$30,$31,$32,$33,$34,$35,$36,$37), ($1,$38,$39,$40,$41,$42,$43,$44,$45,$46)",
    [
      tenantId,
      "Composite",
      "A2",
      "CONSUMABLE",
      "capsule",
      20,
      40,
      160,
      10,
      "3M Filtek",
      "Composite",
      "A3",
      "CONSUMABLE",
      "capsule",
      20,
      40,
      160,
      10,
      "3M Filtek",
      "Composite",
      "C2",
      "CONSUMABLE",
      "capsule",
      20,
      40,
      160,
      10,
      "3M Filtek",
      "Cotton rolls",
      "Bulk",
      "CONSUMABLE",
      "roll",
      200,
      400,
      1200,
      100,
      "Henry Schein",
      "Gloves",
      "Bin level",
      "CONSUMABLE",
      "box",
      100,
      200,
      800,
      50,
      "Ansell"
    ]
  );

  await client.query(
    "INSERT INTO stock_instances (tenant_id, product_id, location_id, qty_received, qty_remaining, status) SELECT $1, id, $2, $3, $3, $4 FROM products WHERE tenant_id = $1 LIMIT 1",
    [tenantId, mainCupboardId, 50, "AVAILABLE"]
  );

  await client.query("COMMIT");
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  await client.end();
}
