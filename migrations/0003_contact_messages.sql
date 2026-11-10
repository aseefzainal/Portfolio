CREATE TABLE contact_messages (
  id integer PRIMARY KEY AUTOINCREMENT,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at text NOT NULL,
  read_at text
);
