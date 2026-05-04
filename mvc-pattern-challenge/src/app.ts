import express from "express";
import nunjucks from "nunjucks";
import path from "node:path";
import { fileURLToPath } from "node:url";
import homeRouter from "./routes/home.js";
import postsRouter from "./routes/posts.js";
import contactRouter from "./routes/contact.js";
import aboutRouter from "./routes/about.js";
import examplePostRouter from "./routes/example-post.js";

interface Post {
  title: string;
  image: string;
  author: string;
  createdAt: number;
  teaser: string;
  content: string;
}

const app = express();
export const PAGE_SIZE = 2;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const assetsDir = path.join(projectRoot, "src", "assets");
const cssDir = path.join(projectRoot, "src", "css");

nunjucks.configure(projectRoot, { autoescape: true, express: app });
app.use("/assets", express.static(assetsDir));
app.use("/css", express.static(cssDir));
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

app.get("/", homeRouter);

app.get("/posts", postsRouter);

app.get("/contact", contactRouter);

app.get("/about", aboutRouter);

app.get("/example-post", examplePostRouter);

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
