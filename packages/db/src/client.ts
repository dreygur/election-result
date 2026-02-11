import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";
import type { Database } from "./types";

const globalForDb = globalThis as unknown as { _dbPool?: pg.Pool };

export function createDb(connectionString?: string): Kysely<Database> {
  if (!globalForDb._dbPool) {
    const connStr = connectionString ?? process.env.DATABASE_URL;

    // Strip sslmode from connection string — we configure SSL via pool options
    const url = connStr ? connStr.replace(/[?&]sslmode=[^&]*/g, "") : undefined;

    globalForDb._dbPool = new pg.Pool({
      connectionString: url,
      ssl: { rejectUnauthorized: false },
      max: 2,
    });
  }

  return new Kysely<Database>({
    dialect: new PostgresDialect({ pool: globalForDb._dbPool }),
  });
}
