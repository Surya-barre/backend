import multer from "multer";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
 
const uploadDir = "public/images";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

export const upload = multer({ storage });

// Register User
async function Register(req, res) {
  try {
    const { username, email, password } = req.body;
    const file = req.file ? req.file.filename : "";

    // Check if email already exists
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      username,
      email,
      password: hashpassword,
      image: file,
    });

    await newUser.save();
    return res.status(200).json({ msg: "Successfully recieved" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Error: " + err });
  }
}

// User Sign-in (Login)
async function signin(req, res) {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invail password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({
      msg: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error: " + err });
  }
}

// Verify User Token
const verify = async (req, res) => {
  try {
       
        
    const user = await UserModel.findById(req.user.id).select("-password"); 
     
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export { Register, signin, verify };
