import express from "express";
import * as postController from "../controllers/postController";

const router = express.Router();

router.get("/:slug", postController.showPost);
router.get("/:id", postController.showPostById);

export default router;
