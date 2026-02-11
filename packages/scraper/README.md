# @election/scraper

Desktop scraper that fetches election data from the Bangladesh Election Commission portal and populates the database.

## Stack

- **Parser**: [cheerio](https://cheerio.js.org/) (HTML parsing)
- **Logger**: [pino](https://getpino.io/)
- **Concurrency**: p-limit (3 concurrent requests, 300ms delay, exponential backoff retries)

## Data Sources

| Source | Port | Data |
|--------|------|------|
| ecs.gov.bd | 80 | Parties, candidates, photos, symbols |
| ecs.gov.bd | 81 | Center lists, center-level results |

## Commands

```bash
# One-time: seed districts, constituencies, parties, candidates
pnpm --filter @election/scraper scrape:setup

# Periodic: fetch center lists + vote results
pnpm --filter @election/scraper scrape:results

# Cleanup scrape logs for re-scraping
pnpm --filter @election/scraper scrape:cleanup
```

### scrape:setup (run once, sequential)

1. Scrapes all registered parties (7 pages) + downloads symbol images
2. Fetches 64 districts
3. Fetches ~300 constituencies
4. Scrapes candidates + downloads photos

### scrape:results (run periodically)

1. Fetches center lists for all constituencies (parallel)
2. Fetches per-center vote details (~40k centers, parallel)
3. Aggregates totals and determines winners via SQL

Already-scraped center lists are skipped (`scrape_log` check). Center details are upserted on every run to capture updated results.

## Environment

Requires `DATABASE_URL` in the root `.env` file. Run migrations before first use.
