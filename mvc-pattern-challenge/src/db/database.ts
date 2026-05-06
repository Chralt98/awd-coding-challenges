import { open, Database } from "sqlite";
import sqlite3 from "sqlite3";
import path from "path";
import { readFile } from "fs/promises";

const DB_FILE = path.join(process.cwd(), "db", "blog.db");
const SEED_FILE = path.join(process.cwd(), "src", "data", "posts.json");

let db: Database | null = null;

interface SeedPost {
  title: string;
  image: string;
  author: string;
  createdAt: number;
  teaser: string;
  content: string;
}

export async function connectDB(): Promise<Database> {
  db = await open({
    filename: DB_FILE,
    driver: sqlite3.Database,
  });

  // add another table:
  await db.run(`
    CREATE TABLE IF NOT EXISTS blog_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      teaser TEXT NOT NULL,
      author TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      image TEXT NOT NULL,
      content TEXT NOT NULL
    )
  `);

  await seedInitialPosts(db);

  return db;
}

async function seedInitialPosts(db: Database): Promise<void> {
  const seedFile = await readFile(SEED_FILE, "utf-8");
  const { seedPosts } = JSON.parse(seedFile) as { seedPosts: SeedPost[] };

  for (const post of seedPosts) {
    const existingPost = await db.get<{ id: number }>(
      "SELECT id FROM blog_entries WHERE title = ?",
      post.title,
    );

    if (existingPost) {
      continue;
    }

    await db.run(
      `
        INSERT INTO blog_entries (title, teaser, author, createdAt, image, content)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      post.title,
      post.teaser,
      post.author,
      post.createdAt,
      post.image,
      post.content,
    );
  }
}

export function getDB(): Database {
  if (db === null) {
    throw new Error("Database not connected. Call connectDB() first.");
  }
  return db;
}

export async function closeDB(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
  }
}
