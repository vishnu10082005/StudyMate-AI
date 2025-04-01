"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, User2, X } from "lucide-react";
import { CircleUser } from "lucide-react";
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [hasMounted, setHasMounted] = useState(false); 

  useEffect(() => {
    setHasMounted(true); 
    const loginStatus = localStorage.getItem("isLogin") === "true";
    setIsLoggedIn(loginStatus);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full text-white z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="font-bold text-xl">
          <Link href="/">StudyMate AI</Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
          <Link href="/about" className="hover:text-gray-300 transition-colors">About</Link>
          <Link href="/features" className="hover:text-gray-300 transition-colors">Features</Link>
          <Link href="/pricing" className="hover:text-gray-300 transition-colors">Pricing</Link>
          <Link href="/blog" className="hover:text-gray-300 transition-colors">Blog</Link>
        </nav>

        {/* Login/Logout Button (Render only after mounting) */}
        <div className="hidden md:block">
          {hasMounted && (
            isLoggedIn ? (
              <button>
                <CircleUser></CircleUser>
              </button>
            ) : (
              <Link
                href="/login"
                className="bg-transparent border border-white rounded-full px-5 py-2 text-sm font-medium hover:bg-white hover:text-black transition-colors"
              >
                Login
              </Link>
            )
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black absolute top-full left-0 w-full">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link href="/" className="hover:text-gray-300 transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link href="/about" className="hover:text-gray-300 transition-colors" onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link href="/features" className="hover:text-gray-300 transition-colors" onClick={() => setIsMenuOpen(false)}>Features</Link>
            <Link href="/pricing" className="hover:text-gray-300 transition-colors" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
            <Link href="/blog" className="hover:text-gray-300 transition-colors" onClick={() => setIsMenuOpen(false)}>Blog</Link>
            {hasMounted && (
              isLoggedIn ? (
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-full"
                  onClick={() => {
                    localStorage.removeItem("isLogin");
                    setIsLoggedIn(false);
                    setIsMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="bg-transparent border border-white rounded-full px-5 py-2 text-sm font-medium hover:bg-white hover:text-black transition-colors inline-block text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
}
