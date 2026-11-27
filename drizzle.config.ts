import { defineConfig } from "drizzle-kit";

/**
 * Schema-first migrations for Cloudflare D1.
 * 1) Edit src/db/schema.ts
 * 2) npm run db:generate
 * 3) npm run db:migrate:local / db:migrate:remote
 *
 * Generated SQL is mirrored into migrations/ as the next Wrangler D1 file.
 */
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
});
