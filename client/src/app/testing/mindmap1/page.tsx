"use client";
import { Sparkles, Download } from "lucide-react";
import React, { useState, useRef } from "react";
import ReactFlow, { MiniMap, Controls, Background, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import DomToImage from "dom-to-image";
import jsPDF from "jspdf";

const initialNodes: Node[] = [
    { id: "1", data: { label: "Frontend Development" }, position: { x: 250, y: 0 }, style: { background: "#6D28D9", color: "#fff", border: "2px solid #4C1D95", borderRadius: "10px", padding: "10px" } },
    { id: "2", data: { label: "HTML" }, position: { x: 100, y: 100 }, style: { background: "#F97316", color: "#fff", border: "2px solid #EA580C", borderRadius: "10px", padding: "10px" } },
    { id: "3", data: { label: "CSS" }, position: { x: 250, y: 100 }, style: { background: "#3B82F6", color: "#fff", border: "2px solid #2563EB", borderRadius: "10px", padding: "10px" } },
    { id: "4", data: { label: "JavaScript" }, position: { x: 400, y: 100 }, style: { background: "#FACC15", color: "#000", border: "2px solid #EAB308", borderRadius: "10px", padding: "10px" } },
    { id: "5", data: { label: "React.js" }, position: { x: 350, y: 200 }, style: { background: "#61DAFB", color: "#000", border: "2px solid #38BDF8", borderRadius: "10px", padding: "10px" } },
    { id: "6", data: { label: "Next.js" }, position: { x: 350, y: 300 }, style: { background: "#000", color: "#fff", border: "2px solid #333", borderRadius: "10px", padding: "10px" } },
];

const initialEdges: Edge[] = [
    { id: "e1-2", source: "1", target: "2", style: { stroke: "#F97316", strokeWidth: 2 } },
    { id: "e1-3", source: "1", target: "3", style: { stroke: "#3B82F6", strokeWidth: 2 } },
    { id: "e1-4", source: "1", target: "4", style: { stroke: "#FACC15", strokeWidth: 2 } },
    { id: "e4-5", source: "4", target: "5", style: { stroke: "#61DAFB", strokeWidth: 2 } },
    { id: "e5-6", source: "5", target: "6", style: { stroke: "#000", strokeWidth: 2 } },
];

export default function MindMap() {
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);
    const reactFlowWrapper = useRef<HTMLDivElement>(null);

    const downloadPDF = async () => {
        if (!reactFlowWrapper.current) return;
        const imgData = await DomToImage.toPng(reactFlowWrapper.current);
        const pdf = new jsPDF("landscape", "mm", "a4");
        const imgWidth = 280;
        const imgHeight = (imgWidth * reactFlowWrapper.current.clientHeight) / reactFlowWrapper.current.clientWidth
        pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        pdf.save("mindmap.pdf");
    };

    const saveAsImage = async () => {
        if (!reactFlowWrapper.current) return;
        try {
            const imgData = await DomToImage.toPng(reactFlowWrapper.current);
            console.log(imgData);
            const link = document.createElement("a");
            link.href = imgData;
            link.download = "mindMap.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error saving image:", error);
        }
    };

    return (
        <div className="bg-[#1E1C26] w-screen h-screen flex flex-col items-center justify-center">
            <p className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-semibold mb-4 text-center w-fit px-4 py-2 rounded-lg shadow-md inline-flex items-center gap-2">
                📸 To save this mind map, Download as PNG or Download as PDF!  <Sparkles />
            </p>

            <div className="flex gap-4 mb-4">
                <button
                    onClick={downloadPDF}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md flex items-center gap-2 cursor-pointer"
                >
                    <Download size={20} /> Download PDF
                </button>
                <button
                    onClick={saveAsImage}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md flex items-center gap-2 cursor-pointer"
                >
                    <Download size={20} /> Download Image
                </button>
            </div>

            <div ref={reactFlowWrapper} className="w-3/4 h-4/5 bg-white rounded-lg shadow-lg">
                <ReactFlow nodes={nodes} edges={edges}>
                    <MiniMap />
                    <Controls />
                    <Background />
                </ReactFlow>
            </div>
        </div>
    );
}
