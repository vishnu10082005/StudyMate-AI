"use client"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import ReactFlow, { MiniMap, Controls, Background } from "reactflow"
import "reactflow/dist/style.css"
import DomToImage from "dom-to-image"
import jsPDF from "jspdf"
import { Download, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Node, Edge } from 'reactflow';


export default function MindMap() {
  const [nodes,setNodes] = useState<Node[] | []>([]);
  const [edges,setEdges] = useState<Edge[] | []>([]);
  const [isLoading, setIsLoading] = useState(true)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const storedData = localStorage.getItem("mindMapData")

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        setNodes(parsedData.nodes);
        setEdges(parsedData.edges);
      } catch (err) {
        console.error("Error parsing mind map data:", err)
      }
    }

    setIsLoading(false)
  }, [])

  const downloadPDF = async () => {
    if (!reactFlowWrapper.current) return
    try {
      const imgData = await DomToImage.toPng(reactFlowWrapper.current)
      const pdf = new jsPDF("landscape", "mm", "a4")
      const imgWidth = 280
      const imgHeight = (imgWidth * reactFlowWrapper.current.clientHeight) / reactFlowWrapper.current.clientWidth
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight)
      pdf.save("mindmap.pdf")
    } catch (error) {
      console.error("Error generating PDF:", error)
    }
  }

  const saveAsImage = async () => {
    if (!reactFlowWrapper.current) return
    try {
      const imgData = await DomToImage.toPng(reactFlowWrapper.current)
      const link = document.createElement("a")
      link.href = imgData
      link.download = "mindMap.png"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error saving image:", error)
    }
  }

  const goBack = () => {
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="bg-gray-900 w-screen h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
        <p className="mt-4 text-white text-lg">Loading your mind map...</p>
      </div>
    )
  }

  if (!edges && !nodes) {
    return (
      <div className="bg-gray-900 w-screen h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">No Mind Map Data Found</h2>
          <p className="mb-6">Please generate a mind map first. OR Error caused please try again</p>
          <Button onClick={goBack} className="bg-purple-600 hover:bg-purple-700">
            Go Back to Generator
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 w-screen h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-7xl flex justify-between items-center mb-4">
        <Button className="bg-gradient-to-r bg-gradient-to-r from-indigo-500 to-pink-500 text-white" onClick={()=>{router.push("/mindmap")}}>
          Back To Generator  <Sparkles className="ml-2 h-4 w-4" />
        </Button>

        <div className="flex gap-4">
          <Button onClick={downloadPDF} className="bg-purple-600 hover:bg-purple-700 text-white">
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
          <Button onClick={saveAsImage} className="bg-purple-600 hover:bg-purple-700 text-white">
            <Download className="mr-2 h-4 w-4" /> Download Image
          </Button>
        </div>
      </div>

      <div ref={reactFlowWrapper} className="w-full h-[80vh] bg-white rounded-lg shadow-lg">
        <ReactFlow nodes={nodes} edges={edges} >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  )
}

