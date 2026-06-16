import sql from "@/lib/db";

export async function register() {
  await sql`CREATE TABLE IF NOT EXISTS snippets (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    language TEXT NOT NULL,
    description TEXT NOT NULL,
    code TEXT NOT NULL
  )`;
  const [{ count }] = await sql`SELECT COUNT(*) FROM snippets`;
  if (Number(count) === 0) {
    await seed();
  }
}

export async function seed() {
  await sql`INSERT INTO snippets (title, language, description, code) VALUES
  (
    'CSS Grid Areas',
    'CSS',
    'Create a grid with named areas.',
    '.grid-container {\n  display: grid;\n  grid-template-areas:\n    ''header header header''\n    ''sidebar content content''\n    ''footer footer footer''; \n  grid-gap: 10px;\n  background-color: #2196F3;\n  padding: 10px;\n}'
  ),
  (
    'Range of numbers',
    'JavaScript',
    'Build an array from a start value up to an end value.',
    'const range = (start, end) =>\n  Array.from({ length: end - start }, (_, i) => start + i);'
  ),
  (
    'Group by key',
    'TypeScript',
    'Turn a list into buckets keyed by one of its fields.',
    'function groupBy(items, key) {\n  return items.reduce((acc, item) => {\n    (acc[item[key]] ??= []).push(item);\n    return acc;\n  }, {});\n}'
  )`;
}
