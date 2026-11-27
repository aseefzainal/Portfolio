Portfolio site built with Next.js, Cloudflare D1, and Drizzle ORM.

## Scripts

```bash
npm run dev
npm run build
npm start
npm run preview   # OpenNext + Cloudflare local preview
npm run deploy    # Deploy to Cloudflare
```

## Database (D1 + Drizzle)

Schema source of truth: [`src/db/schema.ts`](src/db/schema.ts).

```bash
# 1) Edit schema.ts
# 2) Generate SQL + copy into migrations/ for Wrangler
npm run db:generate

# 3) Apply (local SQLite / Cloudflare D1)
npm run db:migrate:local
npm run db:migrate:remote
```

| Path | Role |
|---|---|
| `src/db/schema.ts` | Edit tables/columns here |
| `drizzle/` | Drizzle Kit snapshots + generated SQL |
| `migrations/` | Wrangler D1 apply history (do not rewrite old files) |

`npm run db:generate` runs `drizzle-kit generate` then `scripts/sync-drizzle-migration.mjs` so new SQL becomes `migrations/NNNN_*.sql`.

Set `WEB3FORMS_ACCESS_KEY` (and other secrets) in `.env.local` / Cloudflare. `npm install` copies the PDF.js worker into `public/`.
