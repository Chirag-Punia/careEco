import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import websiteRoutes from "./routes/websiteRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import { protect } from "./middleware/auth.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/websites", protect, websiteRoutes);
app.use("/api/products", protect, productRoutes);
app.use("/api/email", emailRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
