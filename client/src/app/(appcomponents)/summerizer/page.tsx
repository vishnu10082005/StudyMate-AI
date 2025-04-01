"use client";

import { useEffect, useState } from "react";
import { Menu, Send, Plus, MessageSquare, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";
import axios from "axios";

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
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [userId, setUserId] = useState<string | null>("");
  const [currentTitle, setCurrentTitle] = useState<string | null>("");


  var setCurrentChatToLocalStorage = (title: string) => {
    setCurrentTitle(title);
  }
  console.log("Current Title ", currentTitle);

  useEffect(() => {
    const userIdL = localStorage.getItem("userId");
    setUserId(userIdL);
    const fetchChats = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`http://localhost:3005/${userIdL}/getChats`);
        console.log("Response ", response);
        setChats(response.data);
        console.log("Response Data ", response.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, [userId]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file!");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));

    // Upload to Supabase
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { data, error } = await supabase.storage.from("summerize").upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (error) {
      console.error("Upload Error:", error);
      return;
    }

    const { data: urlData } = supabase.storage.from("summerize").getPublicUrl(filePath);
    setPreview(urlData.publicUrl);
  };

  const sendMessage = async () => {
    if (!input.trim() && !preview) return;
    const newMessage: Message = {
      role: "user",
      content: input || "",
      image: preview || "",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    try {
      console.log("Sending messages:", [...messages, newMessage]);
      console.log("New Message ", newMessage);
      // Make the API call to the backend to store the message
      const response = await axios.post(`http://localhost:3005/${userId}/summarize`, {
        title: currentTitle,
        content: newMessage.content,
        image: newMessage.image,
      });

      const aiMessage: Message = {
        role: "bot",
        content: response.data.ResponseText ||  "",
        image: preview || "",
      }
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      const generatedTitle = response.data.chatTitle;
      setCurrentChatToLocalStorage(generatedTitle);

    } catch (error) {
      console.error("Error saving chat:", error);
    }

    setInput("");
    setImage(null);
    setPreview("");
  };
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={cn("fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out md:relative", sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-20")}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <Button onClick={() => setChats([{ id: Date.now().toString(), title: "New Chat", messages: [] }, ...chats])} className="w-full justify-start gap-2" variant="outline">
              <Plus size={18} />
              {sidebarOpen && <span>New chat</span>}
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => (
              <button key={chat.id} onClick={() => { setCurrentChatToLocalStorage(chat.title); setActiveChat(chat.id); setMessages(chat.messages); }} className={cn("w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-700", activeChat === chat.id ? "bg-gray-200 dark:bg-gray-600 font-semibold" : "")}>
                {sidebarOpen ? chat.title : <MessageSquare size={18} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-14 border-b border-gray-200 dark:border-gray-700 flex items-center px-4">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
            <Menu />
          </Button>
          <h1 className="text-lg font-semibold ml-2">{chats.find((chat) => chat.id === activeChat)?.title || "Chat"}</h1>
        </header>

        {/* Messages Box */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[75%] p-4 rounded-4xl shadow-md", message.role === "user" ? "bg-[#1E2939] text-white" : "bg-[#2F3948] text-white")}>
                {message.image && <img src={message.image} alt="Uploaded" className="w-12 h-12 rounded-2xl border border-gray-300 mb-2" />}
                <p>{message.message}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex gap-2 items-center relative">
            <div className="relative flex items-center flex-1">
              {preview && <img src={preview} alt="Preview" className="absolute right-12 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-md border border-gray-300" />}
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." className="pr-10 h-15" />
            </div>

            <label className="cursor-pointer">
              <ImageIcon size={24} />
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>

            <Button onClick={sendMessage} disabled={!input.trim() && !preview}>
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
