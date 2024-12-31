import express from "express";
import { generateWebsiteController } from "../controllers/websiteController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/generate-website", protect, generateWebsiteController);

export default router;
