import mongoose from "mongoose";

// Schema for individual messages in chat
const MessageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "bot"], required: true },
  content: { type: String },
  image: { type: String },
  timestamp: { type: Date, default: Date.now },
}, { _id: false });  // Prevent auto-generating _id for array elements

// Schema for storing mind maps
const MindMapSchema = new mongoose.Schema({
  title: { type: String, required: true },
  mindMaps: [{
    mindmap: { type: Object, required: true },
  }], 
  createdAt: { type: Date, default: Date.now },
}, { _id: false });  

const TitleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  messages: [MessageSchema], 
}, { _id: false }); 

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userChats: [TitleSchema],  
  userMindMaps: [MindMapSchema],  
});

const User = mongoose.model("User", UserSchema);
export default User;
