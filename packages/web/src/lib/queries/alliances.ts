import { sql } from "kysely";
import { db } from "../db";
import { ALLIANCES, getAllianceSlugForParty, type Alliance } from "../alliances";

export type AllianceResult = {
  slug: string;
  name: string;
  shortName: string;
  color: string;
  seats: number;
  totalVotes: number;
  totalCandidates: number;
  parties: number;
};

export async function getAllianceResults(): Promise<AllianceResult[]> {
  // Get all candidates with their party slugs
  const rows = await db
    .selectFrom("candidates as c")
    .leftJoin("parties as p", "p.id", "c.party_id")
    .select([
      "p.slug as partySlug",
      sql<number>`count(*)`.as("totalCandidates"),
      sql<number>`coalesce(sum(c.total_votes), 0)`.as("totalVotes"),
      sql<number>`count(case when c.is_winner then 1 end)`.as("seats"),
    ])
    .groupBy("p.slug")
    .execute();

  // Aggregate into alliances
  const allianceMap = new Map<string, AllianceResult>();

  // Init known alliances
  for (const a of ALLIANCES) {
    allianceMap.set(a.slug, {
      slug: a.slug,
      name: a.name,
      shortName: a.shortName,
      color: a.color,
      seats: 0,
      totalVotes: 0,
      totalCandidates: 0,
      parties: 0,
    });
  }

  // "Others" bucket
  allianceMap.set("others", {
    slug: "others",
    name: "Others / Independent",
    shortName: "Others",
    color: "#78909C",
    seats: 0,
    totalVotes: 0,
    totalCandidates: 0,
    parties: 0,
  });

  // Map from party slug → alliance slug
  const partyToAlliance = new Map<string, string>();
  for (const a of ALLIANCES) {
    for (const ps of a.partySlugs) {
      partyToAlliance.set(ps, a.slug);
    }
  }

  for (const row of rows) {
    const aSlug = partyToAlliance.get(row.partySlug ?? "") ?? "others";
    const entry = allianceMap.get(aSlug)!;
    entry.seats += Number(row.seats);
    entry.totalVotes += Number(row.totalVotes);
    entry.totalCandidates += Number(row.totalCandidates);
    entry.parties += 1;
  }

  return Array.from(allianceMap.values())
    .filter((a) => a.totalCandidates > 0)
    .sort((a, b) => b.seats - a.seats || b.totalVotes - a.totalVotes);
}

export type AlliancePartyRow = {
  id: number;
  name_en: string | null;
  name_bn: string;
  slug: string;
  short_name: string | null;
  logo_url: string | null;
  symbol_url: string | null;
  totalCandidates: number;
  totalVotes: number;
  seatsWon: number;
};

export async function getAlliancePartyBreakdown(
  allianceSlug: string
): Promise<AlliancePartyRow[]> {
  const alliance = ALLIANCES.find((a) => a.slug === allianceSlug);
  if (!alliance || alliance.partySlugs.length === 0) return [];

  return db
    .selectFrom("parties as p")
    .leftJoin("candidates as c", "c.party_id", "p.id")
    .where("p.slug", "in", alliance.partySlugs)
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
    .orderBy("totalVotes", "desc")
    .execute();
}

export async function getAllianceConstituencies(allianceSlug: string) {
  const alliance = ALLIANCES.find((a) => a.slug === allianceSlug);
  if (!alliance || alliance.partySlugs.length === 0) return [];

  return db
    .selectFrom("candidates as c")
    .innerJoin("constituencies as con", "con.id", "c.constituency_id")
    .innerJoin("districts as d", "d.id", "con.district_id")
    .innerJoin("parties as p", "p.id", "c.party_id")
    .where("c.is_winner", "=", true)
    .where("p.slug", "in", alliance.partySlugs)
    .select([
      "con.name_en as constituencyName",
      "con.slug as constituencySlug",
      "d.name_en as districtName",
      "c.name_bn as winnerName",
      "c.total_votes as votes",
      "p.name_en as partyName",
      "p.slug as partySlug",
      "p.short_name as partyShortName",
    ])
    .orderBy("con.name_en")
    .execute();
}
