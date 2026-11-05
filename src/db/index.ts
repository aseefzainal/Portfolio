import { getCloudflareContext } from "@opennextjs/cloudflare";
import { and, asc, eq, isNull, max } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import {
  aboutFacts,
  aboutParagraphs,
  passwordResetTokens,
  projects,
  siteProfile,
  skills,
  timelineEntries,
  users,
  type TimelineKind,
} from "@/db/schema";

async function getDb() {
  const { env } = await getCloudflareContext({ async: true });
  return drizzle(env.DB, {
    schema: {
      projects,
      users,
      passwordResetTokens,
      siteProfile,
      aboutParagraphs,
      aboutFacts,
      timelineEntries,
      skills,
    },
  });
}

export type StoredProject = {
  id: number;
  title: string;
  description: string;
  stack: string[];
  href: string;
  repo: string;
  position: number;
  image: string;
  mark: string;
  showOnSite: boolean;
  showOnResume: boolean;
};

export type StoredUser = {
  id: number;
  email: string;
  passwordHash: string;
};

export type SiteProfile = {
  name: string;
  role: string;
  summary: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  resume: string;
  githubUsername: string;
  photo: string;
  photoShape: "circle" | "rounded" | "square";
};

export type AboutParagraph = {
  id: number;
  body: string;
  position: number;
};

export type AboutFact = {
  id: number;
  title: string;
  text: string;
  position: number;
};

export type TimelineEntry = {
  id: number;
  kind: TimelineKind;
  title: string;
  place: string;
  period: string;
  detail: string;
  href: string;
  position: number;
};

export type StoredSkill = {
  id: number;
  name: string;
  iconSlug: string;
  color: string;
  position: number;
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
    image: row.image,
    mark: row.mark,
    showOnSite: row.showOnSite !== 0,
    showOnResume: row.showOnResume !== 0,
  };
}

function isTimelineKind(value: string): value is TimelineKind {
  return value === "work" || value === "education" || value === "certificate";
}

function toTimeline(row: typeof timelineEntries.$inferSelect): TimelineEntry {
  return {
    id: row.id,
    kind: isTimelineKind(row.kind) ? row.kind : "work",
    title: row.title,
    place: row.place,
    period: row.period,
    detail: row.detail,
    href: row.href,
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

export async function getSiteProfile(): Promise<SiteProfile> {
  const db = await getDb();
  const [row] = await db.select().from(siteProfile).where(eq(siteProfile.id, 1)).limit(1);
  if (!row) {
    throw new Error("Site profile is missing. Apply D1 migrations.");
  }
  const shape = row.photoShape;
  return {
    name: row.name,
    role: row.role,
    summary: row.summary,
    location: row.location,
    email: row.email,
    github: row.github,
    linkedin: row.linkedin,
    resume: row.resume,
    githubUsername: row.githubUsername,
    photo: row.photo ?? "",
    photoShape: shape === "rounded" || shape === "square" ? shape : "circle",
  };
}

export async function updateSiteProfile(input: SiteProfile) {
  const db = await getDb();
  await db
    .update(siteProfile)
    .set({
      name: input.name,
      role: input.role,
      summary: input.summary,
      location: input.location,
      email: input.email,
      github: input.github,
      linkedin: input.linkedin,
      resume: input.resume,
      githubUsername: input.githubUsername,
      photo: input.photo,
      photoShape: input.photoShape,
    })
    .where(eq(siteProfile.id, 1));
}

export async function listAboutParagraphs(): Promise<AboutParagraph[]> {
  const db = await getDb();
  return db.select().from(aboutParagraphs).orderBy(asc(aboutParagraphs.position), asc(aboutParagraphs.id));
}

export async function getAboutParagraph(id: number) {
  const db = await getDb();
  const [row] = await db.select().from(aboutParagraphs).where(eq(aboutParagraphs.id, id)).limit(1);
  return row;
}

export async function insertAboutParagraph(body: string) {
  const db = await getDb();
  const [current] = await db.select({ value: max(aboutParagraphs.position) }).from(aboutParagraphs);
  await db.insert(aboutParagraphs).values({ body, position: (current?.value ?? -1) + 1 });
}

export async function updateAboutParagraph(id: number, body: string) {
  const db = await getDb();
  await db.update(aboutParagraphs).set({ body }).where(eq(aboutParagraphs.id, id));
}

export async function deleteAboutParagraph(id: number) {
  const db = await getDb();
  await db.delete(aboutParagraphs).where(eq(aboutParagraphs.id, id));
}

export async function listAboutFacts(): Promise<AboutFact[]> {
  const db = await getDb();
  return db.select().from(aboutFacts).orderBy(asc(aboutFacts.position), asc(aboutFacts.id));
}

export async function getAboutFact(id: number) {
  const db = await getDb();
  const [row] = await db.select().from(aboutFacts).where(eq(aboutFacts.id, id)).limit(1);
  return row;
}

export async function insertAboutFact(input: { title: string; text: string }) {
  const db = await getDb();
  const [current] = await db.select({ value: max(aboutFacts.position) }).from(aboutFacts);
  await db.insert(aboutFacts).values({ ...input, position: (current?.value ?? -1) + 1 });
}

export async function updateAboutFact(id: number, input: { title: string; text: string }) {
  const db = await getDb();
  await db.update(aboutFacts).set(input).where(eq(aboutFacts.id, id));
}

export async function deleteAboutFact(id: number) {
  const db = await getDb();
  await db.delete(aboutFacts).where(eq(aboutFacts.id, id));
}

export async function listTimelineEntries(kind?: TimelineKind): Promise<TimelineEntry[]> {
  const db = await getDb();
  const rows = kind
    ? await db
        .select()
        .from(timelineEntries)
        .where(eq(timelineEntries.kind, kind))
        .orderBy(asc(timelineEntries.position), asc(timelineEntries.id))
    : await db.select().from(timelineEntries).orderBy(asc(timelineEntries.position), asc(timelineEntries.id));
  return rows.map(toTimeline);
}

export async function getTimelineEntry(id: number): Promise<TimelineEntry | undefined> {
  const db = await getDb();
  const [row] = await db.select().from(timelineEntries).where(eq(timelineEntries.id, id)).limit(1);
  return row ? toTimeline(row) : undefined;
}

export async function insertTimelineEntry(input: Omit<TimelineEntry, "id" | "position">) {
  const db = await getDb();
  const [current] = await db.select({ value: max(timelineEntries.position) }).from(timelineEntries);
  const [row] = await db
    .insert(timelineEntries)
    .values({ ...input, position: (current?.value ?? -1) + 1 })
    .returning({ id: timelineEntries.id });
  return row.id;
}

export async function updateTimelineEntry(id: number, input: Omit<TimelineEntry, "id" | "position">) {
  const db = await getDb();
  await db.update(timelineEntries).set(input).where(eq(timelineEntries.id, id));
}

export async function deleteTimelineEntry(id: number) {
  const db = await getDb();
  await db.delete(timelineEntries).where(eq(timelineEntries.id, id));
}

export async function listSkills(): Promise<StoredSkill[]> {
  const db = await getDb();
  const rows = await db.select().from(skills).orderBy(asc(skills.position), asc(skills.id));
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    iconSlug: row.iconSlug,
    color: row.color,
    position: row.position,
  }));
}

export async function getSkill(id: number): Promise<StoredSkill | undefined> {
  const db = await getDb();
  const [row] = await db.select().from(skills).where(eq(skills.id, id)).limit(1);
  if (!row) return undefined;
  return {
    id: row.id,
    name: row.name,
    iconSlug: row.iconSlug,
    color: row.color,
    position: row.position,
  };
}

export async function insertSkill(input: Omit<StoredSkill, "id" | "position">) {
  const db = await getDb();
  const [current] = await db.select({ value: max(skills.position) }).from(skills);
  const [row] = await db
    .insert(skills)
    .values({
      name: input.name,
      iconSlug: input.iconSlug,
      color: input.color,
      position: (current?.value ?? -1) + 1,
    })
    .returning({ id: skills.id });
  return row.id;
}

export async function updateSkill(id: number, input: Omit<StoredSkill, "id" | "position">) {
  const db = await getDb();
  await db
    .update(skills)
    .set({ name: input.name, iconSlug: input.iconSlug, color: input.color })
    .where(eq(skills.id, id));
}

export async function deleteSkill(id: number) {
  const db = await getDb();
  await db.delete(skills).where(eq(skills.id, id));
}

export async function listProjects(filter?: {
  showOnSite?: boolean;
  showOnResume?: boolean;
}): Promise<StoredProject[]> {
  const db = await getDb();
  const rows = await db.select().from(projects).orderBy(asc(projects.position), asc(projects.id));
  return rows
    .map(toProject)
    .filter((project) => {
      if (filter?.showOnSite !== undefined && project.showOnSite !== filter.showOnSite) return false;
      if (filter?.showOnResume !== undefined && project.showOnResume !== filter.showOnResume) {
        return false;
      }
      return true;
    });
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
  const [row] = await db
    .insert(projects)
    .values({
      title: input.title,
      description: input.description,
      stack: JSON.stringify(input.stack),
      href: input.href,
      repo: input.repo,
      image: input.image,
      mark: input.mark,
      showOnSite: input.showOnSite ? 1 : 0,
      showOnResume: input.showOnResume ? 1 : 0,
      position,
    })
    .returning({ id: projects.id });
  if (row?.id) return row.id;

  const [latest] = await db.select({ id: max(projects.id) }).from(projects);
  if (latest?.id) return latest.id;
  throw new Error("Could not create project.");
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
      image: input.image,
      mark: input.mark,
      showOnSite: input.showOnSite ? 1 : 0,
      showOnResume: input.showOnResume ? 1 : 0,
    })
    .where(eq(projects.id, id));
}

export async function deleteProject(id: number) {
  const db = await getDb();
  await db.delete(projects).where(eq(projects.id, id));
}
