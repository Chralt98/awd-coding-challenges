import express from "express";
import nunjucks from "nunjucks";
import { logger, ensureLogFile, LOG_FILE } from "./logger.js";
import messagesRouter from "./routes/messages.js";

const app = express();
const port = process.env.PORT || "3000";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

await ensureLogFile(LOG_FILE);
app.use(logger);
app.use("/messages", messagesRouter);

app.get("/", (req, res) => {
  res.render("index.html");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
