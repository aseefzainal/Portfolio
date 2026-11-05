CREATE TABLE projects (
  id integer PRIMARY KEY AUTOINCREMENT,
  title text NOT NULL,
  description text NOT NULL,
  stack text NOT NULL,
  href text NOT NULL DEFAULT '',
  repo text NOT NULL DEFAULT '',
  position integer NOT NULL
);

INSERT INTO projects (title, description, stack, href, repo, position) VALUES
  (
    'Project One',
    'A short description of what you built, who it was for, and the part you owned.',
    '["Laravel","MySQL","Blade"]',
    'https://github.com',
    'https://github.com',
    0
  ),
  (
    'Project Two',
    'Another project. Mention the problem, the approach, and one result you can stand behind.',
    '["PHP","REST API"]',
    'https://github.com',
    'https://github.com',
    1
  ),
  (
    'This portfolio',
    'A single-page site in the Next.js App Router. Content lives in one data file so the layout stays untouched when you edit copy.',
    '["Next.js","TypeScript","Tailwind CSS"]',
    'https://github.com',
    'https://github.com',
    2
  );
