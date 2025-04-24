import express from "express"
import User from "../schema/User.js"

const resetrouter = express.Router()

resetrouter.post("/reset-smart-summary", async (req, res) => {
  try {
    await User.updateMany({}, { smartSummaries: 5 })
    res.status(200).json({ success: true, message: "Smart summaries reset to 5" })
  } catch (err) {
    console.error("Reset error:", err)
    res.status(500).json({ success: false, message: "Reset failed" })
  }
})
resetrouter.post("/reset-mindmaps", async (req, res) => {
  try {
    await User.updateMany({}, { monthlymindMaps: 5 })
    res.status(200).json({ success: true, message: "Monthly MindMaps reset to 5" })
  } catch (err) {
    console.error("Reset error:", err)
    res.status(500).json({ success: false, message: "Reset failed" })
  }
})
resetrouter.post("/reset-blogs", async (req, res) => {
  try {
    await User.updateMany({}, { montlyBlogs: 5 })
    res.status(200).json({ success: true, message: "Monthly Blogs reset to 5" })
  } catch (err) {
    console.error("Reset error:", err)
    res.status(500).json({ success: false, message: "Reset failed" })
  }
})

export default resetrouter
