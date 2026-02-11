import "dotenv/config";
import { createDb } from "@election/db";
import { sql } from "kysely";

async function main() {
  const db = createDb();

  console.log("Deleting center_results...");
  await sql`DELETE FROM center_results`.execute(db);

  console.log("Deleting centers...");
  await sql`DELETE FROM centers`.execute(db);

  console.log("Deleting candidates...");
  await sql`DELETE FROM candidates`.execute(db);

  console.log("Deleting constituencies...");
  await sql`DELETE FROM constituencies`.execute(db);

  console.log("Deleting parties...");
  await sql`DELETE FROM parties`.execute(db);

  console.log("Clearing scrape_log...");
  await sql`DELETE FROM scrape_log`.execute(db);

  console.log("Done! Tables cleared.");
  await db.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
