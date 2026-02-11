import "dotenv/config";
import { createDb } from "@election/db";
import { scrapeParties } from "./scrapers/parties";
import { scrapeDistricts } from "./scrapers/districts";
import { scrapeConstituencies } from "./scrapers/constituencies";
import { scrapeCandidates } from "./scrapers/candidates";
import { logger } from "./logger";

async function main() {
  const db = createDb();
  logger.info("Starting one-time setup scraper...");

  try {
    // Phase 1: Parties (from ecs.gov.bd)
    await scrapeParties(db);

    // Phase 2: Districts
    await scrapeDistricts(db);

    // Phase 3: Constituencies
    await scrapeConstituencies(db);

    // Phase 4: Candidates + photos
    await scrapeCandidates(db);

    logger.info("Setup scraper complete!");
  } catch (err) {
    logger.fatal({ error: (err as Error).message, stack: (err as Error).stack }, "Setup scraper failed");
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

main();
