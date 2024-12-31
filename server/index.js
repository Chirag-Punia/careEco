import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import mongoose from "mongoose";
import { generateWebsite } from "./services/websiteGenerator.js";
import { uploadToS3 } from "./services/s3Service.js";
import Product from "./models/productModel.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const storage = multer.memoryStorage();
const upload = multer({ storage }).array("images");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.post("/api/generate-website", upload, async (req, res) => {
  try {
    const websiteData = req.body;
    const uploadedImages = [];

    if (req.files && websiteData.products) {
      for (let i = 0; i < websiteData.products.length; i++) {
        const product = websiteData.products[i];
        if (req.files[i] && product.image === undefined) {
          const imageBuffer = req.files[i].buffer;

          const imageKey = `${websiteData.businessName
            .toLowerCase()
            .replace(/\s+/g, "-")}/images/${product.name
            .toLowerCase()
            .replace(/\s+/g, "-")}.jpg`;

          const imageUrl = await uploadToS3(
            { [imageKey]: imageBuffer },
            websiteData.businessName,
            "image/jpeg"
          );

          uploadedImages.push(imageUrl);
          product.imageUrl = imageUrl;

          const newProduct = new Product({
            name: product.name,
            description: product.description,
            price: product.price,
            imageUrl: imageUrl,
            businessName: websiteData.businessName,
          });

          await newProduct.save();
        }
      }
    }

    const { files } = await generateWebsite(websiteData);

    const websiteUrl = await uploadToS3(files, websiteData.businessName);

    res.json({ success: true, websiteUrl, images: uploadedImages });
  } catch (error) {
    console.error("Error generating website:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.use("/api/auth", authRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
