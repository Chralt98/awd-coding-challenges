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

const seedPosts: Post[] = [
  {
    title: "Black: The Absence, Not the Presence, of Color",
    image: "colorful-umbrella.jpg",
    author: "Peter Parker",
    createdAt: 1743120000,
    teaser:
      "Scientifically, black is not a color but rather the absence of all colors, occurring when an object absorbs nearly all light wavelengths instead of reflecting them.",
    content:
      "<p>When you think about the rainbow, you see a vibrant spectrum of hues. But black does not appear in that spectrum the same way red or blue does.</p><p>From a scientific perspective, black is usually the absence of visible light, not a reflected wavelength.</p>",
  },
  {
    title: "Flowers: Nature's Muse for Design",
    image: "flowers.jpg",
    author: "Peter Parker",
    createdAt: 1745452800,
    teaser:
      "Flowers inspire design with their color palettes, structure, and balance between repetition and variation.",
    content:
      "<p>Designers borrow from flowers all the time: layered composition, contrasting accents, and natural hierarchy.</p>",
  },
  {
    title: "UDesign's Harmony: Core Purpose and Supporting Details",
    image: "sailing.jpg",
    author: "Peter Parker",
    createdAt: 1748736000,
    teaser:
      "Strong design starts with one clear core idea, then adds supporting details that reinforce it.",
    content:
      "<p>A useful mental model is major and minor elements. Major elements communicate the main point, minor elements support it without stealing focus.</p>",
  },
];

export function loadPosts(): Post[] {
  return seedPosts;
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

export function findPostBySlug(slug: string): Post | undefined {
  const posts = loadPosts();
  return posts.find((p) => slugify(p.title) === slug);
}

export function addPost(post: Post): void {
  const posts = loadPosts();
  posts.push(post);
}

export function updatePost(slug: string, changes: Partial<Post>): void {
  const post = findPostBySlug(slug);
  if (post) {
    Object.assign(post, changes);
  }
}

export function deletePost(slug: string): void {
  const posts = loadPosts();
  const index = posts.findIndex((p) => slugify(p.title) === slug);
  if (index !== -1) {
    posts.splice(index, 1);
  }
}
