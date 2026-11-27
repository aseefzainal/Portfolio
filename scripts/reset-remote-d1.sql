-- One-shot remote reset (personal/dev). Not part of the numbered migration chain.
PRAGMA foreign_keys = OFF;

-- Current schema
DROP TABLE IF EXISTS password_resets;
DROP TABLE IF EXISTS contact_messages;
DROP TABLE IF EXISTS showcase_tools;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS resume_entries;
DROP TABLE IF EXISTS about_highlights;
DROP TABLE IF EXISTS about_paragraphs;
DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS d1_migrations;

-- Legacy table names from earlier schema
DROP TABLE IF EXISTS about_facts;
DROP TABLE IF EXISTS password_reset_tokens;
DROP TABLE IF EXISTS site_profile;
DROP TABLE IF EXISTS timeline_entries;

PRAGMA foreign_keys = ON;
