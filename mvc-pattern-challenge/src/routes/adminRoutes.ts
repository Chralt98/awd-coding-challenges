import express from "express";
import * as adminController from "../controllers/adminController";

const router = express.Router();

router.get("/", adminController.showAllPosts);

export default router;
