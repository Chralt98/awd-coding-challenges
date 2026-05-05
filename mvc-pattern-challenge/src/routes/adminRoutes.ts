import express from "express";
import * as adminController from "../controllers/adminController";

const router = express.Router();

router.get("/", adminController.showAdmin);
router.get("/posts/new", adminController.showNewPostForm);
router.post("/posts", adminController.createNewPost);
router.get("/posts/:slug/edit", adminController.showEditPostForm);
router.post("/posts/:slug", adminController.updatePost);
router.post("/posts/:slug/delete", adminController.deletePost);

export default router;
