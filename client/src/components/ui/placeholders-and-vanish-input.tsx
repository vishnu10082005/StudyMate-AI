"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface PlaceholdersAndVanishInputProps {
  placeholders: string[]
  value?: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: () => void
  className?: string
  disabled?: boolean
}

export function PlaceholdersAndVanishInput({
  placeholders,
  value = "",
  onChange,
  onSubmit,
  className,
  disabled = false,
}: PlaceholdersAndVanishInputProps) {
  const [placeholder, setPlaceholder] = useState("")
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Handle typing animation for placeholders
  useEffect(() => {
    const typingSpeed = 80 // ms per character
    const deletingSpeed = 40 // ms per character
    const pauseBeforeDeleting = 2000 // ms
    const pauseBeforeNextPlaceholder = 500 // ms

    if (isDeleting) {
      if (currentCharIndex > 0) {
        const timeout = setTimeout(() => {
          setCurrentCharIndex(currentCharIndex - 1)
          setPlaceholder(placeholders[currentPlaceholderIndex].substring(0, currentCharIndex - 1))
        }, deletingSpeed)
        return () => clearTimeout(timeout)
      } else {
        setIsDeleting(false)
        const nextIndex = (currentPlaceholderIndex + 1) % placeholders.length
        setCurrentPlaceholderIndex(nextIndex)

        const timeout = setTimeout(() => {
          setCurrentCharIndex(1)
          setPlaceholder(placeholders[nextIndex].substring(0, 1))
        }, pauseBeforeNextPlaceholder)
        return () => clearTimeout(timeout)
      }
    } else {
      if (currentCharIndex < placeholders[currentPlaceholderIndex].length) {
        const timeout = setTimeout(() => {
          setCurrentCharIndex(currentCharIndex + 1)
          setPlaceholder(placeholders[currentPlaceholderIndex].substring(0, currentCharIndex + 1))
        }, typingSpeed)
        return () => clearTimeout(timeout)
      } else {
        const timeout = setTimeout(() => {
          setIsDeleting(true)
        }, pauseBeforeDeleting)
        return () => clearTimeout(timeout)
      }
    }
  }, [currentCharIndex, currentPlaceholderIndex, isDeleting, placeholders])

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [value])

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      rows={1}
      className={cn("resize-none min-h-[40px] max-h-[200px] transition-all duration-200 outline-none", className)}
      disabled={disabled}
    />
  )
}
