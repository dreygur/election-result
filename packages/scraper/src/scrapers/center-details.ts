import type { Kysely } from "kysely";
import type { Database } from "@election/db";
import * as cheerio from "cheerio";
import { fetchHtml81, ELECTION_ID } from "../api/ec-client";
import { parseBnInt } from "../parsers/bengali-numerals";
import { upsertCenterResult, logScrape, isScraped } from "../db/upsert";
import { logger } from "../logger";

/**
 * Port 81: GET /get/center-result/details?election_id=14&id=<ec_center_id>
 * Returns modal HTML with table:
 *   প্রতিদ্বন্দী প্রার্থীগনের নাম | প্রতিদ্বন্দী প্রার্থীগনের প্রতীক | ভোটের সংখ্যা
 */
async function scrapeSingleCenter(
  db: Kysely<Database>,
  center: { id: number; ec_center_id: number | null; constituency_id: number },
  candidateMap: Map<string, number>,
) {
  const logKey = `center-detail-${center.id}`;
  if (await isScraped(db, "center-detail", logKey)) return false;

  const html = await fetchHtml81(
    `/get/center-result/details?election_id=${ELECTION_ID}&id=${center.ec_center_id}`
  );

  const $ = cheerio.load(html);
  const rows = $("tbody tr");

  if (rows.length === 0) {
    await logScrape(db, { entity_type: "center-detail", entity_id: logKey, status: "empty" });
    return true;
  }

  for (const row of rows.toArray()) {
    const cells = $(row).find("td");
    if (cells.length < 3) continue;

    const nameBn = $(cells[0]).text().trim();
    const votes = parseBnInt($(cells[2]).text().trim());

    if (!nameBn || votes === null) continue;

    const candidateId = candidateMap.get(`${center.constituency_id}:${nameBn}`);
    if (!candidateId) {
      logger.warn({ center: center.id, name: nameBn }, "Candidate not found");
      continue;
    }

    await upsertCenterResult(db, {
      center_id: center.id,
      candidate_id: candidateId,
      votes,
    });
  }

  await logScrape(db, { entity_type: "center-detail", entity_id: logKey, status: "success" });
  return true;
}

export async function scrapeCenterDetails(db: Kysely<Database>) {
  const centers = await db
    .selectFrom("centers")
    .select(["id", "ec_center_id", "constituency_id"])
    .where("ec_center_id", "is not", null)
    .execute();

  logger.info({ count: centers.length }, "Scraping center details (all concurrent)...");

  // Pre-load candidate mapping: constituency_id:name_bn → candidate_id
  const candidates = await db
    .selectFrom("candidates")
    .select(["id", "constituency_id", "name_bn"])
    .execute();

  const candidateMap = new Map<string, number>();
  for (const c of candidates) {
    candidateMap.set(`${c.constituency_id}:${c.name_bn}`, c.id);
  }

  const results = await Promise.allSettled(
    centers.map((center) => scrapeSingleCenter(db, center, candidateMap))
  );

  const failed = results.filter((r) => r.status === "rejected");
  const processed = results.filter((r) => r.status === "fulfilled" && r.value).length;

  if (failed.length > 0) {
    logger.warn({ failed: failed.length, total: centers.length }, "Some center details failed");
  }

  logger.info({ processed, total: centers.length }, "All center details done");
}
