import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const colorThemes = {
  "purple-blue": {
    primary: "#7e22ce",
    primaryDark: "#6b21a8",
    secondary: "#3b82f6",
  },
  "green-teal": {
    primary: "#16a34a",
    primaryDark: "#15803d",
    secondary: "#0d9488",
  },
  "orange-red": {
    primary: "#f97316",
    primaryDark: "#ea580c",
    secondary: "#dc2626",
  },
};

export async function generateWebsite(data) {
  const { businessName, description, colorTheme, layout, products } = data;
  const selectedColorTheme = colorThemes[colorTheme];

  try {
    // Set the EJS template based on the layout selection
    let layoutTemplate = "index.ejs"; // Default template
    if (layout === "luxury") {
      layoutTemplate = "luxury.ejs";
    } else if (layout === "minimal") {
      layoutTemplate = "minimal.ejs";
    } else if (layout === "modern") {
      layoutTemplate = "modern.ejs";
    }

    const updatedProducts = products.map((product) => {
      if (product.imageUrl) {
        product.imageUrl = product.imageUrl;
      }
      return product;
    });

    // Render the appropriate EJS template
    const indexHtml = await ejs.renderFile(
      path.join(__dirname, `../templates/${layoutTemplate}`), // Dynamically load the correct template
      {
        businessName,
        description,
        colorTheme: selectedColorTheme,
        layout,
        products: updatedProducts,
      }
    );

    // Read the JS file for the website
    const scriptJs = await fs.promises.readFile(
      path.join(__dirname, "../templates/script.js"),
      "utf-8"
    );

    return {
      files: {
        "index.html": indexHtml,
        "script.js": scriptJs,
      },
    };
  } catch (error) {
    throw new Error(`Failed to generate website: ${error.message}`);
  }
}