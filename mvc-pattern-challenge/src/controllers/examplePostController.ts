import { type Request, type Response } from "express";

export function showExamplePost(req: Request, res: Response) {
  res.render("postExample.html");
}
