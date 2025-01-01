import express from "express";
import {
  generateWebsiteController,
  getUserWebsitesController,
  deleteWebsiteController,
} from "../controllers/websiteController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../config/multer.js"; // Import configured multer instance

const router = express.Router();

// Route to generate a website (protected, with file upload)
router.post(
  "/generate-website",
  protect,
  upload.array("images"), // Apply multer's array middleware
  generateWebsiteController
);

// Route to get user websites (protected)
router.get("/", protect, getUserWebsitesController);

// Route to delete a website by ID (protected)
router.delete("/:id", protect, deleteWebsiteController);

export default router;
