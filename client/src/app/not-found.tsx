"use client"

import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { ArrowLeft, AlertCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Ensure animations run after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#1E1C26] text-gray-200 text-center px-4">
      <div className="w-full max-w-md">
        {/* Animated 404 text */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "easeInOut" }}
            >
              <AlertCircle size={80} className="mx-auto text-purple-500 mb-4" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text"
            >
              404
            </motion.h1>
          </div>
        </motion.div>

        {/* Animated message */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h2 className="text-xl font-medium mb-2">Page not found</h2>
          <p className="text-gray-400 mb-6">
            Sorry, the page <span className="text-purple-400 font-medium">{pathname}</span> doesn't exist.
          </p>
        </motion.div>

        {/* Animated search path */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mb-8"
        />

        {/* Animated search icon */}
        <motion.div
          initial={{ opacity: 0, rotate: -20 }}
          animate={{
            opacity: [0, 1, 1, 0],
            rotate: [-20, 0, 0, 20],
            x: [-50, 0, 0, 50],
          }}
          transition={{
            delay: 1,
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            times: [0, 0.3, 0.7, 1],
          }}
          className="absolute"
        >
          <Search className="text-purple-400/50" size={24} />
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mt-8"
        >
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="border-[#323042] text-gray-300 hover:bg-[#2A2833] bg-[#1E1C26] hover:text-white cursor-pointer"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>

          <Button onClick={() => router.push("/")} className="bg-purple-600 hover:bg-purple-700 cursor-pointer">
            Return Home
          </Button>
        </motion.div>
      </div>

      {/* Animated particles */}
      <Particles />
    </div>
  )
}

// Animated background particles
function Particles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-purple-500/10"
          style={{
            width: Math.random() * 40 + 10,
            height: Math.random() * 40 + 10,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.5, 0],
            scale: [0, 1, 0],
            y: [0, -100, -200],
            x: [0, Math.random() * 50 - 25, Math.random() * 100 - 50],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
