import { sql } from "kysely";
import { createDb } from "./client";

const db = createDb();
await sql`TRUNCATE center_results, centers, candidates, constituencies, parties, districts, scrape_log RESTART IDENTITY CASCADE`.execute(db);
console.log("All tables truncated");
await db.destroy();
