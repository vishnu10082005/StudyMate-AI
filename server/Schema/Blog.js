import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  commenterAvatar : {type:String},
  commenterUserName:{type:String},
  commenterId:{type:String},
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, { _id: false });

const BlogsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authorId:{type:String},
  content: { type: String, required: true },
  image: { type: String },
  authorName: { type: String, required: true },
  authorAvatar: { type: String },
  dateOfPost: { 
    type: String, 
    default: () => {
      const date = new Date();
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  },
  category: { type: String },
  authorBio: { type: String },
  readTime: { type: String }, 
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [CommentSchema],
});

const Blogs = mongoose.model("Blog", BlogsSchema);

export default Blogs;