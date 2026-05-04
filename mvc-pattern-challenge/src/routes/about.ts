import express from "express";
import * as aboutController from "../controllers/aboutController";

const router = express.Router();

router.get("/", aboutController.showAbout);

export default router;
