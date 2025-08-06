"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar, Tag, ArrowLeft, Heart, MessageSquare, Share2, Bookmark, User, Users } from "lucide-react"
import UserAvatar from "@/components/ui/useAvatar"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { formatDistanceToNow } from "date-fns"

interface Blog {
  _id?: string
  id?: string
  title: string
  content: string
  image: string
  authorName: string
  authorId: string
  authorImage: string
  dateOfPost: string
  category: string
  likes: any[]
  comments: any[]
  readTime: string
  authorBio: string
}

interface UserRef {
  id: string
  name: string
}

interface UserType {
  _id?: string
  name?: string
  userName?: string
  bio?: string
  avatar?: string
  coverImage?: string
  joinDate?: string
  userBlogs?: Blog[]
  followers?: string[]
  following?: string[]
  likes?: string[]
}

interface Comment {
  commenterId: string
  content: string
  createdAt: string
  commenterUserName?: string
  commenterAvatar?: string
}

export default function BlogPostPage() {
  const router = useRouter()
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [userName, setUserName] = useState("")
  const [author, setAuthor] = useState<UserType | null>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isCurrentUserAuthor, setIsCurrentUserAuthor] = useState(false)
  const [commentContent, setCommentContent] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [user, setUser] = useState<UserType>({});

  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    setCurrentUserId(userId)
  }, [])
  const { toast } = useToast()

  const fetchAuthor = useCallback(async () => {
    if (!userName) return
    try {
      const response = await axios.get(`https://studymate-ai-2gvx.onrender.com/${userName}/viewProfile`)
      const authorData = response.data.user
      setAuthor(authorData)

      if (currentUserId && authorData._id) {
        setIsCurrentUserAuthor(currentUserId === authorData._id)
      }

      if (currentUserId && authorData.followers) {
        setIsFollowing(authorData.followers.includes(currentUserId))
      }
    } catch (error) {
      console.error("Error fetching author:", error)
    }
  }, [userName, currentUserId])

  useEffect(() => {
    if (userName) {
      fetchAuthor()
    }
  }, [userName, fetchAuthor])


  const fetchUser = useCallback(async () => {
    if (!currentUserId) return;
    try {
      const response = await axios.get(
        `https://studymate-ai-2gvx.onrender.com/${currentUserId}/getUser`
      );
      setUser(response.data.user);
      console.log(response.data.user);
      const totalLikes = response.data.user.likes.reduce((total: number, like: any) => {
        return total + (Array.isArray(like) ? like.length : 1);
      }, 0);


      console.log("TotalLikes ", totalLikes);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  }, [currentUserId]);

  useEffect(() => {
    if (currentUserId) {
      fetchUser();
    }
  }, [currentUserId, fetchUser]);
  const fetchSingleBlog = useCallback(async () => {
    if (!id) return
    try {
      const response = await axios.get(`https://studymate-ai-2gvx.onrender.com/${id}/getSingleBlog`)
      const blogData = response.data.blogs
      setBlog(blogData)
      setUserName(blogData.authorName)
      setComments(blogData.comments)

      if (currentUserId && blogData.likes) {
        setLiked(blogData.likes.includes(currentUserId))
      }
    } catch (error) {
      console.error("Error fetching blog:", error)
    }
  }, [id, currentUserId])

  const [blog, setBlog] = useState<Blog | null>(null)

  useEffect(() => {
    if (id) {
      fetchSingleBlog()
    }
  }, [id, fetchSingleBlog])

  const handleFollowToggle = async () => {
    if (!currentUserId || !author?._id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to follow users",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const endpoint = isFollowing ? "unfollow" : "follow"
      const response = await axios.post(`https://studymate-ai-2gvx.onrender.com/users/${author._id}/${endpoint}`, {
        followerId: currentUserId,
      })

      if (response.data.success) {
        setIsFollowing(!isFollowing)

        toast({
          title: isFollowing ? "Unfollowed" : "Following",
          description: isFollowing
            ? `You have unfollowed ${author.name || author.userName}`
            : `You are now following ${author.name || author.userName}`,
        })
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error)
      toast({
        title: "Error",
        description: "Failed to update follow status. Please try again.",
        variant: "destructive",
      })
    }
    setIsLoading(false)
  }

  // Handle like/unlike
  const handleLikeToggle = async () => {
    if (!currentUserId || !blog?._id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to like posts",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await axios.put(`https://studymate-ai-2gvx.onrender.com/${blog._id}/toggle-like`, {
        likerId: currentUserId,
      })

      if (response.data.success) {
        if (response.data.isLiked) {
          toast({
            title: "Liked",
            description: "Liked Thank you for liking",
            variant: "success",
          })
        }
        else {
          toast({
            title: "DisLiked",
            description: "You have successfully disliked , Please share your comment",
          })
        }
        setLiked(!liked)
        setBlog((prevBlog) => {
          if (!prevBlog) return null

          const updatedLikes = liked
            ? prevBlog.likes.filter((id) => id !== currentUserId)
            : [...prevBlog.likes, currentUserId]

          return {
            ...prevBlog,
            likes: updatedLikes,
          }
        })
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error)
      alert("Error")
      toast({
        title: "Error",
        description: "Failed to update like status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddComment = async () => {
    if (!currentUserId || !blog?._id || !commentContent.trim()) {
      toast({
        title: "Cannot Add Comment",
        description: currentUserId ? "Please enter a comment" : "Please log in to comment",
        variant: "destructive",
      })
      return
    }

    setIsSubmittingComment(true)

    try {
      const response = await axios.put(`https://studymate-ai-2gvx.onrender.com/${blog.authorId}/add-comment/${blog._id}`, {
        commenterId: currentUserId,
        content: commentContent,
      })

      if (response.data.success) {
        setComments([response.data.newComment, ...comments])
        setCommentContent("")
        fetchSingleBlog()
        toast({
          title: "Comment Added",
          description: "Your comment has been added successfully",
        })
      }
    } catch (error) {
      console.error("Error adding comment:", error)
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      })
    }

    setIsSubmittingComment(false)
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#1E1C26] text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading post...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-[#1E1C26] text-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" className="mb-6 text-gray-400 hover:text-white" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to blogs
        </Button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-purple-500/20 text-purple-300 text-sm px-3 py-1 rounded-full flex items-center">
              <Tag className="h-4 w-4 mr-1" />
              {blog.category}
            </span>
            <span className="text-gray-400 text-sm flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {blog.dateOfPost}
            </span>
            <span className="text-gray-400 text-sm">{blog.readTime}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">{blog.title}</h1>

          <div className="flex items-center mb-8">
            <UserAvatar user={author || {}} size="sm" />
            <div>
              <div
                className="text-white font-medium cursor-pointer hover:underline"
                onClick={() => router.push(`/profile/${blog.authorName}`)}
              >
                {blog.authorName}
              </div>
              <div className="text-gray-400 text-sm">Author</div>
            </div>
          </div>
        </div>

        <div className="relative h-[300px] md:h-[400px] w-full mb-8 rounded-lg overflow-hidden">
          <Image src={blog.image || "/placeholder.svg"} alt={blog.title} fill className="object-cover" />
        </div>

        <div
          className="prose prose-invert max-w-none mb-8"
          dangerouslySetInnerHTML={{
            __html: (blog.content || "")
              .split("\n\n")
              .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br />")}</p>`)
              .join(""),
          }}
        />

        <div className="flex justify-between items-center border-t border-[#323042] pt-6 mt-8">
          <div className="flex gap-4">
            <Button
              variant="ghost"
              className={`text-gray-400 cursor-pointer  ${liked ? "text-red-500" : ""}`}
              onClick={handleLikeToggle}
            >
              <Heart className={`mr-2 h-5 w-5 ${liked ? "fill-current" : ""}`} />
              {blog.likes?.length || 0}
            </Button>
            <Button variant="ghost" className="text-gray-400 cursor-pointer">
              <MessageSquare className="mr-2 h-5 w-5" />
              {blog.comments?.length || 0}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="text-gray-400 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                toast({
                  title: "Link Copied",
                  description: "Post link copied to clipboard!",
                })
              }}
            >
              <Share2 className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              className={`text-gray-400 cursor-pointer ${bookmarked ? "text-purple-500 hover:text-purple-600" : ""}`}
              onClick={() => setBookmarked(!bookmarked)}
            >
              <Bookmark className={`h-5 w-5 ${bookmarked ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>

        <div className="mt-12 bg-[#252330] border border-[#323042] rounded-lg p-6">
          <div className="flex items-start gap-4">
            <UserAvatar user={author || {}} size="lg" />
            <div className="flex-1">
              <h3 className="text-lg font-medium text-white mb-1">About {blog.authorName}</h3>
              <p className="text-gray-400 text-sm mb-4">{author?.bio || blog.authorBio || "No bio available"}</p>

              {!isCurrentUserAuthor && (
                <Button
                  className={
                    isFollowing
                      ? "bg-[#252330] hover:bg-[#2A2838] text-white border border-[#323042]"
                      : "bg-purple-600 hover:bg-purple-700 text-white"
                  }
                  onClick={handleFollowToggle}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing
                    </span>
                  ) : (
                    <>
                      {isFollowing ? (
                        <>
                          <Users className="mr-2 h-4 w-4" />
                          Following
                        </>
                      ) : (
                        <>
                          <User className="mr-2 h-4 w-4" />
                          Follow Author
                        </>
                      )}
                    </>
                  )}
                </Button>
              )}

              {isCurrentUserAuthor && (
                <Button
                  variant="outline"
                  className="border-[#323042] bg-[#252330] hover:bg-[#2A2838]"
                  onClick={() => router.push(`/blog/edit/${blog._id || blog.id}`)}
                >
                  Edit Post
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Comments ({blog.comments?.length || 0})</h2>

          {/* Comment Form */}
          {currentUserId && (
            <div className="bg-[#252330] border border-[#323042] rounded-lg p-4 mb-8">
              <div className="flex items-start gap-3">
                <UserAvatar
                  user={{
                    avatar: user.avatar,
                  }}
                  size="sm"
                />
                <div className="flex-1">
                  <Textarea
                    placeholder="Add a comment..."
                    className="bg-[#1E1C26] border-[#323042] text-gray-200 min-h-[100px] mb-3"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={handleAddComment}
                      disabled={isSubmittingComment || !commentContent.trim()}
                    >
                      {isSubmittingComment ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Posting...
                        </span>
                      ) : (
                        "Post Comment"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Comments List */}
          {!blog.comments || blog.comments.length === 0 ? (
            <div className="text-center py-8 bg-[#252330] border border-[#323042] rounded-lg">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-500 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No comments yet</h3>
              <p className="text-gray-400">Be the first to share your thoughts on this post</p>
            </div>
          ) : (
            <div className="space-y-4">
              {blog.comments
                .slice()
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((comment, index) => {
                  const commentDate = new Date(comment.createdAt)
                  const timeAgo = isNaN(commentDate.getTime())
                    ? "Recently"
                    : formatDistanceToNow(commentDate, { addSuffix: true })

                  return (
                    <div key={index} className="bg-[#252330] border border-[#323042] rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <UserAvatar
                          user={{
                            avatar: comment.commenterAvatar,
                            name: comment.commenterId == currentUserId ? "YOU" : comment.commenterUserName,
                          }}
                          size="sm"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <span
                                className="font-medium text-white cursor-pointer hover:underline"
                                onClick={() => comment.commenterId == currentUserId ? router.push(`/profile`) : router.push(`/profile/${comment.commenterUserName}`)}
                              >
                                {comment.commenterId == currentUserId ? "YOU" : comment.commenterUserName}
                              </span>
                              <span className="text-gray-400 text-xs ml-2">{timeAgo}</span>
                            </div>
                          </div>
                          <p className="text-gray-300">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}