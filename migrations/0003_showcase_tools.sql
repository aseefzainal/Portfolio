CREATE TABLE showcase_tools (
  id integer PRIMARY KEY AUTOINCREMENT,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL,
  href text NOT NULL,
  enabled integer NOT NULL DEFAULT 1,
  position integer NOT NULL
);

INSERT INTO showcase_tools (slug, title, description, href, enabled, position) VALUES
  (
    'merge-pdf',
    'Merge PDF',
    'Combine multiple PDF files into one document. Runs entirely in your browser.',
    '/showcase/merge-pdf',
    1,
    0
  ),
  (
    'split-pdf',
    'Split PDF',
    'Extract a page range from a PDF into a new file. Nothing is uploaded to a server.',
    '/showcase/split-pdf',
    1,
    1
  );
