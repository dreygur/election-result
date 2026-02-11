# @election/web

Next.js web app displaying results of the Bangladesh 13th National Parliament Election.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdreygur%2Felection-result&env=DATABASE_URL&envDescription=PostgreSQL%20connection%20string%20(Aiven%20or%20any%20provider)&envLink=https%3A%2F%2Fgithub.com%2Fdreygur%2Felection-result%23environment-variables&project-name=bd-election-results&root-directory=packages/web)


## Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, React Server Components)
- **UI**: React 19, [shadcn/ui](https://ui.shadcn.com/), Tailwind CSS v4
- **Charts**: Recharts
- **Database**: Direct Kysely queries (server-only, no API layer)

## Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage — stats, seats by party, turnout |
| `/constituencies` | All ~300 constituencies, filterable by district/party |
| `/constituencies/[slug]` | Candidate results, winner, center list |
| `/constituencies/[slug]/centers/[centerId]` | Per-candidate votes at a polling station |
| `/parties` | All parties with seats and total votes |
| `/parties/[slug]` | Party candidates and results |
| `/alliances` | Alliance groupings |
| `/alliances/[slug]` | Alliance detail |
| `/candidates/[id]` | Individual candidate detail |
| `/search` | Search across all entities |

## Development

```bash
# Install dependencies (from repo root)
pnpm install

# Run migrations
pnpm db:migrate

# Start dev server with Turbopack
pnpm dev
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXT_PUBLIC_LIVE_REFRESH_INTERVAL` | No | Auto-refresh interval in seconds (0 = disabled) |

## Build

```bash
pnpm build
```

The app uses `generateStaticParams` for constituency pages and RSC with direct database queries — no client-side data fetching.
