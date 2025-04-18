"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabaseClient"
import { Upload, User, FileImage, FileText, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface Blog {
  _id?: string
  id?:string
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
interface UpdatedUser {
  name?: string;
  userName?: string;
  email?: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
}
interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  userData: UserType
  onProfileUpdate: (updatedUser: UserType) => void
}

export default function EditProfileModal({ isOpen, onClose, userData, onProfileUpdate }: EditProfileModalProps) {
  const [name, setName] = useState(userData.name || "")
  const [userName, setUserName] = useState(userData.userName || "")
  const [bio, setBio] = useState(userData.bio || "")
  const [avatar, setAvatar] = useState(userData.avatar || "")
  const [coverImage, setCoverImage] = useState(userData.coverImage || "")

  const [avatarPreview, setAvatarPreview] = useState<string | null>(userData.avatar || null)
  const [coverPreview, setCoverPreview] = useState<string | null>(userData.coverImage || null)
  const [isLoading, setIsLoading] = useState(false)

  // Update state when userData changes
  useEffect(() => {
    setName(userData.name || "")
    setUserName(userData.userName || "")
    setBio(userData.bio || "")
    setAvatar(userData.avatar || "")
    setCoverImage(userData.coverImage || "")
    setAvatarPreview(userData.avatar || null)
    setCoverPreview(userData.coverImage || null)
  }, [userData])

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
      .upload(filePath, file, { cacheControl: "3600", upsert: false })

    if (error) {
      console.error("Upload Error:", error)
      return
    }

    const { data: urlData } = supabase.storage.from("summerize").getPublicUrl(filePath)
    setCoverImage(urlData.publicUrl)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const id = localStorage.getItem("userId");
    try {
      const updateData: UpdatedUser = {
        name,
        userName,
        bio,
        avatar,
        coverImage,
      }
      console.log(updateData);

      const response = await axios.put(
        `http://localhost:3005/${id}/editedProfile`,
        {name,
        userName,
        bio,
        avatar,
        coverImage}
      )
      console.log(response)

      onProfileUpdate({
        ...userData,
        ...updateData,
      })

      alert("Profile updated successfully")
      onClose()
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Error updating profile")
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#252330] border-[#323042] text-gray-200 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Edit Profile</DialogTitle>
          <DialogDescription className="text-gray-400">
            Update your profile information below
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="flex flex-col justify-center justify-items-center overflow-auto">
            {/* Left column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300 flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="John Doe"
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
                  placeholder="johndoe"
                  className="bg-[#1E1C26] border-[#323042] text-gray-200 focus:border-purple-500"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>
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
                      Change Avatar
                    </Button>
                  </div>

                  {avatarPreview && (
                    <div className="h-16 w-16 rounded-full overflow-hidden border border-[#323042] relative group">
                      <img
                        src={avatarPreview || "/placeholder.svg"}
                        alt="Avatar preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          setAvatarPreview(null)
                          setAvatar("")
                        }}
                      >
                        <X className="h-5 w-5 text-white" />
                      </button>
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
                      Change Cover
                    </Button>
                  </div>

                  {coverPreview && (
                    <div className="h-16 w-32 rounded overflow-hidden border border-[#323042] relative group">
                      <img
                        src={coverPreview || "/placeholder.svg"}
                        alt="Cover preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          setCoverPreview(null)
                          setCoverImage("")
                        }}
                      >
                        <X className="h-5 w-5 text-white" />
                      </button>
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

          <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              className="border-[#323042] text-gray-300 hover:bg-[#2A2838]"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white" disabled={isLoading}>
              {isLoading ? "Saving Changes..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
