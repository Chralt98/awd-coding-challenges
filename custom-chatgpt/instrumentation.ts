import sql from "./lib/db";

export async function register() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      email text NOT NULL UNIQUE,
      password_hash text NOT NULL,
      created timestamp NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS stories (
      id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      title text NOT NULL,
      created timestamp NOT NULL DEFAULT now(),
      language text NOT NULL DEFAULT 'english'
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS messages (
      id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      story_id integer NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
      role text NOT NULL,
      content text NOT NULL,
      followups jsonb,
      ended boolean
    )
  `;

  await sql`ALTER TABLE stories ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'english'`;
  await sql`ALTER TABLE messages ADD COLUMN IF NOT EXISTS followups jsonb`;
  await sql`ALTER TABLE messages ADD COLUMN IF NOT EXISTS ended boolean`;
  // Nullable: pre-existing story rows predate user accounts and have no owner to backfill.
  await sql`ALTER TABLE stories ADD COLUMN IF NOT EXISTS user_id integer REFERENCES users(id) ON DELETE CASCADE`;
}
