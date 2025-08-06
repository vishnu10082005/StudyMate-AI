"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Map, CheckSquare, FileText, Edit, Grid3X3, List, LogOut, LogOutIcon, SquareDashedBottom, SquareDashedBottomCode, BookDashedIcon } from "lucide-react"
import BlogCard from "@/components/ui/blog-card"
import axios from "axios"
import UserAvatar from "@/components/ui/useAvatar"
import EditProfileModal from "@/components/ui/edit-profile-model"


interface Blog {
  _id?: string
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
  readTime: string
  authorId: string
}

interface User {
  id: string;
  name: string;
}

interface UserType {
  _id?: string;
  name?: string;
  userName?: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  joinDate?: string;
  userBlogs?: Blog[];
  followers?: User[];
  following?: User[];
  likes?: string[];
}


export default function ProfilePage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [userId, setUserId] = useState<string | null>("");
  const [user, setUser] = useState<UserType | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  const handleProfileUpdate = (updatedUser: UserType) => {
    setUser(updatedUser)
    fetchUser()
  }



  const fetchUser = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await axios.get(
        `https://studymate-ai-2gvx.onrender.com/${userId}/getUser`
      );
      setUser(response.data.user);
      console.log(response.data.user);
      const totalLikes = response.data.user.likes.reduce((total: number, like: any) => {
        return total + (Array.isArray(like) ? like.length : 1);
      }, 0);

      setLikes(totalLikes);
      console.log("TotalLikes ", totalLikes);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId, fetchUser]);

  return (
    <div className="min-h-screen bg-[#1E1C26] text-gray-200">
      <div className="relative h-64 w-full">
        <Image src={user?.coverImage || "/placeholder.svg"} alt="Cover" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1E1C26]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-8">
          <UserAvatar user={user || {}} size="xl" />
          <div className="flex-grow">
            <h1 className="text-3xl font-bold text-white mb-1">{user?.name}</h1>
            <p className="text-gray-400 mb-2">
              @{user?.userName} · {user?.joinDate}
            </p>
            <p className="text-gray-300 max-w-2xl mb-4">{user?.bio}</p>

            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                {user?.userBlogs && user.userBlogs.length > 0 && (
                  <span className="text-white font-bold">{user.userBlogs.length}</span>
                )}
                <span className="text-gray-400 ml-1">Posts</span>
              </div>
              <div>
                <span className="text-white font-bold">{user?.followers && user?.followers.length > 1000 ? (user.followers.length / 1000).toFixed(1) + 'K' : user?.followers?.length}</span>
                <span className="text-gray-400 ml-1">Followers</span>
              </div>
              <div>
                <span className="text-white font-bold">{user?.following?.length || 0}</span>
                <span className="text-gray-400 ml-1">Following</span>
              </div>
              <div>
                <span className="text-white font-bold">
                  {likes && likes > 1000
                    ? (likes / 1000).toFixed(1) + 'K'
                    : likes || 0}
                </span>

                <span className="text-gray-400 ml-1">Likes</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0">
            <Button variant="outline" className="border-[#323042] bg-[#252330] hover:bg-[#2A2838] hover:text-white cursor-pointer" onClick={() => setIsEditModalOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Button variant="outline" className="border-[#323042] bg-[#252330] hover:bg-[#2A2838] hover:text-white cursor-pointer" onClick={() => router.push("/dashboard")}>
              <BookDashedIcon className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button variant="outline" className="border-[#323042] bg-[#252330] hover:bg-[#2A2838] hover:text-white cursor-pointer hover:bg-red-500" onClick={() => {
                localStorage.removeItem("isLogin")
                router.push("/");
              }}>
              <LogOutIcon className="h-4 w-4 mr-2" />
              LogOut
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <Card className="bg-[#252330] border-[#323042]">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="border-[#323042] bg-[#2A2838] hover:bg-[#323042] justify-start h-auto py-4"
                  onClick={() => router.push("/chat")}
                >
                  <div className="flex flex-col items-center md:flex-row md:items-start text-left">
                    <MessageSquare className="h-5 w-5 mb-2 md:mb-0 md:mr-3 text-white" />
                    <div className="cursor-pointer">
                      <p className="font-medium text-white">Previous Chats</p>
                      <p className="text-xs text-gray-400 mt-1">View your chat history</p>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="border-[#323042] bg-[#2A2838] hover:bg-[#323042] justify-start h-auto py-4"
                  onClick={() => router.push("/mindmap")}
                >
                  <div className="flex flex-col items-center md:flex-row md:items-start text-left">
                    <Map className="h-5 w-5 mb-2 md:mb-0 md:mr-3 text-white" />
                    <div className="cursor-pointer">
                      <p className="font-medium text-white">Mindmaps</p>
                      <p className="text-xs text-gray-400 mt-1">Explore your mindmaps</p>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="border-[#323042] bg-[#2A2838] hover:bg-[#323042] justify-start h-auto py-4"
                  onClick={() => router.push("/todos")}
                >
                  <div className="flex flex-col items-center md:flex-row md:items-start text-left">
                    <CheckSquare className="h-5 w-5 mb-2 md:mb-0 md:mr-3 text-white" />
                    <div className="cursor-pointer">
                      <p className="font-medium text-white">Todo Lists</p>
                      <p className="text-xs text-gray-400 mt-1">Manage your tasks</p>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="border-[#323042] bg-[#2A2838] hover:bg-[#323042] justify-start h-auto py-4"
                  onClick={() => router.push("/blog")}
                >
                  <div className="flex flex-col items-center md:flex-row md:items-start text-left">
                    <FileText className="h-5 w-5 mb-2 md:mb-0 md:mr-3 text-white" />
                    <div className="cursor-pointer">
                      <p className="font-medium text-white">My Blogs</p>
                      <p className="text-xs text-gray-400 mt-1">Access your Blogs</p>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="posts" className="mb-12 ">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="bg-[#252330] border border-[#323042]">
              <TabsTrigger value="posts" className="data-[state=active]:bg-[#323042] text-white ">
                Posts
              </TabsTrigger>
              <TabsTrigger value="liked" className="data-[state=active]:bg-[#323042] text-white ">
                Liked
              </TabsTrigger>
              <TabsTrigger value="Saved Posts" className="data-[state=active]:bg-[#323042] text-white">
                Saved Posts
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
            {user?.userBlogs && user.userBlogs.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {user.userBlogs.map((blog) => (
                    <BlogCard key={blog._id} blog={blog} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {user.userBlogs.map((blog) => (
                    <Card
                      key={blog.id}
                      className="bg-[#252330] border-[#323042] hover:border-purple-500/50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/blog/${blog.id}`)}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="relative h-24 w-24 flex-shrink-0 rounded-md overflow-hidden">
                            <Image
                              src={blog.image || "/placeholder.svg"}
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
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">No Posts yet</h3>
                <p className="text-gray-400 mb-6">Start writing blogs or post to see them here</p>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => router.push("/blog/create")}
                >
                  Create New Post
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="liked">
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-500 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No liked posts yet</h3>
              <p className="text-gray-400 mb-6">Like posts to save them here for quick access</p>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => router.push("/blog")}>
                Browse Posts
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="Saved Posts">
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-500 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No Saved Posts yet</h3>
              <p className="text-gray-400 mb-6">Please Save the Posts to See</p>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => router.push("/blog")}>
                Browse Posts
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          userData={user || {}}
          onProfileUpdate={handleProfileUpdate}
        />
      </div>
    </div>
  )
}