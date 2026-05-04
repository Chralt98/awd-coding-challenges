import { type Request, type Response } from "express";

export function showAbout(req: Request, res: Response) {
  res.render("about.html");
}
