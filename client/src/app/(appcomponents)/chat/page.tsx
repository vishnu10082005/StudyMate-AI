"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback, useRef } from "react"
import {
  Menu,
  Plus,
  MessageSquare,
  ImageIcon,
  SidebarOpenIcon,
  SidebarCloseIcon,
  DownloadIcon,
  Sparkles,
  X,
  Send,
  Bot,
  User,
  LogOut,
  Crown,
  Home,
} from "lucide-react"
import WelcomeCard from "@/components/ui/welcome-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabaseClient"
import axios from "axios"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import Image from "next/image"
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"

type Message = {
  role: "user" | "bot"
  content?: string
  image?: string
  timestamp?: Date
}

type Chat = {
  id: string
  title: string
  messages: Message[]
}

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [preview, setPreview] = useState<string>("")
  const [userId, setUserId] = useState<string | null>("")
  const [currentTitle, setCurrentTitle] = useState<string | null>("")
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [smartSummaryCount, setSmartSummaryCount] = useState(5)
  const [isPro, setIsPro] = useState(false)
  const [summaryType, setSummaryType] = useState<"normal" | "smart">("normal")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [userName, setUserName] = useState("")
  const [userAvatar, setUserAvatar] = useState("")
  const router = useRouter();
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId")
    setUserId(storedUserId)
  }, [])

  const fetchUserData = useCallback(async () => {
    if (!userId) return
    try {
      const response = await axios.get(`https://studymate-ai-2gvx.onrender.com/${userId}/getUser`)
      setSmartSummaryCount(response.data.user.smartSummaries || 0)
      setIsPro(response.data.user.isPro || false)
      setUserName(response.data.user.userName || "User")
      setUserAvatar(response.data.user.avatar || "/placeholder.svg?height=200&width=200")

    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }, [userId])

  const fetchChats = useCallback(async () => {
    if (!userId) return
    try {
      const response = await axios.get(`https://studymate-ai-2gvx.onrender.com/${userId}/getChats`)
      setChats(response.data)
    } catch (error) {
      console.error("Error fetching chats:", error)
    }
  }, [userId])

  useEffect(() => {
    if (userId) {
      fetchChats()
      fetchUserData()
    }
  }, [userId, fetchChats, fetchUserData])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const placeholders = [
    "Explain me about the Time Complexity",
    "How to plan a day",
    "Explain me about the Photosynthesis",
    "What is the Currying in the Javascript",
    "How to Study focused?",
  ]

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file!")
      return
    }

    setPreview(URL.createObjectURL(file))

    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `uploads/${fileName}`

    try {
      const { error } = await supabase.storage
        .from("summerize")
        .upload(filePath, file, { cacheControl: "3600", upsert: false })

      if (error) {
        console.error("Upload Error:", error)
        return
      }

      const { data: urlData } = supabase.storage.from("summerize").getPublicUrl(filePath)
      setPreview(urlData.publicUrl)
    } catch (error) {
      console.error("Error uploading image:", error)
      setPreview("")
    }
  }

  const clearImagePreview = () => {
    setPreview("")
  }

  const sendMessage = async () => {
    if (!input.trim() && !preview) return

    setIsLoading(true)

    const newMessage: Message = {
      role: "user",
      content: input || "",
      image: preview || "",
      timestamp: new Date(),
    }

    setMessages((prevMessages) => [...prevMessages, newMessage])

    try {
      const response = await axios.post(
        `https://studymate-ai-2gvx.onrender.com/${userId}/summarize?summaryType=${summaryType}`,
        {
          title: currentTitle,
          content: newMessage.content,
          image: newMessage.image,
        },
      )

      if (summaryType === "smart" && !isPro) {
        setSmartSummaryCount((prev) => Math.max(0, prev - 1))
      }

      const aiMessage: Message = {
        role: "bot",
        content: response.data.ResponseText || "",
        image: "",
        timestamp: new Date(),
      }

      setMessages((prevMessages) => [...prevMessages, aiMessage])
      setCurrentTitle(response.data.chatTitle)

      // Refresh chats to get updated list
      fetchChats()
    } catch (error: any) {
      console.error("Error saving chat:", error)
      if (error.response?.status === 403) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: "bot",
            content: "Smart summary limit reached. Upgrade to Pro for unlimited smart summaries.",
            timestamp: new Date(),
          },
        ])
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: "bot",
            content: "Sorry, there was an error processing your request. Please try again.",
            timestamp: new Date(),
          },
        ])
      }
    } finally {
      setIsLoading(false)
      setInput("")
      setPreview("")
    }
  }

  const downloadChatAsPDF = async () => {
    const chatElement = document.getElementById("chat-box");
    
    if (!chatElement) {
        console.error("Chat container not found");
        return;
    }

    // Backup original styles
    const originalOverflow = chatElement.style.overflow;
    chatElement.style.overflow = "visible";

    try {
        // 1. Create a sanitized version of the chat
        const sanitizedChat = document.createElement('div');
        sanitizedChat.style.position = 'absolute';
        sanitizedChat.style.left = '-9999px';
        sanitizedChat.style.width = '210mm'; // A4 width
        sanitizedChat.style.background = '#1E1C26';
        sanitizedChat.style.padding = '20px';
        document.body.appendChild(sanitizedChat);

        // 2. Convert all messages to simple HTML with basic styling
        Array.from(chatElement.children).forEach(message => {
            const clone = message.cloneNode(true) as HTMLElement;
            
            // Remove problematic CSS
            clone.removeAttribute('style');
            
            // Convert to simple div with basic styling
            const simpleMessage = document.createElement('div');
            simpleMessage.style.margin = '10px 0';
            simpleMessage.style.padding = '10px';
            simpleMessage.style.background = '#2D2A36';
            simpleMessage.style.borderRadius = '8px';
            simpleMessage.style.color = 'white';
            simpleMessage.innerHTML = clone.innerHTML;
            
            sanitizedChat.appendChild(simpleMessage);
        });

        // 3. Generate PDF using jsPDF's html method (if available)
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
        });

        // Alternative approach if html method isn't available
        const canvas = await html2canvas(sanitizedChat, {
            scale: 2,
            logging: true,
            backgroundColor: null, // Use the element's background
            ignoreElements: (element) => {
                // Skip elements that might cause issues
                return element.tagName === 'SCRIPT' || 
                       element.tagName === 'LINK' ||
                       element.hasAttribute('data-ignore-pdf');
            }
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pdf.internal.pageSize.getWidth() - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Add title
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(16);
        pdf.setTextColor(255, 255, 255);
        pdf.text(currentTitle || "Chat History", 10, 10);

        // Add content with pagination
        let position = 20;
        let remainingHeight = imgHeight;
        
        while (remainingHeight > 0) {
            const pageHeight = pdf.internal.pageSize.getHeight();
            const heightThisPage = Math.min(remainingHeight, pageHeight - position);
            
            pdf.addImage(
                imgData,
                'PNG',
                10,
                position,
                imgWidth,
                imgHeight,
                undefined,
                'FAST'
            );
            
            remainingHeight -= (pageHeight - position);
            position = 10;
            
            if (remainingHeight > 0) {
                pdf.addPage();
            }
        }

        pdf.save(`Chat_History_${new Date().toISOString().slice(0,10)}.pdf`);
        document.body.removeChild(sanitizedChat);

    } catch (error) {
        console.error("PDF generation failed:", error);
        alert("Could not generate PDF. Please try again.");
    } finally {
        // Restore original styles

        chatElement.style.overflow = originalOverflow;
      }
  };

  const handleNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
    }
    setActiveChat(newChat.id)
    setMessages([])
    setCurrentTitle(newChat.title)
    setInput("")
    setPreview("")
  }

  const formatTimestamp = (timestamp: Date) => {
    if (!timestamp) return ""
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex h-screen bg-[#1E1C26] text-gray-200">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-[#252330] fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out md:relative border-r border-[#323042]",
          sidebarOpen ? "translate-x-0 w-72" : "-translate-x-full md:translate-x-0 md:w-20",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-[#323042]">
            <Button
              onClick={handleNewChat}
              className="w-full justify-start bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
            >
              <Plus size={18} className="mr-2" />
              {sidebarOpen && <span>New chat</span>}
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto py-2">
            <AnimatePresence>
              {chats.map((chat) => (
                <motion.button
                  key={chat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => {
                    setActiveChat(chat.id)
                    setCurrentTitle(chat.title)
                    setMessages(chat.messages || [])
                    setInput("")
                    setPreview("")
                  }}
                  className={cn(
                    "w-full text-left p-3 px-4 hover:bg-[#2A2838] transition-colors flex items-center",
                    activeChat === chat.id ? "bg-[#323042] text-white" : "text-gray-400",
                  )}
                >
                  <MessageSquare size={18} className="flex-shrink-0" />
                  {sidebarOpen && <span className="ml-3 truncate">{chat.title}</span>}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          <div className="p-4 border-t border-[#323042]">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <div className="text-sm text-gray-400">
                  {isPro ? (
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">PRO</Badge>
                  ) : (
                    <div className="flex items-center">
                      <Sparkles size={14} className="text-yellow-500 mr-1" />
                      <span>{smartSummaryCount} smart summaries left</span>
                    </div>
                  )}
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-400 hover:text-white"
              >
                {sidebarOpen ? <SidebarCloseIcon size={18} /> : <SidebarOpenIcon size={18} />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {currentTitle ? (
          <>
            <header className="h-16 px-4 border-b border-[#323042] bg-[#252330] flex items-center justify-between">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden text-gray-400 hover:text-white"
                >
                  <Menu size={20} />
                </Button>
                <h1 className="text-lg font-medium ml-2 text-white">{currentTitle}</h1>


              </div>

              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={downloadChatAsPDF}
                        disabled={isGeneratingPDF || messages.length === 0}
                        className="text-gray-400 hover:text-white"
                      >
                        {isGeneratingPDF ? <span className="animate-spin">⏳</span> : <DownloadIcon size={18} />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Download chat as PDF</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="flex items-center gap-4">
                  {isPro && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0 px-3">
                      <Crown className="h-3 w-3 mr-1" /> PRO
                    </Badge>
                  )}
                  {!isPro && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0 px-3">
                      <Crown className="h-3 w-3 mr-1" /> Upgrade to Pro 
                    </Badge>
                  )}
                  <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/profile")}>
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <Image src={userAvatar || "/placeholder.svg"} alt={userName} fill className="object-cover" />
                    </div>
                    <span className="hidden md:inline text-sm font-medium">{userName}</span>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      router.push("/")
                    }}
                    className="text-gray-400 hover:text-white hover:bg-[#1E2C48] cursor-pointer"
                  >
                    <Home className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </header>

            {/* Messages Box */}
            <div id="chat-box" className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#1E1C26]">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg shadow-md",
                        message.role === "user" ? "bg-[#2A2838] text-white" : "bg-[#323042] text-white",
                      )}
                    >
                      <div className="p-4">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-full bg-[#1E1C26] flex items-center justify-center mr-2">
                            {message.role === "user" ? (
                              <User size={16} className="text-purple-400" />
                            ) : (
                              <Bot size={16} className="text-purple-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{message.role === "user" ? "You" : "StudyMate AI"}</p>
                            {message.timestamp && (
                              <p className="text-xs text-gray-400">{formatTimestamp(message.timestamp)}</p>
                            )}
                          </div>
                        </div>

                        {message.image && (
                          <div className="mb-3 rounded-lg overflow-hidden">
                            <Image
                              src={message.image || "/placeholder.svg"}
                              alt="Uploaded"
                              width={300}
                              height={200}
                              className="object-contain max-h-[300px] w-auto"
                              unoptimized={true}
                            />
                          </div>
                        )}

                        {message.role === "bot" ? (
                          <div className="prose prose-invert max-w-none">
                            <ul className="list-disc pl-5 space-y-1">
                              {message.content
                                ?.trim()
                                .split("\\n")
                                .filter((line) => line.trim())
                                .map((line, idx) => (
                                  <li key={idx}>{line}</li>
                                ))}
                            </ul>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-[#323042] bg-[#252330]">
              <div className="flex flex-col gap-3">
                {/* Summary Type Selector */}
                <div className="flex justify-between items-center">
                  <Tabs
                    value={summaryType}
                    onValueChange={(value) => setSummaryType(value as "normal" | "smart")}
                    className="w-auto"
                  >
                    <TabsList className="bg-[#1E1C26]">
                      <TabsTrigger value="normal" className="data-[state=active]:bg-[#323042] text-gray-200">
                        Normal
                      </TabsTrigger>
                      <TabsTrigger
                        value="smart"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 text-gray-300"
                        disabled={!isPro && smartSummaryCount <= 0}
                      >
                        <Sparkles size={14} className="mr-1" />
                        Smart
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {!isPro && <div className="text-xs text-gray-400">Smart summaries reset at 4:30 AM daily</div>}
                </div>

                <div className="flex gap-2 items-center relative">
                  <div className="relative flex items-center flex-1">
                    {preview && (
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                        <div className="relative w-8 h-8 rounded overflow-hidden">
                          <Image
                            src={preview || "/placeholder.svg"}
                            alt="Preview"
                            fill
                            className="object-cover"
                            unoptimized={true}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 rounded-full bg-[#323042] hover:bg-[#3a3850]"
                          onClick={clearImagePreview}
                        >
                          <X size={12} />
                        </Button>
                      </div>
                    )}

                    <PlaceholdersAndVanishInput
                      placeholders={placeholders}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onSubmit={sendMessage}
                      className={cn(
                        "bg-[#1E1C26] border-[#323042] rounded-lg py-3 px-4 w-full focus:ring-1 focus:ring-purple-500 focus:border-purple-500",
                        preview ? "pl-20" : "pl-4",
                      )}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <label className="cursor-pointer p-3 rounded-lg bg-[#1E1C26] border border-[#323042] hover:bg-[#2A2838] transition-colors flex items-center justify-center">
                            <ImageIcon size={20} className="text-gray-400" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                              disabled={isLoading}
                            />
                          </label>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Upload image</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <Button
                      onClick={sendMessage}
                      disabled={(!input.trim() && !preview) || isLoading}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg p-3 h-auto"
                    >
                      {isLoading ? <span className="animate-pulse">Processing...</span> : <Send size={20} />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <WelcomeCard onNewChat={handleNewChat} />
        )}
      </div>
    </div>
  )
}