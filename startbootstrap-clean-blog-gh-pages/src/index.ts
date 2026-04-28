import express from "express";
import nunjucks from "nunjucks";
import blogPosts from "../assets/blog-posts.json";

const app = express();
const port = 3000;

function slugify(title: string): string {
  // Declare a function named slugify.
  // It accepts one argument, title, which must be a string.
  // It returns a string.

  return (
    title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      // Remove punctuation and other unwanted characters.
      // Keeps:
      // - word characters: letters, numbers, underscores
      // - whitespace
      // - existing hyphens
      // Example: "hello, world!" -> "hello world"
      .trim()
      // Remove whitespace from the beginning and end.
      // Example: "  hello world  " -> "hello world"
      .replace(/\s+/g, "-")
      // Replace one or more whitespace characters with a single hyphen.
      // Example: "hello   world" -> "hello-world"
      .replace(/-+/g, "-")
    // Collapse multiple hyphens into one hyphen.
    // Example: "hello---world" -> "hello-world"
  );
}
function formatDate(createdAt: number): string {
  return new Date(createdAt * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

app.use("/css", express.static("./css"));
app.use("/js", express.static("./js"));
app.use("/assets", express.static("./assets"));

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.get(["/", "/index.html"], (req, res) => {
  const posts = blogPosts.map((post) => ({
    ...post,
    slug: slugify(post.title),
    date: formatDate(post.createdAt),
  }));
  res.render("index.html", { posts });
});

app.get("/about.html", (req, res) => {
  res.render("about.html");
});

app.get("/contact.html", (req, res) => {
  res.render("contact.html");
});

app.get("/post/:title", (req, res) => {
  const post = blogPosts.find(
    (post) => slugify(post.title) === req.params.title,
  );

  if (!post) {
    res.status(404).send("Post not found");
    return;
  }

  res.render("post.html", {
    post: {
      ...post,
      date: formatDate(post.createdAt),
    },
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
