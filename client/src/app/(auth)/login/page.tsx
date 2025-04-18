"use client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post("https://study-mate-ai-server.vercel.app/auth/login", {
        email,
        password
      });
      alert("User successfully logged in");
      router.push("/");
      localStorage.setItem("isLogin", response.data.isLogin);
      localStorage.setItem("userId", response.data.userId);
    } catch (error) {
      alert("Error in logging in");
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <Card className="w-[350px] bg-[#252330] border-[#323042] text-gray-200 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl">Sign in</CardTitle>
          <CardDescription className="text-gray-400">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative my-4">
          </div>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email" className="text-gray-400">
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="m@example.com"
                  className="bg-gray-900 border-gray-700 text-white focus:ring-gray-700 focus-visible:ring-gray-700"
                  onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleLogin}
            className="cursor-pointer w-full bg-white text-black hover:bg-gray-200"
          >
            Sign in
          </Button>
        </CardFooter>
        <div className="px-6 pb-4 text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-white hover:underline">
            Create account
          </Link>
        </div>
      </Card>
    </div>
  );
}