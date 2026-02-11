import type { Kysely } from "kysely";
import type { Database } from "@election/db";
import { fetchJson81, ELECTION_ID } from "../api/ec-client";
import { DISTRICT_EN_NAMES, slugify } from "../parsers/district-names";
import { upsertDistrict, logScrape, isScraped } from "../db/upsert";
import { logger } from "../logger";

interface ZillaResponse {
  zillas: { zillaID: string; zilla_name: string }[];
}

export async function scrapeDistricts(db: Kysely<Database>) {
  if (await isScraped(db, "districts", "all")) {
    logger.info("Districts already scraped, skipping");
    return;
  }

  logger.info("Scraping districts...");

  const data = await fetchJson81<ZillaResponse>(
    `/election-settings/get-election-zilla?electionID=${ELECTION_ID}`
  );

  logger.info({ count: data.zillas.length }, "Districts fetched");

  for (const z of data.zillas) {
    const nameBn = z.zilla_name.trim().normalize("NFC");
    let nameEn = DISTRICT_EN_NAMES[nameBn];

    // Fallback: try matching with normalized keys
    if (!nameEn) {
      for (const [key, val] of Object.entries(DISTRICT_EN_NAMES)) {
        if (key.normalize("NFC") === nameBn) {
          nameEn = val;
          break;
        }
      }
    }

    if (!nameEn) {
      logger.warn({ nameBn, zillaID: z.zillaID }, "No English name mapping found");
      nameEn = `District-${z.zillaID}`;
    }

    await upsertDistrict(db, {
      ec_zilla_id: parseInt(z.zillaID),
      name_bn: nameBn,
      name_en: nameEn,
      slug: slugify(nameEn),
    });
  }

  await logScrape(db, { entity_type: "districts", entity_id: "all", status: "success" });
  logger.info("Districts done");
}
