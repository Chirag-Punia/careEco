import Product from "../models/productModel.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user._id });
    res.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createProduct = async (req, res) => {
  const { name, description, price, imageUrl } = req.body;

  try {
    const newProduct = new Product({ name, description, price, imageUrl, userId: req.user._id });
    await newProduct.save();
    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
