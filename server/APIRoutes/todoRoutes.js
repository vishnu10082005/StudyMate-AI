import express from "express"
import User from "../schema/User.js"

const todoRouter = express.Router()

/**
 * @route   GET /api/todos/:userId
 * @desc    Get all todos for a user
 * @access  Private
 */
todoRouter.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    // Sort todos by creation date (newest first)
    const sortedTodos = [...user.userTodos].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return res.status(200).json({
      success: true,
      todos: sortedTodos,
      count: sortedTodos.length,
    })
  } catch (error) {
    console.error("Error fetching todos:", error)
    return res.status(500).json({ success: false, message: "Server error" })
  }
})

/**
 * @route   GET /api/todos/:userId/filter
 * @desc    Get filtered todos for a user
 * @access  Private
 */
todoRouter.get("/:userId/filter", async (req, res) => {
  try {
    const userId = req.params.userId
    const { priority, completed } = req.body

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    // Start with all todos
    let filteredTodos = [...user.userTodos]

    // Apply filters
    if (priority) {
      filteredTodos = filteredTodos.filter((todo) => todo.priority === priority)
    }

    if (completed !== undefined) {
      const isCompleted = completed === "true"
      filteredTodos = filteredTodos.filter((todo) => todo.completed === isCompleted)
    }

    // Sort by creation date (newest first)
    filteredTodos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return res.status(200).json({
      success: true,
      todos: filteredTodos,
      count: filteredTodos.length,
    })
  } catch (error) {
    console.error("Error fetching filtered todos:", error)
    return res.status(500).json({ success: false, message: "Server error" })
  }
})

/**
 * @route   POST /api/todos/:userId
 * @desc    Create a new todo
 * @access  Private
 */
todoRouter.post("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId
    const { title, description, priority } = req.body

    // Validate required fields
    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" })
    }

    const newTodo = {
      title,
      description: description || "",
      priority: priority || "medium",
      completed: false,
      createdAt: new Date().toISOString(),
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    user.userTodos.push(newTodo)
    await user.save()

    // Get the newly created todo (last item in the array)
    const createdTodo = user.userTodos[user.userTodos.length - 1]

    return res.status(201).json({
      success: true,
      message: "Todo created successfully",
      todo: createdTodo,
    })
  } catch (error) {
    console.error("Error creating todo:", error)
    return res.status(500).json({ success: false, message: "Server error" })
  }
})

/**
 * @route   PATCH /api/todos/:userId/:todoId/toggle
 * @desc    Toggle todo completion status
 * @access  Private
 */
todoRouter.patch("/:userId/:todoId/toggle", async (req, res) => {
  try {
    const userId = req.params.userId
    const todoId = req.params.todoId

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    const todo = user.userTodos.id(todoId)
    if (!todo) {
      return res.status(404).json({ success: false, message: "Todo not found" })
    }

    // Toggle completion status
    todo.completed = !todo.completed

    await user.save()

    return res.status(200).json({
      success: true,
      message: `Todo marked as ${todo.completed ? "completed" : "incomplete"}`,
      todo,
    })
  } catch (error) {
    console.error("Error toggling todo status:", error)
    return res.status(500).json({ success: false, message: "Server error" })
  }
})

/**
 * @route   DELETE /api/todos/:userId/:todoId
 * @desc    Delete a todo
 * @access  Private
 */
todoRouter.delete("/:userId/:todoId", async (req, res) => {
  try {
    const userId = req.params.userId
    const todoId = req.params.todoId

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    const todoIndex = user.userTodos.findIndex((todo) => todo._id.toString() === todoId)
    if (todoIndex === -1) {
      return res.status(404).json({ success: false, message: "Todo not found" })
    }

    // Remove the todo
    user.userTodos.splice(todoIndex, 1)
    await user.save()

    return res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting todo:", error)
    return res.status(500).json({ success: false, message: "Server error" })
  }
})

/**
 * @route   DELETE /api/todos/:userId
 * @desc    Delete multiple todos
 * @access  Private
 */
todoRouter.delete("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId
    const { todoIds } = req.body

    if (!todoIds || !Array.isArray(todoIds) || todoIds.length === 0) {
      return res.status(400).json({ success: false, message: "Todo IDs array is required" })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    // Filter out todos that match the provided IDs
    const initialCount = user.userTodos.length
    user.userTodos = user.userTodos.filter((todo) => !todoIds.includes(todo._id.toString()))
    const deletedCount = initialCount - user.userTodos.length

    await user.save()

    return res.status(200).json({
      success: true,
      message: `${deletedCount} todos deleted successfully`,
      deletedCount,
    })
  } catch (error) {
    console.error("Error deleting multiple todos:", error)
    return res.status(500).json({ success: false, message: "Server error" })
  }
})

todoRouter.put("/:userId/:todoId", async (req, res) => {
  const { userId, todoId } = req.params
  const updatedData = req.body

  try {
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    const todo = user.userTodos.id(todoId)

    if (!todo) {
      return res.status(404).json({ success: false, message: "Todo not found" })
    }

    // Update the fields
    Object.assign(todo, updatedData)

    await user.save()

    res.status(200).json({ success: true, updatedTodo: todo })
  } catch (error) {
    console.error("Error updating todo:", error)
    res.status(500).json({ success: false, message: "Internal server error" })
  }
})

export default todoRouter
