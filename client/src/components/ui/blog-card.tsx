"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Tag } from "lucide-react"
import UserAvatar from "./useAvatar"


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
  userBlogs?: any[];
  followers?: User[];
  following?: User[];
  likes?: string[];
}
interface BlogCardProps {
  blog: {
    _id?: string
    id?:string
    title: string
    content: string
    image: string
    authorName: string
    authorAvatar: string
    dateOfPost: string
    category: string
    authorId:string    
  }
}


export default function BlogCard({ blog }: BlogCardProps) {
  const router = useRouter()

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      onClick={() => router.push(`/blog/${blog._id}`)}
      className="cursor-pointer h-full"
    >
      <Card className="overflow-hidden h-full bg-[#252330] border-[#323042] hover:border-purple-500/50 transition-colors">
        <div className="relative h-48 w-full">
          <Image src={blog.image || "/placeholder.svg"} alt={blog.title} fill className="object-fit" />
        </div>

        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full flex items-center">
              <Tag className="h-3 w-3 mr-1" />
              {blog.category}
            </span>
            <span className="text-gray-400 text-xs flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {blog.dateOfPost}
            </span>
          </div>

          <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">{blog.title}</h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-3">{blog.content}</p>

          <div className="flex items-center mt-auto">
            <UserAvatar avatar={blog?.authorAvatar} size="sm" className="mr-2" />
            <span className="text-sm text-gray-300 hover:underline">{blog.authorName}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

