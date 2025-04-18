import User from "../schema/User.js";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";




const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { userName, email, password, name,avatar,coverImage,bio } = req.body;

        if (!userName || !email || !password) {
            return res.status(400).json({ error: "Username, email, and password are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "Email already in use" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user with default values
        const newUser = new User({
            userName,
            email,
            password: hashedPassword,
            name,
            bio,
            avatar,
            coverImage 

        });

        await newUser.save();
        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201).json({ 
            message: "User registered successfully",
            user: userResponse
        });

    } catch (err) {
        console.error("Registration error:", err);
        
        // Handle specific errors
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ error: errors.join(', ') });
        }
        
        res.status(500).json({ 
            error: "Registration failed",
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});




router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", token, { httpOnly: true });
        res.json({ isLogin:true, message: "Login successful",StudymateToken:  token ,userId : user._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


export default router;