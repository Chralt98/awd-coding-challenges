import express from "express";
import nunjucks from "nunjucks";
import { logger, ensureLogFile, LOG_FILE } from "./logger";

const app = express();
const port = process.env.PORT || "3000";

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

await ensureLogFile(LOG_FILE);
app.use(logger);

app.get("/", (req, res) => {
  res.render("index.html");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
