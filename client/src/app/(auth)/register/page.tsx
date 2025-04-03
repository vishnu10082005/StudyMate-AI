"use client"

import type * as React from "react"
import Link from "next/link"
import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();
  const handleRegister = async () => {
    
    setIsLoading(true);
    console.log("UserName ",userName);
    console.log("email ",email);
    console.log("password ",password);
    try {
      const response = await axios.post("http://localhost:3005/auth/register", {
        userName,
        email,
        password
      })
      alert("user Successfully Registered");
      console.log(response.data);
      router.push("/login");

    } catch (error) {
      alert("Error in Registering");
      console.log("Error ",error);
    }




    setIsLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <Card className="w-[350px] bg-gray-950 border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription className="text-gray-400">Enter your email below to create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="text" className="text-gray-400">
                  Username
                </Label>
                <Input
                  id="text"
                  placeholder="abcdef"
                  className="bg-gray-900 border-gray-700 text-white focus:ring-gray-700 focus-visible:ring-gray-700"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
                <Label htmlFor="email" className="text-gray-400">
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="m@example.com"
                  className="bg-gray-900 border-gray-700 text-white focus:ring-gray-700 focus-visible:ring-gray-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password" className="text-gray-400">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  className="bg-gray-900 border-gray-700 text-white focus:ring-gray-700 focus-visible:ring-gray-700"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button className="w-full bg-white text-black hover:bg-gray-200 mt-4" onClick={handleRegister} disabled={isLoading}>
              {isLoading ? "Creating..." : "Create account"}
            </Button>
          </form>
        </CardContent>
        <div className="px-6 pb-4 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-white hover:underline">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  )
}

