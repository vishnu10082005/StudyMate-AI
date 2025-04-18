"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Edit, Trash2, Heart, Share2, Calendar, Tag, Clock, Bookmark, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export default function NoteDetailPage(){
  const router = useRouter()
  const [favorited, setFavorited] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  // Mock data - replace with your actual data fetching
  const note = {
    id: 1,
    title: "Project Ideas for Q3",
    content: `1. AI-powered content recommendation engine
- Personalized content based on user behavior
- Integration with existing product catalog
- A/B testing framework for recommendations
- Analytics dashboard for performance metrics

2. Mobile app for task management
- Cross-platform (iOS and Android)
- Offline functionality
- Push notifications for reminders
- Integration with calendar apps
- Cloud sync across devices

3. API integration with third-party services
- Authentication using OAuth 2.0
- Rate limiting and caching
- Comprehensive documentation
- SDK for common programming languages
- Monitoring and analytics

4. Dashboard redesign with improved analytics
- Real-time data visualization
- Customizable widgets
- Export functionality (CSV, PDF)
- Role-based access control
- Dark/light mode support

5. Performance optimization for existing features
- Code profiling and bottleneck identification
- Database query optimization
- Asset compression and lazy loading
- Caching strategy implementation
- Load testing and benchmarking`,
    category: "Work",
    tags: ["projects", "planning", "ideas", "development", "product"],
    createdAt: "June 15, 2023",
    updatedAt: "June 18, 2023",
    color: "purple",
  }

  // Color mapping for note categories
  const categoryColors: Record<string, string> = {
    Work: "bg-purple-500/20 text-purple-300",
    Learning: "bg-blue-500/20 text-blue-300",
    Personal: "bg-green-500/20 text-green-300",
    Design: "bg-pink-500/20 text-pink-300",
  }

  return (
    <div className="min-h-screen bg-[#1E1C26] text-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" className="text-gray-400 hover:text-white" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Notes
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={`text-gray-400 hover:text-white ${favorited ? "text-red-500 hover:text-red-600" : ""}`}
              onClick={() => setFavorited(!favorited)}
            >
              <Heart className={`h-5 w-5 ${favorited ? "fill-current" : ""}`} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className={`text-gray-400 hover:text-white ${bookmarked ? "text-purple-500 hover:text-purple-600" : ""}`}
              onClick={() => setBookmarked(!bookmarked)}
            >
              <Bookmark className={`h-5 w-5 ${bookmarked ? "fill-current" : ""}`} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white"
              onClick={() => router.push(`/notes/edit/${note.id}`)}
            >
              <Edit className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#252330] border-[#323042] text-gray-200">
                <DropdownMenuItem className="hover:bg-[#2A2838] cursor-pointer">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-[#2A2838] cursor-pointer">
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
                    className="mr-2"
                  >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  </svg>
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#323042]" />
                <DropdownMenuItem className="text-red-500 hover:bg-red-500/10 cursor-pointer">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Card className={`bg-[#252330] border-[#323042] mb-6 border-t-4 border-t-purple-500`}>
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`text-sm px-3 py-1 rounded-full flex items-center ${categoryColors[note.category]}`}>
                <Tag className="h-4 w-4 mr-1" />
                {note.category}
              </span>
              <span className="text-gray-400 text-sm flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Created: {note.createdAt}
              </span>
              <span className="text-gray-400 text-sm flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Updated: {note.updatedAt}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-white mb-6">{note.title}</h1>

            <div className="prose prose-invert max-w-none mb-6">
              <div className="whitespace-pre-line text-gray-300 leading-relaxed">{note.content}</div>
            </div>

            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-[#323042]">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm text-gray-300 bg-[#1E1C26] hover:bg-[#2A2838] px-3 py-1 rounded-full cursor-pointer transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            className="border-[#323042] bg-[#252330] hover:bg-[#2A2838]"
            onClick={() => router.push("/notes")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            All Notes
          </Button>

          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => router.push(`/notes/edit/${note.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Note
          </Button>
        </div>
      </div>
    </div>
  )
}
