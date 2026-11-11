import { getCloudflareContext } from "@opennextjs/cloudflare";
import { and, asc, count, desc, eq, isNull, max } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import {
  aboutHighlights,
  aboutParagraphs,
  contactMessages,
  passwordResets,
  profiles,
  projects,
  resumeEntries,
  showcaseTools,
  skills,
  users,
  type TimelineKind,
} from "@/db/schema";
import {
  parseSectionVisibility,
  serializeSectionVisibility,
  type SectionVisibility,
} from "@/lib/section-visibility";
import { parseSkillLevel, type SkillLevel } from "@/lib/skill-level";

async function getDb() {
  const { env } = await getCloudflareContext({ async: true });
  return drizzle(env.DB, {
    schema: {
      projects,
      users,
      passwordResets,
      profiles,
      aboutParagraphs,
      aboutHighlights,
      resumeEntries,
      skills,
      showcaseTools,
      contactMessages,
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
  photo: string;
  photoShape: "circle" | "rounded" | "square";
  resumePublished: boolean;
  sections: SectionVisibility;
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
  location: string;
  locationType: string;
  mapLat: string;
  mapLng: string;
  employmentType: string;
  isCurrent: boolean;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  fieldOfStudy: string;
  grade: string;
  activities: string;
  showOnSite: boolean;
  showOnResume: boolean;
};

export type StoredSkill = {
  id: number;
  name: string;
  iconSlug: string;
  color: string;
  level: SkillLevel;
  position: number;
};

export type ShowcaseTool = {
  id: number;
  slug: string;
  title: string;
  description: string;
  href: string;
  enabled: boolean;
  position: number;
};

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  readAt: string | null;
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
    showOnSite: row.showOnSite !== 0,
    showOnResume: row.showOnResume !== 0,
  };
}

function isTimelineKind(value: string): value is TimelineKind {
  return value === "work" || value === "education" || value === "certificate";
}

function toTimeline(row: typeof resumeEntries.$inferSelect): TimelineEntry {
  return {
    id: row.id,
    kind: isTimelineKind(row.kind) ? row.kind : "work",
    title: row.title,
    place: row.place,
    period: row.period,
    detail: row.detail,
    href: row.href,
    position: row.position,
    location: row.location ?? "",
    locationType: row.locationType ?? "",
    mapLat: row.mapLat ?? "",
    mapLng: row.mapLng ?? "",
    employmentType: row.employmentType ?? "",
    isCurrent: (row.isCurrent ?? 0) !== 0,
    startMonth: row.startMonth ?? "",
    startYear: row.startYear ?? "",
    endMonth: row.endMonth ?? "",
    endYear: row.endYear ?? "",
    fieldOfStudy: row.fieldOfStudy ?? "",
    grade: row.grade ?? "",
    activities: row.activities ?? "",
    showOnSite: (row.showOnSite ?? 1) !== 0,
    showOnResume: (row.showOnResume ?? 1) !== 0,
  };
}

function timelineValues(input: Omit<TimelineEntry, "id" | "position">) {
  return {
    kind: input.kind,
    title: input.title,
    place: input.place,
    period: input.period,
    detail: input.detail,
    href: input.href,
    location: input.location,
    locationType: input.locationType,
    mapLat: input.mapLat,
    mapLng: input.mapLng,
    employmentType: input.employmentType,
    isCurrent: input.isCurrent ? 1 : 0,
    startMonth: input.startMonth,
    startYear: input.startYear,
    endMonth: input.endMonth,
    endYear: input.endYear,
    fieldOfStudy: input.fieldOfStudy,
    grade: input.grade,
    activities: input.activities,
    showOnSite: input.showOnSite ? 1 : 0,
    showOnResume: input.showOnResume ? 1 : 0,
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
  await db.delete(passwordResets).where(eq(passwordResets.userId, userId));
  await db.insert(passwordResets).values({ userId, tokenHash, expiresAt });
}

export async function findValidPasswordResetToken(tokenHash: string) {
  const db = await getDb();
  const [row] = await db
    .select()
    .from(passwordResets)
    .where(and(eq(passwordResets.tokenHash, tokenHash), isNull(passwordResets.usedAt)))
    .limit(1);

  if (!row) return undefined;
  if (new Date(row.expiresAt).getTime() <= Date.now()) return undefined;
  return row;
}

export async function markPasswordResetTokenUsed(id: number) {
  const db = await getDb();
  await db
    .update(passwordResets)
    .set({ usedAt: new Date().toISOString() })
    .where(eq(passwordResets.id, id));
}

export async function getSiteProfile(): Promise<SiteProfile> {
  const db = await getDb();
  const [row] = await db.select().from(profiles).where(eq(profiles.id, 1)).limit(1);
  if (!row) {
    throw new Error("Profile is missing. Apply D1 migrations.");
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
    photo: row.photo ?? "",
    photoShape: shape === "rounded" || shape === "square" ? shape : "circle",
    resumePublished: row.resumePublished !== 0,
    sections: parseSectionVisibility(row.sectionVisibility),
  };
}

export async function updateSiteProfile(input: SiteProfile) {
  const db = await getDb();
  await db
    .update(profiles)
    .set({
      name: input.name,
      role: input.role,
      summary: input.summary,
      location: input.location,
      email: input.email,
      github: input.github,
      linkedin: input.linkedin,
      photo: input.photo,
      photoShape: input.photoShape,
      resumePublished: input.resumePublished ? 1 : 0,
      sectionVisibility: serializeSectionVisibility(input.sections),
    })
    .where(eq(profiles.id, 1));
}

export async function updateSectionVisibility(sections: SectionVisibility) {
  const db = await getDb();
  await db
    .update(profiles)
    .set({ sectionVisibility: serializeSectionVisibility(sections) })
    .where(eq(profiles.id, 1));
}

export async function setResumePublished(published: boolean) {
  const db = await getDb();
  await db
    .update(profiles)
    .set({ resumePublished: published ? 1 : 0 })
    .where(eq(profiles.id, 1));
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
  return db.select().from(aboutHighlights).orderBy(asc(aboutHighlights.position), asc(aboutHighlights.id));
}

export async function getAboutFact(id: number) {
  const db = await getDb();
  const [row] = await db.select().from(aboutHighlights).where(eq(aboutHighlights.id, id)).limit(1);
  return row;
}

export async function insertAboutFact(input: { title: string; text: string }) {
  const db = await getDb();
  const [current] = await db.select({ value: max(aboutHighlights.position) }).from(aboutHighlights);
  await db.insert(aboutHighlights).values({ ...input, position: (current?.value ?? -1) + 1 });
}

export async function updateAboutFact(id: number, input: { title: string; text: string }) {
  const db = await getDb();
  await db.update(aboutHighlights).set(input).where(eq(aboutHighlights.id, id));
}

export async function deleteAboutFact(id: number) {
  const db = await getDb();
  await db.delete(aboutHighlights).where(eq(aboutHighlights.id, id));
}

export async function listTimelineEntries(
  kind?: TimelineKind,
  filter?: { showOnSite?: boolean; showOnResume?: boolean },
): Promise<TimelineEntry[]> {
  const db = await getDb();
  const rows = kind
    ? await db
        .select()
        .from(resumeEntries)
        .where(eq(resumeEntries.kind, kind))
        .orderBy(asc(resumeEntries.position), asc(resumeEntries.id))
    : await db.select().from(resumeEntries).orderBy(asc(resumeEntries.position), asc(resumeEntries.id));
  return rows.map(toTimeline).filter((entry) => {
    if (filter?.showOnSite !== undefined && entry.showOnSite !== filter.showOnSite) return false;
    if (filter?.showOnResume !== undefined && entry.showOnResume !== filter.showOnResume) return false;
    return true;
  });
}

export async function getTimelineEntry(id: number): Promise<TimelineEntry | undefined> {
  const db = await getDb();
  const [row] = await db.select().from(resumeEntries).where(eq(resumeEntries.id, id)).limit(1);
  return row ? toTimeline(row) : undefined;
}

export async function insertTimelineEntry(input: Omit<TimelineEntry, "id" | "position">) {
  const db = await getDb();
  const [current] = await db.select({ value: max(resumeEntries.position) }).from(resumeEntries);
  const [row] = await db
    .insert(resumeEntries)
    .values({ ...timelineValues(input), position: (current?.value ?? -1) + 1 })
    .returning({ id: resumeEntries.id });
  return row.id;
}

export async function updateTimelineEntry(id: number, input: Omit<TimelineEntry, "id" | "position">) {
  const db = await getDb();
  await db.update(resumeEntries).set(timelineValues(input)).where(eq(resumeEntries.id, id));
}

export async function deleteTimelineEntry(id: number) {
  const db = await getDb();
  await db.delete(resumeEntries).where(eq(resumeEntries.id, id));
}

export async function setTimelineEntryPositions(orderedIds: number[]) {
  const db = await getDb();
  await Promise.all(
    orderedIds.map((id, index) =>
      db.update(resumeEntries).set({ position: index }).where(eq(resumeEntries.id, id)),
    ),
  );
}

export async function setProjectPositions(orderedIds: number[]) {
  const db = await getDb();
  await Promise.all(
    orderedIds.map((id, index) =>
      db.update(projects).set({ position: index }).where(eq(projects.id, id)),
    ),
  );
}

export async function setSkillPositions(orderedIds: number[]) {
  const db = await getDb();
  await Promise.all(
    orderedIds.map((id, index) =>
      db.update(skills).set({ position: index }).where(eq(skills.id, id)),
    ),
  );
}

function toStoredSkill(row: typeof skills.$inferSelect): StoredSkill {
  return {
    id: row.id,
    name: row.name,
    iconSlug: row.iconSlug,
    color: row.color,
    level: parseSkillLevel(row.level),
    position: row.position,
  };
}

export async function listSkills(): Promise<StoredSkill[]> {
  const db = await getDb();
  const rows = await db.select().from(skills).orderBy(asc(skills.position), asc(skills.id));
  return rows.map(toStoredSkill);
}

export async function getSkill(id: number): Promise<StoredSkill | undefined> {
  const db = await getDb();
  const [row] = await db.select().from(skills).where(eq(skills.id, id)).limit(1);
  return row ? toStoredSkill(row) : undefined;
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
      level: input.level,
      position: (current?.value ?? -1) + 1,
    })
    .returning({ id: skills.id });
  return row.id;
}

export async function updateSkill(id: number, input: Omit<StoredSkill, "id" | "position">) {
  const db = await getDb();
  await db
    .update(skills)
    .set({
      name: input.name,
      iconSlug: input.iconSlug,
      color: input.color,
      level: input.level,
    })
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
      showOnSite: input.showOnSite ? 1 : 0,
      showOnResume: input.showOnResume ? 1 : 0,
    })
    .where(eq(projects.id, id));
}

export async function deleteProject(id: number) {
  const db = await getDb();
  await db.delete(projects).where(eq(projects.id, id));
}

function toShowcaseTool(row: typeof showcaseTools.$inferSelect): ShowcaseTool {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    href: row.href,
    enabled: row.enabled !== 0,
    position: row.position,
  };
}

export async function listShowcaseTools(filter?: { enabled?: boolean }): Promise<ShowcaseTool[]> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(showcaseTools)
    .orderBy(asc(showcaseTools.position), asc(showcaseTools.id));
  return rows.map(toShowcaseTool).filter((tool) => {
    if (filter?.enabled !== undefined && tool.enabled !== filter.enabled) return false;
    return true;
  });
}

export async function hasEnabledShowcaseTools() {
  const tools = await listShowcaseTools({ enabled: true });
  return tools.length > 0;
}

export async function getShowcaseToolBySlug(slug: string): Promise<ShowcaseTool | undefined> {
  const db = await getDb();
  const [row] = await db.select().from(showcaseTools).where(eq(showcaseTools.slug, slug)).limit(1);
  return row ? toShowcaseTool(row) : undefined;
}

export async function setShowcaseToolEnabled(slug: string, enabled: boolean) {
  const db = await getDb();
  await db
    .update(showcaseTools)
    .set({ enabled: enabled ? 1 : 0 })
    .where(eq(showcaseTools.slug, slug));
}

function toContactMessage(row: typeof contactMessages.$inferSelect): ContactMessage {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    createdAt: row.createdAt,
    readAt: row.readAt ?? null,
  };
}

export async function createContactMessage(input: {
  name: string;
  email: string;
  message: string;
}) {
  const db = await getDb();
  const [row] = await db
    .insert(contactMessages)
    .values({
      name: input.name,
      email: input.email,
      message: input.message,
      createdAt: new Date().toISOString(),
    })
    .returning({ id: contactMessages.id });
  return row.id;
}

export async function listContactMessages(): Promise<ContactMessage[]> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(contactMessages)
    .orderBy(desc(contactMessages.createdAt), desc(contactMessages.id));
  return rows.map(toContactMessage);
}

export async function listUnreadContactMessages(limit = 5): Promise<ContactMessage[]> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(contactMessages)
    .where(isNull(contactMessages.readAt))
    .orderBy(desc(contactMessages.createdAt), desc(contactMessages.id))
    .limit(limit);
  return rows.map(toContactMessage);
}

export async function countUnreadContactMessages() {
  const db = await getDb();
  const [row] = await db
    .select({ value: count() })
    .from(contactMessages)
    .where(isNull(contactMessages.readAt));
  return row?.value ?? 0;
}

export async function getContactMessage(id: number): Promise<ContactMessage | undefined> {
  const db = await getDb();
  const [row] = await db.select().from(contactMessages).where(eq(contactMessages.id, id)).limit(1);
  return row ? toContactMessage(row) : undefined;
}

export async function markContactMessageRead(id: number) {
  const db = await getDb();
  await db
    .update(contactMessages)
    .set({ readAt: new Date().toISOString() })
    .where(and(eq(contactMessages.id, id), isNull(contactMessages.readAt)));
}

export async function markAllContactMessagesRead() {
  const db = await getDb();
  await db
    .update(contactMessages)
    .set({ readAt: new Date().toISOString() })
    .where(isNull(contactMessages.readAt));
}

export async function deleteContactMessage(id: number) {
  const db = await getDb();
  await db.delete(contactMessages).where(eq(contactMessages.id, id));
}
