import type { Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .alterTable("parties")
    .addColumn("ec_registration_no", "varchar(10)")
    .execute();

  await db.schema
    .alterTable("parties")
    .addColumn("registration_date", "varchar(20)")
    .execute();

  await db.schema
    .alterTable("parties")
    .addColumn("symbol_bn", "varchar(255)")
    .execute();

  await db.schema
    .alterTable("parties")
    .addColumn("symbol_url", "text")
    .execute();

  await db.schema
    .createIndex("uq_parties_ec_registration_no")
    .on("parties")
    .column("ec_registration_no")
    .unique()
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropIndex("uq_parties_ec_registration_no").ifExists().execute();

  await db.schema.alterTable("parties").dropColumn("symbol_url").execute();
  await db.schema.alterTable("parties").dropColumn("symbol_bn").execute();
  await db.schema.alterTable("parties").dropColumn("registration_date").execute();
  await db.schema.alterTable("parties").dropColumn("ec_registration_no").execute();
}
