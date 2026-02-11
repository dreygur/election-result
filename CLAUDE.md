# Bangladesh 13th National Parliament Election Results Website

## Architecture
```
[EC Portal :80/:81] --> [Scraper (Desktop)] --> [Aiven PostgreSQL] <-- [Next.js 15 (Vercel)]
```

## Tech Stack
- Monorepo: pnpm workspaces
- DB: PostgreSQL (Aiven), Kysely ORM
- Scraper: Node.js/TypeScript, cheerio, pino
- Web: Next.js 15, React 19, shadcn/ui, Tailwind CSS v4
- Language: English only

## Project Structure
```
election/
├── packages/
│   ├── db/           # Shared: Kysely client, migrations, types
│   ├── scraper/      # Desktop scraper (cheerio + rate-limited HTTP)
│   └── web/          # Next.js 15 app
```

## Web Folder Structure (packages/web/src/)
- `app/` — Routes + layouts only. Pages are thin wrappers calling views.
- `views/` — Page-level compositions (one per route).
- `components/` — Reusable UI pieces (used in 2+ views). `components/ui/` for shadcn primitives.
- `hooks/` — Custom React hooks.
- `providers/` — Context providers (separate from components).
- `lib/` — Utilities, db client (server-only), query modules, constants.
- `types/` — Shared TypeScript types.

## Conventions
- All filenames in **kebab-case**
- No code duplication — anything used 2+ times must be shared
- No co-author credits in commits

## DB Schema (7 tables)
districts, constituencies, parties, candidates, centers, center_results, scrape_log

## Scraper Commands
- `pnpm --filter scraper scrape:setup` — **Run once.** Seeds static data.
- `pnpm --filter scraper scrape:results` — **Run periodically.** Fetches live results.

### scrape:setup (one-time, sequential)
1. Parties (7 pages from ecs.gov.bd + symbol images → `web/public/symbols/`)
2. Districts (1 JSON call → 64)
3. Constituencies (64 JSON calls → ~300)
4. Candidates + photos (300 HTML calls, port 80 → `web/public/photos/`)

### scrape:results (periodic, concurrent)
1. Center List (~300 HTML calls, port 81 — all constituencies in parallel)
2. Center Details (~40k HTML calls, port 81 — all centers in parallel)
3. Aggregation (SQL totals + is_winner)

Rate limiting: 3 concurrent, 300ms delay, 3 retries with exponential backoff.
Election ID: 14 (candidates use status_id=11 for 13th election)

## Site Routes
- `/` — Homepage (stats, seats by party, turnout)
- `/constituencies` — All ~300, filterable by district/party
- `/constituencies/[slug]` — Candidates, votes, winner, center list
- `/constituencies/[slug]/centers/[centerId]` — Per-candidate votes
- `/parties` — All parties (seats, total votes)
- `/parties/[slug]` — Party candidates + results
- `/candidates/[id]` — Single candidate detail
- `/search` — Search across entities

Data fetching: RSC + direct Kysely queries. `generateStaticParams` for constituency pages.

## Implementation Progress
- [x] Phase 1: Monorepo init, git, root configs
- [x] Phase 1: packages/db (client, types, migration)
- [x] Phase 2: packages/scraper
- [x] Phase 3: packages/web setup (Next.js, Tailwind v4, shadcn, layout)
- [x] Phase 4: All web pages/views (home, constituencies, parties, candidates, centers, search)
- [x] Phase 5: SEO metadata, loading/not-found states
- [ ] Phase 6: Deploy to Vercel
