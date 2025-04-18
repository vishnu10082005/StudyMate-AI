export interface Todo {
    id: string
    title: string
    description: string
    completed: boolean
    priority: "low" | "medium" | "high"
    category: string
    dueDate: string | null
    createdAt: string
  }
  