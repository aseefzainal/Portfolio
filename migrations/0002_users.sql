CREATE TABLE users (
  id integer PRIMARY KEY AUTOINCREMENT,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL
);

INSERT INTO users (email, password_hash) VALUES (
  'aseefzainal65@gmail.com',
  '$2b$10$Kui2YY1yRjnuxubu.6uSHO5vXpF35l3AZ4W2hWvzcpWWVVJ0Sdmr2'
);
