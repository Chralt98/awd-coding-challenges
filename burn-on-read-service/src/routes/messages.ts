import { Router } from "express";

const router = Router();

router.get("/show", (req, res) => {
  const uniqueLink = req.query.uniqueLink;

  if (typeof uniqueLink !== "string" || !uniqueLink) {
    res.redirect("/");
    return;
  }

  res.render("message-created.html", { uniqueLink });
});

router.get("/read/:hash", (req, res) => {
  const { hash } = req.params;
  res.render("message-created.html", {
    uniqueLink: "http://example.com/unique-link",
  });
});

router.post("/save", (req, res) => {
  const { message } = req.body;
  if (!message) {
    res.status(400).render("index.html", {
      error: "Message is required",
    });
    return;
  }
  const uniqueLink = "http://example.com/unique-link"; // In a real implementation, generate a unique link for the message

  res.redirect(`/messages/show?uniqueLink=${encodeURIComponent(uniqueLink)}`);
});

export default router;
