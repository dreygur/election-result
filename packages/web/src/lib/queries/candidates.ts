import { db } from "../db";

export async function getCandidateById(id: number) {
  return db
    .selectFrom("candidates as c")
    .innerJoin("constituencies as con", "con.id", "c.constituency_id")
    .innerJoin("districts as d", "d.id", "con.district_id")
    .leftJoin("parties as p", "p.id", "c.party_id")
    .where("c.id", "=", id)
    .select([
      "c.id",
      "c.name_bn",
      "c.name_en",
      "c.photo_url",
      "c.symbol",
      "c.symbol_url",
      "c.total_votes",
      "c.is_winner",
      "con.name_en as constituencyName",
      "con.slug as constituencySlug",
      "con.total_votes_cast as constituencyTotalVotes",
      "d.name_en as districtName",
      "p.name_en as partyName",
      "p.name_bn as partyNameBn",
      "p.slug as partySlug",
      "p.short_name as partyShortName",
    ])
    .executeTakeFirst();
}

export async function getCandidateCenterResults(candidateId: number) {
  return db
    .selectFrom("center_results as cr")
    .innerJoin("centers as ctr", "ctr.id", "cr.center_id")
    .where("cr.candidate_id", "=", candidateId)
    .select([
      "ctr.id as centerId",
      "ctr.center_number",
      "ctr.name_bn as centerName",
      "ctr.total_voters",
      "ctr.total_votes_cast",
      "ctr.constituency_id",
      "cr.votes",
    ])
    .orderBy("ctr.center_number")
    .execute();
}
