import type { Kysely } from "kysely";
import type { Database } from "@election/db";
import * as cheerio from "cheerio";
import { fetchHtml81, ELECTION_ID } from "../api/ec-client";
import { parseBnInt } from "../parsers/bengali-numerals";
import { upsertCenter, logScrape, isScraped } from "../db/upsert";
import { logger } from "../logger";

/**
 * Port 81: GET /get/center-wise-result?election_type_id=1&election_id=14&candidate_type=1&zilla_id=X&constituency_id=X
 * Returns HTML table with columns:
 *   জেলা | নির্বাচনী আসন | কেন্দ্র নং | ভোটকেন্দ্রের নাম | বৈধ ভোট | বাতিল ভোট | অনুপস্থিত ভোটার | মোট ভোটার | ফাইল
 * Center number cells have onclick="getCenterResults(ecCenterId)"
 */
async function scrapeConstituencyCenters(
  db: Kysely<Database>,
  con: { id: number; ec_constituency_id: number; name_en: string; ec_zilla_id: number },
) {
  const logKey = `centers-${con.ec_constituency_id}`;
  if (await isScraped(db, "centers", logKey)) {
    return;
  }

  const html = await fetchHtml81(
    `/get/center-wise-result?election_type_id=1&election_id=${ELECTION_ID}&candidate_type=1&zilla_id=${con.ec_zilla_id}&constituency_id=${con.ec_constituency_id}`
  );

  const $ = cheerio.load(html);
  const rows = $("tbody tr");

  if (rows.length === 0) {
    logger.warn({ constituency: con.name_en }, "No center rows found");
    await logScrape(db, { entity_type: "centers", entity_id: logKey, status: "empty" });
    return;
  }

  let count = 0;
  let totalValidVotes = 0;
  let totalRejectedVotes = 0;
  let totalVoters = 0;

  for (const row of rows.toArray()) {
    const cells = $(row).find("td");
    if (cells.length < 8) continue;

    const centerCell = $(cells[2]);
    const centerLink = centerCell.find("a");
    const onclickAttr = centerLink.attr("onclick") || "";
    const ecCenterIdMatch = onclickAttr.match(/getCenterResults\((\d+)\)/);
    const ecCenterId = ecCenterIdMatch ? parseInt(ecCenterIdMatch[1]) : null;

    const centerNumberText = centerLink.text().trim() || centerCell.text().trim();
    const centerNumber = parseBnInt(centerNumberText);
    if (!centerNumber) continue;

    const nameBn = $(cells[3]).find("a").text().trim() || $(cells[3]).text().trim();
    const validVotes = parseBnInt($(cells[4]).text().trim());
    const rejectedVotes = parseBnInt($(cells[5]).text().trim());
    const absentVoters = parseBnInt($(cells[6]).text().trim());
    const centerTotalVoters = parseBnInt($(cells[7]).text().trim());
    const votesCast = (validVotes ?? 0) + (rejectedVotes ?? 0);
    const resultSheetUrl = $(cells[8]).find("a").attr("href") || null;

    await upsertCenter(db, {
      ec_center_id: ecCenterId,
      constituency_id: con.id,
      center_number: centerNumber,
      name_bn: nameBn,
      total_voters: centerTotalVoters,
      total_votes_cast: votesCast || null,
      valid_votes: validVotes,
      rejected_votes: rejectedVotes,
      absent_voters: absentVoters,
      result_sheet_url: resultSheetUrl,
    });

    totalValidVotes += validVotes ?? 0;
    totalRejectedVotes += rejectedVotes ?? 0;
    totalVoters += centerTotalVoters ?? 0;
    count++;
  }

  if (count > 0) {
    await db
      .updateTable("constituencies")
      .set({
        total_voters: totalVoters || null,
        total_votes_cast: (totalValidVotes + totalRejectedVotes) || null,
        total_valid_votes: totalValidVotes || null,
        total_rejected_votes: totalRejectedVotes || null,
      })
      .where("id", "=", con.id)
      .execute();
  }

  await logScrape(db, { entity_type: "centers", entity_id: logKey, status: "success" });
  logger.info({ constituency: con.name_en, count }, "Centers scraped");
}

export async function scrapeCenterList(db: Kysely<Database>) {
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

  logger.info({ count: constituencies.length }, "Scraping center lists (all concurrent)...");

  const results = await Promise.allSettled(
    constituencies.map((con) => scrapeConstituencyCenters(db, con))
  );

  const failed = results.filter((r) => r.status === "rejected");
  if (failed.length > 0) {
    logger.warn({ failed: failed.length, total: constituencies.length }, "Some center lists failed");
  }

  logger.info("All center lists done");
}
