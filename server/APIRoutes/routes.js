import User from "../schema/User.js";
import express from "express";
import Blogs from "../schema/Blog.js";
import mongoose from "mongoose";

const blogRouter = express.Router();

blogRouter.get("/:userId/getBlogs", async (req, res) => {
  try {
    const id = req.params.userId;
    const user = await User.findById(id);

    if (!user) {
      res.status(400).json({ error: "User Not Found" })
      return;
    }
    res.status(200).json({ userBlogs: user.userBlogs })
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error ", err: error })
  }
})


blogRouter.post("/:userId/postBlog", async (req, res) => {
  try {
    const { title, content, category, image, readTime } = req.body;
    const id = req.params.userId;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    if (!user.userName || !user.bio || !user.avatar) {
      return res.status(400).json({
        message: "User profile is incomplete. Author name, bio, or avatar missing.",
        success: false,
      });
    }

    const postId = new mongoose.Types.ObjectId();
    const userId = user._id;
    const post = {
      _id: postId,
      authorId: userId.toString(), // ✅ or just userId
      title,
      content,
      category,
      image,
      readTime: readTime + " min Read",
      authorName: user.userName,
      authorBio: user.bio,
      authorAvatar: user.avatar,
    };
    // Save to Blogs collection
    if (!user.isPro && user.monthlyBlogs > 0) {
      const newPost = new Blogs(post);
      await newPost.save();

      user.userBlogs.push(post);
      user.monthlyBlogs -=1 ;
      await user.save();
    }
    else if(user.isPro){
      const newPost = new Blogs(post);
      await newPost.save();
      user.userBlogs.push(post);
      await user.save();
    }


    res.status(200).json({
      userBlogs: user.userBlogs,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      error: error,
      success: false,
    });
    console.log(error);
  }
});
blogRouter.get("/getAllBlogs", async (req, res) => {
  try {
    const blogs = await Blogs.find();
    res.status(200).json({
      blogs: blogs,
      success: true
    })
  } catch (error) {
    res.status(500).json({
      error: error,
      success: false
    })
  }
})

blogRouter.get("/:id/getSingleBlog", async (req, res) => {
  try {
    const id = req.params.id;
    const blogs = await Blogs.findById(id);
    res.status(200).json({
      blogs: blogs,
      success: true
    })
  } catch (error) {
    res.status(500).json({
      error: error,
      success: false
    })
  }
})
blogRouter.put("/update-author-details/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Step 1: Fetch user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const updatedFields = {
      authorName: user.userName,
      authorBio: user.bio,
      authorAvatar: user.avatar,
    };

    // Step 2: Update all blogs in Blogs collection
    await Blogs.updateMany(
      { authorId: userId },
      { $set: updatedFields }
    );

    // Step 3: Update userBlogs inside User schema
    user.userBlogs = user.userBlogs.map((blog) => ({
      ...blog.toObject(),
      ...updatedFields
    }));
    await user.save();

    res.status(200).json({
      message: "All blogs and userBlogs updated successfully.",
      success: true,
    });

  } catch (err) {
    console.error("Error updating blogs:", err);
    res.status(500).json({ message: "Server Error", error: err, success: false });
  }
});


export default blogRouter;