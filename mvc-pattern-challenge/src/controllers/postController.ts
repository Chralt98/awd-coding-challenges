import { Request, Response } from "express";
import {
  formatDate,
  findPostBySlug,
  findPostById,
} from "../models/postModel.js";

export async function showPost(req: Request<{ slug: string }>, res: Response) {
  const slug = Array.isArray(req.params.slug)
    ? req.params.slug[0]
    : req.params.slug;

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    res.status(400).send("Invalid slug");
    return;
  }

  try {
    const post = await findPostBySlug(slug);
    if (!post) {
      res.status(404).send("Post not found");
      return;
    }
    res.render("post.html", {
      post: { ...post, createdAt: formatDate(post.createdAt) },
    });
  } catch (error) {
    console.error("Error finding post by slug:", error);
    res.status(500).send("Error retrieving post");
  }
}

export async function showPostById(
  req: Request<{ id: string }>,
  res: Response,
) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  try {
    const post = await findPostById(id);
    if (!post) {
      res.status(404).send("Post not found");
      return;
    }
    res.render("post.html", {
      post: { ...post, createdAt: formatDate(post.createdAt) },
    });
  } catch (error) {
    console.error("Error finding post by ID:", error);
    res.status(500).send("Error retrieving post");
  }
}
