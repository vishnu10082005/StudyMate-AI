"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Check, X, Sparkles, Star } from "lucide-react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

// Define Razorpay type for TypeScript
declare global {
  interface Window {
    Razorpay: any
  }
}

interface FaqItemProps {
  question: string
  answer: string
}

interface Blog {
  _id?: string
  id?: string
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
  authorId: string
}

interface User {
  id: string
  name: string
}

interface UserType {
  _id?: string
  name?: string
  userName?: string
  bio?: string
  avatar?: string
  email: string
  isPro?: boolean
  protype: string
  coverImage?: string
  joinDate?: string
  userBlogs?: Blog[]
  followers?: User[]
  following?: User[]
  likes?: string[]
}

interface FeatureRowProps {
  feature: string
  starter: string | boolean
  pro: string | boolean
  premium: string | boolean
}

interface FeatureItemProps {
  children: React.ReactNode
  included?: boolean
}

export default function PricingPage() {
  const router = useRouter()
  const [isAnnual, setIsAnnual] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  const [userId, setUserId] = useState<string | null>("")
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({
    pro: false,
    premium: false,
  })
  const { toast } = useToast()

  useEffect(() => {
    setHasMounted(true)
    const loginStatus = localStorage.getItem("isLogin") === "true"
    setIsLoggedIn(loginStatus)
  }, [])

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId")
    setUserId(storedUserId)
  }, [])

  const fetchUser = useCallback(async () => {
    if (!userId) return
    try {
      const response = await axios.get(`https://study-mate-ai-server.vercel.app/${userId}/getUser`)
      setUser(response.data.user)
    } catch (error) {
      console.error("Error fetching user:", error)
      toast({
        title: "Error",
        description: "Failed to fetch user data. Please try again.",
        variant: "destructive",
      })
    }
  }, [userId, toast])

  useEffect(() => {
    if (userId) {
      fetchUser()
    }
  }, [userId, fetchUser])

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePaymentSuccess = async (response: any) => {
    try {

      const paymentData = {
        ...response,
        notes: {
          userId: userId,
          planType: "Pro",
          billingCycle: isAnnual ? "annual" : "monthly",
        },
      }

      // Send verification request to backend
      const verificationResponse = await axios.post(
        "https://study-mate-ai-server.vercel.app/paymentverification",
        paymentData,
      )
      console.log("Verification data ",verificationResponse)
      if (verificationResponse.data.success) {
        toast({
          title: "Payment Successful",
          description: "Your subscription has been activated!",
          variant: "success",
        })

        router.push(`/dashboard?paymentSuccess=true&referenceNumber=${verificationResponse.data.payment_id}`);
        fetchUser()
      } else {
        toast({
          title: "Verification Failed",
          description: "Payment was received but verification failed. Please contact support.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Payment verification error:", error)
      toast({
        title: "Verification Error",
        description: "There was an error verifying your payment. Please contact support.",
        variant: "destructive",
      })
    }
  }

  const checkoutHandler = async (amount: number, planType: string, description: string) => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please login to purchase a subscription",
        variant: "destructive",
      })
      return
    }

    if (!user) {
      toast({
        title: "User Data Missing",
        description: "Unable to process payment. Please try again later.",
        variant: "destructive",
      })
      return
    }

    setIsLoading({ ...isLoading, [planType.toLowerCase()]: true })

    try {
      const isScriptLoaded = await loadRazorpayScript()
      if (!isScriptLoaded) {
        toast({
          title: "Payment Error",
          description: "Failed to load payment gateway. Please try again.",
          variant: "destructive",
        })
        setIsLoading({ ...isLoading, [planType.toLowerCase()]: false })
        return
      }

      // Get API key and create order
      try {
        const {
          data: { key },
        } = await axios.get("https://study-mate-ai-server.vercel.app/api/getkey")

        const {
          data: { order },
        } = await axios.post(`https://study-mate-ai-server.vercel.app/checkout/${userId}`, {
          amount,
          protype: planType,
        })

        // Configure Razorpay options
        const options = {
          key,
          amount: order.amount,
          currency: "INR",
          name: "StudyMate AI",
          description: `${description}`,
          image:
            "https://sdmntprwestus.oaiusercontent.com/files/00000000-5950-6230-8447-e439211cc1f7/raw?se=2025-04-21T05%3A48%3A31Z&sp=r&sv=2024-08-04&sr=b&scid=a24cf6dd-0a3b-51fa-8d25-9f229584f534&skoid=51916beb-8d6a-49b8-8b29-ca48ed86557e&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-04-20T17%3A28%3A40Z&ske=2025-04-21T17%3A28%3A40Z&sks=b&skv=2024-08-04&sig=FKiPLiPrAopb/nwsMd8kXA29ZfpVPnCtlwD3K/lvgpQ%3D",
          order_id: order.id,
          prefill: {
            name: user.name || user.userName || "User",
            email: user.email,
            contact: "9999999999",
          },
          notes: {
            userId: userId,
            planType: planType,
            billingCycle: isAnnual ? "annual" : "monthly",
          },
          theme: {
            color: "#8B5CF6",
          },
 
          handler: (response: any) => {
            console.log("response this is the response ",response)
            handlePaymentSuccess(response)
          },
        }

        // Initialize Razorpay
        const razorpay = new window.Razorpay(options)
        razorpay.on("payment.failed", (response: any) => {
          toast({
            title: "Payment Failed",
            description: response.error.description || "Your payment was unsuccessful. Please try again.",
            variant: "destructive",
          })
        })

        razorpay.open()
      } catch (error) {
        console.error("Razorpay error:", error)
        toast({
          title: "Payment Error",
          description: "Failed to initialize payment. Please try again later.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading({ ...isLoading, [planType.toLowerCase()]: false })
    }
  }

  const handlePlanChange = () => {
    setIsAnnual(!isAnnual)
  }

  return (
    <div className="min-h-screen bg-[#1E1C26] text-white pb-20">
      {/* Header with animated gradient background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-fuchsia-900/20 to-pink-900/20"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>

        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-600/30 rounded-full filter blur-[100px] animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-pink-600/20 rounded-full filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-blue-600/20 rounded-full filter blur-[100px] animate-blob animation-delay-4000"></div>

        <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400">
              Choose Your Learning Journey
            </span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Unlock the full potential of AI-powered learning with a plan that fits your needs
          </motion.p>

          {/* Billing toggle */}
          {!user?.isPro && (
            <motion.div
              className="flex items-center justify-center space-x-3 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className={`text-sm ${!isAnnual ? "text-white" : "text-gray-400"}`}>Monthly</span>
              <div className="flex items-center">
                <Switch id="billing-toggle" checked={isAnnual} onCheckedChange={handlePlanChange} />
              </div>
              <div className="flex items-center">
                <span className={`text-sm ${isAnnual ? "text-white" : "text-gray-400"}`}>Annual</span>
                <Badge className="ml-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                  Save 20%
                </Badge>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Pricing cards */}
      {!user?.isPro ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <motion.div
              className="relative bg-[#2A2833] rounded-xl overflow-hidden border border-gray-800 shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="p-6 sm:p-8">
                <h3 className="text-xl font-semibold mb-2 text-gray-200">Starter</h3>
                <p className="text-gray-400 text-sm mb-6">Perfect for trying out StudyMate AI</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold">₹0</span>
                  <span className="text-gray-400 ml-2">/ forever</span>
                </div>

                <Button className="w-full bg-[#323042] hover:bg-[#3a3850] mb-6">Get Started</Button>

                <div className="space-y-4">
                  <FeatureItem included>
                    <span>Basic AI Mind Maps</span>
                    <Badge className="ml-2 bg-gray-700 text-gray-300 text-xs">Limited</Badge>
                  </FeatureItem>
                  <FeatureItem included>
                    <span>Smart Summaries</span>
                    <Badge className="ml-2 bg-gray-700 text-gray-300 text-xs">3/month</Badge>
                  </FeatureItem>
                  <FeatureItem included>Study Chat (Basic)</FeatureItem>
                  <FeatureItem included>Smart Todo's (Basic)</FeatureItem>
                  <FeatureItem>Priority Support</FeatureItem>
                  <FeatureItem>Advanced AI Features</FeatureItem>
                  <FeatureItem>Unlimited Storage</FeatureItem>
                </div>
              </div>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              className="relative bg-[#2A2833] rounded-xl overflow-hidden border border-purple-500/30 shadow-xl transform md:scale-105 md:-translate-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {/* Popular badge */}
              <div className="absolute top-0 right-0">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-4 py-1 rounded-bl-lg">
                  MOST POPULAR
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-purple-600/10 to-transparent"></div>

              <div className="p-6 sm:p-8 relative">
                <div className="flex items-center mb-2">
                  <h3 className="text-xl font-semibold text-white">Pro</h3>
                  <Sparkles className="h-5 w-5 text-purple-400 ml-2" />
                </div>
                <p className="text-gray-300 text-sm mb-6">For serious students and professionals</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold">₹{isAnnual ? "399" : "599"}</span>
                  <span className="text-gray-400 ml-2">/ {isAnnual ? "month" : "month"}</span>
                  {isAnnual && <div className="text-sm text-purple-400">Billed annually (₹{399 * 12})</div>}
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 mb-6 cursor-pointer"
                  onClick={() =>
                    checkoutHandler(
                      isAnnual ? 399 * 12 : 599,
                      "Pro",
                      "Pro Plan - For serious students and professionals",
                    )
                  }
                  disabled={isLoading.pro}
                >
                  {isLoading.pro ? "Processing..." : "Get Pro"}
                </Button>

                <div className="space-y-4">
                  <FeatureItem included>
                    <span>Advanced AI Mind Maps</span>
                    <Badge className="ml-2 bg-purple-900/50 text-purple-300 text-xs">Unlimited</Badge>
                  </FeatureItem>
                  <FeatureItem included>
                    <span>Smart Summaries</span>
                    <Badge className="ml-2 bg-purple-900/50 text-purple-300 text-xs">Unlimited</Badge>
                  </FeatureItem>
                  <FeatureItem included>Study Chat (Advanced)</FeatureItem>
                  <FeatureItem included>Smart Todo's (Advanced)</FeatureItem>
                  <FeatureItem included>Priority Support</FeatureItem>
                  <FeatureItem included>Advanced AI Features</FeatureItem>
                  <FeatureItem>Unlimited Storage</FeatureItem>
                </div>
              </div>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              className="relative bg-[#2A2833] rounded-xl overflow-hidden border border-gray-800 shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="p-6 sm:p-8 cursor-not-allowed">
                <div className="flex items-center mb-2">
                  <h3 className="text-xl font-semibold text-gray-200">Premium</h3>
                  <Star className="h-5 w-5 text-yellow-400 ml-2" />
                </div>
                <p className="text-gray-400 text-sm mb-6">For power users and teams</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold">₹{isAnnual ? "699" : "999"}</span>
                  <span className="text-gray-400 ml-2">/ {isAnnual ? "month" : "month"}</span>
                  {isAnnual && <div className="text-sm text-purple-400">Billed annually (₹{699 * 12})</div>}
                </div>

                <Button className="w-full bg-[#323042] mb-6 cursor-not-allowed" disabled={isLoading.premium}>
                  {isLoading.premium ? "Processing..." : "Get Premium"}
                </Button>

                <div className="space-y-4">
                  <FeatureItem included>
                    <span>Everything in Pro</span>
                    <Badge className="ml-2 bg-yellow-900/50 text-yellow-300 text-xs">Enhanced</Badge>
                  </FeatureItem>
                  <FeatureItem included>
                    <span>Team Collaboration</span>
                    <Badge className="ml-2 bg-yellow-900/50 text-yellow-300 text-xs">New</Badge>
                  </FeatureItem>
                  <FeatureItem included>API Access</FeatureItem>
                  <FeatureItem included>Custom AI Training</FeatureItem>
                  <FeatureItem included>24/7 Premium Support</FeatureItem>
                  <FeatureItem included>Advanced Analytics</FeatureItem>
                  <FeatureItem included>Unlimited Storage</FeatureItem>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center px-4">
          <motion.div
            className="relative bg-[#2A2833] rounded-xl overflow-hidden border border-purple-500/30 shadow-xl transform md:scale-105 md:-translate-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="absolute top-0 right-0">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-4 py-1 rounded-bl-lg">
                CURRENT PLAN
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-purple-600/10 to-transparent"></div>
            <div className="p-6 sm:p-8 relative">
              <div className="flex items-center mb-2">
                <h3 className="text-xl font-semibold text-white">Pro</h3>
                <Sparkles className="h-5 w-5 text-purple-400 ml-2" />
              </div>
              <p className="text-gray-300 text-sm mb-6">For serious students and professionals</p>
              <div className="mb-6 w-3xl">
                <span className="text-4xl font-bold">₹{isAnnual ? "399" : "599"}</span>
                <span className="text-gray-400 ml-2">/ {isAnnual ? "month" : "month"}</span>
              </div>
              <div className="space-y-4">
                <FeatureItem included>
                  <span>Advanced AI Mind Maps</span>
                  <Badge className="ml-2 bg-purple-900/50 text-purple-300 text-xs">Unlimited</Badge>
                </FeatureItem>
                <FeatureItem included>
                  <span>Smart Summaries</span>
                  <Badge className="ml-2 bg-purple-900/50 text-purple-300 text-xs">Unlimited</Badge>
                </FeatureItem>
                <FeatureItem included>Study Chat (Advanced)</FeatureItem>
                <FeatureItem included>Smart Todo's (Advanced)</FeatureItem>
                <FeatureItem included>Priority Support</FeatureItem>
                <FeatureItem included>Advanced AI Features</FeatureItem>
                <FeatureItem>Unlimited Storage</FeatureItem>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Feature comparison */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Compare Features
          </span>
        </motion.h2>

        <motion.div
          className="overflow-x-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="py-4 px-4 text-left text-gray-300 font-medium">Feature</th>
                <th className="py-4 px-4 text-center text-gray-300 font-medium">
                  Starter {!user?.isPro && "(Current)"}
                </th>
                <th className="py-4 px-4 text-center text-purple-400 font-medium">
                  Pro {user?.isPro && user.protype === "Pro" && "(Current)"}
                </th>
                <th className="py-4 px-4 text-center text-yellow-400 font-medium">Premium (Yet To Launch)</th>
              </tr>
            </thead>
            <tbody>
              <FeatureRow
                feature="AI Mind Maps"
                starter="Basic (5 maps)"
                pro="Unlimited"
                premium="Unlimited + Team Maps"
              />
              <FeatureRow
                feature="Smart Summaries"
                starter="5 per day"
                pro="Unlimited"
                premium="Unlimited + Enhanced"
              />
              <FeatureRow
                feature="Study Chat"
                starter="Basic (Unlimited)"
                pro="Advanced (Unlimited)"
                premium="Premium (Unlimited)"
              />
              <FeatureRow
                feature="Smart Todo's"
                starter="Basic features"
                pro="Advanced features"
                premium="Premium features"
              />
              <FeatureRow
                feature="Blogs"
                starter="5 Per account"
                pro="Pro (Unlimited)"
                premium="Advanced (Unlimited)"
              />
              <FeatureRow feature="Storage" starter="500 MB" pro="10 GB" premium="Unlimited" />
              <FeatureRow feature="Team Collaboration" starter={false} pro={false} premium={true} />
              <FeatureRow feature="API Access" starter={false} pro={false} premium={true} />
              <FeatureRow feature="Custom AI Training" starter={false} pro={false} premium={true} />
              <FeatureRow feature="Support" starter="Email" pro="Priority Email" premium="24/7 Premium" />
            </tbody>
          </table>
        </motion.div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Frequently Asked Questions
          </span>
        </motion.h2>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <FaqItem
            question="Can I switch between plans?"
            answer="Yes, you can upgrade or downgrade your plan at any time. If you upgrade, the new features will be available immediately. If you downgrade, the changes will take effect at the end of your current billing cycle."
          />
          <FaqItem
            question="Is there a student discount?"
            answer="Yes! Students and educators can get 50% off any paid plan. Just verify your status with your academic email address during signup."
          />
          <FaqItem
            question="How does the free plan work?"
            answer="The free plan gives you access to basic features with some limitations. It's perfect for trying out StudyMate AI and seeing how it can help your learning journey."
          />
          <FaqItem
            question="Can I cancel anytime?"
            answer="Absolutely. There are no long-term contracts or commitments. You can cancel your subscription at any time, and you won't be charged for the next billing cycle."
          />
          <FaqItem
            question="What payment methods do you accept?"
            answer="We accept all major credit cards through our secure payment gateway, Razorpay. For annual plans, we also offer invoicing options for businesses and educational institutions."
          />
        </motion.div>
      </div>

      {!user?.isPro && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <motion.div
            className="relative rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-fuchsia-900/80 to-pink-900/80"></div>
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>

            {/* Animated particles */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-white opacity-20 animate-float"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDuration: `${Math.random() * 10 + 10}s`,
                    animationDelay: `${Math.random() * 5}s`,
                  }}
                />
              ))}
            </div>

            <div className="relative py-16 px-6 sm:px-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Ready to Transform Your Learning Experience?
              </h2>
              <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
                Join thousands of students and professionals who are already using StudyMate AI to learn faster and
                retain more.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button className="bg-white text-purple-900 hover:bg-gray-100">Try For Free</Button>
                <Button className="bg-transparent border border-white hover:bg-white/10">Schedule a Demo</Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
          50% { opacity: 0.5; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-float {
          animation: float 10s linear infinite;
        }
      `}</style>
    </div>
  )
}

// Helper components
const FeatureItem: React.FC<FeatureItemProps> = ({ children, included = false }) => (
  <div className="flex items-center">
    {included ? (
      <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" />
    ) : (
      <X className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
    )}
    <span className={included ? "text-gray-300" : "text-gray-500"}>{children}</span>
  </div>
)

const FeatureRow: React.FC<FeatureRowProps> = ({ feature, starter, pro, premium }) => (
  <tr className="border-b border-gray-800">
    <td className="py-4 px-4 text-left text-gray-300">{feature}</td>
    <td className="py-4 px-4 text-center">
      {typeof starter === "boolean" ? (
        starter ? (
          <Check className="h-5 w-5 text-green-400 mx-auto" />
        ) : (
          <X className="h-5 w-5 text-gray-500 mx-auto" />
        )
      ) : (
        <span className="text-gray-400 text-sm">{starter}</span>
      )}
    </td>
    <td className="py-4 px-4 text-center">
      {typeof pro === "boolean" ? (
        pro ? (
          <Check className="h-5 w-5 text-green-400 mx-auto" />
        ) : (
          <X className="h-5 w-5 text-gray-500 mx-auto" />
        )
      ) : (
        <span className="text-purple-400 text-sm">{pro}</span>
      )}
    </td>
    <td className="py-4 px-4 text-center">
      {typeof premium === "boolean" ? (
        premium ? (
          <Check className="h-5 w-5 text-green-400 mx-auto" />
        ) : (
          <X className="h-5 w-5 text-gray-500 mx-auto" />
        )
      ) : (
        <span className="text-yellow-400 text-sm">{premium}</span>
      )}
    </td>
  </tr>
)

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => (
  <div className="bg-[#2A2833] rounded-lg p-6 border border-gray-800">
    <h3 className="text-lg font-medium text-white mb-3">{question}</h3>
    <p className="text-gray-400">{answer}</p>
  </div>
)
