import User from "../Schema/User.js";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const authRoute = express.Router();

authRoute.post("/register", async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ userName, email, password: hashedPassword });
        await newUser.save();
        console.log("New User ",newUser)
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("error ",err);
    }
});


authRoute.post("/login", async (req, res) => {
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
export default authRoute;