"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Upload, ImageIcon, Save, X } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import axios from "axios"

export default function CreateBlogPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [image, setImage] = useState("")
  const [readTime, setReadTime] = useState("")
  const removeImage = () => {
    setImage("")
  }
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file!");
      return;
    }
    setImage(URL.createObjectURL(file));
    console.log("URL ", image);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error } = await supabase.storage
      .from("summerize")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });
    if (error) {
      console.error("Upload Error:", error);
      return;
    }

    const { data: urlData } = supabase.storage.from("summerize").getPublicUrl(filePath);
    console.log("Image Url ",urlData.publicUrl)
    setImage(urlData.publicUrl);
    console.log(image)
  };

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission - connect to your Node.js backend
    const id = localStorage.getItem("userId")
    console.log({ title, content, category, image ,id})

    try {
      const response = await axios.post(`https://study-mate-ai-server.vercel.app/${id}/postBlog`, {
        title, content, image, readTime, category
      })
      console.log(response);
      alert("Blog Posted");
      // Redirect to blog list after successful creation
      router.push("/blog")
    } catch (error) {
      alert("Error in posting")
      console.log("Error ",error)
    }


  }

  return (
    <div className="min-h-screen bg-[#1E1C26] text-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" className="mb-6 text-gray-400 hover:text-white" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Posts
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create New Blog Post</h1>
          <p className="text-gray-400">Share your thoughts, ideas, and insights with the community</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="bg-[#252330] border-[#323042] mb-6">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-gray-300 mb-2 block">
                    Post Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter a descriptive title"
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
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="ai">AI</SelectItem>
                      <SelectItem value="webdev">Web Development</SelectItem>
                      <SelectItem value="database">Database</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="career">Career</SelectItem>
                      <SelectItem value="tutorial">Tutorial</SelectItem>
                      <SelectItem value="news">News</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-300 mb-2 block">Featured Image</Label>

                  {image ? (
                    <div className="relative mt-2 rounded-lg overflow-hidden">
                      <img
                        src={image || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-64 object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-[#323042] rounded-lg p-8 text-center mt-2">
                      <ImageIcon className="h-10 w-10 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-400 mb-4">Drag and drop an image, or click to browse</p>
                      <div className="relative inline-block">
                        <Button
                          type="button"
                          variant="outline"
                          className="border-[#323042] bg-[#252330] text-gray-400 relative z-10"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Image
                        </Button>
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer z-20"
                          onChange={handleImageUpload}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="content" className="text-gray-300 mb-2 block">
                    Content
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="Write your blog post content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="bg-[#1E1C26] border-[#323042] text-gray-200 min-h-[300px]"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="title" className="text-gray-300 mb-2 block">
                    Time Required To Read
                  </Label>
                  <Input
                    id="title"
                    placeholder="Ex: 5 min"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    className="bg-[#1E1C26] border-[#323042] text-gray-200 w-32"
                    required
                  />
                </div>
              </div>

            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              className="border-[#323042] bg-[#1E1C26] text-gray-300 hover:bg-[#252330] hover:text-white"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
              <Save className="mr-2 h-4 w-4" />
              Publish Post
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

