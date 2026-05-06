import { Request, Response } from "express";
import {
  loadPosts,
  addViewMetadata,
  Post,
  addPost,
} from "../models/postModel.js";

export async function showAdmin(_req: Request, res: Response) {
  const posts = await loadPosts();
  const view = addViewMetadata(posts);

  res.render("admin.html", {
    posts: view,
  });
}

export function showNewPostForm(_req: Request, res: Response) {
  res.render("postForm.html");
}

export async function createNewPost(req: Request, res: Response) {
  const { title, image, author, teaser, content } = req.body;

  if (!title || !image || !author || !teaser || !content) {
    res.status(400).send("All fields are required.");
    return;
  }

  const newPost = {
    title,
    image,
    author,
    teaser,
    content,
    createdAt: Math.floor(Date.now() / 1000),
  } as Post;

  await addPost(newPost);

  res.redirect("/admin");
}

export function showEditPostForm(req: Request, res: Response) {}

export function updatePost(req: Request, res: Response) {}

export function deletePost(req: Request, res: Response) {}
