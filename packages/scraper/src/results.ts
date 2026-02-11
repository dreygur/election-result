import "dotenv/config";
import { createDb } from "@election/db";
import { scrapeCenterList } from "./scrapers/centers";
import { scrapeCenterDetails } from "./scrapers/center-details";
import { scrapeReferendumCenters } from "./scrapers/referendum-centers";
import { runAggregation } from "./scrapers/aggregation";
import { logger } from "./logger";

async function main() {
  const db = createDb();
  logger.info("Starting results scraper...");

  try {
    // Phase 1: Center lists + center details (all constituencies in parallel)
    await scrapeCenterList(db);
    await scrapeCenterDetails(db);

    // Phase 1.5: Referendum center results
    await scrapeReferendumCenters(db);

    // Phase 2: Aggregation
    await runAggregation(db);

    logger.info("Results scraper complete!");
  } catch (err) {
    logger.fatal({ error: (err as Error).message }, "Results scraper failed");
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

main();
