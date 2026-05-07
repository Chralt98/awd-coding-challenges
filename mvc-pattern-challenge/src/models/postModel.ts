import { getDB } from "../db/database";

/*
- your data interfaces and types
- constants related to your data source, like file paths
- helper functions specifically related to data parsing, like generating slugs
- a function to fetch all posts
- a function to fetch a single post by its identifier
- a function to overwrite the data file with new data, which you will need for the next challenge
*/

export interface Post {
  id: number;
  title: string;
  image: string;
  author: string;
  createdAt: number;
  teaser: string;
  content: string;
}

export async function loadPosts(): Promise<Post[]> {
  const db = getDB();
  return await db.all<Post[]>("SELECT * FROM blog_entries");
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatDate(unix: number): string {
  return new Date(unix * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function findPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await loadPosts();
  return posts.find((post) => slugify(post.title) === slug);
}

export async function findPostById(id: number): Promise<Post | undefined> {
  const db = getDB();
  return await db.get<Post>("SELECT * FROM blog_entries WHERE id = ?", id);
}

export function filterPostsByAuthor(posts: Post[], author: string): Post[] {
  return posts.filter((post) =>
    post.author.toLowerCase().includes(author.toLowerCase()),
  );
}

export function sortPostsByDate(
  posts: Post[],
  sort: "newest" | "oldest",
): Post[] {
  return [...posts].sort((a, b) => {
    if (sort === "oldest") {
      return a.createdAt - b.createdAt;
    }
    return b.createdAt - a.createdAt;
  });
}

export function addViewMetadata(
  posts: Post[],
): (Omit<Post, "createdAt"> & { slug: string; createdAt: string })[] {
  return posts.map((post) => ({
    ...post,
    slug: slugify(post.title),
    createdAt: formatDate(post.createdAt),
  }));
}

export async function createBlogEntry(
  entry: Omit<Post, "id">,
): Promise<number> {
  const db = getDB();
  const result = await db.run(
    `INSERT INTO blog_entries (title, teaser, author, createdAt, image, content)
     VALUES (@title, @teaser, @author, @createdAt, @image, @content)`,
    {
      "@title": entry.title,
      "@teaser": entry.teaser,
      "@author": entry.author,
      "@createdAt": entry.createdAt,
      "@image": entry.image,
      "@content": entry.content,
    },
  );
  return result.lastID!;
}

export async function updateBlogEntry(
  id: number,
  entry: Omit<Post, "id">,
): Promise<void> {
  const db = getDB();
  await db.run(
    `UPDATE blog_entries
     SET title = @title, teaser = @teaser, author = @author, createdAt = @createdAt, image = @image, content = @content
     WHERE id = @id`,
    {
      "@title": entry.title,
      "@teaser": entry.teaser,
      "@author": entry.author,
      "@createdAt": entry.createdAt,
      "@image": entry.image,
      "@content": entry.content,
      "@id": id,
    },
  );
}

export async function deleteBlogEntry(id: number): Promise<void> {
  const db = getDB();
  await db.run(`DELETE FROM blog_entries WHERE id = @id`, { "@id": id });
}
