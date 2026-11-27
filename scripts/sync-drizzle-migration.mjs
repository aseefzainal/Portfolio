import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const drizzleDir = path.join(root, "drizzle");
const migrationsDir = path.join(root, "migrations");
const statePath = path.join(drizzleDir, ".wrangler-synced.json");

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}

function nextMigrationNumber(files) {
  let max = 0;
  for (const file of files) {
    const match = /^(\d+)_/.exec(file);
    if (match) max = Math.max(max, Number(match[1]));
  }
  return max + 1;
}

function slugify(name) {
  return name
    .replace(/\.sql$/i, "")
    .replace(/^\d+_/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "") || "schema";
}

const journal = await readJson(path.join(drizzleDir, "meta", "_journal.json"), null);
if (!journal?.entries?.length) {
  console.log("No drizzle/meta/_journal.json entries yet. Run db:generate first.");
  process.exit(0);
}

await mkdir(migrationsDir, { recursive: true });
const existing = await readdir(migrationsDir);
const synced = new Set((await readJson(statePath, { files: [] })).files);
let nextNum = nextMigrationNumber(existing);
let copied = 0;

for (const entry of journal.entries) {
  const tag = entry.tag;
  const sourceName = `${tag}.sql`;
  if (synced.has(sourceName)) continue;

  const sourcePath = path.join(drizzleDir, sourceName);
  let sql;
  try {
    sql = await readFile(sourcePath, "utf8");
  } catch {
    console.warn(`Skip missing drizzle file: ${sourceName}`);
    continue;
  }

  const trimmed = sql
    .replace(/^--> statement-breakpoint\s*/gm, "")
    .replace(/^--.*$/gm, "")
    .trim();
  // Baseline / comment-only snapshots must not become executable Wrangler migrations.
  // Never copy baselines / comment-only files into Wrangler migrations.
  if (!trimmed || /baseline/i.test(tag) || /baseline/i.test(sourceName)) {
    synced.add(sourceName);
    console.log(`Marked synced without Wrangler copy: ${sourceName}`);
    continue;
  }

  const targetName = `${String(nextNum).padStart(4, "0")}_${slugify(tag)}.sql`;
  const targetPath = path.join(migrationsDir, targetName);
  const header = `-- Generated from drizzle/${sourceName} — do not edit by hand; change schema.ts and re-generate.\n`;
  await writeFile(targetPath, `${header}${sql.trim()}\n`, "utf8");
  synced.add(sourceName);
  nextNum += 1;
  copied += 1;
  console.log(`Synced ${sourceName} → migrations/${targetName}`);
}

await writeFile(statePath, `${JSON.stringify({ files: [...synced] }, null, 2)}\n`, "utf8");
if (copied === 0) console.log("Wrangler migrations folder is already up to date.");
