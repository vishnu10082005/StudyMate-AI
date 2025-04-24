"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import {
  MessageSquare,
  Network,
  CheckSquare,
  BookOpen,
  LogOut,
  Crown,
  Sparkles,
  ChevronRight,
  Clock,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const [userAvatar, setUserAvatar] = useState("")
  const [isPro, setIsPro] = useState(false)
  const [smartSummaries, setSmartSummaries] = useState(0)
  const [monthlymindMaps, setMonthlyMindMaps] = useState(0)
  const [monthlyBlogs, setMonthlyBlogs] = useState(0)
  const [loading, setLoading] = useState(true)
  const [blogs, setBlogs] = useState([])
  const [mindMaps, setMindMaps] = useState([])
  const [chats, setChats] = useState([])
  const [todos, setTodos] = useState([])

  useEffect(() => {
    // Check if user is logged in
    const loginStatus = localStorage.getItem("isLogin") === "true"
    setIsLoggedIn(loginStatus)

    if (!loginStatus) {
      router.push("/login")
      return
    }

    // Get user data
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId")
        if (!userId) {
          throw new Error("User ID not found")
        }

        const response = await fetch(`https://study-mate-ai-server.vercel.app/${userId}/getUser`)
        const data = await response.json()

        if (data.user) {
          setUserName( data.user.userName || "User")
          setUserAvatar(data.user.avatar || "/placeholder.svg?height=200&width=200")
          setIsPro(data.user.isPro || false)
          setSmartSummaries(data.user.smartSummaries || 0)
          setMonthlyMindMaps(data.user.monthlymindMaps || 0)
          setMonthlyBlogs(data.user.monthlyBlogs || 0)
          setBlogs(data.user.userBlogs)
          setMindMaps(data.user.userMindMaps)
          setChats(data.user.userChats)
          setTodos(data.user.userTodos)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  if (!isLoggedIn || loading) {
    return (
      <div className="min-h-screen bg-[#1E1C26] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1E1C26] text-gray-200">
      {/* Header */}
      <header className="bg-[#252330] border-b border-[#323042]">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="font-bold text-xl bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
          >
            StudyMate AI
          </Link>

          <div className="flex items-center gap-4">
            {isPro && (
              <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0 px-3">
                <Crown className="h-3 w-3 mr-1" /> PRO
              </Badge>
            )}

            <div className="flex items-center gap-2 cursor-pointer" onClick={()=>router.push("/profile")}>
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image src={userAvatar || "/placeholder.svg"} alt={userName} fill className="object-cover" />
              </div>
              <span className="hidden md:inline text-sm font-medium">{userName}</span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                localStorage.removeItem("isLogin")
                localStorage.removeItem("userId")
                router.push("/login")
              }}
              className="text-gray-400 hover:text-white hover:bg-red-500 cursor-pointer"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="mb-10">
          <div className="bg-[#252330] border border-[#323042] rounded-xl p-6 md:p-8 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full filter blur-[80px]"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-600/10 rounded-full filter blur-[80px]"></div>

            <div className="relative">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, {userName}!</h1>
              <p className="text-gray-400 mb-6">Continue your learning journey with StudyMate AI</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <UsageCard
                  title="Smart Summaries"
                  count={isPro ? "Unlimited" : smartSummaries}
                  total={isPro ? "∞" : "5"}
                  icon={<Sparkles className="h-5 w-5 text-purple-400" />}
                  resetInfo={isPro ? "Unlimited" : "Resets at 4:30 AM daily"}
                />
                <UsageCard
                  title="Mind Maps"
                  count={isPro ? "Unlimited" : monthlymindMaps}
                  total={isPro ? "∞" : "5"}
                  icon={<Network className="h-5 w-5 text-blue-400" />}
                  resetInfo={isPro ? "Unlimited" : "Resets Montly"}
                />
                <UsageCard
                  title="AI Blogs"
                  count={isPro ? "Unlimited" : monthlyBlogs}
                  total={isPro ? "∞" : "5"}
                  icon={<BookOpen className="h-5 w-5 text-green-400" />}
                  resetInfo={isPro ? "Unlimited" : "Resets Monthly"}
                />
              </div>

              {!isPro && (
                <div className="mt-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between">
                  <div className="flex items-center mb-4 sm:mb-0">
                    <Crown className="h-6 w-6 text-yellow-400 mr-3" />
                    <div>
                      <h3 className="font-medium text-white">Upgrade to Pro</h3>
                      <p className="text-sm text-gray-300">Get unlimited access to all features</p>
                    </div>
                  </div>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    onClick={() => router.push("/pricing")}
                  >
                    Upgrade Now
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section>
          <h2 className="text-xl font-bold mb-6">Your Tools</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              title="AI Chat Assistant"
              description="Get instant answers to your questions"
              icon={<MessageSquare className="h-8 w-8 text-purple-400" />}
              href="/chat"
              color="purple"
            />

            <FeatureCard
              title="Mind Map Generator"
              description="Visualize concepts and connections"
              icon={<Network className="h-8 w-8 text-blue-400" />}
              href="/mindmap"
              color="blue"
              limit={isPro ? "Unlimited" : `${monthlymindMaps}/5 remaining`}
            />

            <FeatureCard
              title="Todo List"
              description="Organize your tasks and studies"
              icon={<CheckSquare className="h-8 w-8 text-green-400" />}
              href="/todos"
              color="green"
            />

            <FeatureCard
              title="AI Blogs"
              description="Explore AI-generated educational content"
              icon={<BookOpen className="h-8 w-8 text-amber-400" />}
              href="/blog"
              color="amber"
              limit={isPro ? "Unlimited" : `${monthlyBlogs}/5 remaining`}
            />
          </div>
        </section>

        {/* Quick Access Section */}
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-6">Quick Access</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickAccessCard
              title="Recent Chats"
              icon={<MessageSquare className="h-5 w-5 text-purple-400" />}
              items={chats}
              viewAllLink="/chat"
            />

            <QuickAccessCard
              title="Recent Mind Maps"
              icon={<Network className="h-5 w-5 text-blue-400" />}
              items={mindMaps}
              viewAllLink="/mindmap"
            />

            <QuickAccessCard
              title="Upcoming Tasks"
              icon={<Calendar className="h-5 w-5 text-green-400" />}
              items={todos}
              viewAllLink="/todos"
            />
          </div>
        </section>
      </main>
    </div>
  )
}

// Helper Components
interface UsageCardProps {
  title: string
  count: string | number
  total: string | number
  icon: React.ReactNode
  resetInfo: string
}

function UsageCard({ title, count, total, icon, resetInfo }: UsageCardProps) {
  const percentage = (typeof total === "number" && typeof count === "number") ? (count / Number(total)) * 100 : 0

  return (
    <div className="bg-[#1E1C26] rounded-lg p-4 border border-[#323042]">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-white">{title}</h3>
        {icon}
      </div>

      <div className="flex items-end justify-between mb-1">
        <div className="text-2xl font-bold">{count}</div>
        <div className="text-sm text-gray-400">of {total}</div>
      </div>

      {typeof total === "number" && (
        <div className="w-full h-1.5 bg-[#323042] rounded-full overflow-hidden mt-2 mb-2">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
      )}

      <div className="text-xs text-gray-500 flex items-center mt-1">
        <Clock className="h-3 w-3 mr-1" />
        {resetInfo}
      </div>
    </div>
  )
}

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: "purple" | "blue" | "green" | "amber"
  limit?: string
}

function FeatureCard({ title, description, icon, href, color, limit }: FeatureCardProps) {
  const colorClasses = {
    purple: {
      border: "border-purple-500/20",
      hover: "hover:border-purple-500/50",
      bg: "bg-purple-500/10",
    },
    blue: {
      border: "border-blue-500/20",
      hover: "hover:border-blue-500/50",
      bg: "bg-blue-500/10",
    },
    green: {
      border: "border-green-500/20",
      hover: "hover:border-green-500/50",
      bg: "bg-green-500/10",
    },
    amber: {
      border: "border-amber-500/20",
      hover: "hover:border-amber-500/50",
      bg: "bg-amber-500/10",
    },
  }

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Link href={href}>
        <Card
          className={`bg-[#252330] ${colorClasses[color].border} ${colorClasses[color].hover} h-full transition-all duration-300 cursor-pointer group`}
        >
          <CardContent className="p-6">
            <div
              className={`w-16 h-16 rounded-full ${colorClasses[color].bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
            >
              {icon}
            </div>

            <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
            <p className="text-gray-400 text-sm mb-4">{description}</p>

            {limit && <div className="text-xs text-gray-500 mb-3">{limit}</div>}

            <div className="flex items-center text-sm font-medium text-purple-400 group-hover:text-purple-300 transition-colors">
              Launch
              <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

interface QuickAccessCardProps {
  title: string
  icon: React.ReactNode
  items: { title: string; createdAt: string }[]
  viewAllLink: string
}

function QuickAccessCard({ title, icon, items, viewAllLink }: QuickAccessCardProps) {

  return (
    <Card className="bg-[#252330] border-[#323042]">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {icon}
            <h3 className="font-medium text-white ml-2">{title}</h3>
          </div>
          <Link href={viewAllLink} className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
            View all
          </Link>
        </div>

        <div className="space-y-3">
            {items.slice(-3).map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-[#323042] text-gray-400 last:border-0">
                <div className="font-medium text-sm">{item.title}</div>
                <div className="font-medium text-sm">{formatDistanceToNow(new Date(item.createdAt))}</div>
              </div>
            ))}
        </div>
        
      </CardContent>
    </Card>
  )
}
