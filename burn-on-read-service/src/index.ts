import express from "express";
import nunjucks from "nunjucks";
import { logger, ensureLogFile, LOG_FILE } from "./logger";
import messagesRouter from "./routes/messages";

const app = express();
const port = process.env.PORT || "3000";

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

await ensureLogFile(LOG_FILE);
app.use(logger);

express.urlencoded({ extended: true }); // add body parser middleware for form data
app.use("/messages", messagesRouter);

app.get("/", (req, res) => {
  res.render("index.html");
});

app.post("/", (req, res) => {
  const { message } = req.body;
  if (!message) {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  res.render("index.html", { link });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
