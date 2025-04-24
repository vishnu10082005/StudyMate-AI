"use client"
import { useState, useEffect, useCallback } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BrainCircuit, Sparkles, Clock, Search, Grid, List, Calendar, Tag, SubscriptIcon, Crown } from "lucide-react"
import axios from "axios"
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MindMap {
  _id: string
  title: string
  mindMaps: any
  createdAt: string
}
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
  monthlymindMaps: number
  joinDate?: string;
  userBlogs?: Blog[];
  followers?: User[];
  following?: User[];
  likes?: string[];
  isPro: boolean
}
export default function MindMapGenerator() {
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [mindMaps, setMindMaps] = useState<MindMap[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>("");
  const [user, setUser] = useState<UserType | null>(null);


  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);



  const fetchUser = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await axios.get(
        `https://study-mate-ai-server.vercel.app/${userId}/getUser`
      );
      setUser(response.data.user);
      console.log(response.data.user);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId, fetchUser]);
  const loadingStates = [
    {
      text: "🧠 Analyzing your topic...",
    },
    {
      text: "🔍 Identifying key concepts...",
    },
    {
      text: "🤝 Discovering relationships...",
    },
    {
      text: "📊 Structuring the hierarchy...",
    },
    {
      text: "🎨 Designing visual layout...",
    },
    {
      text: "🌈 Applying color scheme...",
    },
    {
      text: "⚡ Optimizing connections...",
    },
    {
      text: "✨ Finalizing your mind map!",
    },
  ]

  // Fetch user's mind maps
  useEffect(() => {
    const fetchMindMaps = async () => {
      try {
        setIsLoading(true)
        const userId = localStorage.getItem("userId")
        if (!userId) {
          console.error("User ID not found")
          setIsLoading(false)
          return
        }

        const response = await axios.get(`https://study-mate-ai-server.vercel.app/${userId}/getAllMindMaps`)
        if (response.data && response.data.allMindMaps) {
          setMindMaps(response.data.allMindMaps)
        }
      } catch (err) {
        console.error("Error fetching mind maps:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMindMaps()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) {
      setError("Please enter a topic for your mind map")
      return
    }
    setError("")
    setLoading(true)

    try {
      const userId = localStorage.getItem("userId")
      console.log("User ID ", userId);
      if (!userId) {
        throw new Error("User ID not found. Please log in again.")
      }

      const response = await axios.post(`https://study-mate-ai-server.vercel.app/${userId}/mindMap`, {
        content: content,
        title: title.trim() || content.trim(), // Use title if provided, otherwise use content as title
      })

      localStorage.setItem("mindMapData", JSON.stringify(response.data.mindMapData))
      const latestOne = response.data.latestOne
      const latestId = response.data.allMindMaps[latestOne]._id

      // Add the new mind map to the list
      if (response.data.allMindMaps && response.data.allMindMaps[latestOne]) {
        setMindMaps((prev) => [response.data.allMindMaps[latestOne], ...prev])
      }

      router.push(`/mindmap/output/${latestId}`)
    } catch (err) {
      console.error("Error generating mind map:", err)
      setError(err instanceof Error ? err.message : "Something went wrong")
      localStorage.setItem("mindMapData", "")
    } finally {
      setLoading(false)
    }
  }

  // Filter mind maps based on search query
  const filteredMindMaps = mindMaps.filter((mindMap) => {
    const searchLower = searchQuery.toLowerCase()
    return mindMap.title.toLowerCase().includes(searchLower)
  })

  // Get a color based on the mind map title
  const getMindMapColor = (title: string) => {
    const colors = [
      "from-purple-500 to-pink-500",
      "from-blue-500 to-cyan-500",
      "from-green-500 to-emerald-500",
      "from-amber-500 to-orange-500",
      "from-red-500 to-pink-500",
      "from-indigo-500 to-purple-500",
    ]

    // Use the sum of character codes to determine the color
    const sum = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[sum % colors.length]
  }

  return (
    <div className="min-h-screen bg-[#1E1C26] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <div className="sticky top-24">
              <Card className="bg-[#252330] border-[#323042] text-white shadow-xl">
                <CardHeader className="space-y-1">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500">
                      <BrainCircuit size={30} className="text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-center">Mind Map Generator</CardTitle>
                  <CardDescription className="text-gray-400 text-center">
                    Enter a topic to generate a visual mind map
                  </CardDescription>
                </CardHeader>

                <Loader loadingStates={loadingStates} loading={loading} duration={2000} />

                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="content" className="text-sm font-medium text-gray-300">
                        Topic
                      </label>

                      <Textarea
                        id="content"
                        placeholder="Enter a topic (e.g., 'Machine Learning', 'Web Development')"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="bg-[#1E1C26] border-[#323042] placeholder:text-gray-500"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="title" className="text-sm font-medium text-gray-300">
                        Title (optional)
                      </label>
                      <Input
                        id="title"
                        placeholder="Enter a title for your mind map"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-[#1E1C26] border-[#323042] placeholder:text-gray-500"
                      />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                  </form>
                </CardContent>
                <CardFooter>
                  {(user?.isPro || (!user?.isPro && (user?.monthlymindMaps ?? 0) > 0)) && (
                    <Button
                      className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white hover:from-indigo-600 hover:to-pink-600"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? "Generating..." : "Generate Mind Map"}
                      <Sparkles className="ml-2 h-4 w-4" />
                    </Button>
                  )}

                  {!user?.isPro && (user?.monthlymindMaps ?? 0) === 0 && (
                    <Button
                      className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white hover:from-indigo-600 hover:to-pink-600"
                      onClick={() => {
                        router.push("/pricing");
                      }}
                    >
                      Monthly Generates Completed Go Pro <Crown className="h-4 w-5" />
                    </Button>
                  )}

                </CardFooter>
              </Card>
            </div>
          </div>

          <div className="md:w-2/3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Your Mind Maps</h2>
              <p className="text-gray-400">View and manage your generated mind maps</p>
            </div>

            {/* Search and view options */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="relative w-full sm:w-auto flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  placeholder="Search mind maps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#252330] border-[#323042] text-gray-200 w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={`border-[#323042] ${viewMode === "grid" ? "bg-[#323042]" : "bg-[#252330]"}`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4 text-gray-100 hover:text-black" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`border-[#323042] ${viewMode === "list" ? "bg-[#323042]" : "bg-[#252330]"}`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4 text-gray-100 hover:text-black" />
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all" className="mb-6">
              <TabsList className="bg-[#252330] border border-[#323042]">
                <TabsTrigger value="all" className="data-[state=active]:bg-[#323042] text-white">
                  All Mind Maps
                </TabsTrigger>
                <TabsTrigger value="recent" className="data-[state=active]:bg-[#323042] text-white">
                  Recent
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-[#252330] border border-[#323042] rounded-lg h-40 animate-pulse"></div>
                    ))}
                  </div>
                ) : filteredMindMaps.length === 0 ? (
                  <div className="text-center py-12 bg-[#252330] border border-[#323042] rounded-lg">
                    <BrainCircuit className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">No mind maps found</h3>
                    <p className="text-gray-400 mb-6">
                      {searchQuery ? "No mind maps match your search" : "Generate your first mind map to get started"}
                    </p>
                  </div>
                ) : viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredMindMaps.map((mindMap) => (
                      <MindMapCard key={mindMap._id} mindMap={mindMap} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredMindMaps.map((mindMap) => (
                      <MindMapListItem key={mindMap._id} mindMap={mindMap} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="recent">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-[#252330] border border-[#323042] rounded-lg h-40 animate-pulse"></div>
                    ))}
                  </div>
                ) : filteredMindMaps.length === 0 ? (
                  <div className="text-center py-12 bg-[#252330] border border-[#323042] rounded-lg">
                    <Clock className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">No recent mind maps</h3>
                    <p className="text-gray-400 mb-6">Generate a mind map to see it here</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredMindMaps.slice(0, 4).map((mindMap) => (
                      <MindMapCard key={mindMap._id} mindMap={mindMap} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

// Mind Map Card Component
function MindMapCard({ mindMap }: { mindMap: MindMap }) {
  const router = useRouter()
  const colorClass = getColorClass(mindMap.title)
  const formattedDate = formatDate(mindMap.createdAt)
  const nodeCount = getNodeCount(mindMap.mindMaps)
  const edgeCount = getEdgeCount(mindMap.mindMaps)

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="cursor-pointer"
      onClick={() => router.push(`/mindmap/output/${mindMap._id}`)}
    >
      <Card className="bg-[#252330] border-[#323042] hover:border-purple-500/50 transition-colors h-full overflow-hidden">
        <div className={`h-2 w-full bg-gradient-to-r ${colorClass}`}></div>
        <CardContent className="p-5">
          <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1">{mindMap.title}</h3>

          <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <span className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {formattedDate}
            </span>
            <span className="flex items-center">
              <Tag className="h-3 w-3 mr-1" />
              {nodeCount} nodes
            </span>
            <span className="flex items-center">
              <Tag className="h-3 w-3 mr-1" />
              {edgeCount} edges
            </span>
          </div>

          <div className="relative h-24 w-full bg-[#1E1C26] rounded-md overflow-hidden mb-3">
            <div className="absolute inset-0 flex items-center justify-center">
              <BrainCircuit className="h-10 w-10 text-gray-700" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#252330]/80"></div>
          </div>

          <Button variant="outline" size="sm" className="w-full border-[#323042] hover:bg-[#323042] text-black-300 hover:text-gray-300">
            View Mind Map
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Mind Map List Item Component
function MindMapListItem({ mindMap }: { mindMap: MindMap }) {
  const router = useRouter()
  const colorClass = getColorClass(mindMap.title)

  // Format date
  const formattedDate = formatDate(mindMap.createdAt)

  // Extract node count from mindMap data
  const nodeCount = getNodeCount(mindMap.mindMaps)

  return (
    <motion.div
      whileHover={{ x: 5 }}
      transition={{ duration: 0.2 }}
      className="cursor-pointer"
      onClick={() => router.push(`/mindmap/output/${mindMap._id}`)}
    >
      <Card className="bg-[#252330] border-[#323042] hover:border-purple-500/50 transition-colors overflow-hidden">
        <div className="flex items-center p-4">
          <div className={`w-1 self-stretch mr-4 bg-gradient-to-b ${colorClass}`}></div>

          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-white mb-1">{mindMap.title}</h3>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {formattedDate}
              </span>
              <span className="flex items-center">
                <Tag className="h-3 w-3 mr-1" />
                {nodeCount} nodes
              </span>
            </div>
          </div>

          <Button variant="ghost" size="sm" className="ml-2 text-gray-400 hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}

// Helper functions
function getColorClass(title: string) {
  const colors = [
    "from-purple-500 to-pink-500",
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-500",
    "from-amber-500 to-orange-500",
    "from-red-500 to-pink-500",
    "from-indigo-500 to-purple-500",
  ]

  // Use the sum of character codes to determine the color
  const sum = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[sum % colors.length]
}

function formatDate(dateString: string) {
  try {
    return format(new Date(dateString), "MMM d, yyyy")
  } catch (error) {
    return "Unknown date"
  }
}

function getNodeCount(mindMapData: any) {
  if (!mindMapData) return 0
  return mindMapData.nodes.length
}
function getEdgeCount(mindMapData: any) {
  if (!mindMapData) return 0
  return mindMapData.edges.length
}
