import { Request, Response } from "express";

export function showAllPosts(req: Request, res: Response) {
  res.render("admin.html");
}
