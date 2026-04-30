import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("message-created.html", {
    uniqueLink: "http://example.com/unique-link",
  });
});

export default router;
