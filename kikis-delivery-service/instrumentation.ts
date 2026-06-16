import sql from "@/lib/db";

export async function register() {
  await sql`CREATE TABLE IF NOT EXISTS deliveries (
    id SERIAL PRIMARY KEY,
    pickup TEXT NOT NULL,
    destination TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active'
  )`;
  const [{ count }] = await sql`SELECT COUNT(*) FROM deliveries`;
  if (Number(count) === 0) {
    await seed();
  }
}

export async function seed() {
  await sql`INSERT INTO deliveries (pickup, destination, status) VALUES
  ('Bakery', 'Clock Tower', 'active'),
  ('Harbour', 'Hillside Cafe', 'accepted'),
  ('Bookshop', 'Lighthouse', 'denied'),
  ('Market Square', 'Train Station', 'fulfilled')`;
}
