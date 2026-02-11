import type { Kysely } from "kysely";
import type { Database } from "@election/db";
import * as cheerio from "cheerio";
import { fetchHtml81, ELECTION_ID } from "../api/ec-client";
import { parseBnInt } from "../parsers/bengali-numerals";
import { upsertReferendumCenterResult, logScrape, isScraped } from "../db/upsert";
import { logger } from "../logger";

/**
 * Port 81: GET /get/center-wise-result?election_type_id=2&election_id=478&candidate_type=1&zilla_id=X&constituency_id=X
 * Referendum (গণভোট) results — yes/no per center.
 * Expected columns: জেলা | আসন | কেন্দ্র নং | কেন্দ্রের নাম | হ্যাঁ | না | বৈধ ভোট | বাতিল ভোট | ...
 */
async function scrapeConstituencyReferendum(
  db: Kysely<Database>,
  con: { id: number; ec_constituency_id: number; name_en: string; ec_zilla_id: number },
) {
  const logKey = `referendum-${con.ec_constituency_id}`;
  if (await isScraped(db, "referendum", logKey)) {
    return;
  }

  const html = await fetchHtml81(
    `/get/center-wise-result?election_type_id=2&election_id=${ELECTION_ID}&candidate_type=1&zilla_id=${con.ec_zilla_id}&constituency_id=${con.ec_constituency_id}`
  );

  const $ = cheerio.load(html);
  const rows = $("tbody tr");

  if (rows.length === 0) {
    logger.warn({ constituency: con.name_en }, "No referendum rows found");
    await logScrape(db, { entity_type: "referendum", entity_id: logKey, status: "empty" });
    return;
  }

  let totalYes = 0;
  let totalNo = 0;
  let totalValid = 0;
  let totalRejected = 0;
  let count = 0;

  for (const row of rows.toArray()) {
    const cells = $(row).find("td");
    if (cells.length < 7) {
      logger.warn({ constituency: con.name_en, cellCount: cells.length }, "Unexpected referendum row format");
      continue;
    }

    // Look up center by constituency + center_number
    const centerNumberText = $(cells[2]).text().trim();
    const centerNumber = parseBnInt(centerNumberText);
    if (!centerNumber) continue;

    const center = await db
      .selectFrom("centers")
      .where("constituency_id", "=", con.id)
      .where("center_number", "=", centerNumber)
      .select("id")
      .executeTakeFirst();

    if (!center) {
      logger.warn({ constituency: con.name_en, centerNumber }, "Center not found for referendum");
      continue;
    }

    // Defensive: try most likely column layout
    const yesVotes = parseBnInt($(cells[4]).text().trim());
    const noVotes = parseBnInt($(cells[5]).text().trim());
    const validVotes = parseBnInt($(cells[6]).text().trim());
    const rejectedVotes = cells.length > 7 ? parseBnInt($(cells[7]).text().trim()) : null;

    await upsertReferendumCenterResult(db, {
      center_id: center.id,
      yes_votes: yesVotes,
      no_votes: noVotes,
      valid_votes: validVotes,
      rejected_votes: rejectedVotes,
    });

    totalYes += yesVotes ?? 0;
    totalNo += noVotes ?? 0;
    totalValid += validVotes ?? 0;
    totalRejected += rejectedVotes ?? 0;
    count++;
  }

  if (count > 0) {
    await db
      .updateTable("constituencies")
      .set({
        ref_yes_votes: totalYes || null,
        ref_no_votes: totalNo || null,
        ref_valid_votes: totalValid || null,
        ref_rejected_votes: totalRejected || null,
      })
      .where("id", "=", con.id)
      .execute();
  }

  await logScrape(db, { entity_type: "referendum", entity_id: logKey, status: "success" });
  logger.info({ constituency: con.name_en, count }, "Referendum centers scraped");
}

export async function scrapeReferendumCenters(db: Kysely<Database>) {
  const constituencies = await db
    .selectFrom("constituencies")
    .innerJoin("districts", "districts.id", "constituencies.district_id")
    .select([
      "constituencies.id",
      "constituencies.ec_constituency_id",
      "constituencies.name_en",
      "districts.ec_zilla_id",
    ])
    .execute();

  logger.info({ count: constituencies.length }, "Scraping referendum centers (all concurrent)...");

  const results = await Promise.allSettled(
    constituencies.map((con) => scrapeConstituencyReferendum(db, con))
  );

  const failed = results.filter((r) => r.status === "rejected");
  if (failed.length > 0) {
    logger.warn({ failed: failed.length, total: constituencies.length }, "Some referendum scrapes failed");
  }

  logger.info("All referendum centers done");
}
