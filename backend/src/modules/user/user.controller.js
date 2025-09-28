import { UserModel } from "../../../db/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendMail } from "../../utilities/Email/sendMail.js";
import { Query } from "mongoose";

const getAllUsers = async (req, res) => {
  const users = await UserModel.find();
  res.json({ message: "All Users", users });
};

const register = async (req, res) => {
  try {
    req.body.password = await bcrypt.hashSync(req.body.password, 10);
    const addedUser = await UserModel.create(req.body);
    
    if (!addedUser) {
      return res.status(400).json({ message: "Error Adding User" });
    }
    
    // Calculate age
    const age = Math.floor((new Date().getTime() - new Date(addedUser.birthDate).getTime()) /1000 /60 /60 /24 /365);
    addedUser.age = age;
    await addedUser.save();
    
    // Remove password from response
    const userResponse = addedUser.toObject();
    delete userResponse.password;
    
    // Send verification email
    sendMail(req.body.email);
    
    res.json({ message: "User Added Successfully", addedUser: userResponse });
  } catch (err) {
    console.error("Registration error:", err);
    if (err.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const exist = await UserModel.findOne({ email: req.body.email });
    if (!exist) {
      return res.status(404).json({ message: "User not found, please register" });
    }

    const match = bcrypt.compareSync(req.body.password, exist.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if email is verified
    if (!exist.isConfirmed) {
      return res.status(403).json({ 
        message: "Please verify your email before logging in",
        isConfirmed: false 
      });
    }

    const token = jwt.sign(
      { _id: exist._id, role: exist.role },
      process.env.JWT_SECRET,
      { expiresIn: "4h" }
    );

    res.json({ message: `Welcome Back ${exist.firstName} ${exist.lastName}`, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Verify token and return user data
const verifyUserToken = async (req, res) => {
  try {
    // User data is already attached by the verifyToken middleware
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Get fresh user data from database
    const userData = await UserModel.findById(user._id).select('-password');
    
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ 
      message: "Token verified successfully",
      user: userData
    });
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Resend verification email
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await UserModel.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isConfirmed) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Resend verification email
    sendMail(email);
    
    res.json({ message: "Verification email sent successfully" });
  } catch (err) {
    console.error("Resend verification error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// const verifyEmail = async(req, res) => {
//   const { email } = req.params;
//   const decoded = jwt.decode(email);
//   const user = await UserModel.findOne({ email: decoded.email });
//   if (!user) {
//     return res.status(404).json({ message: "User Not Found" });
//   }
//   await UserModel.findOneAndUpdate({ email: decoded.email }, { isConfirmed: true });
//   res.json({ message: "Email Verified" });
// };

const verifyEmail = async (req, res) => {
  const email = req.email; // نأخذ الإيميل من الـ middleware

  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User Not Found" });
  }

  await UserModel.findOneAndUpdate({ email }, { isConfirmed: true });
  res.json({ message: "✅ Email Verified Successfully" });
};


const updateUser = async (req, res) => {
  let { id } = req.params;
  const updatedUser = await UserModel.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true }
  );
  res.json({ message: "User Updated", updatedUser });
};

const deleteUser = async (req, res) => {
  let { id } = req.params;
  const deletedUser = await UsersModel.findByIdAndDelete(id);
  res.json({ message: "User Deleted", deletedUser });
};

const deleteAllUsers = async(req, res) => {
    try {
    const result = await UserModel.deleteMany({});
    res.json({ message: "All Users Deleted", result });
  } catch (err) {
    res.status(500).json({ message: "Error Deleting Users", err });
  }
}

export { getAllUsers, register, updateUser, deleteUser, login, deleteAllUsers, verifyEmail, verifyUserToken, resendVerification };
