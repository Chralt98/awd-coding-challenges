import express from "express";
import nunjucks from "nunjucks";
import path from "node:path";
import { fileURLToPath } from "node:url";
import homeRouter from "./routes/homeRoutes.js";
import postsRouter from "./routes/postRoutes.js";
import contactRouter from "./routes/contactRoutes.js";
import aboutRouter from "./routes/aboutRoutes.js";
import examplePostRouter from "./routes/examplePostRoutes.js";

const app = express();
export const PAGE_SIZE = 2;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const assetsDir = path.join(projectRoot, "src", "assets");
const cssDir = path.join(projectRoot, "src", "css");

nunjucks.configure(projectRoot, { autoescape: true, express: app });
app.use("/assets", express.static(assetsDir));
app.use("/css", express.static(cssDir));

app.use("/", homeRouter);

app.use("/posts", postsRouter);

app.use("/contact", contactRouter);

app.use("/about", aboutRouter);

app.use("/example-post", examplePostRouter);

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
