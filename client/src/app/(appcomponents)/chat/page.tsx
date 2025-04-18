"use client";

import { useEffect, useState, useCallback } from "react";
import { Menu, Plus, MessageSquare, Image as ImageIcon, SidebarOpenIcon, SidebarCloseIcon, DownloadIcon } from "lucide-react";
import WelcomeCard from "@/components/ui/welcome-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Image from "next/image";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

type Message = {
  role: "user" | "bot";
  content?: string;
  image?: string;
};

type Chat = {
  id: string;
  title: string;
  messages: Message[];
};

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [preview, setPreview] = useState<string>("");
  const [userId, setUserId] = useState<string | null>("");
  const [currentTitle, setCurrentTitle] = useState<string | null>("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);



  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);




  const fetchChats = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await axios.get(
        `https://study-mate-ai-server.vercel.app/${userId}/getChats`
      );
      setChats(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchChats();
    }
  }, [userId, fetchChats]);



  const placeholders = [
    "Explain me about the Time Complexity",
    "How to plan a day",
    "Explain me about the Photosynthesis",
    "What is the Currying in the Javascript",
    "How to Study focused?",
  ];


  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file!");
      return;
    }
    setPreview(URL.createObjectURL(file));
    console.log("URL ", preview);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error } = await supabase.storage
      .from("summerize")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (error) {
      console.error("Upload Error:", error);
      return;
    }

    const { data: urlData } = supabase.storage.from("summerize").getPublicUrl(filePath);
    setPreview(urlData.publicUrl);
  };
  console.log("currentTitle ", currentTitle);
  const sendMessage = async () => {
    if (!input.trim() && !preview) return;
    const newMessage: Message = {
      role: "user",
      content: input || "",
      image: preview || "",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    try {
      const response = await axios.post(`http://localhost:3005/${userId}/summarize`, {
        title: currentTitle,
        content: newMessage.content,
        image: newMessage.image,
      });
      console.log("preview ", preview);
      const aiMessage: Message = {
        role: "bot",
        content: response.data.ResponseText || "",
        image: preview || "",
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      setCurrentTitle(response.data.chatTitle);
    } catch (error) {
      console.error("Error saving chat:", error);
    }

    setInput("");
    setPreview("");
  };

  const downloadChatAsPDF = async () => {
    setIsGeneratingPDF(true);
    const chatElement = document.getElementById("chat-box");

    if (!chatElement) {
      console.error("Chat container not found");
      setIsGeneratingPDF(false);
      return;
    }

    const originalOverflow = chatElement.style.overflow;
    chatElement.style.overflow = "visible";

    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const canvas = await html2canvas(chatElement, {
        scale: 2,
        logging: true,
        useCORS: true,
        allowTaint: true,
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth - 10;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 5, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 5, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`chat/studymate-ai/${currentTitle}/chat_history.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF");
    } finally {
      chatElement.style.overflow = originalOverflow;
      setIsGeneratingPDF(false);
    }
  };

  const handleNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: []
    };
    setChats([newChat, ...chats]);
    setActiveChat(newChat.id);
    setMessages([]);
    setCurrentTitle(newChat.title);
    setInput("");
    setPreview("");
  }

  return (
    <div className="flex h-screen bg-[#1E1C26] text-[#D1D5DB] border border-[#3A3A3A]">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-[#1E1C26] text-[#D1D5DB] fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out md:relative border border-[#3A3A3A]",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-20"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 bg-[#1E1C26] text-[#D1D5DB] border border-[#3A3A3A]">
            <Button
              onClick={handleNewChat}
              className="w-full justify-start bg-[#1E1C26] cursor-pointer gap-2 border border-[#3A3A3A]"
              variant="outline"
            >
              <Plus size={18} />
              {sidebarOpen && <span>New chat</span>}
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => {
                  setActiveChat(chat.id);
                  setCurrentTitle(chat.title);
                  setMessages(chat.messages || []);
                  setInput("");
                  setPreview("");
                  if (chat.messages) fetchChats();
                }}
                className={cn(
                  "w-full text-left p-3 hover:bg-[#212121]",
                  activeChat === chat.id ? "bg-[#1E1C26] font-semibold cursor" : ""
                )}
              >
                {sidebarOpen ? chat.title : <MessageSquare size={18} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Window */}
      {currentTitle && <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-14 px-4 border-b border-[#3A3A3A] bg-[#1E1C26]">
          <div className="flex items-center mt-4 justify-between w-65">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              <Menu />
            </Button>
            <h1 className="text-lg font-semibold ml-2">
              {currentTitle}
            </h1>
            {sidebarOpen ? (
              <SidebarCloseIcon
                className="text-[#D1D5DB]"
                onClick={() => {
                  setSidebarOpen(false);
                }}
              />
            ) : (
              <SidebarOpenIcon
                className="text-[#D1D5DB]"
                onClick={() => {
                  setSidebarOpen(true);
                }}
              />
            )}
            <button disabled={isGeneratingPDF}>
              <DownloadIcon onClick={downloadChatAsPDF} />
              {isGeneratingPDF && <span>Generating...</span>}
            </button>
          </div>
        </header>

        {/* Messages Box */}
        <div id="chat-box" className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[75%] p-4 rounded-4xl shadow-md",
                  message.role === "user" ? "bg-[#2A273C] text-[#D1D5DB]" : "bg-[#212121] text-[#D1D5DB] w-full"
                )}
              >
                {message.role === "bot" && (
                  <h1>Here&apos;s the Simple and Structured Explanation about the Topic:</h1>
                )}
                <div className="relative w-12 h-12"> {/* Adjust size as needed */}
                  {message.image && <Image
                    src={message.image}
                    alt="Uploaded"
                    fill // Makes the image fill its container
                    className="rounded-2xl object-contain"
                  />}

                </div>
                {message.role === "bot" ? (
                  <ul className="list-disc pl-5">
                    {message.content
                      ?.trim()
                      .split("\\n")
                      .map((line, idx) => (
                        <li key={idx}>{line}</li>
                      ))}
                  </ul>
                ) : (
                  <p>{message.content}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-[#3A3A3A] bg-[#1E1C26]">
          <div className="flex gap-2 items-center relative">
            <div className="relative flex items-center flex-1">
              {preview && (
                <Image
                  src={preview}
                  alt="Preview"
                  width={40}
                  height={40}
                  className="absolute right top-1/2 transform -translate-y-1/2 rounded-md"
                  unoptimized={true}
                />
              )}
              <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={(e) => setInput(e.target.value)}
                onSubmit={sendMessage}
              />
            </div>

            <label className="cursor-pointer">
              <ImageIcon size={24} />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>}
      {!currentTitle && <div className="flex-1 flex flex-col">
          <WelcomeCard onNewChat={handleNewChat} />
      </div>}

    </div>
  );
}