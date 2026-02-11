import { sql } from "kysely";
import { db } from "../db";

export async function getOverallStats() {
  const [constituencies, candidates, parties, centers] = await Promise.all([
    db
      .selectFrom("constituencies")
      .select([
        sql<number>`count(*)`.as("total"),
        sql<number>`coalesce(sum(total_voters), 0)`.as("totalVoters"),
        sql<number>`coalesce(sum(total_votes_cast), 0)`.as("totalVotesCast"),
        sql<number>`coalesce(sum(total_rejected_votes), 0)`.as("totalRejected"),
      ])
      .executeTakeFirstOrThrow(),
    db
      .selectFrom("candidates")
      .select(sql<number>`count(*)`.as("total"))
      .executeTakeFirstOrThrow(),
    db
      .selectFrom("parties")
      .select(sql<number>`count(*)`.as("total"))
      .executeTakeFirstOrThrow(),
    db
      .selectFrom("centers")
      .select(sql<number>`count(*)`.as("total"))
      .executeTakeFirstOrThrow(),
  ]);

  return {
    totalConstituencies: Number(constituencies.total),
    totalVoters: Number(constituencies.totalVoters),
    totalVotesCast: Number(constituencies.totalVotesCast),
    totalRejected: Number(constituencies.totalRejected),
    totalCandidates: Number(candidates.total),
    totalParties: Number(parties.total),
    totalCenters: Number(centers.total),
  };
}

export async function getSeatsByParty() {
  return db
    .selectFrom("candidates")
    .innerJoin("parties", "parties.id", "candidates.party_id")
    .where("candidates.is_winner", "=", true)
    .groupBy(["parties.id", "parties.name_en", "parties.name_bn", "parties.slug", "parties.short_name"])
    .select([
      "parties.id",
      "parties.name_en",
      "parties.name_bn",
      "parties.slug",
      "parties.short_name",
      sql<number>`count(*)`.as("seats"),
      sql<number>`coalesce(sum(candidates.total_votes), 0)`.as("totalVotes"),
    ])
    .orderBy("seats", "desc")
    .execute();
}
