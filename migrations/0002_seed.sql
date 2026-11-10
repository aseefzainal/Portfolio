-- Seed data for fresh installs (local / new environments)

INSERT INTO users (email, password_hash) VALUES (
  'aseefzainal65@gmail.com',
  '$2b$10$Kui2YY1yRjnuxubu.6uSHO5vXpF35l3AZ4W2hWvzcpWWVVJ0Sdmr2'
);

INSERT INTO profiles (
  id, name, role, summary, location, email, github, linkedin, photo, photo_shape, resume_published
) VALUES (
  1,
  'Aseef Zainal',
  'Full-stack developer',
  'I build web apps with Laravel and I''m learning Next.js. This page is a placeholder — replace the text, links, and projects with your own.',
  'Malaysia',
  'aseefzainal65@gmail.com',
  'https://github.com/aseefzainal',
  'https://www.linkedin.com',
  '',
  'circle',
  0
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

INSERT INTO about_highlights (title, text, position) VALUES
  ('Laravel', 'Systems, reports, and permissions', 0),
  ('Next.js', 'This portfolio, in public', 1),
  ('Malaysia', 'Based here', 2),
  ('Open', 'Freelance and full-time', 3);

INSERT INTO resume_entries (
  kind, title, place, period, detail, href, position,
  location, location_type, employment_type, is_current,
  start_month, start_year, end_month, end_year,
  field_of_study, grade, activities, show_on_site, show_on_resume
) VALUES
  (
    'work',
    'Full-Stack Developer',
    'FMZ Net Solutions · Freelance',
    'Aug 2023 – Dec 2025',
    'Freelance full-stack development across web applications.',
    '',
    0,
    '', '', 'Freelance', 0,
    '08', '2023', '12', '2025',
    '', '', '', 1, 1
  ),
  (
    'education',
    'Bachelor of Science',
    'Universiti Kuala Lumpur MIIT',
    'Sep 2022 – Jul 2025',
    'Completed with a final-year project and industrial training.',
    '',
    1,
    '', '', '', 0,
    '09', '2022', '07', '2025',
    'Bachelor In Information Technology (Honours) (Internet Of Things)',
    '3.53',
    '',
    1, 1
  ),
  (
    'work',
    'Backend Developer',
    'Politeknik Muadzam Shah · Diploma intern',
    'Mar 2022 – Jul 2022',
    'Backend internship at the polytechnic, during the diploma in ICT.',
    '',
    2,
    '', '', 'Internship', 0,
    '03', '2022', '07', '2022',
    '', '', '', 1, 1
  ),
  (
    'education',
    'Diploma',
    'Politeknik Muadzam Shah',
    'Jun 2019 – Aug 2022',
    '',
    '',
    3,
    '', '', '', 0,
    '06', '2019', '08', '2022',
    'Information Technology and Communication Technology',
    '3.86',
    '',
    1, 1
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

INSERT INTO projects (title, description, stack, href, repo, position, image, show_on_site, show_on_resume) VALUES
  (
    'ILMS',
    'Integrated Land Management System. Staff record premise census and licensing, track billboards, and review coverage on maps and printable reports.',
    '["Laravel","Livewire","MySQL"]',
    '',
    '',
    0,
    '/projects/ilms.svg',
    1, 1
  ),
  (
    'DAMS',
    'Door Attendance Management System. It registers staff and visitors, issues QR invitations, and shows live access from door devices.',
    '["Laravel","Livewire","MySQL"]',
    '',
    '',
    1,
    '/projects/dams.png',
    1, 1
  ),
  (
    'Capital Park',
    'Parking and patrol operations for lot inventory, patroller activity, incidents, payments, and daily summary reports.',
    '["Laravel","Blade","MySQL"]',
    '',
    '',
    2,
    '/projects/capital-park.png',
    1, 1
  ),
  (
    'EPPP',
    'Online procurement for DBKL. Suppliers register their company and bid for supplies, services, and works, with tenders, claims, and project records in one system.',
    '["Laravel","Blade","MySQL"]',
    '',
    '',
    3,
    '/projects/eppp.png',
    1, 1
  );
