import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/*
- your data interfaces and types
- constants related to your data source, like file paths
- helper functions specifically related to data parsing, like generating slugs
- a function to fetch all posts
- a function to fetch a single post by its identifier
- a function to overwrite the data file with new data, which you will need for the next challenge
*/

interface Post {
  title: string;
  image: string;
  author: string;
  createdAt: number;
  teaser: string;
  content: string;
}

interface PostsData {
  seedPosts: Post[];
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const postsFilePath = join(__dirname, "../data/posts.json");

export function loadPosts(): Post[] {
  const fileContent = readFileSync(postsFilePath, "utf-8");
  const postsData = JSON.parse(fileContent) as PostsData;

  return postsData.seedPosts;
}

export function savePosts(posts: Post[]): void {
  const postsData: PostsData = {
    seedPosts: posts,
  };

  writeFileSync(postsFilePath, JSON.stringify(postsData, null, 2), "utf-8");
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

export function findPostBySlug(slug: string): Post | undefined {
  const posts = loadPosts();
  return posts.find((p) => slugify(p.title) === slug);
}

export function addPost(post: Post): void {
  const posts = loadPosts();
  posts.push(post);
  savePosts(posts);
}

export function updatePost(slug: string, changes: Partial<Post>): void {
  const posts = loadPosts();
  const postIndex = posts.findIndex((p) => slugify(p.title) === slug);

  if (postIndex !== -1) {
    posts[postIndex] = {
      ...posts[postIndex],
      ...changes,
    };
    savePosts(posts);
  }
}

export function deletePost(slug: string): void {
  const posts = loadPosts();
  const index = posts.findIndex((p) => slugify(p.title) === slug);
  if (index !== -1) {
    posts.splice(index, 1);
    savePosts(posts);
  }
}
