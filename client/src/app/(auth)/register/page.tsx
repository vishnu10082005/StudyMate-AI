"use client"

import type * as React from "react"
import Link from "next/link"
import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabaseClient"
import { Eye, EyeOff, Upload, User, Mail, Lock, FileImage, FileText } from "lucide-react"

export default function RegisterPage() {
  const [userName, setUserName] = useState<string | null>("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [avatar, setAvatar] = useState("")
  const [coverImage, setCoverImg] = useState("")
  const [bio, setBio] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const router = useRouter()

  const handleImageChangeAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file!")
      return
    }

    // Set preview
    setAvatarPreview(URL.createObjectURL(file))

    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `uploads/${fileName}`

    const { error } = await supabase.storage
      .from("summerize")
      .upload(filePath, file, { cacheControl: "3600", upsert: false })

    if (error) {
      console.error("Upload Error:", error)
      return
    }

    const { data: urlData } = supabase.storage.from("summerize").getPublicUrl(filePath)
    setAvatar(urlData.publicUrl)
  }

  const handleImageChangeCoverImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file!")
      return
    }

    // Set preview 
    setCoverPreview(URL.createObjectURL(file))

    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `uploads/${fileName}`

    const { error } = await supabase.storage
      .from("summerize")
      .upload(filePath, file)

    if (error) {
      console.error("Upload Error:", error)
      return
    }

    const { data: urlData } = supabase.storage.from("summerize").getPublicUrl(filePath)
    setCoverImg(urlData.publicUrl)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await axios.post("http://localhost:3005/auth/register", {
        userName,
        email,
        password,
        avatar,
        coverImage,
        bio,
        name,
      })

      alert("User Successfully Registered")
      console.log(response.data)
      router.push("/login")
    } catch (error) {
      alert("Error in Registering")
      console.log("Error ", error)
    }

    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1E1C26] p-4">
      <Card className="w-full max-w-4xl bg-[#252330] border-[#323042] text-gray-200 shadow-xl">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold text-white">Create your account</CardTitle>
          <CardDescription className="text-gray-400">Join our community and start your journey</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300 flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Milan Sana"
                    className="bg-[#1E1C26] border-[#323042] text-gray-200 focus:border-purple-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-300 flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    Username
                  </Label>
                  <Input
                    id="username"
                    placeholder="Milan sana"
                    className="bg-[#1E1C26] border-[#323042] text-gray-200 focus:border-purple-500"
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300 flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="sana@example.com"
                    className="bg-[#1E1C26] border-[#323042] text-gray-200 focus:border-purple-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300 flex items-center">
                    <Lock className="h-4 w-4 mr-2 text-gray-400" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="bg-[#1E1C26] border-[#323042] text-gray-200 focus:border-purple-500 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="avatar" className="text-gray-300 flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    Profile Picture
                  </Label>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChangeAvatar}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="bg-[#1E1C26] border-[#323042] text-gray-300 hover:bg-[#2A2838]"
                        onClick={() => document.getElementById("avatar")?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Avatar
                      </Button>
                    </div>

                    {avatarPreview && (
                      <div className="h-12 w-12 rounded-full overflow-hidden border border-[#323042]">
                        <img
                          src={avatarPreview || "/placeholder.svg"}
                          alt="Avatar preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverImage" className="text-gray-300 flex items-center">
                    <FileImage className="h-4 w-4 mr-2 text-gray-400" />
                    Cover Image
                  </Label>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Input
                        id="coverImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChangeCoverImage}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="bg-[#1E1C26] border-[#323042] text-gray-300 hover:bg-[#2A2838]"
                        onClick={() => document.getElementById("coverImage")?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Cover
                      </Button>
                    </div>

                    {coverPreview && (
                      <div className="h-12 w-24 rounded overflow-hidden border border-[#323042]">
                        <img
                          src={coverPreview || "/placeholder.svg"}
                          alt="Cover preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-gray-300 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-gray-400" />
                    Bio
                  </Label>
                  <textarea
                    id="bio"
                    rows={4}
                    placeholder="Tell us about yourself... Ex Tech Enthusiast | Working at HX Central"
                    className="w-full bg-[#1E1C26] border border-[#323042] text-gray-200 rounded-md p-2 focus:border-purple-500 focus:ring-0 focus:outline-none"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-[#323042] pt-4">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
