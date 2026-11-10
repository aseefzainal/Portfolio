import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});

export const passwordResets = sqliteTable("password_resets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: text("expires_at").notNull(),
  usedAt: text("used_at"),
});

export const profiles = sqliteTable("profiles", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  summary: text("summary").notNull(),
  location: text("location").notNull(),
  email: text("email").notNull(),
  github: text("github").notNull(),
  linkedin: text("linkedin").notNull(),
  photo: text("photo").notNull().default(""),
  photoShape: text("photo_shape").notNull().default("circle"),
  resumePublished: integer("resume_published").notNull().default(0),
});

export const aboutParagraphs = sqliteTable("about_paragraphs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  body: text("body").notNull(),
  position: integer("position").notNull(),
});

export const aboutHighlights = sqliteTable("about_highlights", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  text: text("text").notNull(),
  position: integer("position").notNull(),
});

export const resumeEntries = sqliteTable("resume_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  kind: text("kind").notNull(),
  title: text("title").notNull(),
  place: text("place").notNull(),
  period: text("period").notNull(),
  detail: text("detail").notNull(),
  href: text("href").notNull().default(""),
  position: integer("position").notNull(),
  location: text("location").notNull().default(""),
  locationType: text("location_type").notNull().default(""),
  employmentType: text("employment_type").notNull().default(""),
  isCurrent: integer("is_current").notNull().default(0),
  startMonth: text("start_month").notNull().default(""),
  startYear: text("start_year").notNull().default(""),
  endMonth: text("end_month").notNull().default(""),
  endYear: text("end_year").notNull().default(""),
  fieldOfStudy: text("field_of_study").notNull().default(""),
  grade: text("grade").notNull().default(""),
  activities: text("activities").notNull().default(""),
  showOnSite: integer("show_on_site").notNull().default(1),
  showOnResume: integer("show_on_resume").notNull().default(1),
});

export const skills = sqliteTable("skills", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  iconSlug: text("icon_slug").notNull().default(""),
  color: text("color").notNull().default(""),
  position: integer("position").notNull(),
});

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  stack: text("stack").notNull(),
  href: text("href").notNull().default(""),
  repo: text("repo").notNull().default(""),
  position: integer("position").notNull(),
  image: text("image").notNull().default(""),
  showOnSite: integer("show_on_site").notNull().default(1),
  showOnResume: integer("show_on_resume").notNull().default(1),
});

export type TimelineKind = "work" | "education" | "certificate";
