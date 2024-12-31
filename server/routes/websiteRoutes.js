import express from "express";
import { generateWebsiteController, getUserWebsitesController, deleteWebsiteController } from "../controllers/websiteController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Route to generate a website (protected)
router.post("/generate-website", protect, generateWebsiteController);

// Route to get user websites (protected)
router.get("/", protect, getUserWebsitesController);

// Route to delete a website by ID (protected)
router.delete("/:id", protect, deleteWebsiteController);

export default router;
