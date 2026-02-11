import type { Kysely } from "kysely";
import type { Database } from "@election/db";
import { fetchJson81, ELECTION_ID } from "../api/ec-client";
import { slugify } from "../parsers/district-names";
import { bnToEn } from "../parsers/bengali-numerals";
import { upsertConstituency, logScrape, isScraped } from "../db/upsert";
import { logger } from "../logger";

interface ConstituencyResponse {
  constituencies: { constituencyID: string; constituency_name: string }[];
}

export async function scrapeConstituencies(db: Kysely<Database>) {
  const districts = await db.selectFrom("districts").selectAll().execute();

  logger.info({ districtCount: districts.length }, "Scraping constituencies...");

  for (const district of districts) {
    const logKey = `constituencies-${district.ec_zilla_id}`;
    if (await isScraped(db, "constituencies", logKey)) {
      logger.debug({ district: district.name_en }, "Already scraped, skipping");
      continue;
    }

    const data = await fetchJson81<ConstituencyResponse>(
      `/election/get-setting-constituency?zillaID=${district.ec_zilla_id}&electionID=${ELECTION_ID}`
    );

    for (const c of data.constituencies) {
      const nameBn = c.constituency_name.trim();
      // Convert "ঢাকা-২" → "Dhaka-2"
      const bnNum = nameBn.match(/-([০-৯]+)$/)?.[1];
      const nameEn = bnNum
        ? `${district.name_en}-${bnToEn(bnNum)}`
        : `${district.name_en}-${c.constituencyID}`;

      await upsertConstituency(db, {
        ec_constituency_id: parseInt(c.constituencyID),
        district_id: district.id,
        name_bn: nameBn,
        name_en: nameEn,
        slug: slugify(nameEn),
        total_voters: null,
        total_votes_cast: null,
        total_valid_votes: null,
        total_rejected_votes: null,
      });
    }

    await logScrape(db, { entity_type: "constituencies", entity_id: logKey, status: "success" });
    logger.info({ district: district.name_en, count: data.constituencies.length }, "Constituencies scraped");
  }

  logger.info("All constituencies done");
}
