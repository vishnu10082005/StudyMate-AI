"use client"

// Base API URL - replace with your actual API URL
const API_BASE_URL = "http://localhost:3005/todos"

// Types
export interface Todo {
  _id: string
  title: string
  description: string
  completed: boolean
  priority: "high" | "medium" | "low"
  category?: string
  createdAt: string
}

// API Service
export const todoService = {
  // Get all todos
  async getTodos(userId: string): Promise<Todo[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/${userId}`)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch todos")
      }

      return data.todos
    } catch (error) {
      console.error("Error fetching todos:", error)
      throw error
    }
  },

  async createTodo(
    userId: string,
    todo: { title: string; description?: string; priority?: "high" | "medium" | "low" },
  ): Promise<Todo> {
    try {
      const response = await fetch(`${API_BASE_URL}/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Failed to create todo")
      }

      return data.todo
    } catch (error) {
      console.error("Error creating todo:", error)
      throw error
    }
  },

  async toggleTodoStatus(userId: string, todoId: string): Promise<Todo> {
    try {
      const response = await fetch(`${API_BASE_URL}/${userId}/${todoId}/toggle`, {
        method: "PATCH",
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Failed to toggle todo status")
      }

      return data.todo
    } catch (error) {
      console.error("Error toggling todo status:", error)
      throw error
    }
  },

  // Delete a todo
  async deleteTodo(userId: string, todoId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/${userId}/${todoId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Failed to delete todo")
      }
    } catch (error) {
      console.error("Error deleting todo:", error)
      throw error
    }
  },

  // Delete multiple todos
  async deleteMultipleTodos(userId: string, todoIds: string[]): Promise<number> {
    try {
      const response = await fetch(`${API_BASE_URL}/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todoIds }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Failed to delete todos")
      }

      return data.deletedCount
    } catch (error) {
      console.error("Error deleting multiple todos:", error)
      throw error
    }
  },


  // Add this function if it doesn't exist
  async updateTodo(userId: string, todoId: string, todoData: Partial<Todo>): Promise<Todo> {
    try {
      const response = await fetch(`${API_BASE_URL}/${userId}/${todoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todoData),
      })
  
      const data = await response.json()
  
      if (!data.success) {
        throw new Error(data.message || "Failed to update todo")
      }
  
      return data.updatedTodo // assuming backend returns updated todo under this key
    } catch (error) {
      console.error("Error updating todo:", error)
      throw error
    }
  }
}