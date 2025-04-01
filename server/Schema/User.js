import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "bot"], required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const TitleSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Title should be a string, not an array
  messages: [MessageSchema], // Array of messages under each title
});

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userChats: [TitleSchema], 
});

const User = mongoose.model("User", UserSchema);
export default User;
