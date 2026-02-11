import { db } from "../db";

export async function getCenterById(centerId: number) {
  return db
    .selectFrom("centers as c")
    .innerJoin("constituencies as con", "con.id", "c.constituency_id")
    .where("c.id", "=", centerId)
    .select([
      "c.id",
      "c.center_number",
      "c.name_bn",
      "c.total_voters",
      "c.total_votes_cast",
      "c.valid_votes",
      "c.rejected_votes",
      "c.absent_voters",
      "c.result_sheet_url",
      "con.name_en as constituencyName",
      "con.slug as constituencySlug",
    ])
    .executeTakeFirst();
}

export async function getCenterResults(centerId: number) {
  return db
    .selectFrom("center_results as cr")
    .innerJoin("candidates as c", "c.id", "cr.candidate_id")
    .leftJoin("parties as p", "p.id", "c.party_id")
    .where("cr.center_id", "=", centerId)
    .select([
      "c.id as candidateId",
      "c.name_bn",
      "c.name_en",
      "cr.votes",
      "c.is_winner",
      "p.name_bn as partyNameBn",
      "p.short_name as partyShortName",
      "p.slug as partySlug",
    ])
    .orderBy("cr.votes", "desc")
    .execute();
}
