# Bangladesh 13th Parliament Election Results

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Kysely-4169E1?logo=postgresql&logoColor=white)](https://kysely.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![pnpm](https://img.shields.io/badge/pnpm-monorepo-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)

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
