# Bangladesh 13th Parliament Election Results

Live results from the 13th National Parliament Election of Bangladesh — constituencies, candidates, parties, and polling station data.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdreygur%2Felection-result&env=DATABASE_URL,NEXT_PUBLIC_IMAGE_BASE&envDescription=PostgreSQL%20connection%20string%20and%20image%20base%20URL&project-name=election-result&repository-name=election-result)

## Tech Stack

- **Monorepo** — pnpm workspaces
- **Database** — PostgreSQL (Aiven), Kysely ORM
- **Scraper** — Node.js, TypeScript, cheerio
- **Web** — Next.js 15, React 19, shadcn/ui, Tailwind CSS v4

## Getting Started

```bash
pnpm install
cp .env.example .env   # fill in DATABASE_URL
pnpm --filter web dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXT_PUBLIC_IMAGE_BASE` | Base URL for images (empty for local, set to GitHub raw URL on Vercel) |
| `NEXT_PUBLIC_LIVE_REFRESH_INTERVAL` | Auto-refresh interval in seconds (0 to disable) |
| `NEXT_PUBLIC_SITE_URL` | Public site URL for sitemap and OG images |
| `NEXT_PUBLIC_GA_ID` | Google Analytics measurement ID (e.g. `G-XXXXXXXXXX`) |

## Database

This project requires a seeded PostgreSQL database with election data. If you'd like access to the database dump, please [open an issue](https://github.com/dreygur/election-result/issues/new?title=Request%3A+Database+dump&labels=database).

## License

MIT
