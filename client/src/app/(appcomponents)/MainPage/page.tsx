"use client"

import type React from "react"

import AIHeroSection from "./Ai-Hero-Section"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, CircleUser } from "lucide-react"
import BackgroundImage from "../../../../public/BgM.png"
import About from "../about/page"
import { motion } from "framer-motion"
import {
  MessageSquare,
  Network,
  CheckSquare,
  BookOpen,
  ArrowRight,
  Sparkles,
  Brain,
  Calendar,
  Clock,
  Users,
  Zap,
} from "lucide-react"

export default function MainPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
    const loginStatus = localStorage.getItem("isLogin") === "true"
    setIsLoggedIn(loginStatus)
  }, [])

  return (
    <div className="w-full bg-[#1E1C26] text-white">
      {/* Navbar - Fixed at the top */}
      <header className="fixed top-0 left-0 w-full text-white z-50 bg-[#1E1C26]/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="font-bold text-xl">
            <Link href="/" className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              StudyMate AI
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#about" className="hover:text-purple-400 transition-colors">
              About
            </Link>
            <Link href="#features" className="hover:text-purple-400 transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="hover:text-purple-400 transition-colors">
              Pricing
            </Link>
            <Link href="/dashboard" className="hover:text-purple-400 transition-colors">
              Dashboard
            </Link>
            <Link href="/explore" className="hover:text-purple-400 transition-colors">
              Explore Community 
            </Link>
          </nav>

          <div className="hidden md:block">
            {hasMounted &&
              (isLoggedIn ? (
                <Link href="/profile" className="text-purple-400 hover:text-purple-300 transition-colors">
                  <CircleUser className="h-6 w-6" />
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                >
                  Login
                </Link>
              ))}
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-[#2A2833] absolute top-full left-0 w-full border-t border-gray-800">
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link
                href="#about"
                className="hover:text-purple-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="#features"
                className="hover:text-purple-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="hover:text-purple-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/dashboard"
                className="hover:text-purple-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/explore"
                className="hover:text-purple-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Explore Community
              </Link>
              {hasMounted &&
                (isLoggedIn ? (
                  <button
                    className="bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-2 rounded-full hover:from-red-500 hover:to-red-400 transition-all duration-300"
                    onClick={() => {
                      localStorage.removeItem("isLogin")
                      setIsLoggedIn(false)
                      setIsMenuOpen(false)
                    }}
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 inline-block text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                ))}
            </div>
          </div>
        )}
      </header>


      <section className="relative w-full h-screen flex justify-center items-center overflow-hidden">

        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-no-repeat bg-center bg-cover"
            style={{
              backgroundImage: `url(${BackgroundImage.src})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-[#1E1C26]/30 backdrop-filter backdrop-blur-[1px]"></div>
        </div>

        <div className="relative z-10 w-full pt-24">
          <AIHeroSection />
        </div>
      </section>

      <section id="about" className="w-full bg-[#1E1C26]">
        <About />
      </section>

      <section className="bg-[#1E1C26] py-20 relative overflow-hidden">

        <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-600/10 rounded-full filter blur-[100px] animate-blob"></div>
        <div className="absolute bottom-40 right-1/4 w-72 h-72 bg-pink-600/10 rounded-full filter blur-[100px] animate-blob animation-delay-2000"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Supercharge Your Learning Journey
            </h2>
            <p className="text-lg text-gray-300">
              Discover how StudyMate AI transforms the way you learn, study, and retain information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard
              icon={<MessageSquare className="h-8 w-8 text-purple-400" />}
              title="AI Chat Assistant"
              description="Get 24/7 doubt-solving and learning support from an AI chat that understands your questions and provides clear explanations."
              details={[
                "Instant answers to academic questions",
                "Personalized explanations based on your learning style",
                "Available anytime, anywhere you need help",
              ]}
              color="purple"
            />

            <FeatureCard
              icon={<Network className="h-8 w-8 text-blue-400" />}
              title="Mind Map Generator"
              description="Visualize topics with auto-generated mind maps that help you understand connections between concepts."
              details={[
                "Transform complex topics into visual learning aids",
                "Customize and expand mind maps as you learn",
                "Export and share your visual notes with classmates",
              ]}
              color="blue"
            />

            <FeatureCard
              icon={<CheckSquare className="h-8 w-8 text-green-400" />}
              title="To-Do List Manager"
              description="Plan your daily study tasks and never miss a topic with our smart task management system."
              details={[
                "AI-powered study scheduling suggestions",
                "Track your progress and productivity trends",
                "Set reminders for important deadlines and exams",
              ]}
              color="green"
            />

            <FeatureCard
              icon={<BookOpen className="h-8 w-8 text-amber-400" />}
              title="AI Blogs"
              description="Read short and simple AI-written blogs to revise or explore concepts in an easy-to-understand format."
              details={[
                "Simplified explanations of complex topics",
                "Regular content updates based on your curriculum",
                "Save and organize articles for quick revision",
              ]}
              color="amber"
            />
          </div>
        </div>
      </section>

      {/* More Features Section - Updated to match dark theme */}
      <section id="features" className="bg-[#2A2833] py-20 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-40 right-1/3 w-72 h-72 bg-blue-600/10 rounded-full filter blur-[100px] animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-purple-600/10 rounded-full filter blur-[100px] animate-blob"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              More Powerful Features
            </h2>
            <p className="text-lg text-gray-300">
              StudyMate AI is packed with tools designed specifically for student success.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <SmallFeatureCard
              icon={<Brain />}
              title="Spaced Repetition"
              description="Optimize your memory retention with scientifically-proven study intervals"
            />
            <SmallFeatureCard
              icon={<Calendar />}
              title="Study Planner"
              description="Create balanced study schedules that adapt to your learning pace"
            />
            <SmallFeatureCard
              icon={<Clock />}
              title="Focus Timer"
              description="Stay productive with customizable Pomodoro timers and break reminders"
            />
            <SmallFeatureCard
              icon={<Users />}
              title="Study Groups"
              description="Form virtual study groups and collaborate with classmates"
            />
            <SmallFeatureCard
              icon={<Sparkles />}
              title="Flashcards"
              description="Generate AI-powered flashcards from your notes or textbooks"
            />
            <SmallFeatureCard
              icon={<Zap />}
              title="Quick Quizzes"
              description="Test your knowledge with auto-generated quizzes on any topic"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1E1C26] py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-fuchsia-900/20 to-pink-900/20"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto bg-[#2A2833] rounded-2xl p-8 md:p-12 shadow-xl border border-gray-800 overflow-hidden relative">
            {/* Glow effects */}
            <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-sm"></div>
            <div className="absolute -bottom-4 right-1/4 w-1/2 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-sm"></div>

            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Transform Your Learning?</h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of students who are already using StudyMate AI to learn faster, understand deeper, and
                remember longer.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/signup"
                    className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium rounded-full px-8 py-3 shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                  >
                    Get Started Free
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/pricing"
                    className="inline-block bg-transparent border border-purple-500 text-purple-400 hover:bg-purple-500/10 font-medium rounded-full px-8 py-3 transition-all duration-300"
                  >
                    View Pricing
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add custom styles for animations */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        .animate-blob {
          animation: blob 15s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  details: string[]
  color: "purple" | "blue" | "green" | "amber"
}

function FeatureCard({ icon, title, description, details, color }: FeatureCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const colorClasses = {
    purple: {
      border: "border-purple-500/20",
      hover: "hover:border-purple-500/50",
      icon: "bg-purple-900/30",
      iconGlow: "shadow-purple-500/20",
      text: "text-purple-400",
      gradient: "from-purple-600 to-pink-600",
    },
    blue: {
      border: "border-blue-500/20",
      hover: "hover:border-blue-500/50",
      icon: "bg-blue-900/30",
      iconGlow: "shadow-blue-500/20",
      text: "text-blue-400",
      gradient: "from-blue-600 to-cyan-600",
    },
    green: {
      border: "border-green-500/20",
      hover: "hover:border-green-500/50",
      icon: "bg-green-900/30",
      iconGlow: "shadow-green-500/20",
      text: "text-green-400",
      gradient: "from-green-600 to-emerald-600",
    },
    amber: {
      border: "border-amber-500/20",
      hover: "hover:border-amber-500/50",
      icon: "bg-amber-900/30",
      iconGlow: "shadow-amber-500/20",
      text: "text-amber-400",
      gradient: "from-amber-600 to-orange-600",
    },
  }

  return (
    <motion.div
      className={`rounded-xl border ${colorClasses[color].border} ${colorClasses[color].hover} bg-[#2A2833] overflow-hidden cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl relative group`}
      onClick={() => setIsExpanded(!isExpanded)}
      whileHover={{ y: -5 }}
      layout
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Glow effect on hover */}
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${colorClasses[color].gradient} opacity-0 group-hover:opacity-20 blur-sm rounded-xl transition-opacity duration-300`}
      ></div>

      <div className="p-6 relative">
        <div
          className={`w-16 h-16 rounded-full ${colorClasses[color].icon} flex items-center justify-center mb-4 shadow-lg ${colorClasses[color].iconGlow} group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white transition-colors">{title}</h3>
        <p className="text-gray-300 group-hover:text-gray-200 transition-colors">{description}</p>

        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isExpanded ? 1 : 0,
            height: isExpanded ? "auto" : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="mt-4 pt-4 border-t border-gray-700/50">
            <h4 className={`font-medium mb-2 ${colorClasses[color].text}`}>Key Benefits:</h4>
            <ul className="space-y-2">
              {details.map((detail, index) => (
                <li key={index} className="flex items-start">
                  <div className={`mr-2 mt-1 ${colorClasses[color].text}`}>•</div>
                  <span className="text-gray-300">{detail}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Link
                href="#"
                className={`inline-flex items-center ${colorClasses[color].text} font-medium hover:underline`}
              >
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <div className={`px-6 py-3 bg-[#323042] text-sm flex justify-between items-center border-t border-gray-700/30`}>
        <span className="font-medium text-gray-300">{isExpanded ? "Click to collapse" : "Click to expand"}</span>
        <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
          <ArrowRight className={`h-4 w-4 ${colorClasses[color].text}`} />
        </motion.div>
      </div>
    </motion.div>
  )
}

interface SmallFeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function SmallFeatureCard({ icon, title, description }: SmallFeatureCardProps) {
  return (
    <motion.div
      className="bg-[#323042] rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-500/20 hover:border-purple-500/40 group relative"
      whileHover={{ y: -5 }}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-20 blur-sm rounded-lg transition-opacity duration-300"></div>

      <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/10 group-hover:scale-110 transition-transform duration-300">
        <div className="text-purple-400">{icon}</div>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">{title}</h3>
      <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors">{description}</p>
    </motion.div>
  )
}
