import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import connectDB from "./DatabaseConnection/dbConnection.js";
import authRoute from "./APIRoutes/authRoute.js";
import User from "./Schema/User.js";
import cors from "cors";
dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));

app.use(express.json());
app.use(cookieParser());
app.use("/auth",authRoute);

connectDB();





// Google OAuth Setup
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
        user = await new User({ username: profile.displayName, email: profile.emails[0].value, googleId: profile.id }).save();
    }
    return done(null, user);
}));

// Google OAuth Route
app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/api/auth/google/callback", passport.authenticate("google", { session: false }), (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
