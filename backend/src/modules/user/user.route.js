import { Router } from "express";
import { deleteUser, getAllUsers, register, updateUser, login, deleteAllUsers, verifyEmail, verifyUserToken, resendVerification } from "./user.controller.js";
import express from "express";
import { checkEmail } from "../../middleware/checkEmail.js";
import { verifyEmailToken, verifyToken } from "../../middleware/verifyToken.js";

export const userRoutes = Router();

userRoutes.use(express.json());


userRoutes.get("/users", getAllUsers);

userRoutes.post("/users/register", checkEmail, register);

userRoutes.post("/users/login" ,login);

userRoutes.put("/users/:id", updateUser);

userRoutes.delete("/users/:id", deleteUser);

userRoutes.delete("/deleteAllUsers", deleteAllUsers);

userRoutes.get("/users/verify/:token", verifyEmailToken ,verifyEmail);

// New routes for protected route functionality
userRoutes.get("/users/verify-token", verifyToken, verifyUserToken);

userRoutes.post("/users/resend-verification", resendVerification);




