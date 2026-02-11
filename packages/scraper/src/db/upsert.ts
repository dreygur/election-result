import type { Kysely } from "kysely";
import type {
  Database,
  NewDistrict,
  NewConstituency,
  NewParty,
  NewCandidate,
  NewCenter,
  NewCenterResult,
  NewReferendumCenterResult,
  NewScrapeLog,
} from "@election/db";

export async function upsertDistrict(db: Kysely<Database>, d: NewDistrict) {
  return db
    .insertInto("districts")
    .values(d)
    .onConflict((oc) => oc.column("ec_zilla_id").doUpdateSet({
      name_bn: d.name_bn,
      name_en: d.name_en,
    }))
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function upsertConstituency(db: Kysely<Database>, c: NewConstituency) {
  return db
    .insertInto("constituencies")
    .values(c)
    .onConflict((oc) => oc.column("ec_constituency_id").doUpdateSet({
      name_bn: c.name_bn,
      name_en: c.name_en,
      district_id: c.district_id,
      total_voters: c.total_voters,
      total_votes_cast: c.total_votes_cast,
      total_valid_votes: c.total_valid_votes,
      total_rejected_votes: c.total_rejected_votes,
    }))
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function upsertParty(db: Kysely<Database>, p: NewParty) {
  return db
    .insertInto("parties")
    .values(p)
    .onConflict((oc) => oc.column("slug").doUpdateSet({
      name_bn: p.name_bn,
      name_en: p.name_en,
      short_name: p.short_name,
      logo_url: p.logo_url,
      ec_registration_no: p.ec_registration_no,
      registration_date: p.registration_date,
      symbol_bn: p.symbol_bn,
      symbol_url: p.symbol_url,
    }))
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function upsertCandidate(db: Kysely<Database>, c: NewCandidate) {
  return db
    .insertInto("candidates")
    .values(c)
    .onConflict((oc) =>
      oc.columns(["constituency_id", "name_bn"]).doUpdateSet({
        party_id: c.party_id,
        photo_url: c.photo_url,
        symbol: c.symbol,
        symbol_url: c.symbol_url,
        total_votes: c.total_votes,
      })
    )
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function upsertCenter(db: Kysely<Database>, c: NewCenter) {
  return db
    .insertInto("centers")
    .values(c)
    .onConflict((oc) =>
      oc.columns(["constituency_id", "center_number"]).doUpdateSet({
        name_bn: c.name_bn,
        total_voters: c.total_voters,
        total_votes_cast: c.total_votes_cast,
        ec_center_id: c.ec_center_id,
        valid_votes: c.valid_votes,
        rejected_votes: c.rejected_votes,
        absent_voters: c.absent_voters,
        result_sheet_url: c.result_sheet_url,
      })
    )
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function upsertCenterResult(db: Kysely<Database>, r: NewCenterResult) {
  return db
    .insertInto("center_results")
    .values(r)
    .onConflict((oc) =>
      oc.columns(["center_id", "candidate_id"]).doUpdateSet({
        votes: r.votes,
      })
    )
    .execute();
}

export async function upsertReferendumCenterResult(db: Kysely<Database>, r: NewReferendumCenterResult) {
  return db
    .insertInto("referendum_center_results")
    .values(r)
    .onConflict((oc) =>
      oc.column("center_id").doUpdateSet({
        yes_votes: r.yes_votes,
        no_votes: r.no_votes,
        valid_votes: r.valid_votes,
        rejected_votes: r.rejected_votes,
      })
    )
    .execute();
}

export async function logScrape(db: Kysely<Database>, log: NewScrapeLog) {
  return db.insertInto("scrape_log").values(log).execute();
}

export async function isScraped(
  db: Kysely<Database>,
  entityType: string,
  entityId: string
): Promise<boolean> {
  const row = await db
    .selectFrom("scrape_log")
    .where("entity_type", "=", entityType)
    .where("entity_id", "=", entityId)
    .where("status", "=", "success")
    .select("id")
    .executeTakeFirst();
  return !!row;
}
