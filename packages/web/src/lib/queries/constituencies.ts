import { sql } from "kysely";
import { db } from "../db";
import type { PaginatedResult } from "@/types/pagination";

export async function getConstituencies(filters?: {
  districtSlug?: string;
  partySlug?: string;
  page?: number;
  pageSize?: number;
}) {
  let query = db
    .selectFrom("constituencies as c")
    .innerJoin("districts as d", "d.id", "c.district_id")
    .leftJoin(
      db
        .selectFrom("candidates")
        .where("is_winner", "=", true)
        .select([
          "constituency_id",
          "name_bn as winner_name",
          "party_id",
          "total_votes as winner_votes",
        ])
        .as("w"),
      "w.constituency_id",
      "c.id"
    )
    .leftJoin("parties as p", "p.id", "w.party_id")
    .select([
      "c.id",
      "c.name_en",
      "c.name_bn",
      "c.slug",
      "c.total_voters",
      "c.total_votes_cast",
      "d.name_en as districtName",
      "d.slug as districtSlug",
      "w.winner_name as winnerName",
      "w.winner_votes as winnerVotes",
      "p.name_en as partyName",
      "p.name_bn as partyNameBn",
      "p.slug as partySlug",
      "p.short_name as partyShortName",
    ])
    .orderBy("c.name_en");

  if (filters?.districtSlug) {
    query = query.where("d.slug", "=", filters.districtSlug);
  }
  if (filters?.partySlug) {
    query = query.where("p.slug", "=", filters.partySlug);
  }

  if (!filters?.page || !filters?.pageSize) {
    return query.execute();
  }

  const { page, pageSize } = filters;
  const offset = (page - 1) * pageSize;

  // Build count query with same filters
  let countQuery = db
    .selectFrom("constituencies as c")
    .innerJoin("districts as d", "d.id", "c.district_id")
    .leftJoin(
      db
        .selectFrom("candidates")
        .where("is_winner", "=", true)
        .select(["constituency_id", "party_id"])
        .as("w"),
      "w.constituency_id",
      "c.id"
    )
    .leftJoin("parties as p", "p.id", "w.party_id")
    .select(sql<number>`count(distinct c.id)`.as("count"));

  if (filters.districtSlug) {
    countQuery = countQuery.where("d.slug", "=", filters.districtSlug);
  }
  if (filters.partySlug) {
    countQuery = countQuery.where("p.slug", "=", filters.partySlug);
  }

  const [data, countResult] = await Promise.all([
    query.limit(pageSize).offset(offset).execute(),
    countQuery.executeTakeFirstOrThrow(),
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

export async function getConstituencyBySlug(slug: string) {
  return db
    .selectFrom("constituencies as c")
    .innerJoin("districts as d", "d.id", "c.district_id")
    .where("c.slug", "=", slug)
    .select([
      "c.id",
      "c.ec_constituency_id",
      "c.name_en",
      "c.name_bn",
      "c.slug",
      "c.total_voters",
      "c.total_votes_cast",
      "c.total_valid_votes",
      "c.total_rejected_votes",
      "d.name_en as districtName",
      "d.slug as districtSlug",
    ])
    .executeTakeFirst();
}

export async function getConstituencyCandidates(constituencyId: number) {
  return db
    .selectFrom("candidates as c")
    .leftJoin("parties as p", "p.id", "c.party_id")
    .where("c.constituency_id", "=", constituencyId)
    .select([
      "c.id",
      "c.name_bn",
      "c.name_en",
      "c.photo_url",
      "c.symbol",
      "c.symbol_url",
      "c.total_votes",
      "c.is_winner",
      "p.name_en as partyName",
      "p.name_bn as partyNameBn",
      "p.slug as partySlug",
      "p.short_name as partyShortName",
    ])
    .orderBy("c.total_votes", "desc")
    .execute();
}

export async function getConstituencyCenters(
  constituencyId: number,
  pagination?: { page: number; pageSize: number }
) {
  const baseQuery = db
    .selectFrom("centers")
    .where("constituency_id", "=", constituencyId)
    .selectAll()
    .orderBy("center_number");

  if (!pagination) return baseQuery.execute();

  const { page, pageSize } = pagination;
  const offset = (page - 1) * pageSize;

  const [data, countResult] = await Promise.all([
    baseQuery.limit(pageSize).offset(offset).execute(),
    db
      .selectFrom("centers")
      .where("constituency_id", "=", constituencyId)
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

export async function getAllConstituencySlugs() {
  return db
    .selectFrom("constituencies")
    .select("slug")
    .execute();
}
