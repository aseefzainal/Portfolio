ALTER TABLE projects ADD COLUMN image text NOT NULL DEFAULT '';
ALTER TABLE projects ADD COLUMN mark text NOT NULL DEFAULT '';

CREATE TABLE site_profile (
  id integer PRIMARY KEY CHECK (id = 1),
  name text NOT NULL,
  role text NOT NULL,
  summary text NOT NULL,
  location text NOT NULL,
  email text NOT NULL,
  github text NOT NULL,
  linkedin text NOT NULL,
  resume text NOT NULL,
  github_username text NOT NULL
);

CREATE TABLE about_paragraphs (
  id integer PRIMARY KEY AUTOINCREMENT,
  body text NOT NULL,
  position integer NOT NULL
);

CREATE TABLE about_facts (
  id integer PRIMARY KEY AUTOINCREMENT,
  title text NOT NULL,
  text text NOT NULL,
  position integer NOT NULL
);

CREATE TABLE timeline_entries (
  id integer PRIMARY KEY AUTOINCREMENT,
  kind text NOT NULL,
  title text NOT NULL,
  place text NOT NULL,
  period text NOT NULL,
  detail text NOT NULL,
  href text NOT NULL DEFAULT '',
  position integer NOT NULL
);

CREATE TABLE skills (
  id integer PRIMARY KEY AUTOINCREMENT,
  name text NOT NULL,
  icon_slug text NOT NULL DEFAULT '',
  color text NOT NULL DEFAULT '',
  position integer NOT NULL
);

INSERT INTO site_profile (
  id, name, role, summary, location, email, github, linkedin, resume, github_username
) VALUES (
  1,
  'Aseef Zainal',
  'Full-stack developer',
  'I build web apps with Laravel and I''m learning Next.js. This page is a placeholder — replace the text, links, and projects with your own.',
  'Malaysia',
  'aseefzainal65@gmail.com',
  'https://github.com/aseefzainal',
  'https://www.linkedin.com',
  '/resume.pdf',
  'aseefzainal'
);

INSERT INTO about_paragraphs (body, position) VALUES
  (
    'I ship features end to end: database, API, and the screen people actually use. Most of my work so far is Laravel — routing, Eloquent, and Blade — and this portfolio is where I''m practising React and Next.js.',
    0
  ),
  (
    'I care about clear structure, readable code, and pages that stay fast on a phone. Swap this copy in src/data/profile.ts when you''re ready to publish.',
    1
  );

INSERT INTO about_facts (title, text, position) VALUES
  ('Laravel', 'Systems, reports, and permissions', 0),
  ('Next.js', 'This portfolio, in public', 1),
  ('Malaysia', 'Based here', 2),
  ('Open', 'Freelance and full-time', 3);

INSERT INTO timeline_entries (kind, title, place, period, detail, href, position) VALUES
  (
    'work',
    'Full-Stack Developer',
    'FMZ Net Solutions · Freelance',
    'Aug 2023 – Jul 2025',
    'Freelance full-stack development across web applications.',
    '',
    0
  ),
  (
    'education',
    'Bachelor in Information Technology (Honours)',
    'Universiti Kuala Lumpur MIIT · Internet of Things',
    'Sep 2022 – Jul 2025',
    'CGPA 3.53. Completed with a final-year project and industrial training.',
    '',
    1
  ),
  (
    'work',
    'Backend Developer',
    'Politeknik Muadzam Shah · Diploma intern',
    'Mar 2022 – Jul 2022',
    'Backend internship at the polytechnic, during the diploma in ICT.',
    '',
    2
  ),
  (
    'education',
    'Diploma in Information Technology and Communication Technology',
    'Politeknik Muadzam Shah',
    'Jun 2019 – Aug 2022',
    'CGPA 3.86.',
    '',
    3
  );

INSERT INTO skills (name, icon_slug, color, position) VALUES
  ('Laravel', 'siLaravel', '#FF2D20', 0),
  ('PHP', 'siPhp', '#777BB4', 1),
  ('MySQL', 'siMysql', '#4479A1', 2),
  ('JavaScript', 'siJavascript', '#F7DF1E', 3),
  ('TypeScript', 'siTypescript', '#3178C6', 4),
  ('React', 'siReact', '#61DAFB', 5),
  ('Next.js', 'siNextdotjs', '', 6),
  ('Tailwind', 'siTailwindcss', '#06B6D4', 7),
  ('Git', 'siGit', '#F05032', 8);

DELETE FROM projects;

INSERT INTO projects (title, description, stack, href, repo, position, image, mark) VALUES
  (
    'ILMS',
    'Integrated Land Management System. Staff record premise census and licensing, track billboards, and review coverage on maps and printable reports.',
    '["Laravel","Livewire","MySQL"]',
    '',
    '',
    0,
    '/projects/ilms.svg',
    'ILMS'
  ),
  (
    'DAMS',
    'Door Attendance Management System. It registers staff and visitors, issues QR invitations, and shows live access from door devices.',
    '["Laravel","Livewire","MySQL"]',
    '',
    '',
    1,
    '/projects/dams.png',
    'DAMS'
  ),
  (
    'Capital Park',
    'Parking and patrol operations for lot inventory, patroller activity, incidents, payments, and daily summary reports.',
    '["Laravel","Blade","MySQL"]',
    '',
    '',
    2,
    '/projects/capital-park.png',
    'CP'
  ),
  (
    'EPPP',
    'Online procurement for DBKL. Suppliers register their company and bid for supplies, services, and works, with tenders, claims, and project records in one system.',
    '["Laravel","Blade","MySQL"]',
    '',
    '',
    3,
    '/projects/eppp.png',
    'EPPP'
  );
