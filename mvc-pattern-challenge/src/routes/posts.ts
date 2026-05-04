import express, { type Request, type Response } from "express";
import { loadPosts, formatDate, slugify } from "../app.js";

const router = express.Router();

router.get("/:slug", (req: Request, res: Response) => {
  const slug = Array.isArray(req.params.slug)
    ? req.params.slug[0]
    : req.params.slug;

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    res.status(400).send("Invalid slug");
    return;
  }

  const posts = loadPosts();
  const post = posts.find((p) => slugify(p.title) === slug);
  if (!post) {
    res.status(404).send("Post not found");
    return;
  }
  res.render("post.html", {
    post: { ...post, createdAt: formatDate(post.createdAt) },
  });
});

export default router;
