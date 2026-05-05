import { Request, Response } from "express";
import { formatDate, slugify, loadPosts } from "../models/postModel.js";

export function showAdmin(req: Request, res: Response) {
  const posts = loadPosts();
  const view = posts.map((post) => ({
    ...post,
    slug: slugify(post.title),
    createdAt: formatDate(post.createdAt),
  }));

  res.render("admin.html", {
    posts: view,
  });
}

export function showNewPostForm(req: Request, res: Response) {
  res.render("postForm.html");
}

export function createNewPost(req: Request, res: Response) {}

export function showEditPostForm(req: Request, res: Response) {}

export function updatePost(req: Request, res: Response) {}

export function deletePost(req: Request, res: Response) {}
