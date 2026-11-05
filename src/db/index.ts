import { getCloudflareContext } from "@opennextjs/cloudflare";
import { and, asc, eq, isNull, max } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { passwordResetTokens, projects, users } from "@/db/schema";

async function getDb() {
  const { env } = await getCloudflareContext({ async: true });
  return drizzle(env.DB, { schema: { projects, users, passwordResetTokens } });
}

export type StoredProject = {
  id: number;
  title: string;
  description: string;
  stack: string[];
  href: string;
  repo: string;
  position: number;
};

export type StoredUser = {
  id: number;
  email: string;
  passwordHash: string;
};

function parseStack(value: string) {
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) return parsed;
  } catch {
    return [];
  }
  return [];
}

function toProject(row: typeof projects.$inferSelect): StoredProject {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    stack: parseStack(row.stack),
    href: row.href,
    repo: row.repo,
    position: row.position,
  };
}

export async function getUserByEmail(email: string): Promise<StoredUser | undefined> {
  const db = await getDb();
  const [row] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!row) return undefined;
  return { id: row.id, email: row.email, passwordHash: row.passwordHash };
}

export async function getUserById(id: number): Promise<StoredUser | undefined> {
  const db = await getDb();
  const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!row) return undefined;
  return { id: row.id, email: row.email, passwordHash: row.passwordHash };
}

export async function updateUserPassword(userId: number, passwordHash: string) {
  const db = await getDb();
  await db.update(users).set({ passwordHash }).where(eq(users.id, userId));
}

export async function createPasswordResetToken(userId: number, tokenHash: string, expiresAt: string) {
  const db = await getDb();
  await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, userId));
  await db.insert(passwordResetTokens).values({ userId, tokenHash, expiresAt });
}

export async function findValidPasswordResetToken(tokenHash: string) {
  const db = await getDb();
  const [row] = await db
    .select()
    .from(passwordResetTokens)
    .where(and(eq(passwordResetTokens.tokenHash, tokenHash), isNull(passwordResetTokens.usedAt)))
    .limit(1);

  if (!row) return undefined;
  if (new Date(row.expiresAt).getTime() <= Date.now()) return undefined;
  return row;
}

export async function markPasswordResetTokenUsed(id: number) {
  const db = await getDb();
  await db
    .update(passwordResetTokens)
    .set({ usedAt: new Date().toISOString() })
    .where(eq(passwordResetTokens.id, id));
}

export async function listProjects(): Promise<StoredProject[]> {
  const db = await getDb();
  const rows = await db.select().from(projects).orderBy(asc(projects.position), asc(projects.id));
  return rows.map(toProject);
}

export async function getProject(id: number): Promise<StoredProject | undefined> {
  const db = await getDb();
  const [row] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return row ? toProject(row) : undefined;
}

export async function insertProject(input: Omit<StoredProject, "id" | "position">) {
  const db = await getDb();
  const [current] = await db.select({ value: max(projects.position) }).from(projects);
  const position = (current?.value ?? -1) + 1;
  await db.insert(projects).values({
    title: input.title,
    description: input.description,
    stack: JSON.stringify(input.stack),
    href: input.href,
    repo: input.repo,
    position,
  });
}

export async function updateProject(id: number, input: Omit<StoredProject, "id" | "position">) {
  const db = await getDb();
  await db
    .update(projects)
    .set({
      title: input.title,
      description: input.description,
      stack: JSON.stringify(input.stack),
      href: input.href,
      repo: input.repo,
    })
    .where(eq(projects.id, id));
}

export async function deleteProject(id: number) {
  const db = await getDb();
  await db.delete(projects).where(eq(projects.id, id));
}
