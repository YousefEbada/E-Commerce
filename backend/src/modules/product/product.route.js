import { Router } from "express";
import { listProducts, createProduct } from "./product.controller.js";
import { verifyToken } from "../../middleware/verifyToken.js";

export const productRoutes = Router();

productRoutes.get("/products", listProducts);
productRoutes.post("/products", verifyToken, createProduct);
