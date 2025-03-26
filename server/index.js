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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
