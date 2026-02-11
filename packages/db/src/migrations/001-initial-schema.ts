import type { Kysely } from "kysely";
import { sql } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable("districts")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("ec_zilla_id", "integer", (col) => col.notNull().unique())
    .addColumn("name_bn", "varchar(255)", (col) => col.notNull())
    .addColumn("name_en", "varchar(255)", (col) => col.notNull())
    .addColumn("slug", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute();

  await db.schema
    .createTable("constituencies")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("ec_constituency_id", "integer", (col) =>
      col.notNull().unique()
    )
    .addColumn("district_id", "integer", (col) =>
      col.notNull().references("districts.id")
    )
    .addColumn("name_bn", "varchar(255)", (col) => col.notNull())
    .addColumn("name_en", "varchar(255)", (col) => col.notNull())
    .addColumn("slug", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("total_voters", "integer")
    .addColumn("total_votes_cast", "integer")
    .addColumn("total_valid_votes", "integer")
    .addColumn("total_rejected_votes", "integer")
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute();

  await db.schema
    .createTable("parties")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name_bn", "varchar(255)", (col) => col.notNull())
    .addColumn("name_en", "varchar(255)")
    .addColumn("short_name", "varchar(50)")
    .addColumn("slug", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("logo_url", "text")
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute();

  await db.schema
    .createTable("candidates")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("constituency_id", "integer", (col) =>
      col.notNull().references("constituencies.id")
    )
    .addColumn("party_id", "integer", (col) => col.references("parties.id"))
    .addColumn("name_bn", "varchar(255)", (col) => col.notNull())
    .addColumn("name_en", "varchar(255)")
    .addColumn("photo_url", "text")
    .addColumn("symbol", "varchar(255)")
    .addColumn("symbol_url", "text")
    .addColumn("total_votes", "integer")
    .addColumn("is_winner", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute();

  await db.schema
    .createTable("centers")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("ec_center_id", "integer")
    .addColumn("constituency_id", "integer", (col) =>
      col.notNull().references("constituencies.id")
    )
    .addColumn("center_number", "integer", (col) => col.notNull())
    .addColumn("name_bn", "varchar(500)", (col) => col.notNull())
    .addColumn("total_voters", "integer")
    .addColumn("total_votes_cast", "integer")
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute();

  await db.schema
    .createTable("center_results")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("center_id", "integer", (col) =>
      col.notNull().references("centers.id")
    )
    .addColumn("candidate_id", "integer", (col) =>
      col.notNull().references("candidates.id")
    )
    .addColumn("votes", "integer", (col) => col.notNull().defaultTo(0))
    .execute();

  await db.schema
    .createTable("scrape_log")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("entity_type", "varchar(50)", (col) => col.notNull())
    .addColumn("entity_id", "varchar(100)", (col) => col.notNull())
    .addColumn("status", "varchar(20)", (col) => col.notNull())
    .addColumn("error", "text")
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute();

  // Indexes
  await db.schema
    .createIndex("idx_constituencies_district")
    .on("constituencies")
    .column("district_id")
    .execute();

  await db.schema
    .createIndex("idx_candidates_constituency")
    .on("candidates")
    .column("constituency_id")
    .execute();

  await db.schema
    .createIndex("idx_candidates_party")
    .on("candidates")
    .column("party_id")
    .execute();

  await db.schema
    .createIndex("idx_centers_constituency")
    .on("centers")
    .column("constituency_id")
    .execute();

  await db.schema
    .createIndex("idx_center_results_center")
    .on("center_results")
    .column("center_id")
    .execute();

  await db.schema
    .createIndex("idx_center_results_candidate")
    .on("center_results")
    .column("candidate_id")
    .execute();

  await db.schema
    .createIndex("idx_scrape_log_entity")
    .on("scrape_log")
    .columns(["entity_type", "entity_id"])
    .execute();

  // Unique constraint: one result per center per candidate
  await db.schema
    .createIndex("uq_center_results_center_candidate")
    .on("center_results")
    .columns(["center_id", "candidate_id"])
    .unique()
    .execute();

  // Unique constraint: one center_number per constituency
  await db.schema
    .createIndex("uq_centers_constituency_number")
    .on("centers")
    .columns(["constituency_id", "center_number"])
    .unique()
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable("center_results").ifExists().execute();
  await db.schema.dropTable("centers").ifExists().execute();
  await db.schema.dropTable("candidates").ifExists().execute();
  await db.schema.dropTable("parties").ifExists().execute();
  await db.schema.dropTable("constituencies").ifExists().execute();
  await db.schema.dropTable("districts").ifExists().execute();
  await db.schema.dropTable("scrape_log").ifExists().execute();
}
