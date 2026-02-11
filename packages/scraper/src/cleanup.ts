import "dotenv/config";
import { rmSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createDb } from "@election/db";
import { sql } from "kysely";
import { logger } from "./logger";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PHOTOS_DIR = resolve(__dirname, "../../../web/public/photos");

async function main() {
  const db = createDb();
  logger.info("Cleaning up constituencies, candidates, and dependent data...");

  try {
    await sql`TRUNCATE center_results, centers, candidates, constituencies CASCADE`.execute(db);
    logger.info("Truncated tables");

    await sql`DELETE FROM scrape_log WHERE entity_type IN ('constituencies', 'candidates', 'centers', 'center-details')`.execute(db);
    logger.info("Cleared scrape_log entries");

    if (existsSync(PHOTOS_DIR)) {
      rmSync(PHOTOS_DIR, { recursive: true, force: true });
      logger.info("Deleted photos directory");
    }

    logger.info("Cleanup complete!");
  } catch (err) {
    logger.fatal({ error: (err as Error).message }, "Cleanup failed");
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

main();
