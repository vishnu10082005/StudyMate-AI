"use client"

import type React from "react"

import { useState } from "react"
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
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/features-bg-pattern.svg')] opacity-5"></div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
                Explore the Power of StudyMate AI
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                From smart notes to organized productivity, everything a student needs in one place.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                  Get Started Free
                </Button>
                <Button size="lg" variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                  Watch Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-6 left-0 right-0 h-12 bg-white rounded-t-[50%] z-10"></div>
      </section>

      {/* Features Grid Section */}
     

      {/* Additional Features Section */}
     

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Learning Experience?</h2>
            <p className="text-xl mb-8 text-purple-100">
              Join thousands of students who are studying smarter, not harder.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50">
                Sign Up Free
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-purple-500">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

