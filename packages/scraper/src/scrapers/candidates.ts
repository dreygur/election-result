import { existsSync, mkdirSync } from "node:fs";
import { resolve, extname, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Kysely } from "kysely";
import type { Database } from "@election/db";
import * as cheerio from "cheerio";
import { fetchHtml80, downloadFileTo, ELECTION_ID } from "../api/ec-client";
import { slugify } from "../parsers/district-names";
import { upsertCandidate, upsertParty, logScrape, isScraped } from "../db/upsert";
import { logger } from "../logger";

const BASE_80 = "http://103.183.38.66";
const __dirname = dirname(fileURLToPath(import.meta.url));
const PHOTOS_DIR = resolve(__dirname, "../../../web/public/photos");

/**
 * Port 80: GET /get/candidate/data?zilla_id=X&constituency_id=X&candidate_type=1&election_id=14
 * Returns HTML <tr> rows with:
 *   td[0]: row number (Bengali)
 *   td[1]: candidate name
 *   td[2]: candidate photo <img>
 *   td[3]: party name
 *   td[4]: symbol name (text)
 *   td[5..7]: document links (holofnama, expenditure, tax return)
 */
export async function scrapeCandidates(db: Kysely<Database>) {
  if (!existsSync(PHOTOS_DIR)) {
    mkdirSync(PHOTOS_DIR, { recursive: true });
  }

  const constituencies = await db
    .selectFrom("constituencies")
    .innerJoin("districts", "districts.id", "constituencies.district_id")
    .select([
      "constituencies.id",
      "constituencies.ec_constituency_id",
      "constituencies.name_en",
      "constituencies.slug as constituency_slug",
      "districts.ec_zilla_id",
    ])
    .execute();

  logger.info({ count: constituencies.length }, "Scraping candidates...");

  // Pre-load all parties into cache keyed by name_bn
  const partyCache = new Map<string, number>();
  const existingParties = await db
    .selectFrom("parties")
    .select(["id", "name_bn"])
    .execute();
  for (const p of existingParties) {
    partyCache.set(p.name_bn, p.id);
  }

  for (const con of constituencies) {
    const logKey = `candidates-${con.ec_constituency_id}`;
    if (await isScraped(db, "candidates", logKey)) {
      logger.debug({ constituency: con.name_en }, "Already scraped, skipping");
      continue;
    }

    try {
      const html = await fetchHtml80(
        `/get/candidate/data?zilla_id=${con.ec_zilla_id}&upazilla_id=&candidate_type=1&municipality_id=&election_id=${ELECTION_ID}&constituency_id=${con.ec_constituency_id}&ward_id=&status_id=11&_=${Date.now()}`
      );

      // Port 80 returns bare <tr> rows without <table> wrapper
      // Cheerio strips <tr> outside tables, so wrap it
      const $ = cheerio.load(`<table><tbody>${html}</tbody></table>`);
      const rows = $("tr").toArray();

      if (rows.length === 0) {
        logger.warn({ constituency: con.name_en }, "No candidate rows found");
        await logScrape(db, { entity_type: "candidates", entity_id: logKey, status: "empty" });
        continue;
      }

      let rowIndex = 0;
      for (const row of rows) {
        const cells = $(row).find("td, th");
        if (cells.length < 5) continue;

        // Skip header rows
        const firstCell = $(cells[0]).text().trim();
        if (firstCell === "ক্রমিক" || firstCell === "#") continue;

        rowIndex++;
        const nameBn = $(cells[1]).text().trim();
        if (!nameBn) continue;

        const photoImg = $(cells[2]).find("img").first();
        const photoSrc = photoImg.attr("src") || null;

        const partyName = $(cells[3]).text().trim();
        const symbolName = $(cells[4]).text().trim() || null;

        // Look up party by name_bn, create only if not found
        let partyId: number | null = null;
        if (partyName) {
          if (partyCache.has(partyName)) {
            partyId = partyCache.get(partyName)!;
          } else {
            const partySlug = slugify(partyName) || `party-${Date.now()}`;
            const party = await upsertParty(db, {
              name_bn: partyName,
              name_en: null,
              short_name: null,
              slug: partySlug,
              logo_url: null,
              ec_registration_no: null,
              registration_date: null,
              symbol_bn: null,
              symbol_url: null,
            });
            partyId = party.id;
            partyCache.set(partyName, partyId);
          }
        }

        // Download candidate photo
        let photoUrl: string | null = null;
        if (photoSrc) {
          try {
            const fullUrl = photoSrc.startsWith("http") ? photoSrc : `${BASE_80}${photoSrc}`;
            const ext = extname(basename(new URL(fullUrl).pathname)) || ".jpg";
            const filename = `${con.constituency_slug}-${rowIndex}${ext}`;
            await downloadFileTo(fullUrl, resolve(PHOTOS_DIR, filename));
            photoUrl = `/photos/${filename}`;
          } catch (err) {
            logger.warn({ constituency: con.name_en, error: (err as Error).message }, "Failed to download photo");
            photoUrl = photoSrc; // fallback to remote URL
          }
        }

        await upsertCandidate(db, {
          constituency_id: con.id,
          party_id: partyId,
          name_bn: nameBn,
          name_en: null,
          photo_url: photoUrl,
          symbol: symbolName,
          symbol_url: null,
          total_votes: null,
        });
      }

      await logScrape(db, { entity_type: "candidates", entity_id: logKey, status: "success" });
      logger.info({ constituency: con.name_en, rows: rows.length }, "Candidates scraped");
    } catch (err) {
      logger.error({ constituency: con.name_en, error: (err as Error).message }, "Failed");
      await logScrape(db, {
        entity_type: "candidates",
        entity_id: logKey,
        status: "error",
        error: (err as Error).message,
      });
    }
  }

  logger.info("All candidates done");
}
