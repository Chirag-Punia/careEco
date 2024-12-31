import ejs from "ejs";
import { color } from "framer-motion";
import path from "path";
import { fileURLToPath } from "url";

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
    const updatedProducts = products.map((product) => {
      if (product.imageUrl) {
        product.imageUrl = product.imageUrl;
      }
      return product;
    });

    console.log(updatedProducts[0].imageUrl);
    const indexHtml = await ejs.renderFile(
      path.join(__dirname, "../templates/index.ejs"),
      {
        businessName,
        description,
        colorTheme: selectedColorTheme,
        layout,
        products: updatedProducts,
      }
    );
    return {
      files: {
        "index.html": indexHtml,
      },
    };
  } catch (error) {
    throw new Error(`Failed to generate website: ${error.message}`);
  }
}
