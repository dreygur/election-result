import { sql } from "kysely";
import { db } from "../db";
import type { PaginatedResult } from "@/types/pagination";

export async function getParties(pagination?: { page: number; pageSize: number }) {
  const baseQuery = db
    .selectFrom("parties as p")
    .leftJoin("candidates as c", "c.party_id", "p.id")
    .groupBy(["p.id", "p.name_en", "p.name_bn", "p.slug", "p.short_name", "p.logo_url", "p.symbol_url"])
    .select([
      "p.id",
      "p.name_en",
      "p.name_bn",
      "p.slug",
      "p.short_name",
      "p.logo_url",
      "p.symbol_url",
      sql<number>`count(c.id)`.as("totalCandidates"),
      sql<number>`coalesce(sum(c.total_votes), 0)`.as("totalVotes"),
      sql<number>`count(case when c.is_winner then 1 end)`.as("seatsWon"),
    ])
    .orderBy("seatsWon", "desc")
    .orderBy("totalVotes", "desc");

  if (!pagination) return baseQuery.execute();

  const { page, pageSize } = pagination;
  const offset = (page - 1) * pageSize;

  const [data, countResult] = await Promise.all([
    baseQuery.limit(pageSize).offset(offset).execute(),
    db
      .selectFrom("parties")
      .select(sql<number>`count(*)`.as("count"))
      .executeTakeFirstOrThrow(),
  ]);

  const total = Number(countResult.count);
  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  } satisfies PaginatedResult<(typeof data)[number]>;
}

export async function getPartyBySlug(slug: string) {
  return db
    .selectFrom("parties")
    .where("slug", "=", slug)
    .selectAll()
    .executeTakeFirst();
}

export async function getPartyCandidates(
  partyId: number,
  pagination?: { page: number; pageSize: number }
) {
  const baseQuery = db
    .selectFrom("candidates as c")
    .innerJoin("constituencies as con", "con.id", "c.constituency_id")
    .where("c.party_id", "=", partyId)
    .select([
      "c.id",
      "c.name_bn",
      "c.name_en",
      "c.photo_url",
      "c.total_votes",
      "c.is_winner",
      "con.name_en as constituencyName",
      "con.slug as constituencySlug",
    ])
    .orderBy("c.is_winner", "desc")
    .orderBy("c.total_votes", "desc");

  if (!pagination) return baseQuery.execute();

  const { page, pageSize } = pagination;
  const offset = (page - 1) * pageSize;

  const [data, countResult] = await Promise.all([
    baseQuery.limit(pageSize).offset(offset).execute(),
    db
      .selectFrom("candidates")
      .where("party_id", "=", partyId)
      .select(sql<number>`count(*)`.as("count"))
      .executeTakeFirstOrThrow(),
  ]);

  const total = Number(countResult.count);
  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  } satisfies PaginatedResult<(typeof data)[number]>;
}

export async function getPartyStats(partyId: number) {
  const result = await db
    .selectFrom("candidates")
    .where("party_id", "=", partyId)
    .select([
      sql<number>`count(*)`.as("totalCandidates"),
      sql<number>`coalesce(sum(total_votes), 0)`.as("totalVotes"),
      sql<number>`count(case when is_winner then 1 end)`.as("seatsWon"),
    ])
    .executeTakeFirstOrThrow();

  return {
    totalCandidates: Number(result.totalCandidates),
    totalVotes: Number(result.totalVotes),
    seatsWon: Number(result.seatsWon),
  };
}
