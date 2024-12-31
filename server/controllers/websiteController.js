import Website from "../models/Website.js"; // Assuming Website is a model for your websites

// Controller for generating a website
export const generateWebsiteController = async (req, res) => {
  try {
    const { businessName, description, colorTheme, layout, products } = req.body;

    // Logic to generate website
    // Example: Call to a function that creates the website and stores it in DB
    const website = await generateWebsiteData(businessName, description, colorTheme, layout, products); // Assumes this function exists

    res.status(201).json({
      message: "Website generated successfully",
      website,
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
