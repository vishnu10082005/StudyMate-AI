import mongoose from "mongoose"

// Other schemas remain the same
const MessageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["user", "bot"], required: true },
    content: { type: String },
    image: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false },
)

const MindMapSchema = new mongoose.Schema({
  title: { type: String, required: true },
  mindMaps: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
})

// Simplified Todo Schema - removed dueDate
const TodoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    completed: { type: Boolean, default: false },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    category: { type: String, default: "general" },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { _id: true },
)

// Other schemas remain the same
const CommentSchema = new mongoose.Schema(
  {
    commenterAvatar: { type: String },
    commenterUserName: { type: String },
    commenterId: { type: String },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
)

const BlogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authorId: { type: String },
  content: { type: String, required: true },
  image: { type: String },
  authorName: { type: String, required: true },
  authorAvatar: { type: String },
  dateOfPost: {
    type: String,
    default: () => {
      const date = new Date()
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    },
  },
  category: { type: String },
  authorBio: { type: String },
  readTime: { type: String },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [CommentSchema],
})

const TitleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  messages: [MessageSchema],
})

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userChats: [TitleSchema],
  userMindMaps: [MindMapSchema],
  name: { type: String },
  bio: { type: String },
  avatar: { type: String, default: "/placeholder.svg?height=200&width=200" },
  coverImage: { type: String, default: "/placeholder.svg?height=400&width=1200" },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
  joinDate: {
    type: String,
    default: function () {
      return `Member since ${new Date(this.registeredAt).getFullYear()}`
    },
  },
  userBlogs: [BlogPostSchema],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogPost" }],
  userTodos: [TodoSchema],
})

const User = mongoose.model("User", UserSchema)
export default User
