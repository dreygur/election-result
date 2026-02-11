import { sql } from "kysely";
import { db } from "../db";

export async function getNationalReferendumStats() {
  const row = await db
    .selectFrom("constituencies")
    .select([
      sql<number>`coalesce(sum(ref_yes_votes), 0)`.as("totalYes"),
      sql<number>`coalesce(sum(ref_no_votes), 0)`.as("totalNo"),
      sql<number>`coalesce(sum(ref_valid_votes), 0)`.as("totalValid"),
      sql<number>`coalesce(sum(ref_rejected_votes), 0)`.as("totalRejected"),
    ])
    .executeTakeFirstOrThrow();

  return {
    totalYes: Number(row.totalYes),
    totalNo: Number(row.totalNo),
    totalValid: Number(row.totalValid),
    totalRejected: Number(row.totalRejected),
  };
}

export async function getReferendumByConstituency() {
  const rows = await db
    .selectFrom("constituencies")
    .innerJoin("districts", "districts.id", "constituencies.district_id")
    .select([
      "constituencies.id",
      "constituencies.name_en",
      "constituencies.slug",
      "districts.name_en as district",
      "constituencies.ref_yes_votes as yes",
      "constituencies.ref_no_votes as no",
      "constituencies.ref_valid_votes as valid",
      "constituencies.ref_rejected_votes as rejected",
    ])
    .where("constituencies.ref_yes_votes", "is not", null)
    .orderBy("constituencies.name_en")
    .execute();

  return rows.map((r) => {
    const total = (Number(r.yes) || 0) + (Number(r.no) || 0);
    return {
      ...r,
      yes: Number(r.yes) || 0,
      no: Number(r.no) || 0,
      valid: Number(r.valid) || 0,
      rejected: Number(r.rejected) || 0,
      yesPercent: total > 0 ? (Number(r.yes) / total) * 100 : 0,
    };
  });
}
