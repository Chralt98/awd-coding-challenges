import { Request, Response } from "express";
import { loadPosts, addViewMetadata } from "../models/postModel.js";

export function showAdmin(req: Request, res: Response) {
  const posts = loadPosts();
  const view = addViewMetadata(posts);

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
