import type { Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createIndex("uq_candidates_constituency_name")
    .on("candidates")
    .columns(["constituency_id", "name_bn"])
    .unique()
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropIndex("uq_candidates_constituency_name").ifExists().execute();
}
