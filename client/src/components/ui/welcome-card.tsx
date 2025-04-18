"use client"

import { motion } from "framer-motion"
import { MessageSquarePlus, Sparkles, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface WelcomeCardProps {
  onNewChat?: () => void
}

export default function WelcomeCard({ onNewChat }: WelcomeCardProps) {
  return (
    <div className="flex items-center justify-center h-full w-full p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-[#252330] border-[#323042] shadow-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2A2838]/50 to-transparent pointer-events-none" />

          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center space-y-6">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 0.7,
                  ease: "easeOut",
                }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
                  <div className="bg-[#2D2A38] p-4 rounded-full relative">
                    <Bot size={40} className="text-purple-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome to Your AI Chat</h2>
                <p className="text-gray-400 mb-6 max-w-md">
                  Start a new conversation or select an existing chat to begin interacting with the AI assistant.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md"
              >
                <Button
                  onClick={onNewChat}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0"
                >
                  <MessageSquarePlus className="mr-2 h-4 w-4" />
                  New Chat
                </Button>

                <Button variant="outline" className="border-[#3A3750] bg-[#2A2838] hover:bg-[#323042] text-gray-200">
                  <Sparkles className="mr-2 h-4 w-4 text-purple-400" />
                  Explore Features
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mt-4"
              >
                {[
                  { title: "Ask questions", icon: "❓" },
                  { title: "Get creative ideas", icon: "💡" },
                  { title: "Solve problems", icon: "🔍" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="bg-[#2A2838] p-3 rounded-lg border border-[#323042]"
                  >
                    <div className="text-xl mb-1">{item.icon}</div>
                    <div className="text-sm text-gray-300">{item.title}</div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="text-xs text-gray-500 mt-6"
              >
                <div className="flex items-center justify-center space-x-1">
                  <span className="block w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  <span>AI Assistant is ready</span>
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

