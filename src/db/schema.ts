import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  stack: text("stack").notNull(),
  href: text("href").notNull().default(""),
  repo: text("repo").notNull().default(""),
  position: integer("position").notNull(),
  image: text("image").notNull().default(""),
  mark: text("mark").notNull().default(""),
});

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});

export const passwordResetTokens = sqliteTable("password_reset_tokens", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: text("expires_at").notNull(),
  usedAt: text("used_at"),
});

export const siteProfile = sqliteTable("site_profile", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  summary: text("summary").notNull(),
  location: text("location").notNull(),
  email: text("email").notNull(),
  github: text("github").notNull(),
  linkedin: text("linkedin").notNull(),
  resume: text("resume").notNull(),
  githubUsername: text("github_username").notNull(),
});

export const aboutParagraphs = sqliteTable("about_paragraphs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  body: text("body").notNull(),
  position: integer("position").notNull(),
});

export const aboutFacts = sqliteTable("about_facts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  text: text("text").notNull(),
  position: integer("position").notNull(),
});

export const timelineEntries = sqliteTable("timeline_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  kind: text("kind").notNull(),
  title: text("title").notNull(),
  place: text("place").notNull(),
  period: text("period").notNull(),
  detail: text("detail").notNull(),
  href: text("href").notNull().default(""),
  position: integer("position").notNull(),
});

export const skills = sqliteTable("skills", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  iconSlug: text("icon_slug").notNull().default(""),
  color: text("color").notNull().default(""),
  position: integer("position").notNull(),
});

export type TimelineKind = "work" | "education" | "certificate";
