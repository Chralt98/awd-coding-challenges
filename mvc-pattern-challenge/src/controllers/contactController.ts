import { type Request, type Response } from "express";

export function showContact(req: Request, res: Response) {
  res.render("contact.html");
}
