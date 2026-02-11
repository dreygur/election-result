import type { Kysely } from "kysely";
import { sql } from "kysely";
import type { Database } from "@election/db";
import { logger } from "../logger";

export async function runAggregation(db: Kysely<Database>) {
  logger.info("Running aggregation...");

  // Update candidate total_votes from center_results
  await sql`
    UPDATE candidates c
    SET total_votes = sub.total
    FROM (
      SELECT candidate_id, SUM(votes) AS total
      FROM center_results
      GROUP BY candidate_id
    ) sub
    WHERE c.id = sub.candidate_id
      AND sub.total > 0
  `.execute(db);

  logger.info("Candidate totals updated");

  // Reset all is_winner
  await db
    .updateTable("candidates")
    .set({ is_winner: false })
    .execute();

  // Set is_winner for top vote-getter in each constituency
  await sql`
    UPDATE candidates c
    SET is_winner = true
    FROM (
      SELECT DISTINCT ON (constituency_id) id
      FROM candidates
      WHERE total_votes IS NOT NULL AND total_votes > 0
      ORDER BY constituency_id, total_votes DESC
    ) winners
    WHERE c.id = winners.id
  `.execute(db);

  const winnerCount = await db
    .selectFrom("candidates")
    .where("is_winner", "=", true)
    .select(sql<number>`count(*)`.as("count"))
    .executeTakeFirstOrThrow();

  logger.info({ winners: winnerCount.count }, "Aggregation done");
}
