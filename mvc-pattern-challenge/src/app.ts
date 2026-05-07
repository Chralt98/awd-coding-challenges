import express from "express";
import nunjucks from "nunjucks";
import path from "node:path";
import { fileURLToPath } from "node:url";
import homeRouter from "./routes/homeRoutes.js";
import postsRouter from "./routes/postRoutes.js";
import contactRouter from "./routes/contactRoutes.js";
import aboutRouter from "./routes/aboutRoutes.js";
import examplePostRouter from "./routes/examplePostRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import { connectDB, closeDB } from "./db/database.js";
import methodOverride from "method-override";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const assetsDir = path.join(projectRoot, "src", "assets");
const cssDir = path.join(projectRoot, "src", "css");
const viewsDir = path.join(projectRoot, "src", "views");

nunjucks.configure(viewsDir, {
  autoescape: true,
  express: app,
});
app.use("/assets", express.static(assetsDir));
app.use("/css", express.static(cssDir));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// parse form bodies with method override support
app.use((req, _res, next) => {
  if (req.body && typeof req.body === "object" && "_method" in req.body) {
    req.method = req.body._method.toUpperCase();
    delete req.body._method;
  }
  next();
});

app.use("/", homeRouter);

app.use("/posts", postsRouter);

app.use("/contact", contactRouter);

app.use("/about", aboutRouter);

app.use("/example-post", examplePostRouter);

app.use("/admin", adminRouter);

const port = Number(process.env.PORT) || 3000;

await connectDB();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received. Closing database connection...");
  await closeDB();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Closing database connection...");
  await closeDB();
  process.exit(0);
});
