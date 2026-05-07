import express from "express";
import * as adminController from "../controllers/adminController";

const router = express.Router();

router.get("/", adminController.showAdmin);
router.get("/posts/new", adminController.showNewPostForm);
router.post("/posts", adminController.createNewPost);
router.get("/posts/:id", adminController.showEditPostForm);
router.put("/posts/:id", adminController.updatePost);
router.delete("/posts/:id", adminController.deletePost);

export default router;
