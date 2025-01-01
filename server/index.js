import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import mongoose from "mongoose";
import { generateWebsite } from "./services/websiteGenerator.js";
import { uploadToS3 } from "./services/s3Service.js";
import Product from "./models/productModel.js";
import Website from "./models/websiteModel.js";
import authRoutes from "./routes/authRoutes.js";
import { protect } from "./middleware/auth.js";
import { deleteFilesFromS3 } from "./services/s3Service.js";
import Stripe from "stripe";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const storage = multer.memoryStorage();
const upload = multer({ storage }).array("images");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.XEMAIL,
    pass: process.env.PASS,
  },
});

app.post("/api/email/send-email", async (req, res) => {
  const { name, email, message, businessName } = req.body;

  try {
    const website = await Website.findOne({ businessName });

    if (!website) {
      return res.status(404).json({ success: false, message: "Website not found" });
    }

    const recipientEmail = website.email;

    if (!recipientEmail) {
      return res.status(400).json({ success: false, message: "Email address not found" });
    }

    const mailOptions = {
      from: process.env.XEMAIL,
      to: recipientEmail,
      subject: "New Contact Form Message",
      text: `You have a new message from ${name} (${email}):\n\n${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ success: false, message: "Error sending email" });
      }
      res.status(200).json({ success: true, message: "Email sent successfully" });
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


app.post("/api/create-payment-intent", async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/webistes/generate-website", protect, upload, async (req, res) => {
  try {
    const websiteData = req.body;
    console.log(websiteData)

    const uploadedImages = [];

    if (req.files && websiteData.products) {
      for (let i = 0; i < websiteData.products.length; i++) {
        const product = websiteData.products[i];
        if (req.files[i] && !product.image) {
          const imageBuffer = req.files[i].buffer;

          const imageKey = `${websiteData.businessName
            .toLowerCase()
            .replace(/\s+/g, "-")}/images/${Date.now()}-${product.name
            .toLowerCase()
            .replace(/\s+/g, "-")}.jpg`;

          const imageUrl = await uploadToS3(
            { [imageKey]: imageBuffer },
            websiteData.businessName,
            "image/jpeg"
          );

          uploadedImages.push(imageUrl[imageKey]);
          product.imageUrl = imageUrl;
          imageUrl;

          const newProduct = new Product({
            name: product.name,
            description: product.description,
            price: product.price,
            imageUrl: Object.values(imageUrl)[0],
            businessName: websiteData.businessName,
            userId: req.user._id,
          });

          const savedProduct = await newProduct.save();
          product._id = savedProduct._id;
        }
      }
    }

    const { files, websiteId } = await generateWebsite(
      websiteData,
      req.user._id
    );

    const uploadedFiles = await uploadToS3(files, websiteData.businessName);

    const websiteUrl = uploadedFiles["index.html"];
    const scriptJsUrl = uploadedFiles["script.js"];

    const website = new Website({
      userId: req.user._id,
      businessName: websiteData.businessName,
      email: websiteData.email,
      phone: websiteData.phone,
      websiteUrl,
      scriptJsUrl,
      images: uploadedImages,
      files: {
        indexHtmlUrl: websiteUrl,
        scriptJsUrl: scriptJsUrl,
      },
    });

    await website.save();

    res.json({
      success: true,
      websiteUrl,
      scriptJsUrl,
      images: uploadedImages,
    });
  } catch (error) {
    console.error("Error generating website:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/products", protect, async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user._id });
    res.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/products/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById({ _id: productId });
    product;

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

app.use("/api/auth", authRoutes);
app.get("/api/websites", protect, async (req, res) => {
  try {
    req.user._id;
    const websites = await Website.find({ userId: req.user._id });
    res.json({ success: true, websites });
  } catch (error) {
    console.error("Error fetching websites:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
app.delete("/api/websites/:id", protect, async (req, res) => {
  try {
    const websiteId = req.params.id;

    const website = await Website.findById(websiteId);
    if (!website) {
      return res
        .status(404)
        .json({ success: false, message: "Website not found" });
    }

    if (website.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const fileKeys = [
      website.files.indexHtmlUrl.split(process.env.AWS_S3_BUCKET)[1],
      website.files.scriptJsUrl.split(process.env.AWS_S3_BUCKET)[1],
      ...website.images.map(
        (imageUrl) => imageUrl.split(process.env.AWS_S3_BUCKET)[1]
      ),
    ];

    await deleteFilesFromS3(fileKeys);

    await Website.findByIdAndDelete(websiteId);

    res.json({
      success: true,
      message: "Website and files deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting website:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});