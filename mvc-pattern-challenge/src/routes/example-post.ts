import express from "express";
import * as examplePostController from "../controllers/examplePostController";

const router = express.Router();

router.get("/", examplePostController.showExamplePost);

export default router;
