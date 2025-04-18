"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export interface TodoType {
  id?: string
  title: string
  description?: string
  priority: "high" | "medium" | "low"
  category?: string
}

interface EditTodoFormProps {
  isOpen: boolean
  onClose: () => void
  formData: TodoType
  onFormUpdate: (updatedForm: TodoType) => void
}

export default function TodoForm({ isOpen, onClose, formData, onFormUpdate }: EditTodoFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium")
  const [category, setCategory] = useState("")

  useEffect(() => {
    setTitle(formData.title || "")
    setDescription(formData.description || "")
    setPriority(formData.priority || "medium")
    setCategory(formData.category || "")
  }, [formData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const updatedTodo: TodoType = {
      ...formData,
      title,
      description,
      priority,
      category,
    }

    try {
      onFormUpdate(updatedTodo)
      alert("Todo updated successfully")
      onClose()
    } catch (error) {
      console.error("Error updating todo:", error)
      alert("Error updating todo")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1E1C26] border-[#323042] text-gray-200">
        <DialogHeader>
          <DialogTitle>{formData?.id ? "Update Todo" : "Create Todo"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#1E1C26] border-[#323042] text-gray-200"
              placeholder="Enter todo title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#1E1C26] border-[#323042] text-gray-200"
              placeholder="Enter description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <RadioGroup
              value={priority}
              onValueChange={(val) => setPriority(val as "high" | "medium" | "low")}
              className="flex space-x-4"
            >
              {["high", "medium", "low"].map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={level}
                    id={level}
                    className={`border-${level === "high" ? "red" : level === "medium" ? "yellow" : "green"}-500`}
                  />
                  <Label
                    htmlFor={level}
                    className={`text-${level === "high" ? "red" : level === "medium" ? "yellow" : "green"}-400`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-[#1E1C26] border-[#323042] text-gray-200"
              placeholder="Enter category"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="border-[#323042] text-gray-300">
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              {formData?.id ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
