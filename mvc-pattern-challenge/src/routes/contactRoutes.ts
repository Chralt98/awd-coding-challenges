import express from "express";
import * as contactController from "../controllers/contactController";

const router = express.Router();

router.get("/", contactController.showContact);

export default router;
