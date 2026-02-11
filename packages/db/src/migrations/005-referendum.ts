import type { Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable("referendum_center_results")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("center_id", "integer", (col) =>
      col.notNull().unique().references("centers.id")
    )
    .addColumn("yes_votes", "integer")
    .addColumn("no_votes", "integer")
    .addColumn("valid_votes", "integer")
    .addColumn("rejected_votes", "integer")
    .execute();

  await db.schema.alterTable("constituencies").addColumn("ref_yes_votes", "integer").execute();
  await db.schema.alterTable("constituencies").addColumn("ref_no_votes", "integer").execute();
  await db.schema.alterTable("constituencies").addColumn("ref_valid_votes", "integer").execute();
  await db.schema.alterTable("constituencies").addColumn("ref_rejected_votes", "integer").execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.alterTable("constituencies").dropColumn("ref_rejected_votes").execute();
  await db.schema.alterTable("constituencies").dropColumn("ref_valid_votes").execute();
  await db.schema.alterTable("constituencies").dropColumn("ref_no_votes").execute();
  await db.schema.alterTable("constituencies").dropColumn("ref_yes_votes").execute();
  await db.schema.dropTable("referendum_center_results").execute();
}
