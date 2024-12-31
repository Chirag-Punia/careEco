import Website from "../models/websiteModel.js"; // Assuming Website is a model for your websites
import { generateWebsite } from "../services/websiteGenerator.js"; 
// Controller for generating a website
export const generateWebsiteController = async (req, res) => {
  try {
    const { businessName, description, colorTheme, layout, products } = req.body;

    // Generate website data (HTML & JS files)
    const websiteData = await generateWebsite({ businessName, description, colorTheme, layout, products });

    // Create a new website in the database
    const newWebsite = new Website({
      user: req.user.id, // Assuming `req.user.id` is the authenticated user's ID
      businessName,
      description,
      colorTheme,
      layout,
      products,
      files: websiteData.files, // Store the generated files (HTML, JS)
    });

    // Save the website to the database
    await newWebsite.save();

    res.status(201).json({
      message: "Website generated and saved successfully",
      website: newWebsite,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Failed to generate website",
    });
  }
};

// Controller for fetching user websites
export const getUserWebsitesController = async (req, res) => {
  try {
    const userId = req.user.id; // Get the user ID from the authenticated user
    const websites = await Website.find({ user: userId }); // Fetch websites for the user from the database

    res.status(200).json(websites);
  } catch (error) {
    res.status(500).json({
      error: error.message || "Failed to fetch websites",
    });
  }
};

// Controller for deleting a website
export const deleteWebsiteController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Get the user ID from the authenticated user

    // Find the website and ensure it belongs to the user
    const website = await Website.findOne({ _id: id, user: userId });
    if (!website) {
      return res.status(404).json({
        error: "Website not found or unauthorized",
      });
    }

    // Delete the website
    await Website.findByIdAndDelete(id);

    res.status(200).json({
      message: "Website deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Failed to delete website",
    });
  }
};
