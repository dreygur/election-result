# @election/db

Shared database package — Kysely client, migrations, and TypeScript types for the Bangladesh 13th National Parliament Election database.

## Stack

- **ORM**: [Kysely](https://kysely.dev/) (type-safe SQL query builder)
- **Database**: PostgreSQL (Aiven)
- **Driver**: pg

## Schema

| Table | Description |
|-------|-------------|
| `districts` | 64 districts (zilla) |
| `constituencies` | ~300 parliamentary seats |
| `parties` | Registered political parties |
| `candidates` | Candidates per constituency |
| `centers` | Polling stations with vote breakdowns |
| `center_results` | Per-candidate votes at each center |
| `scrape_log` | Tracks scraper progress |

## Setup

Requires `DATABASE_URL` in the root `.env` file.

```bash
# Run all pending migrations
pnpm --filter @election/db migrate
```

## Migrations

Migrations live in `src/migrations/` and are registered in `src/migrate.ts`. To add a new migration:

1. Create `src/migrations/NNN-description.ts` with `up()` and `down()` exports
2. Import and register it in `src/migrate.ts`

## Usage

Import types and the client from other workspace packages:

```ts
import type { Database, Candidate, Center } from "@election/db";
```
