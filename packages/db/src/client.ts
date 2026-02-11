import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";
import type { Database } from "./types";

export function createDb(connectionString?: string): Kysely<Database> {
  const connStr = connectionString ?? process.env.DATABASE_URL;

  // Strip sslmode from connection string — we configure SSL via pool options
  const url = connStr ? connStr.replace(/[?&]sslmode=[^&]*/g, "") : undefined;

  const pool = new pg.Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    max: 5,
  });

  return new Kysely<Database>({
    dialect: new PostgresDialect({ pool }),
  });
}
