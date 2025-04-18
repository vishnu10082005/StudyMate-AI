"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BrainCircuit, Sparkles } from "lucide-react"
import axios from "axios"
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";

export default function MindMapGenerator() {
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false);
  const router = useRouter()


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
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true);
    if (!content.trim()) {
      setError("Please enter a topic for your mind map")
      return
    }
    setError("")

    try {
      const userId = localStorage.getItem("userId");
      console.log("User Id ", userId)
      console.log("Content", typeof (content));

      const response = await axios.post(`https://study-mate-ai-server.vercel.app/${userId}/mindMap`, { content: content });
      localStorage.setItem("mindMapData", JSON.stringify(response.data.mindMapData));
      const latestOne = response.data.latestOne;
      const latestId=response.data.allMindMaps[latestOne]._id;
      setLoading(false);
      router.push(`/mindmap/output/${latestId}`);
    } catch (err) {
      console.error("Error generating mind map:", err)
      setError(err instanceof Error ? err.message : "Something went wrong")
      localStorage.setItem("mindMapData","");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#1E1C26] flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700 text-white">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <BrainCircuit size={40} className="text-purple-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Mind Map Generator</CardTitle>
          <CardDescription className="text-gray-400 text-center">
            Enter a topic to generate a visual mind map
          </CardDescription>
        </CardHeader>
          {/* Core Loader Modal */}
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
                className="bg-gray-700 border-gray-600 placeholder:text-gray-400"
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
                className="bg-gray-700 border-gray-600 placeholder:text-gray-400"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>
        </CardContent>
        <CardFooter>
        <Button className="bg-gradient-to-r bg-gradient-to-r from-indigo-500 to-pink-500 text-white" onClick={handleSubmit}>
          Generate MindMap  <Sparkles className="ml-2 h-4 w-4" />
        </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

