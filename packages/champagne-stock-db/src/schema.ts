import { jsonb, date, integer, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const tenants = pgTable("tenants", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id),
  email: text("email").notNull(),
  displayName: text("display_name").notNull(),
  role: text("role").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const locations = pgTable("locations", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id),
  name: text("name").notNull(),
  type: text("type").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id),
  name: text("name").notNull(),
  variant: text("variant"),
  stockClass: text("stock_class").notNull(),
  unitLabel: text("unit_label").notNull(),
  packSizeUnits: integer("pack_size_units").notNull(),
  minLevelUnits: integer("min_level_units").notNull(),
  maxLevelUnits: integer("max_level_units").notNull(),
  defaultWithdrawUnits: integer("default_withdraw_units").notNull(),
  supplierHint: text("supplier_hint"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const stockInstances = pgTable("stock_instances", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id),
  productId: uuid("product_id").notNull().references(() => products.id),
  locationId: uuid("location_id").notNull().references(() => locations.id),
  batchNumber: text("batch_number"),
  expiryDate: date("expiry_date"),
  qtyReceived: integer("qty_received").notNull(),
  qtyRemaining: integer("qty_remaining").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const qrCodes = pgTable("qr_codes", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id),
  code: text("code").notNull(),
  type: text("type").notNull(),
  targetId: uuid("target_id").notNull(),
  printedLabelText: text("printed_label_text"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const qrCodesTenantCodeUnique = uniqueIndex("qr_codes_tenant_code_unique").on(
  qrCodes.tenantId,
  qrCodes.code
);

export const events = pgTable("events", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id),
  ts: timestamp("ts", { withTimezone: true }).notNull(),
  userId: uuid("user_id").references(() => users.id),
  locationId: uuid("location_id").references(() => locations.id),
  productId: uuid("product_id").references(() => products.id),
  stockInstanceId: uuid("stock_instance_id").references(() => stockInstances.id),
  eventType: text("event_type").notNull(),
  qtyDeltaUnits: integer("qty_delta_units"),
  metaJson: jsonb("meta_json"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});
