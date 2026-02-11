import type { Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema.alterTable("centers").addColumn("valid_votes", "integer").execute();
  await db.schema.alterTable("centers").addColumn("rejected_votes", "integer").execute();
  await db.schema.alterTable("centers").addColumn("absent_voters", "integer").execute();
  await db.schema.alterTable("centers").addColumn("result_sheet_url", "text").execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.alterTable("centers").dropColumn("result_sheet_url").execute();
  await db.schema.alterTable("centers").dropColumn("absent_voters").execute();
  await db.schema.alterTable("centers").dropColumn("rejected_votes").execute();
  await db.schema.alterTable("centers").dropColumn("valid_votes").execute();
}
