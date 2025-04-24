"use client"

import { useCallback, useEffect, useState } from "react"
import { Search, Filter, Plus, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import BlogCard from "@/components/ui/blog-card"
import BlogFilter from "@/components/ui/blog-filter"
import { useRouter } from "next/navigation"
import axios from "axios"


export default function BlogPage() {
  const router = useRouter()
  const [showFilters, setShowFilters] = useState(false)
  const [blogs, setBlogs] = useState([])
  const [userId, setUserId] = useState<string | null>("");
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);



  const getBlogs = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await axios.get(
        `https://study-mate-ai-server.vercel.app/${userId}/getBlogs`
      );
      setBlogs(response.data.userBlogs);
      console.log(response.data.userBlogs);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      getBlogs();
    }
  }, [userId, getBlogs]);



  return (
    <div className="min-h-screen bg-[#1E1C26] text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Blog Posts</h1>
            <p className="text-gray-400">Discover the latest insights and tutorials</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Search posts..."
                className="pl-10 bg-[#252330] border-[#323042] text-gray-200 w-full"
              />
            </div>

            <Button
              variant="outline"
              className="border-[#323042] bg-[#252330] hover:bg-[#2A2838]"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>

            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => router.push("/blog/create")}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </div>
        </div>

        {showFilters && <BlogFilter />}

        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {blogs.map((blog,idx) => (
              <BlogCard key={idx} blog={blog} />
            ))}
          </div>
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

      </div>
    </div>
  )
}

