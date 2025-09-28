import express from "express";
import { dbConnection } from "./db/dbConnection.js";
import mongoose from "mongoose";
import { userRoutes } from "./src/modules/user/user.route.js";
import cors from "cors";
import { sendMail } from "./src/utilities/Email/sendMail.js";
import { productRoutes } from "./src/modules/product/product.route.js";
import { cartRoutes } from "./src/modules/cart/cart.route.js";


const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(userRoutes);
app.use(productRoutes);
app.use(cartRoutes);

// sendMail();
dbConnection;

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
