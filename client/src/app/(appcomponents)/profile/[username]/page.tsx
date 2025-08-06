"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter, useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Grid3X3, List, MessageSquare, Share2, Flag, User, Users } from "lucide-react"
import BlogCard from "@/components/ui/blog-card"
import UserInitial from "@/components/ui/user-initial"
import { Skeleton } from "@/components/ui/skeleton"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"

interface Blog {
  _id: string
  id?: string
  title: string
  content: string
  image: string
  authorName: string
  authorAvatar: string
  dateOfPost: string
  category: string
  likes: any[]
  comments: any[]
  readTime?: string
  authorId: string
}

interface UserProfile {
  _id: string
  name?: string
  userName: string
  email?: string
  bio?: string
  avatar?: string
  coverImage?: string
  joinDate?: string
  registeredAt?: Date
  userBlogs?: Blog[]
  followers?: string[]
  following?: string[]
  likes?: string[]
}

export default function UserProfilePage() {
  const router = useRouter()
  const params = useParams<{ username: string }>()
  const username = params.username as string
  const { toast } = useToast()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [profileUser, setProfileUser] = useState<UserProfile | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // Get current user ID from localStorage
  useEffect(() => {
    const userId = localStorage.getItem("userId")
    setCurrentUserId(userId)
  }, [])

  // Fetch user data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!username) return

      setLoadingProfile(true)
      try {
        const response = await axios.get(`https://study-mate-ai-server.vercel.app/${username}/viewProfile`)

        if (response.data && response.data.user) {
          const userData = response.data.user

          // Check if current user is following this profile
          if (currentUserId && userData.followers) {
            setIsFollowing(userData.followers.includes(currentUserId))
          }

          setProfileUser(userData)

          // Set blogs if available
          if (userData.userBlogs && Array.isArray(userData.userBlogs)) {
            setBlogs(
              userData.userBlogs.map((blog: any) => ({
                ...blog,
                authorName: userData.name || userData.userName,
                authorAvatar: userData.avatar,
              })),
            )
          }
        }

        setLoadingProfile(false)
      } catch (error) {
        console.error("Error fetching user profile:", error)
        toast({
          title: "Error",
          description: "Failed to load user profile. Please try again later.",
          variant: "destructive",
        })
        setLoadingProfile(false)
      }
    }

    if (username) {
      fetchUserProfile()
    }
  }, [username, currentUserId])

  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    if (!currentUserId || !profileUser?._id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to follow users",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Based on your schema, we need to update the followers array
      const endpoint = isFollowing ? "unfollow" : "follow"

      // Send the current user ID as the follower
      const response = await axios.put(`https://study-mate-ai-server.vercel.app/${profileUser._id}/${endpoint}`, {
        followerId: currentUserId,
      })

      if (response.data.success) {
        setIsFollowing(!isFollowing)

        // Update follower count in the UI
        if (profileUser && profileUser.followers) {
          const updatedFollowers = isFollowing
            ? profileUser.followers.filter((id) => id !== currentUserId)
            : [...profileUser.followers, currentUserId]

          setProfileUser({
            ...profileUser,
            followers: updatedFollowers,
          })

        }

        toast({
          title: isFollowing ? "Unfollowed" : "Following",
          description: isFollowing
            ? `You have unfollowed ${profileUser.name || profileUser.userName}`
            : `You are now following ${profileUser.name || profileUser.userName}`,
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

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-[#1E1C26] text-gray-200 p-4">
        <div className="relative h-64 w-full bg-[#252330]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-8">
            <Skeleton className="h-32 w-32 rounded-full bg-[#252330]" />
            <div className="flex-grow">
              <Skeleton className="h-8 w-64 bg-[#252330] mb-2" />
              <Skeleton className="h-4 w-40 bg-[#252330] mb-4" />
              <Skeleton className="h-16 w-full max-w-2xl bg-[#252330] mb-4" />
              <div className="flex flex-wrap gap-6">
                <Skeleton className="h-6 w-20 bg-[#252330]" />
                <Skeleton className="h-6 w-20 bg-[#252330]" />
                <Skeleton className="h-6 w-20 bg-[#252330]" />
              </div>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Skeleton className="h-10 w-24 bg-[#252330]" />
              <Skeleton className="h-10 w-24 bg-[#252330]" />
            </div>
          </div>
          <Tabs defaultValue="posts" className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-10 w-64 bg-[#252330]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-64 w-full bg-[#252330]" />
              ))}
            </div>
          </Tabs>
        </div>
      </div>
    )
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-[#1E1C26] text-gray-200 flex items-center justify-center">
        <Card className="bg-[#252330] border-[#323042] max-w-md">
          <CardContent className="p-8 text-center">
            <User className="h-16 w-16 mx-auto text-gray-500 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">User Not Found</h2>
            <p className="text-gray-400 mb-6">The user you're looking for doesn't exist or has been removed.</p>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => router.push("/")}>
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calculate stats from the user schema
  const stats = {
    posts: profileUser.userBlogs?.length || 0,
    followers: profileUser.followers?.length || 0,
    following: profileUser.following?.length || 0,
    likes: profileUser.likes?.length || 0,
  }

  // Format stats for display
  const formatStat = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  return (
    <div className="min-h-screen bg-[#1E1C26] text-gray-200">
      <div className="relative h-64 w-full">
        <Image
          src={profileUser.coverImage || "/placeholder.svg?height=400&width=1200"}
          alt="Cover"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1E1C26]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-8">
          {profileUser.avatar ? (
            <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-[#1E1C26]">
              <Image
                src={profileUser.avatar || "/placeholder.svg?height=128&width=128"}
                alt={profileUser.name || profileUser.userName}
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
          ) : (
            <UserInitial
              name={profileUser.name || profileUser.userName}
              size="xl"
              className="border-4 border-[#1E1C26]"
            />
          )}

          <div className="flex-grow">
            <h1 className="text-3xl font-bold text-white mb-1">{profileUser.name || profileUser.userName}</h1>
            <p className="text-gray-400 mb-2">
              @{profileUser.userName} · {profileUser.joinDate || "Member since 2023"}
            </p>
            <p className="text-gray-300 max-w-2xl mb-4">{profileUser.bio || "No bio available"}</p>

            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <span className="text-white font-bold">{formatStat(stats.posts)}</span>
                <span className="text-gray-400 ml-1">Posts</span>
              </div>
              <div>
                <span className="text-white font-bold">{formatStat(stats.followers)}</span>
                <span className="text-gray-400 ml-1">Followers</span>
              </div>
              <div>
                <span className="text-white font-bold">{formatStat(stats.following)}</span>
                <span className="text-gray-400 ml-1">Following</span>
              </div>
              <div>
                <span className="text-white font-bold">{formatStat(stats.likes)}</span>
                <span className="text-gray-400 ml-1">Likes</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0">
            {currentUserId && currentUserId !== profileUser._id && (
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
                        Follow
                      </>
                    )}
                  </>
                )}
              </Button>
            )}

            {currentUserId && currentUserId !== profileUser._id && (
              <Button
                variant="outline"
                className="border-[#323042] bg-[#252330] hover:bg-[#2A2838] cursor-not-allowed"
              // onClick={handleMessage}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Message
              </Button>
            )}

            <div className="flex">
              <Button
                variant="outline"
                className="border-[#323042] bg-[#252330] hover:bg-[#2A2838] hover:text-gray-300 px-2"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  toast({
                    title: "Link Copied",
                    description: "Profile link copied to clipboard!",
                  })
                }}
              >
                <Share2 className="h-4 w-4" />
              </Button>

              {currentUserId && currentUserId !== profileUser._id && (
                <Button
                  variant="outline"
                  className="border-[#323042] bg-[#252330] hover:bg-[#2A2838] px-2 ml-2"
                  onClick={() => {
                    toast({
                      title: "Report User",
                      description: "Report functionality will be implemented soon.",
                    })
                  }}
                >
                  <Flag className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue="posts" className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="bg-[#252330] border border-[#323042]">
              <TabsTrigger value="posts" className="data-[state=active]:bg-[#323042] text-gray-300 ">
                Posts
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className={`border-[#323042] ${viewMode === "grid" ? "bg-[#323042]" : "bg-[#252330]"}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`border-[#323042] ${viewMode === "list" ? "bg-[#323042]" : "bg-[#252330]"}`}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="posts">
            {blogs && blogs.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogs.map((blog) => (
                    <BlogCard
                      key={blog._id || blog.id}
                      blog={blog}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {blogs.map((blog) => (
                    <Card
                      key={blog._id || blog.id}
                      className="bg-[#252330] border-[#323042] hover:border-purple-500/50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/blog/${blog._id || blog.id}`)}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="relative h-24 w-24 flex-shrink-0 rounded-md overflow-hidden">
                            <Image
                              src={blog.image || "/placeholder.svg?height=96&width=96"}
                              alt={blog.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-0.5 rounded-full">
                                {blog.category}
                              </span>
                              <span className="text-gray-400 text-xs">{blog.dateOfPost}</span>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-1">{blog.title}</h3>
                            <p className="text-gray-400 text-sm line-clamp-2">{blog.content}</p>

                            <div className="flex items-center mt-2">
                              <div className="flex items-center mr-4">
                                {profileUser.avatar ? (
                                  <Image
                                    src={profileUser.avatar || "/placeholder.svg?height=20&width=20"}
                                    alt={profileUser.name || profileUser.userName}
                                    width={20}
                                    height={20}
                                    className="rounded-full mr-1"
                                  />
                                ) : (
                                  <UserInitial
                                    name={profileUser.name || profileUser.userName}
                                    size="sm"
                                    className="mr-1 h-5 w-5 text-xs"
                                  />
                                )}
                                <span className="text-xs text-gray-300">
                                  {profileUser.name || profileUser.userName}
                                </span>
                              </div>
                              <div className="flex items-center text-xs text-gray-400 space-x-2">
                                <span>❤️ {blog.likes?.length || 0}</span>
                                <span>💬 {blog.comments?.length || 0}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <div className="h-12 w-12 mx-auto text-gray-500 mb-4 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">No posts yet</h3>
                <p className="text-gray-400 mb-6">
                  {profileUser.name || profileUser.userName} hasn't published any posts
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
