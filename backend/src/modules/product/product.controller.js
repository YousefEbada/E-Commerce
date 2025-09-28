import { ProductModel } from "../../../db/models/product.model.js";

export const listProducts = async (req, res) => {
  const products = await ProductModel.find().sort({ createdAt: -1 });
  res.json(products);
};

export const createProduct = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can create products" });
    }

    const { title, description, price } = req.body;
    if (!title || !description || price == null) {
      return res.status(400).json({ message: "title, description, price are required" });
    }

    const created = await ProductModel.create({ title, description, price });
    res.status(201).json({ message: "Product created", product: created });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e?.message });
  }
};
