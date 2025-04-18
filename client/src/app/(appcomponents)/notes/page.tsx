"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Filter, Plus, Grid3X3, List, Tag, Calendar } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function NotesPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  // Mock data - replace with your actual data fetching
  const notes = [
    {
      id: "1",
      title: "Project Ideas for Q3",
      content:
        "1. AI-powered content recommendation engine\n2. Mobile app for task management\n3. API integration with third-party services\n4. Dashboard redesign with improved analytics\n5. Performance optimization for existing features",
      category: "Work",
      tags: ["projects", "planning", "ideas"],
      date: "June 15, 2023",
      color: "purple",
    },
    {
      id: "2",
      title: "Meeting Notes: Product Team",
      content:
        "- Discussed roadmap for next quarter\n- Assigned tasks for upcoming sprint\n- Reviewed user feedback from latest release\n- Identified key metrics to track\n- Action items: Update documentation, schedule follow-up",
      category: "Work",
      tags: ["meeting", "product"],
      date: "June 10, 2023",
      color: "blue",
    },
    {
      id: "3",
      title: "Learning Resources: Machine Learning",
      content:
        "Books:\n- Hands-On Machine Learning with Scikit-Learn and TensorFlow\n- Deep Learning by Ian Goodfellow\n\nCourses:\n- Stanford CS229\n- Fast.ai Practical Deep Learning\n\nProjects to try:\n- Image classification\n- Sentiment analysis\n- Recommendation system",
      category: "Learning",
      tags: ["ML", "resources", "education"],
      date: "May 28, 2023",
      color: "green",
    },
    {
      id: "4",
      title: "Weekly Goals",
      content:
        "1. Complete API documentation\n2. Review pull requests\n3. Prepare presentation for team meeting\n4. Research new authentication methods\n5. Update personal portfolio website",
      category: "Personal",
      tags: ["goals", "planning"],
      date: "June 5, 2023",
      color: "yellow",
    },
    {
      id: "5",
      title: "Book Recommendations",
      content:
        "Fiction:\n- Project Hail Mary by Andy Weir\n- The Three-Body Problem by Liu Cixin\n\nNon-fiction:\n- Atomic Habits by James Clear\n- Thinking, Fast and Slow by Daniel Kahneman\n- The Pragmatic Programmer by Andrew Hunt",
      category: "Personal",
      tags: ["books", "reading"],
      date: "May 20, 2023",
      color: "red",
    },
    {
      id: "6",
      title: "Design Inspiration",
      content:
        "Websites to check:\n- Dribbble.com\n- Behance.net\n- Awwwards.com\n\nDesign trends to explore:\n- Glassmorphism\n- Dark mode interfaces\n- Micro-interactions\n- 3D elements\n- Minimalist navigation",
      category: "Design",
      tags: ["design", "inspiration", "UI"],
      date: "June 12, 2023",
      color: "pink",
    },
  ]

  // Color mapping for note categories
  const categoryColors: Record<string, string> = {
    Work: "bg-purple-500/20 text-purple-300",
    Learning: "bg-blue-500/20 text-blue-300",
    Personal: "bg-green-500/20 text-green-300",
    Design: "bg-pink-500/20 text-pink-300",
  }

  // Color mapping for note cards
  const noteColors: Record<string, string> = {
    purple: "border-l-4 border-l-purple-500",
    blue: "border-l-4 border-l-blue-500",
    green: "border-l-4 border-l-green-500",
    yellow: "border-l-4 border-l-yellow-500",
    red: "border-l-4 border-l-red-500",
    pink: "border-l-4 border-l-pink-500",
  }

  return (
    <div className="min-h-screen bg-[#1E1C26] text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Notes</h1>
            <p className="text-gray-400">Capture your thoughts, ideas, and reminders</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Search notes..."
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
              onClick={() => router.push("/notes/create")}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Note
            </Button>
          </div>
        </div>

        {showFilters && (
          <Card className="bg-[#252330] border-[#323042] mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {["All", "Work", "Learning", "Personal", "Design"].map((category) => (
                      <Button
                        key={category}
                        variant="outline"
                        size="sm"
                        className={`border-[#323042] ${
                          category === "All" ? "bg-[#323042]" : "bg-[#252330] hover:bg-[#2A2838]"
                        }`}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {["projects", "meeting", "ideas", "resources", "goals"].map((tag) => (
                      <Button
                        key={tag}
                        variant="outline"
                        size="sm"
                        className="border-[#323042] bg-[#252330] hover:bg-[#2A2838]"
                      >
                        #{tag}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Date</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Today", "This Week", "This Month", "Older"].map((period) => (
                      <Button
                        key={period}
                        variant="outline"
                        size="sm"
                        className="border-[#323042] bg-[#252330] hover:bg-[#2A2838]"
                      >
                        {period}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="all" className="mb-6">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="bg-[#252330]">
              <TabsTrigger value="all" className="data-[state=active]:bg-[#323042]">
                All Notes
              </TabsTrigger>
              <TabsTrigger value="recent" className="data-[state=active]:bg-[#323042]">
                Recent
              </TabsTrigger>
              <TabsTrigger value="favorites" className="data-[state=active]:bg-[#323042]">
                Favorites
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

          <TabsContent value="all">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note) => (
                  <Card
                    key={note.id}
                    className={`bg-[#252330] border-[#323042] hover:border-purple-500/50 transition-colors cursor-pointer ${
                      noteColors[note.color]
                    }`}
                    onClick={() => router.push(`/notes/${note.id}`)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-full flex items-center ${
                            categoryColors[note.category]
                          }`}
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {note.category}
                        </span>
                        <span className="text-gray-400 text-xs flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {note.date}
                        </span>
                      </div>

                      <h3 className="text-xl font-semibold text-white mb-2">{note.title}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-4 whitespace-pre-line">{note.content}</p>

                      <div className="flex flex-wrap gap-1 mt-auto">
                        {note.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs text-gray-400 bg-[#1E1C26] px-2 py-0.5 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {notes.map((note) => (
                  <Card
                    key={note.id}
                    className={`bg-[#252330] border-[#323042] hover:border-purple-500/50 transition-colors cursor-pointer ${
                      noteColors[note.color]
                    }`}
                    onClick={() => router.push(`/notes/${note.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[note.category]}`}
                            >
                              {note.category}
                            </span>
                            <span className="text-gray-400 text-xs">{note.date}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-1">{note.title}</h3>
                          <p className="text-gray-400 text-sm line-clamp-1">{note.content}</p>
                        </div>
                        <div className="flex flex-wrap gap-1 justify-end">
                          {note.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs text-gray-400 bg-[#1E1C26] px-2 py-0.5 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                          {note.tags.length > 2 && (
                            <span className="text-xs text-gray-400 bg-[#1E1C26] px-2 py-0.5 rounded-full">
                              +{note.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recent">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.slice(0, 3).map((note) => (
                <Card
                  key={note.id}
                  className={`bg-[#252330] border-[#323042] hover:border-purple-500/50 transition-colors cursor-pointer ${
                    noteColors[note.color]
                  }`}
                  onClick={() => router.push(`/notes/${note.id}`)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full flex items-center ${
                          categoryColors[note.category]
                        }`}
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {note.category}
                      </span>
                      <span className="text-gray-400 text-xs flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {note.date}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-2">{note.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-4 whitespace-pre-line">{note.content}</p>

                    <div className="flex flex-wrap gap-1 mt-auto">
                      {note.tags.map((tag) => (
                        <span key={tag} className="text-xs text-gray-400 bg-[#1E1C26] px-2 py-0.5 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites">
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
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No favorite notes yet</h3>
              <p className="text-gray-400 mb-6">Mark notes as favorites to see them here</p>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => router.push("/notes")}>
                Browse Notes
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


