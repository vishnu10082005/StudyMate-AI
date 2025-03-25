"use client"

import type * as React from "react"
import Link from "next/link"
import { Github } from "lucide-react"
import { signIn } from "next-auth/react"
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
      console.log(error);
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
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className=" bg-black-600 w-full border-gray-700 text-white hover:bg-gray-800 hover:text-white"
              onClick={() => signIn("github", { callbackUrl: "/" })}
              disabled={isLoading}
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
            <Button
              variant="outline"
              className="bg-black-600 w-full border-gray-700 text-white hover:bg-gray-800 hover:text-white"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-700"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-950 px-2 text-gray-400">OR CONTINUE WITH</span>
            </div>
          </div>

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

