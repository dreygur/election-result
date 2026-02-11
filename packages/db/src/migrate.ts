import { type Migration, type MigrationProvider, Migrator } from "kysely";
import { createDb } from "./client";

// Import migrations directly to avoid Windows ESM path issues
import * as m001 from "./migrations/001-initial-schema";
import * as m002 from "./migrations/002-candidate-unique";
import * as m003 from "./migrations/003-party-details";
import * as m004 from "./migrations/004-center-columns";
import * as m005 from "./migrations/005-referendum";

const migrations: Record<string, Migration> = {
  "001-initial-schema": m001,
  "002-candidate-unique": m002,
  "003-party-details": m003,
  "004-center-columns": m004,
  "005-referendum": m005,
};

const provider: MigrationProvider = {
  async getMigrations() {
    return migrations;
  },
};

async function main() {
  const db = createDb();
  const migrator = new Migrator({ db, provider });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((r) => {
    if (r.status === "Success") {
      console.log(`Migration "${r.migrationName}" executed successfully`);
    } else if (r.status === "Error") {
      console.error(`Migration "${r.migrationName}" failed`);
    }
  });

  if (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }

  await db.destroy();
}

main();
