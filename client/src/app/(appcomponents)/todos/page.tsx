"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { type Todo, todoService } from "@/services/todo-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { PlusCircle, Trash2, CheckCircle, XCircle, Edit2Icon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TodoForm from "@/components/ui/todo-form"

interface TodoType {
  id?: string
  title: string
  description?: string
  priority: "high" | "medium" | "low"
  category?: string
}

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newTodoTitle, setNewTodoTitle] = useState("")
  const [newTodoDescription, setNewTodoDescription] = useState("")
  const [newTodoPriority, setNewTodoPriority] = useState<"high" | "medium" | "low">("medium")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedTodos, setSelectedTodos] = useState<string[]>([])
  const [userId, setCurrentUserId] = useState<string | "">("")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedTodo, setSelectedTodo] = useState<TodoType | null>(null)

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    setCurrentUserId(userId || "")
  }, [])
  const { toast } = useToast()

  // Fetch todos on component mount
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setIsLoading(true)
        const todosData = await todoService.getTodos(userId)
        setTodos(todosData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load todos. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTodos()
  }, [userId, toast])

  // Filter todos based on active tab
  const filteredTodos = todos.filter((todo) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return !todo.completed
    if (activeTab === "completed") return todo.completed
    if (activeTab === "high") return todo.priority === "high"
    if (activeTab === "medium") return todo.priority === "medium"
    if (activeTab === "low") return todo.priority === "low"
    return true
  })

  // Create a new todo
  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newTodoTitle.trim()) {
      toast({
        title: "Error",
        description: "Todo title cannot be empty",
        variant: "destructive",
      })
      return
    }

    try {
      const newTodo = await todoService.createTodo(userId, {
        title: newTodoTitle,
        description: newTodoDescription,
        priority: newTodoPriority,
      })

      setTodos((prevTodos) => [...prevTodos, newTodo])
      setNewTodoTitle("")
      setNewTodoDescription("")
      setNewTodoPriority("medium")

      toast({
        title: "Success",
        description: "Todo created successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create todo. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Toggle todo completion status
  const handleToggleTodo = async (todoId: string) => {
    try {
      const updatedTodo = await todoService.toggleTodoStatus(userId, todoId)
      setTodos((prevTodos) => prevTodos.map((t) => (t._id === todoId ? updatedTodo : t)))

      toast({
        title: "Success",
        description: `Todo marked as ${updatedTodo.completed ? "completed" : "active"}!`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update todo status. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Delete a todo
  const handleDeleteTodo = async (todoId: string) => {
    try {
      await todoService.deleteTodo(userId, todoId)
      setTodos((prevTodos) => prevTodos.filter((t) => t._id !== todoId))

      toast({
        title: "Success",
        description: "Todo deleted successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete todo. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Delete selected todos
  const handleDeleteSelected = async () => {
    if (selectedTodos.length === 0) return

    try {
      await todoService.deleteMultipleTodos(userId, selectedTodos)
      setTodos((prevTodos) => prevTodos.filter((t) => !selectedTodos.includes(t._id)))
      setSelectedTodos([])

      toast({
        title: "Success",
        description: `${selectedTodos.length} todos deleted successfully!`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete todos. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle checkbox selection
  const handleSelect = (todoId: string) => {
    if (selectedTodos.includes(todoId)) {
      setSelectedTodos(selectedTodos.filter((id) => id !== todoId))
    } else {
      setSelectedTodos([...selectedTodos, todoId])
    }
  }
  const handleFormUpdate = async (updatedTodo: TodoType) => {
    try {
      if (updatedTodo.id) {
        const updated = await todoService.updateTodo(userId, updatedTodo.id, {
          title: updatedTodo.title,
          description: updatedTodo.description,
          priority: updatedTodo.priority,
          category: updatedTodo.category,
        })

        setTodos((prevTodos) => prevTodos.map((t) => (t._id === updatedTodo.id ? { ...t, ...updated } : t)))

        toast({
          title: "Success",
          description: "Todo updated successfully!",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update todo. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-blue-500"
    }
  }

  const handleEditTodo = (todo: Todo) => {
    setSelectedTodo({
      id: todo._id,
      title: todo.title,
      description: todo.description || "",
      priority: todo.priority as "high" | "medium" | "low",
      category: todo.category || "",
    })
    setIsEditModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#1E1C26] text-gray-200 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold mb-2">My Todos</h1>
          <p className="text-gray-400">Simple task management</p>
        </header>

        {/* Add Todo Form */}
        <div className="bg-[#2A2833] rounded-lg p-4 mb-6">
          <form onSubmit={handleCreateTodo} className="space-y-4">
            <div>
              <Input
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="bg-[#1E1C26] border-[#323042] text-gray-200"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-2">
                <Textarea
                  value={newTodoDescription}
                  onChange={(e) => setNewTodoDescription(e.target.value)}
                  placeholder="Add description (optional)"
                  className="bg-[#1E1C26] border-[#323042] text-gray-200 h-20"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-400">Priority</p>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={newTodoPriority === "low" ? "default" : "outline"}
                    className={`flex-1 cursor-pointer ${newTodoPriority === "low" ? "bg-green-600" : "border-[#323042] text-gray-300 bg-[#2A2833]"}`}
                    onClick={() => setNewTodoPriority("low")}
                  >
                    Low
                  </Button>
                  <Button
                    type="button"
                    variant={newTodoPriority === "medium" ? "default" : "outline"}
                    className={`flex-1 cursor-pointer ${newTodoPriority === "medium" ? "bg-yellow-600" : "border-[#323042] text-gray-300 bg-[#2A2833]"}`}
                    onClick={() => setNewTodoPriority("medium")}
                  >
                    Med
                  </Button>
                  <Button
                    type="button"
                    variant={newTodoPriority === "high" ? "default" : "outline"}
                    className={`flex-1 cursor-pointer ${newTodoPriority === "high" ? "bg-red-600" : "border-[#323042] text-gray-300 bg-[#2A2833]"}`}
                    onClick={() => setNewTodoPriority("high")}
                  >
                    High
                  </Button>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 cursor-pointer">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Todo
            </Button>
          </form>
        </div>

        {/* Todo List */}
        <div className="bg-[#2A2833] rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-6 bg-[#1E1C26] text-[#99A1AF]">
                <TabsTrigger value="all" className="text-[#99A1AF]">
                  All
                </TabsTrigger>
                <TabsTrigger value="active" className="text-[#99A1AF]">
                  Active
                </TabsTrigger>
                <TabsTrigger value="completed" className="text-[#99A1AF]">
                  Done
                </TabsTrigger>
                <TabsTrigger value="high" className="text-[#99A1AF]">
                  High
                </TabsTrigger>
                <TabsTrigger value="medium" className="text-[#99A1AF]">
                  Medium
                </TabsTrigger>
                <TabsTrigger value="low" className="text-[#99A1AF]">
                  Low
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {selectedTodos.length > 0 && (
            <div className="mb-4">
              <Button variant="destructive" onClick={handleDeleteSelected} className="w-full">
                Delete Selected ({selectedTodos.length})
              </Button>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <CheckCircle className="h-12 w-12 text-gray-500 mb-3" />
              <h3 className="text-lg font-medium text-gray-400">No todos found</h3>
              <p className="text-gray-500 mt-1">Add a new todo to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTodos.map((todo) => (
                <div
                  key={todo._id}
                  className={`bg-[#323042] rounded-lg p-3 transition-all ${todo.completed ? "opacity-70" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedTodos.includes(todo._id)}
                      onCheckedChange={() => handleSelect(todo._id)}
                      className="mt-1 border-gray-500 cursor-pointer"
                    />

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className={`font-medium ${todo.completed ? "line-through text-gray-400" : "text-white"}`}>
                            {todo.title}
                          </h3>
                          {todo.description && <p className="text-gray-400 mt-1 text-sm">{todo.description}</p>}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleTodo(todo._id)}
                            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#2A2833] cursor-pointer"
                          >
                            {todo.completed ? <XCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditTodo(todo)}
                            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#2A2833] cursor-pointer"
                          >
                            <Edit2Icon className="h-5 w-5"></Edit2Icon>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteTodo(todo._id)}
                            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#2A2833] cursor-pointer"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge className={`${getPriorityColor(todo.priority)} text-white`}>{todo.priority}</Badge>

                        {todo.category && (
                          <Badge variant="outline" className="border-gray-500 text-gray-300">
                            {todo.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <TodoForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        formData={
          selectedTodo || {
            title: "",
            description: "",
            priority: "medium",
            category: "",
          }
        }
        onFormUpdate={handleFormUpdate}
      />
    </div>
  )
}
