DROP TABLE IF EXISTS posts;

CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL
);

INSERT INTO posts (title, content) VALUES
  ('First post', 'Hello world'),
  ('Second post', 'More content');