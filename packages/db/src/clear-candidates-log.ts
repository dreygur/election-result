import { sql } from "kysely";
import { createDb } from "./client";

const db = createDb();
// Clear candidate scrape logs so they get re-scraped
await db.deleteFrom("scrape_log").where("entity_type", "=", "candidates").execute();
// Also clear actual candidate/party data
await sql`TRUNCATE candidates, parties RESTART IDENTITY CASCADE`.execute(db);
console.log("Cleared candidate scrape logs and data");
await db.destroy();
