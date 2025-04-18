"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, X, Plus } from "lucide-react"

export default function CreateNotePage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [color, setColor] = useState("purple")

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission - connect to your backend
    console.log({ title, content, category, tags, color })
    // Redirect to notes list after successful creation
    router.push("/notes")
  }

  // Color options for note highlighting
  const colorOptions = [
    { value: "purple", label: "Purple", class: "bg-purple-500" },
    { value: "blue", label: "Blue", class: "bg-blue-500" },
    { value: "green", label: "Green", class: "bg-green-500" },
    { value: "yellow", label: "Yellow", class: "bg-yellow-500" },
    { value: "red", label: "Red", class: "bg-red-500" },
    { value: "pink", label: "Pink", class: "bg-pink-500" },
  ]

  return (
    <div className="min-h-screen bg-[#1E1C26] text-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" className="mb-6 text-gray-400 hover:text-white" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Notes
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create New Note</h1>
          <p className="text-gray-400">Capture your thoughts, ideas, and information</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card
            className={`bg-[#252330] border-[#323042] mb-6 border-t-4 ${
              color ? `border-t-${color}-500` : "border-t-purple-500"
            }`}
          >
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-gray-300 mb-2 block">
                    Note Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter a title for your note"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-[#1E1C26] border-[#323042] text-gray-200"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-gray-300 mb-2 block">
                    Category
                  </Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger className="bg-[#1E1C26] border-[#323042] text-gray-200">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#252330] border-[#323042] text-gray-200">
                      <SelectItem value="Work">Work</SelectItem>
                      <SelectItem value="Learning">Learning</SelectItem>
                      <SelectItem value="Personal">Personal</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="content" className="text-gray-300 mb-2 block">
                    Note Content
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="Write your note content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="bg-[#1E1C26] border-[#323042] text-gray-200 min-h-[300px]"
                    required
                  />
                </div>

                <div>
                  <Label className="text-gray-300 mb-2 block">Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map((tag) => (
                      <div key={tag} className="bg-[#1E1C26] text-gray-300 px-3 py-1 rounded-full flex items-center">
                        #{tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 ml-1 text-gray-400 hover:text-white"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="bg-[#1E1C26] border-[#323042] text-gray-200"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="border-[#323042] bg-[#1E1C26] hover:bg-[#252330]"
                      onClick={handleAddTag}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300 mb-2 block">Color</Label>
                  <div className="flex flex-wrap gap-3">
                    {colorOptions.map((colorOption) => (
                      <button
                        key={colorOption.value}
                        type="button"
                        className={`w-8 h-8 rounded-full ${colorOption.class} ${
                          color === colorOption.value ? "ring-2 ring-white ring-offset-2 ring-offset-[#1E1C26]" : ""
                        }`}
                        onClick={() => setColor(colorOption.value)}
                        title={colorOption.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              className="border-[#323042] text-gray-300 hover:bg-[#252330]"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
              <Save className="mr-2 h-4 w-4" />
              Save Note
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
