import { Router } from "express";
import { addToCart, getCart, removeFromCart, updateCart } from "./cart.controller.js";
import { verifyToken } from "../../middleware/verifyToken.js";

export const cartRoutes = Router();

cartRoutes.get("/cart", verifyToken, getCart);
cartRoutes.post("/cart/add", verifyToken, addToCart);
cartRoutes.patch("/cart/update", verifyToken, updateCart);
cartRoutes.delete("/cart/remove/:productId", verifyToken, removeFromCart);
