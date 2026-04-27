import type { Bookmark } from "../types/index.d.ts";
import express from "express";

const app = express();
const port = 3000;

let bookmarks: Bookmark[] = [
  { id: 1, url: "https://expressjs.com", title: "Express.js", tag: "node" },
  {
    id: 2,
    url: "https://typescriptlang.org",
    title: "TypeScript",
    tag: "typescript",
  },
  { id: 3, url: "https://developer.mozilla.org", title: "MDN Web Docs" },
];

app.use(express.json()); // add body parser middleware

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/bookmarks", (req, res) => {
  const tagFilter = req.query.tag as string | undefined;
  if (tagFilter) {
    const filteredBookmarks = bookmarks.filter((b) => b.tag === tagFilter);
    res.json(filteredBookmarks);
    return;
  }
  res.json(bookmarks);
});

app.get("/bookmarks/:id", (req, res) => {
  const bookmark = bookmarks.find((b) => String(b.id) === req.params.id);
  if (!bookmark) {
    res.status(404).json({ error: "Bookmark not found" });
    return;
  }

  res.json(bookmark);
});

app.post("/bookmarks", (req, res) => {
  const newId = bookmarks.length + 1;
  if (!req.body) {
    res.status(404).json({ error: "Request body not found" });
    return;
  }
  if (!req.body.url) {
    res.status(400).json({ error: "URL is required" });
    return;
  }
  if (!req.body.title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }
  if (!req.body.tag) {
    res.status(400).json({ error: "Tag is required" });
    return;
  }
  if (typeof req.body.url !== "string") {
    res.status(400).json({ error: "URL must be a string" });
    return;
  }
  if (typeof req.body.title !== "string") {
    res.status(400).json({ error: "Title must be a string" });
    return;
  }
  if (typeof req.body.tag !== "string") {
    res.status(400).json({ error: "Tag must be a string" });
    return;
  }
  const newBookmark = {
    id: newId,
    url: req.body.url,
    title: req.body.title,
    tag: req.body.tag,
  } as Bookmark;
  bookmarks.push(newBookmark);

  res.status(201).json(newBookmark);
});

app.delete("/bookmarks/:id", (req, res) => {
  const bookmarkIndex = bookmarks.findIndex(
    (b) => String(b.id) === req.params.id,
  );
  if (bookmarkIndex === -1) {
    res.status(404).json({ error: "Bookmark not found" });
    return;
  }
  // const deletedBookmark = bookmarks.splice(bookmarkIndex, 1)[0];
  res.status(204).json();
});

app.patch("/bookmarks/:id", (req, res) => {
  const bookmarkIndex = bookmarks.findIndex(
    (b) => String(b.id) === req.params.id,
  );
  if (bookmarkIndex === -1) {
    res.status(404).json({ error: "Bookmark not found" });
    return;
  }
  const bookmark = bookmarks[bookmarkIndex];
  if (!bookmark) {
    res.status(404).json({ error: "Bookmark not found" });
    return;
  }
  if (req.body.url && typeof req.body.url === "string") {
    bookmark.url = req.body.url;
  }
  if (req.body.title && typeof req.body.title === "string") {
    bookmark.title = req.body.title;
  }
  if (req.body.tag && typeof req.body.tag === "string") {
    bookmark.tag = req.body.tag;
  }
  bookmarks[bookmarkIndex] = bookmark;
  res.json(bookmark);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
