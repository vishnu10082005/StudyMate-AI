import User from "../schema/User.js";
import express from "express";
import mongoose from "mongoose";
import Blogs from "../schema/Blog.js";

const userRouter = express.Router();
userRouter.get("/:userId/getUser", async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId format (optional but recommended)
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // Find user and exclude sensitive data
    const user = await User.findById(userId)
      .select('-password -__v')
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user data",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

userRouter.get("/:userName/viewProfile", async (req, res) => {
  try {
    const userName = req.params.userName;

    const user = await User.findOne({ userName })
      .select('-password -__v -userChats -userMindMaps');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user data",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});


userRouter.put("/:userId/editedProfile", async (req, res) => {
  const id = req.params.userId;
  console.log(typeof (id));
  try {
    const { userName, name, avatar, coverImage, bio } = req.body;
    console.log("Updating user: ", userName);

    // Step 1: Update the user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        userName,
        name,
        bio,
        avatar,
        coverImage,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 2: Update all blogs in the Blogs collection
    const updatedFields = {
      authorName: updatedUser.userName,
      authorBio: updatedUser.bio,
      authorAvatar: updatedUser.avatar,
    };

    await Blogs.updateMany(
      { authorId: id },
      { $set: updatedFields }
    );

    // Step 3: Update userBlogs array inside the user document
    updatedUser.userBlogs = updatedUser.userBlogs.map((blog) => ({
      ...blog.toObject(),
      ...updatedFields,
    }));

    await updatedUser.save(); // Save updated userBlogs

    res.status(200).json({
      message: "User profile and all related blogs updated successfully",
      user: updatedUser.toObject(),
    });

  } catch (err) {
    console.error("Error during user/blog update:", err);
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
});

// PUT /api/users/:userId/follow
userRouter.put("/:userId/follow", async (req, res) => {
  const { userId } = req.params;
  const { followerId } = req.body;

  try {
    if (userId === followerId) {
      return res.status(400).json({ message: "You can't follow yourself.", success: false });
    }

    const userToFollow = await User.findById(userId);
    const followerUser = await User.findById(followerId);

    if (!userToFollow || !followerUser) {
      return res.status(404).json({ message: "User not found.", success: false });
    }

    if (userToFollow.followers.includes(followerId)) {
      return res.status(400).json({ message: "Already following.", success: false });
    }
    userToFollow.followers.push(followerId);
    followerUser.following.push(userId);

    await userToFollow.save();
    await followerUser.save();

    res.status(200).json({ message: "User followed successfully.", success: true });
  } catch (error) {
    res.status(500).json({ message: "Error while following user", error: error.message, success: false });
  }
});

userRouter.put("/:userId/unfollow", async (req, res) => {
  try {
    const { userId } = req.params; // The user to unfollow
    const { followerId } = req.body; // The one who is unfollowing

    if (userId === followerId) {
      return res.status(400).json({ message: "You cannot unfollow yourself!", success: false });
    }

    const userToUnfollow = await User.findById(userId);
    const followerUser = await User.findById(followerId);

    if (!userToUnfollow || !followerUser) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Remove followerId from user's followers list
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== followerId
    );

    // Remove userId from follower's following list
    followerUser.following = followerUser.following.filter(
      (id) => id.toString() !== userId
    );

    await userToUnfollow.save();
    await followerUser.save();

    res.status(200).json({ message: "Unfollowed successfully", success: true });

  } catch (error) {
    console.error("Unfollow error:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
});


userRouter.put("/:userId/add-comment/:blogId", async (req, res) => {
  try {
    const { userId, blogId } = req.params;
    const { commenterId, content } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found", success: false });

    const commenter = await User.findById(commenterId);
    if (!commenter) return res.status(404).json({ message: "commenter not found", success: false });

    const newComment = {
      commenterUserName : commenter.userName,
      commenterId:commenter._id.toString(),
      commenterAvatar : commenter.avatar,
      content:content,
      createdAt:new Date()
    }

    const sepBlog= await Blogs.findById(blogId);
    sepBlog.comments.push(newComment);

    const blog = user.userBlogs.id(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found", success: false });


    blog.comments.push(newComment);
    await user.save();
    await sepBlog.save();

    res.status(200).json({ message: "Comment added successfully", newComment, success: true });
    
  } catch (error) {
    console.log("error ",error)
    res.status(500).json({ message: "Failed to add comment", error: error.message, success: false });
  }
});
userRouter.put("/:blogId/toggle-like", async (req, res) => {
  try {
    const { blogId } = req.params;
    const { likerId } = req.body;

    const blog = await Blogs.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found", success: false });

    const author = await User.findById(blog.authorId);
    if (!author) return res.status(404).json({ message: "Author not found", success: false });

    const alreadyLiked = blog.likes.includes(likerId);

    if (alreadyLiked) {
      blog.likes = blog.likes.filter(id => id.toString() !== likerId);
      const indexToRemove = author.likes.findIndex(id => id.toString() === blogId);
      if (indexToRemove !== -1) {
        author.likes.splice(indexToRemove, 1);
      }

      await blog.save();
      await author.save();

      return res.status(200).json({ message: "Blog unliked successfully", blog, success: true });
    } else {
      blog.likes.push(likerId);
      author.likes.push(blog._id);
      await blog.save();
      await author.save();
      return res.status(200).json({ message: "Blog liked successfully", blog, success: true });
    }

  } catch (error) {
    res.status(500).json({ message: "Failed to toggle like", error: error.message, success: false });
  }
});



export default userRouter




