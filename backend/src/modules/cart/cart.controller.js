import { ProductModel } from "../../../db/models/product.model.js";

// Simple in-memory carts keyed by user id for demo purposes
const userIdToCart = new Map();

const normalizeCart = async (cart) => {
  const productIds = cart.map((i) => i.product?._id).filter(Boolean);
  const products = await ProductModel.find({ _id: { $in: productIds } }).lean();
  const idToProduct = new Map(products.map((p) => [String(p._id), p]));

  let total = 0;
  const items = cart.map((item) => {
    const pid = String(item.product?._id);
    const dbp = idToProduct.get(pid);
    const price = dbp?.price ?? 0;
    const title = dbp?.title ?? item.product?.title ?? "Product";
    const quantity = Number(item.quantity) || 0;
    total += price * quantity;
    return {
      product: { _id: pid, title, price },
      quantity,
    };
  });

  return { items, total };
};

export const getCart = async (req, res) => {
  if (!req.user?._id) return res.status(401).json({ message: "Unauthorized" });
  const cart = userIdToCart.get(req.user._id) || [];
  const normalized = await normalizeCart(cart);
  res.json(normalized);
};

export const addToCart = async (req, res) => {
  if (!req.user?._id) return res.status(401).json({ message: "Unauthorized" });
  const { productId, quantity } = req.body;
  if (!productId || !quantity || quantity < 1) return res.status(400).json({ message: "Invalid payload" });

  const product = await ProductModel.findById(productId).lean();
  if (!product) return res.status(404).json({ message: "Product not found" });

  const cart = userIdToCart.get(req.user._id) || [];
  const idx = cart.findIndex((i) => String(i.product?._id) === String(productId));
  if (idx >= 0) {
    cart[idx].quantity += Number(quantity);
  } else {
    cart.push({ product: { _id: String(product._id) }, quantity: Number(quantity) });
  }
  userIdToCart.set(req.user._id, cart);
  const normalized = await normalizeCart(cart);
  res.json({ message: "Added", ...normalized });
};

export const updateCart = async (req, res) => {
  if (!req.user?._id) return res.status(401).json({ message: "Unauthorized" });
  const { productId, quantity } = req.body;
  if (!productId || !quantity || quantity < 1) return res.status(400).json({ message: "Invalid payload" });
  const cart = userIdToCart.get(req.user._id) || [];
  const idx = cart.findIndex((i) => String(i.product?._id) === String(productId));
  if (idx === -1) return res.status(404).json({ message: "Item not found" });
  cart[idx].quantity = Number(quantity);
  userIdToCart.set(req.user._id, cart);
  const normalized = await normalizeCart(cart);
  res.json({ message: "Updated", ...normalized });
};

export const removeFromCart = async (req, res) => {
  if (!req.user?._id) return res.status(401).json({ message: "Unauthorized" });
  const { productId } = req.params;
  const cart = userIdToCart.get(req.user._id) || [];
  const next = cart.filter((i) => String(i.product?._id) !== String(productId));
  userIdToCart.set(req.user._id, next);
  const normalized = await normalizeCart(next);
  res.json({ message: "Removed", ...normalized });
};
