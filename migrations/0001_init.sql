-- Baseline schema (matches src/db/schema.ts)

CREATE TABLE users (
  id integer PRIMARY KEY AUTOINCREMENT,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL
);

CREATE TABLE password_resets (
  id integer PRIMARY KEY AUTOINCREMENT,
  user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at text NOT NULL,
  used_at text
);

CREATE TABLE profiles (
  id integer PRIMARY KEY CHECK (id = 1),
  name text NOT NULL,
  role text NOT NULL,
  summary text NOT NULL,
  location text NOT NULL,
  email text NOT NULL,
  github text NOT NULL,
  linkedin text NOT NULL,
  photo text NOT NULL DEFAULT '',
  photo_shape text NOT NULL DEFAULT 'circle',
  resume_published integer NOT NULL DEFAULT 0,
  section_visibility text NOT NULL DEFAULT '{}'
);

CREATE TABLE about_paragraphs (
  id integer PRIMARY KEY AUTOINCREMENT,
  body text NOT NULL,
  position integer NOT NULL
);

CREATE TABLE about_highlights (
  id integer PRIMARY KEY AUTOINCREMENT,
  title text NOT NULL,
  text text NOT NULL,
  position integer NOT NULL
);

CREATE TABLE resume_entries (
  id integer PRIMARY KEY AUTOINCREMENT,
  kind text NOT NULL,
  title text NOT NULL,
  place text NOT NULL,
  period text NOT NULL,
  detail text NOT NULL,
  href text NOT NULL DEFAULT '',
  position integer NOT NULL,
  location text NOT NULL DEFAULT '',
  location_type text NOT NULL DEFAULT '',
  employment_type text NOT NULL DEFAULT '',
  is_current integer NOT NULL DEFAULT 0,
  start_month text NOT NULL DEFAULT '',
  start_year text NOT NULL DEFAULT '',
  end_month text NOT NULL DEFAULT '',
  end_year text NOT NULL DEFAULT '',
  field_of_study text NOT NULL DEFAULT '',
  grade text NOT NULL DEFAULT '',
  activities text NOT NULL DEFAULT '',
  show_on_site integer NOT NULL DEFAULT 1,
  show_on_resume integer NOT NULL DEFAULT 1
);

CREATE TABLE skills (
  id integer PRIMARY KEY AUTOINCREMENT,
  name text NOT NULL,
  icon_slug text NOT NULL DEFAULT '',
  color text NOT NULL DEFAULT '',
  level text NOT NULL DEFAULT 'proficient',
  position integer NOT NULL
);

CREATE TABLE projects (
  id integer PRIMARY KEY AUTOINCREMENT,
  title text NOT NULL,
  description text NOT NULL,
  stack text NOT NULL,
  href text NOT NULL DEFAULT '',
  repo text NOT NULL DEFAULT '',
  position integer NOT NULL,
  image text NOT NULL DEFAULT '',
  show_on_site integer NOT NULL DEFAULT 1,
  show_on_resume integer NOT NULL DEFAULT 1
);
