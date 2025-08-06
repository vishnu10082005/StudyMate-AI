"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Search,
  Filter,
  TrendingUp,
  Clock,
  Grid3X3,
  List,
  SlidersHorizontal,
  X,
  ChevronDown,
  MessageSquare,
} from "lucide-react"
import BlogCard from "@/components/ui/blog-card" // Fixed import path
import UserInitial from "@/components/ui/user-initial" // Fixed import path
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"

interface Blog {
  _id: string
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
  authorId:string
}

export default function ExplorePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("newest")
  const [userId, setUserId] = useState<string | null>("")
  const [allPosts, setAllPosts] = useState<Blog[]>([])
  const [uniqueCategories, setUniqueCategories] = useState<{ name: string; count: number }[]>([])
  const {toast}=useToast();
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId")
    setUserId(storedUserId)
  }, [])

  const fetchAllBlogs = useCallback(async () => {
    if (!userId) return
    setIsLoading(true)
    try {
      const response = await axios.get(`https://study-mate-ai-server.vercel.app/getAllBlogs`)
      const blogs = response.data.blogs
      setAllPosts(blogs)
      const categories = blogs.reduce((acc: Record<string, number>, blog: Blog) => {
        if (blog.category) {
          acc[blog.category] = (acc[blog.category] || 0) + 1
        }
        return acc
      }, {})

      const categoryArray = Object.entries(categories).map(([name, count]) => ({
        name,
        count: count as number,
      }))

      setUniqueCategories(categoryArray)
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching blogs:", error)
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (userId) {
      fetchAllBlogs()
    }
  }, [userId, fetchAllBlogs])

  useEffect(() => {
    const category = searchParams.get("category")
    if (category) {
      setSelectedCategories([category])
    }
  }, [searchParams])

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  const setSingleCategory = (category: string) => {
    setSelectedCategories([category])
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSortBy("newest")
    setSearchQuery("")
  }

  const filteredPosts = allPosts
    .filter((post) => {
      if (searchQuery && !post.title?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      if (selectedCategories.length > 0 && !selectedCategories.includes(post.category)) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.dateOfPost).getTime() - new Date(a.dateOfPost).getTime()
        case "oldest":
          return new Date(a.dateOfPost).getTime() - new Date(b.dateOfPost).getTime()
        case "popular":
          return (b.likes?.length || 0) - (a.likes?.length || 0)
        case "comments":
          return (b.comments?.length || 0) - (a.comments?.length || 0)
        default:
          return 0
      }
    })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", searchQuery)
  }

  const categories =
    uniqueCategories.length > 0
      ? uniqueCategories
      : [
          { name: "Technology", count: 0 },
          { name: "AI", count: 0 },
          { name: "Web Development", count: 0 },
          { name: "Data Science", count: 0 },
          { name: "Design", count: 0 },
          { name: "Career", count: 0 },
          { name: "Productivity", count: 0 },
          { name: "Health", count: 0 },
          { name: "Finance", count: 0 },
        ]

  return (
    <div className="min-h-screen bg-[#1E1C26] text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Explore</h1>
            <p className="text-gray-400">Discover interesting posts from the community</p>
          </div>

          <form onSubmit={handleSearch} className="flex w-full md:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Search posts..."
                className="pl-10 bg-[#252330] border-[#323042] text-gray-200 w-full md:w-64 lg:w-80"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="ml-2 border-[#323042] bg-[#252330] hover:bg-[#2A2838]"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </form>
        </div>

        {(selectedCategories.length > 0 || sortBy !== "newest") && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm text-gray-400">Active filters:</span>
            {selectedCategories.map((category) => (
              <Badge key={category} className="bg-[#323042] hover:bg-[#3a3750] text-gray-200 flex items-center gap-1">
                {category}
                <button onClick={() => toggleCategory(category)}>
                  <X className="h-3 w-3 ml-1" />
                </button>
              </Badge>
            ))}
            {sortBy !== "newest" && (
              <Badge className="bg-[#323042] hover:bg-[#3a3750] text-gray-200 flex items-center gap-1">
                Sort: {sortBy}
                <button onClick={() => setSortBy("newest")}>
                  <X className="h-3 w-3 ml-1" />
                </button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-200 h-7 px-2"
              onClick={clearFilters}
            >
              Clear all
            </Button>
          </div>
        )}

        {showFilters && (
          <Card className="bg-[#252330] border-[#323042] mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white flex items-center">
                  <SlidersHorizontal className="h-5 w-5 mr-2" />
                  Filter Posts
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                  onClick={() => setShowFilters(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Categories</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <div key={category.name} className="flex items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className={`justify-start h-8 px-3 text-xs w-full ${
                            selectedCategories.includes(category.name)
                              ? "bg-purple-600 hover:bg-purple-700 border-purple-600 text-white"
                              : "bg-[#1E1C26] border-[#323042] text-gray-300 hover:bg-[#2A2838]"
                          }`}
                          onClick={() => toggleCategory(category.name)}
                        >
                          {category.name}
                          <span className="ml-auto text-xs opacity-70">{category.count}</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Sort By</h4>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`justify-start w-full ${
                        sortBy === "newest"
                          ? "bg-purple-600 hover:bg-purple-700 border-purple-600 text-white"
                          : "bg-[#1E1C26] border-[#323042] text-gray-300 hover:bg-[#2A2838]"
                      }`}
                      onClick={() => setSortBy("newest")}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Newest First
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`justify-start w-full ${
                        sortBy === "oldest"
                          ? "bg-purple-600 hover:bg-purple-700 border-purple-600 text-white"
                          : "bg-[#1E1C26] border-[#323042] text-gray-300 hover:bg-[#2A2838]"
                      }`}
                      onClick={() => setSortBy("oldest")}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Oldest First
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`justify-start w-full ${
                        sortBy === "popular"
                          ? "bg-purple-600 hover:bg-purple-700 border-purple-600 text-white"
                          : "bg-[#1E1C26] border-[#323042] text-gray-300 hover:bg-[#2A2838]"
                      }`}
                      onClick={() => setSortBy("popular")}
                    >
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Most Popular
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`justify-start w-full ${
                        sortBy === "comments"
                          ? "bg-purple-600 hover:bg-purple-700 border-purple-600 text-white"
                          : "bg-[#1E1C26] border-[#323042] text-gray-300 hover:bg-[#2A2838]"
                      }`}
                      onClick={() => setSortBy("comments")}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Most Discussed
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-4 border-t border-[#323042]">
                <Button
                  variant="outline"
                  className="mr-2 border-[#323042] text-gray-300 hover:bg-[#2A2838]"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => setShowFilters(false)}>
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Category quick filters */}
        <div className="flex overflow-x-auto pb-2 mb-6 hide-scrollbar">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className={`whitespace-nowrap ${
                selectedCategories.length === 0
                  ? "bg-purple-600 hover:bg-purple-700 border-purple-600 text-white"
                  : "bg-[#252330] border-[#323042] text-gray-300 hover:bg-[#2A2838]"
              }`}
              onClick={() => setSelectedCategories([])}
            >
              All Topics
            </Button>
            {categories.slice(0, 7).map((category) => (
              <Button
                key={category.name}
                variant="outline"
                size="sm"
                className={`whitespace-nowrap ${
                  selectedCategories.includes(category.name)
                    ? "bg-purple-600 hover:bg-purple-700 border-purple-600 text-white"
                    : "bg-[#252330] border-[#323042] text-gray-300 hover:bg-[#2A2838] hover:text-gray-400"
                }`}
                onClick={() => setSingleCategory(category.name)}
              >
                {category.name}
              </Button>
            ))}
            {categories.length > 7 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="whitespace-nowrap bg-[#252330] border-[#323042] text-gray-300 hover:bg-[#2A2838]"
                  >
                    More
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#252330] border-[#323042] text-gray-200">
                  {categories.slice(7).map((category) => (
                    <DropdownMenuItem
                      key={category.name}
                      className="hover:bg-[#2A2838] cursor-pointer"
                      onClick={() => setSingleCategory(category.name)}
                    >
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* View mode and sort options */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-400">
            {isLoading ? "Loading posts..." : `Showing ${filteredPosts.length} posts`}
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#323042] bg-[#252330] hover:bg-[#2A2838] hidden sm:flex"
                >
                  {sortBy === "newest" && (
                    <>
                      <Clock className="mr-2 h-4 w-4" />
                      Newest
                    </>
                  )}
                  {sortBy === "oldest" && (
                    <>
                      <Clock className="mr-2 h-4 w-4" />
                      Oldest
                    </>
                  )}
                  {sortBy === "popular" && (
                    <>
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Popular
                    </>
                  )}
                  {sortBy === "comments" && (
                    <>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Most Discussed
                    </>
                  )}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#252330] border-[#323042] text-gray-200">
                <DropdownMenuItem className="hover:bg-[#2A2838] cursor-pointer" onClick={() => setSortBy("newest")}>
                  <Clock className="mr-2 h-4 w-4" />
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-[#2A2838] cursor-pointer" onClick={() => setSortBy("oldest")}>
                  <Clock className="mr-2 h-4 w-4" />
                  Oldest First
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#323042]" />
                <DropdownMenuItem className="hover:bg-[#2A2838] cursor-pointer" onClick={() => setSortBy("popular")}>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Most Popular
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-[#2A2838] cursor-pointer" onClick={() => setSortBy("comments")}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Most Discussed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex gap-1">
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
        </div>

        {/* Posts display */}
        {isLoading ? (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className={`${viewMode === "grid" ? "h-96" : "h-32"} bg-[#252330]`} />
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <BlogCard key={post._id} blog={post} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <Card
                  key={post._id}
                  className="bg-[#252330] border-[#323042] hover:border-purple-500/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/blog/${post._id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="relative h-24 w-24 flex-shrink-0 rounded-md overflow-hidden">
                        <Image
                          src={post.image || "/placeholder.svg?height=96&width=96"}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-0.5 rounded-full">
                            {post.category}
                          </span>
                          <span className="text-gray-400 text-xs">{post.dateOfPost}</span>
                          <span className="text-gray-400 text-xs">{post.readTime}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">{post.title}</h3>
                        <p className="text-gray-400 text-sm line-clamp-2">{post.content}</p>

                        <div className="flex items-center mt-2">
                          <div className="flex items-center mr-4">
                            {post.authorAvatar ? (
                              <Image
                                src={post.authorAvatar || "/placeholder.svg?height=20&width=20"}
                                alt={post.authorName}
                                width={20}
                                height={20}
                                className="rounded-full mr-1"
                              />
                            ) : (
                              <UserInitial name={post.authorName} size="sm" className="mr-1 h-5 w-5 text-xs" />
                            )}
                            <span className="text-xs text-gray-300">{post.authorName}</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-400 space-x-2">
                            <span>❤️ {post.likes?.length || 0}</span>
                            <span>💬 {post.comments?.length || 0}</span>
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
              <Search className="h-12 w-12" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No posts found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Load more button */}
        {!isLoading && filteredPosts.length > 0 && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              className="border-[#323042] bg-[#252330] hover:bg-[#2A2838] px-8"
              onClick={() => console.log("Load more posts")}
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
